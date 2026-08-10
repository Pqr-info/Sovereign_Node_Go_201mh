use clap::{Parser, Subcommand};
use crate::runtime::orchestrator::MeshOrchestrator;
use crate::sidecars::health::mesh_health_sidecar::MeshHealthSidecar;
use crate::sidecars::telemetry::sovereign_context_sidecar::TelemetrySidecar;
use crate::persistence::mesh_persistence_layer::MeshPersistenceLayer;
use crate::integration::pqr_integration_layer::PqrIntegrationLayer;

#[derive(Parser)]
#[command(name = "mesh")]
#[command(about = "Sovereign Mesh CLI", long_about = None)]
pub struct MeshCli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Run one sovereign tick
    Tick,

    /// Run N ticks
    Run {
        #[arg(short, long)]
        count: usize,
    },

    /// Show sovereign state + lens
    State,

    /// Show mesh health diagnostics
    Health,

    /// Show telemetry context
    Telemetry,

    /// Trigger ATR recovery
    Recover {
        #[arg(short, long)]
        wallet_id: String,
        #[arg(short, long)]
        challenge: String,
    },

    /// Persist a snapshot into CockroachDB
    Snapshot,

    /// Export symbolic kernel summary
    Smf,
}

pub fn run_cli(
    cli: MeshCli,
    orchestrator: &mut MeshOrchestrator,
    pqr: &mut PqrIntegrationLayer,
    persistence: &MeshPersistenceLayer,
) {
    match cli.command {
        Commands::Tick => {
            orchestrator.tick();
            println!("Tick complete. State: {:?}", orchestrator.state);
        }

        Commands::Run { count } => {
            for _ in 0..count {
                orchestrator.tick();
            }
            println!("Ran {} ticks. State: {:?}", count, orchestrator.state);
        }

        Commands::State => {
            println!("State: {:?}", orchestrator.state);
            println!("Lens: {:?}", orchestrator.lens.mode);
        }

        Commands::Health => {
            let health = MeshHealthSidecar::new().evaluate(
                &orchestrator.corridors,
                &orchestrator.pantheon,
                orchestrator.state,
            );
            println!("Mesh Health:");
            println!("  Stress: {:.3}", health.corridor_stress);
            println!("  Coherence: {:.3}", health.coherence_index);
            println!("  Lineage Stability: {:.3}", health.lineage_stability);
            println!("  Symbolic Density: {:.3}", health.symbolic_density);
            println!("  State Stability: {:.3}", health.state_stability);
            if !health.warnings.is_empty() {
                println!("  Warnings: {:?}", health.warnings);
            }
        }

        Commands::Telemetry => {
            let ctx = TelemetrySidecar::new().collect(
                &orchestrator.corridors,
                &orchestrator.pantheon,
                None,
            );
            println!("Telemetry:");
            println!("  Load: {:.3}", ctx.load);
            println!("  Consensus: {}", ctx.consensus_stable);
            println!("  Identity: {}", ctx.identity_coherent);
            println!("  Mutation Rate: {:.3}", ctx.corridor_mutation_rate);
            println!("  Symbolic Density: {:.3}", ctx.symbolic_density);
        }

        Commands::Recover { wallet_id, challenge } => {
            let res = reqwest::blocking::Client::new()
                .post("https://recovery-worker.local/recover")
                .json(&serde_json::json!({
                    "wallet_id": wallet_id,
                    "challenge": challenge
                }))
                .send()
                .unwrap()
                .json::<serde_json::Value>()
                .unwrap();

            println!("Recovery Result: {}", res);
        }

        Commands::Snapshot => {
            let health = MeshHealthSidecar::new().evaluate(
                &orchestrator.corridors,
                &orchestrator.pantheon,
                orchestrator.state,
            );

            futures::executor::block_on(async {
                persistence.persist_snapshot(
                    orchestrator.state,
                    orchestrator.lens.mode,
                    &orchestrator.corridors,
                    &orchestrator.pantheon,
                    &health,
                ).await;
            });

            println!("Snapshot persisted.");
        }

        Commands::Smf => {
            let smf = orchestrator.export_smf();
            let events = smf.tracks.iter().map(|t| t.len()).sum::<usize>();
            println!("SMF Summary:");
            println!("  Tracks: {}", smf.tracks.len());
            println!("  Events: {}", events);
        }
    }
}
