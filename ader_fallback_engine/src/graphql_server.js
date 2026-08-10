import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import neo4j from 'neo4j-driver';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Neo4j connection
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

const resolvers = {
  Query: {
    successPaths: async (_, { tags, minReusabilityScore, limit }) => {
      const session = driver.session();
      try {
        let cypher = `
          MATCH (sp:SuccessPath)
          WHERE sp.reusabilityScore >= $minScore
        `;
        if (tags && tags.length > 0) {
          cypher += ` AND any(tag IN $tags WHERE tag IN sp.tags) `;
        }
        cypher += `
          RETURN sp
          ORDER BY sp.reusabilityScore DESC
          LIMIT toInteger($limit)
        `;
        const result = await session.run(cypher, { 
          minScore: minReusabilityScore || 0.0, 
          tags: tags || [], 
          limit: limit || 10 
        });
        return result.records.map(record => record.get('sp').properties);
      } finally {
        await session.close();
      }
    },
    resolutionPaths: async (_, { ticketId, startX, startY, startZ, maxDepth }) => {
      // Simulate Qwen's heuristic routing logic for L1 Resolution Path Mapping
      const depth = maxDepth || 3;
      const paths = [];
      
      // Primary Path (Conservative): Deepen context (y+1), tick epoch (z+1)
      const path1 = [];
      let curX1 = startX, curY1 = startY, curZ1 = startZ, conf1 = 0.95;
      for (let i = 0; i < depth; i++) {
        curY1 = Math.min(48, curY1 + 1);
        curZ1 = Math.min(6, curZ1 + 1);
        conf1 = Number((conf1 * 0.9).toFixed(2));
        path1.push({ x: curX1, y: curY1, z: curZ1, confidence: conf1 });
      }
      paths.push(path1);

      // Secondary Path (Urgent Relief): Drop urgency (x-2), deepen context (y+1), tick epoch (z+1)
      const path2 = [];
      let curX2 = startX, curY2 = startY, curZ2 = startZ, conf2 = 0.85;
      for (let i = 0; i < depth; i++) {
        curX2 = Math.max(0, curX2 - 2);
        curY2 = Math.min(48, curY2 + 1);
        curZ2 = Math.min(6, curZ2 + 1);
        conf2 = Number((conf2 * 0.85).toFixed(2));
        path2.push({ x: curX2, y: curY2, z: curZ2, confidence: conf2 });
      }
      paths.push(path2);

      return paths;
    },
    fallbackPlan: async (_, args, ctx) => {
      const { ticketId, startX, startY, startZ, maxDepth, minReusabilityScore } = args;

      // 1. Topological escape paths
      const resPaths = await resolvers.Query.resolutionPaths(_, { ticketId, startX, startY, startZ, maxDepth }, ctx);

      // 2. Historical remediation
      const successPaths = await resolvers.Query.successPaths(
        _, 
        { tags: [], minReusabilityScore, limit: 1 }, 
        ctx
      );

      const bestSuccessPath = successPaths.length > 0 ? successPaths[0] : null;

      return {
        startX,
        startY,
        startZ,
        resolutionPaths: resPaths,
        bestSuccessPath
      };
    }
  },
  SuccessPath: {
    steps: async (parent, { orderBy }) => {
      const session = driver.session();
      try {
        // Expand the BUILDS_ON relationship chain
        const cypher = `
          MATCH (sp:SuccessPath {id: $pathId})
          CALL apoc.path.expand(
            sp,
            "<BUILDS_ON|",
            "-Observation|-Hypothesis|-Action|-Result",
            0, 
            -1,
            "BREADTH_FIRST"
          ) YIELD path AS traversalPath
          WITH nodes(traversalPath) AS steps
          UNWIND range(0, size(steps)-1) AS i
          WITH steps[i] AS step, i+1 AS step_order
          WHERE step IS NOT NULL AND size(labels(step)) > 0 AND NOT "SuccessPath" IN labels(step)
          RETURN step
          ORDER BY step_order
        `;
        const result = await session.run(cypher, { pathId: parent.id });
        return result.records.map(r => r.get('step').properties);
      } finally {
        await session.close();
      }
    }
  },
  PathStep: {
    __resolveType: (obj) => {
      if (obj.extractedSignal !== undefined) return 'Observation';
      if (obj.statement !== undefined) return 'Hypothesis';
      if (obj.command !== undefined) return 'Action';
      if (obj.outcome !== undefined) return 'Result';
      return null;
    }
  },
  Mutation: {
    rateSuccessPath: async (_, { id, success }) => {
      const session = driver.session();
      try {
        const cypher = `
          MATCH (sp:SuccessPath {id: $id})
          SET sp.reusabilityScore = CASE 
            WHEN $success = true THEN CASE WHEN sp.reusabilityScore + 0.1 > 1.0 THEN 1.0 ELSE sp.reusabilityScore + 0.1 END
            ELSE CASE WHEN sp.reusabilityScore - 0.1 < 0.0 THEN 0.0 ELSE sp.reusabilityScore - 0.1 END
          END
          RETURN sp
        `;
        const result = await session.run(cypher, { id, success });
        if (result.records.length === 0) {
          throw new Error(`SuccessPath with id ${id} not found.`);
        }
        return result.records[0].get('sp').properties;
      } finally {
        await session.close();
      }
    },
    ingestTicket: async (_, { ticketId, agentId, label, severity, description, sourceSystem }) => {
      const session = driver.session();
      try {
        const obsId = `${ticketId}_obs`;
        const createdAt = new Date().toISOString();
        const srcSys = sourceSystem || 'rqlite_cube';
        const desc = description || `Ingested ticket`;

        const cypher = `
          MERGE (p:Problem {id: $ticketId})
          SET p.title = $label,
              p.severity = $severity,
              p.description = $description,
              p.status = 'resolved',
              p.sourceSystem = $sourceSystem,
              p.createdAt = $createdAt,
              p.tags = ['live_ingestion']

          MERGE (e:Entity {id: $agentId})
          SET e.type = 'agent'

          MERGE (p)-[:MENTIONS {role: 'affected'}]->(e)

          MERGE (o:Observation {id: $obsId})
          SET o.extractedSignal = 'Live ticket ingested',
              o.confidenceScore = 0.50,
              o.anomalyType = 'live_ingestion',
              o.sourceSystem = $sourceSystem,
              o.createdAt = $createdAt,
              o.tags = ['default_live']

          MERGE (p)-[:LEADS_TO {evidenceStrength: 0.1, method: 'inductive'}]->(o)

          RETURN p
        `;

        const result = await session.run(cypher, {
          ticketId,
          agentId,
          label,
          severity,
          description: desc,
          sourceSystem: srcSys,
          obsId,
          createdAt
        });

        const node = result.records[0].get('p').properties;
        return node;
      } finally {
        await session.close();
      }
    }
  }
};

import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

async function startServer() {
  const schemaPath = path.join(__dirname, '..', 'data', 'schema.graphql');
  const typeDefs = gql(await fs.readFile(schemaPath, 'utf-8'));

  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4076 },
  });

  console.log(`🚀 ADER GraphQL Ingestion Resolver ready at: ${url}`);
}

startServer().catch(console.error);
