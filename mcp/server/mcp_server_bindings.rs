use serde::{Serialize, Deserialize};
use axum::{
    routing::post,
    Json, Router,
};

use crate::runtime::orchestrator::MeshOrchestrator;
use crate::sidecars::health::mesh_health_sidecar::MeshHealthSidecar;
use crate::sidecars::telemetry::sovereign_context_sidecar::TelemetrySidecar;
use crate::integration::pqr_integration_layer::PqrIntegrationLayer;

#[derive(Debug, Serialize, Deserialize)]
pub struct McpRequest {
    pub tool_name: String,
    pub payload: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct McpResponse {
    pub tool_name: String,
    pub result: serde_json::Value,
}

pub fn mcp_server_bindings(
    orchestrator: MeshOrchestrator,
    pqr: PqrIntegrationLayer,
) -> Router {
    let health_sidecar = MeshHealthSidecar::new();
    let telemetry_sidecar = TelemetrySidecar::new();

    Router::new().route(
        "/mcp",
        post(move |Json(req): Json<McpRequest>| async move {
            let result = match req.tool_name.as_str() {
                "get_mesh_health" => {
                    let health = health_sidecar.evaluate(
                        &orchestrator.corridors,
                        &orchestrator.pantheon,
                        orchestrator.state,
                    );
                    serde_json::json!(health)
                }

                "get_state" => {
                    serde_json::json!({
                        "state": format!("{:?}", orchestrator.state),
                        "lens_mode": format!("{:?}", orchestrator.lens.mode)
                    })
                }

                "run_recovery" => {
                    let wallet_id = req.payload["wallet_id"].as_str().unwrap_or("");
                    let challenge = req.payload["challenge"].as_str().unwrap_or("");

                    let recovery_result = reqwest::blocking::Client::new()
                        .post("https://recovery-worker.local/recover")
                        .json(&serde_json::json!({
                            "wallet_id": wallet_id,
                            "challenge": challenge
                        }))
                        .send()
                        .unwrap()
                        .json::<serde_json::Value>()
                        .unwrap();

                    serde_json::json!(recovery_result)
                }

                "get_smf_output" => {
                    let smf = orchestrator.export_smf();
                    let events = smf.tracks.iter().map(|t| t.len()).sum::<usize>();

                    serde_json::json!({
                        "tracks": smf.tracks.len(),
                        "events": events
                    })
                }

                "create_ticket" => {
                    let title = req.payload["title"].as_str().unwrap_or("Untitled");
                    let description = req.payload["description"].as_str().unwrap_or("");
                    let priority = req.payload["priority"].as_str().unwrap_or("Medium");
                    let domain = req.payload["domain"].as_str().unwrap_or("General");

                    let payload = serde_json::json!({
                        "title": title,
                        "description": description,
                        "priority": priority,
                        "domain": domain
                    });

                    let _ = pqr.http.post(format!("{}/tickets", pqr.pqr_api))
                        .json(&payload)
                        .send();

                    serde_json::json!({ "status": "ticket_created" })
                }

                _ => serde_json::json!({ "error": "unknown_tool" }),
            };

            Json(McpResponse {
                tool_name: req.tool_name,
                result,
            })
        }),
    )
}
