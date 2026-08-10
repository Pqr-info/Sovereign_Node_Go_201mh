use crate::runtime::orchestrator::MeshOrchestrator;
use crate::sidecars::telemetry::sovereign_context_sidecar::TelemetrySidecar;
use crate::sidecars::health::mesh_health_sidecar::{MeshHealthSidecar, MeshHealth};
use crate::runtime::state::SovereignContext;

use serde::{Serialize, Deserialize};
use reqwest::blocking::Client;

#[derive(Debug, Serialize, Deserialize)]
pub struct TicketPayload {
    pub title: String,
    pub description: String,
    pub priority: String,
    pub domain: String,
    pub state: String,
    pub health: MeshHealth,
}

pub struct PqrIntegrationLayer {
    pub orchestrator: MeshOrchestrator,
    pub telemetry: TelemetrySidecar,
    pub health: MeshHealthSidecar,
    pub http: Client,
    pub pqr_api: String,
}

impl PqrIntegrationLayer {
    pub fn new(orchestrator: MeshOrchestrator, pqr_api: &str) -> Self {
        Self {
            orchestrator,
            telemetry: TelemetrySidecar::new(),
            health: MeshHealthSidecar::new(),
            http: Client::new(),
            pqr_api: pqr_api.to_string(),
        }
    }

    pub fn tick(&mut self) {
        // 1. Collect telemetry → SovereignContext
        let ctx: SovereignContext = self.telemetry.collect(
            &self.orchestrator.corridors,
            &self.orchestrator.pantheon,
            None,
        );

        self.orchestrator.ctx = ctx;

        // 2. Run sovereign organism tick
        self.orchestrator.tick();

        // 3. Evaluate mesh health
        let health = self.health.evaluate(
            &self.orchestrator.corridors,
            &self.orchestrator.pantheon,
            self.orchestrator.state,
        );

        // 4. If health warnings exist → create PQR ticket
        if !health.warnings.is_empty() {
            self.create_ticket(health);
        }
    }

    pub fn create_ticket(&self, health: MeshHealth) {
        let payload = TicketPayload {
            title: "Mesh Health Warning".into(),
            description: format!(
                "Warnings detected: {:?}",
                health.warnings
            ),
            priority: "High".into(),
            domain: "SovereignMesh".into(),
            state: format!("{:?}", self.orchestrator.state),
            health,
        };

        let _ = self.http.post(format!("{}/tickets", self.pqr_api))
            .json(&payload)
            .send();
    }
}
