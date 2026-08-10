use axum::{
    routing::{get},
    Json, Router,
};
use serde::Serialize;

use crate::runtime::orchestrator::MeshOrchestrator;
use crate::sidecars::health::mesh_health_sidecar::MeshHealthSidecar;
use crate::sidecars::telemetry::sovereign_context_sidecar::TelemetrySidecar;

#[derive(Serialize)]
struct StateResponse {
    state: String,
    lens_mode: String,
}

#[derive(Serialize)]
struct TelemetryResponse {
    load: f64,
    consensus_stable: bool,
    identity_coherent: bool,
    mutation_rate: f64,
    symbolic_density: f64,
}

#[derive(Serialize)]
struct HealthResponse {
    corridor_stress: f64,
    coherence_index: f64,
    lineage_stability: f64,
    symbolic_density: f64,
    state_stability: f64,
    warnings: Vec<String>,
}

#[derive(Serialize)]
struct SmfResponse {
    tracks: usize,
    events: usize,
}

pub fn sovereign_dashboard_api(orchestrator: MeshOrchestrator) -> Router {
    let health_sidecar = MeshHealthSidecar::new();
    let telemetry_sidecar = TelemetrySidecar::new();

    Router::new()
        .route(
            "/state",
            get({
                let orchestrator = orchestrator.clone();
                move || async move {
                    Json(StateResponse {
                        state: format!("{:?}", orchestrator.state),
                        lens_mode: format!("{:?}", orchestrator.lens.mode),
                    })
                }
            }),
        )
        .route(
            "/telemetry",
            get({
                let orchestrator = orchestrator.clone();
                let telemetry_sidecar = telemetry_sidecar.clone();
                move || async move {
                    let ctx = telemetry_sidecar.collect(
                        &orchestrator.corridors,
                        &orchestrator.pantheon,
                        None,
                    );

                    Json(TelemetryResponse {
                        load: ctx.load,
                        consensus_stable: ctx.consensus_stable,
                        identity_coherent: ctx.identity_coherent,
                        mutation_rate: ctx.corridor_mutation_rate,
                        symbolic_density: ctx.symbolic_density,
                    })
                }
            }),
        )
        .route(
            "/health",
            get({
                let orchestrator = orchestrator.clone();
                let health_sidecar = health_sidecar.clone();
                move || async move {
                    let health = health_sidecar.evaluate(
                        &orchestrator.corridors,
                        &orchestrator.pantheon,
                        orchestrator.state,
                    );

                    Json(HealthResponse {
                        corridor_stress: health.corridor_stress,
                        coherence_index: health.coherence_index,
                        lineage_stability: health.lineage_stability,
                        symbolic_density: health.symbolic_density,
                        state_stability: health.state_stability,
                        warnings: health.warnings,
                    })
                }
            }),
        )
        .route(
            "/smf",
            get({
                let orchestrator = orchestrator.clone();
                move || async move {
                    let smf = orchestrator.export_smf();
                    let events = smf
                        .tracks
                        .iter()
                        .map(|t| t.len())
                        .sum::<usize>();

                    Json(SmfResponse {
                        tracks: smf.tracks.len(),
                        events,
                    })
                }
            }),
        )
}
