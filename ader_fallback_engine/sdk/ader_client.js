import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class AderClient {
  constructor(options = {}) {
    this.endpoint = options.endpoint || 'http://ader.mh:4076/graphql';
    this.agentContext = options.context || {};
    this.failureCount = 0;
    this.lastError = null;
    this.mode = 'ACTIVE'; // ACTIVE | FALLBACK_MODE
  }

  /**
   * Monitor an action. If it fails 3 times in a row with the same error,
   * trigger the dead-end handshake and fallback resolution.
   */
  async executeWithFallback(actionFn, tags = []) {
    try {
      const result = await actionFn();
      this.resetFailureState();
      return result;
    } catch (err) {
      this.failureCount++;
      
      if (this.lastError && err.message === this.lastError.message && this.failureCount >= 3) {
        console.log(`[ADER Client] Dead-end detected (3x identical failures). Entering FALLBACK_MODE.`);
        this.mode = 'FALLBACK_MODE';
        
        // Formulate tags from error context + provided tags
        const searchTags = [...new Set([...tags, 'historical_ticket', this.agentContext.systemName])].filter(Boolean);
        
        const fallbackResult = await this.triggerFallback(searchTags);
        if (fallbackResult) {
          console.log(`[ADER Client] Fallback path resolved the dead-end.`);
          this.resetFailureState();
          return fallbackResult;
        } else {
          throw new Error(`[ADER Client] Dead-end unresolved even after fallback attempts. Escalating.`);
        }
      } else {
        this.lastError = err;
        throw err; // Bubble up for normal retry logic
      }
    }
  }

  resetFailureState() {
    this.failureCount = 0;
    this.lastError = null;
    this.mode = 'ACTIVE';
  }

  async triggerFallback(tags) {
    console.log(`[ADER Client] Requesting fallback path for tags: ${tags.join(', ')}`);
    
    const query = `
      query RequestFallbackPath($tags: [String!]) {
        successPaths(tags: $tags, limit: 1, minReusabilityScore: 0.5) {
          id
          title
          steps {
            __typename
            ... on Observation { extractedSignal }
            ... on Hypothesis { statement, validationCost }
            ... on Action { command, environment, isReversible }
            ... on Result { outcome, recurrenceProbability }
          }
        }
      }
    `;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { tags } })
      });
      
      const { data, errors } = await response.json();
      if (errors) {
        console.error(`[ADER Client] GraphQL Error from ADER:`, errors);
        return false;
      }

      if (!data.successPaths || data.successPaths.length === 0) {
        console.log(`[ADER Client] No success paths found for given context.`);
        return false;
      }

      const path = data.successPaths[0];
      console.log(`[ADER Client] Found path: ${path.title}. Executing steps...`);
      const success = await this.executePath(path);
      
      await this.reportFeedback(path.id, success);
      
      return success;
      
    } catch (err) {
      console.error(`[ADER Client] Network error reaching ADER engine: ${err.message}`);
      return false;
    }
  }

  async executePath(path) {
    for (const step of path.steps) {
      switch (step.__typename) {
        case 'Observation':
          console.log(`[ADER Observation] Historical Context: ${step.extractedSignal}`);
          break;
          
        case 'Hypothesis':
          console.log(`[ADER Hypothesis] Considering: ${step.statement} (Cost: ${step.validationCost})`);
          break;
          
        case 'Action':
          console.log(`[ADER Action] Executing: ${step.command}`);
          try {
            const { stdout, stderr } = await execAsync(step.command);
            if (stdout) console.log(`[stdout] ${stdout.trim()}`);
            if (stderr) console.error(`[stderr] ${stderr.trim()}`);
          } catch (e) {
            console.error(`[ADER Action] Execution failed:`, e.message);
            return false; // Path execution broke
          }
          break;
          
        case 'Result':
          console.log(`[ADER Result] Expected Outcome: ${step.outcome}`);
          // Agent evaluates if current state matches Expected Outcome.
          // For simplicity in the SDK, if we reached the result step without action failure, we assume success.
          break;
          
        default:
          console.warn(`[ADER Client] Unknown step type: ${step.__typename}`);
      }
    }
    
    return true; // Path executed completely
  }

  async reportFeedback(pathId, success) {
    console.log(`[ADER Client] Reporting path execution feedback: Success=${success}`);
    
    const query = `
      mutation RateSuccessPath($id: ID!, $success: Boolean!) {
        rateSuccessPath(id: $id, success: $success) {
          id
          reusabilityScore
        }
      }
    `;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { id: pathId, success } })
      });
      
      const { data, errors } = await response.json();
      if (errors) {
        console.error(`[ADER Client] GraphQL Error submitting feedback:`, errors);
      } else {
        console.log(`[ADER Client] Feedback recorded. New Reusability Score: ${data.rateSuccessPath.reusabilityScore}`);
      }
    } catch (err) {
      console.error(`[ADER Client] Network error submitting feedback: ${err.message}`);
    }
  }
}
