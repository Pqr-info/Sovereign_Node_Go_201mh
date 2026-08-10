use serde::{Serialize, Deserialize};
use reqwest::blocking::Client;

use crate::runtime::orchestrator::MeshOrchestrator;
use crate::sidecars::health::mesh_health_sidecar::MeshHealthSidecar;
use crate::sidecars::telemetry::sovereign_context_sidecar::TelemetrySidecar;

#[derive(Debug, Serialize, Deserialize)]
pub struct GemmaToolCall {
    pub tool_name: String,
    pub payload: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GemmaResponse {
    pub message: String,
    pub tool_calls: Vec<GemmaToolCall>,
}

pub struct GemmaAgentIntegration {
    pub orchestrator: MeshOrchestrator,
    pub telemetry: TelemetrySidecar,
    pub health: MeshHealthSidecar,
    pub http: Client,
    pub mcp_endpoint: String,
}

impl GemmaAgentIntegration {
    pub fn new(orchestrator: MeshOrchestrator, mcp_endpoint: &str) -> Self {
        Self {
            orchestrator,
            telemetry: TelemetrySidecar::new(),
            health: MeshHealthSidecar::new(),
            http: Client::new(),
            mcp_endpoint: mcp_endpoint.to_string(),
        }
    }

    pub fn handle_gemma_message(&mut self, message: &str) -> GemmaResponse {
        // 1. Interpret message → decide which MCP tool to call
        let tool_calls = self.route_message_to_tools(message);

        // 2. Execute tool calls via MCP server
        for call in &tool_calls {
            let _ = self.http.post(&self.mcp_endpoint)
                .json(call)
                .send();
        }

        // 3. Return structured response for Gemma
        GemmaResponse {
            message: format!("Gemma processed: {}", message),
            tool_calls,
        }
    }

    fn route_message_to_tools(&mut self, message: &str) -> Vec<GemmaToolCall> {
        let mut calls = Vec::new();

        // Mesh health
        if message.contains("health") {
            let health = self.health.evaluate(
                &self.orchestrator.corridors,
                &self.orchestrator.pantheon,
                self.orchestrator.state,
            );

            calls.push(GemmaToolCall {
                tool_name: "get_mesh_health".into(),
                payload: serde_json::json!({ "warnings": health.warnings }),
            });
        }

        // State
        if message.contains("state") {
            calls.push(GemmaToolCall {
                tool_name: "get_state".into(),
                payload: serde_json::json!({}),
            });
        }

        // Recovery
        if message.contains("recover") {
            calls.push(GemmaToolCall {
                tool_name: "run_recovery".into(),
                payload: serde_json::json!({
                    "wallet_id": "sovereign-wallet",
                    "challenge": "gemma-challenge"
                }),
            });
        }

        // SMF output
        if message.contains("symbolic") || message.contains("smf") {
            calls.push(GemmaToolCall {
                tool_name: "get_smf_output".into(),
                payload: serde_json::json!({}),
            });
        }

        calls
    }
}
