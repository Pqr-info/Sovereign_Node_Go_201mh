use crate::agents::pantheon::{PantheonEntity, GenesisOrganism};
use crate::substrate::evolution::{Corridor, PhysicsState};
use crate::runtime::orchestrator::MeshOrchestrator;
use crate::substrate::pallets::substrate27::Substrate27Address;
use crate::substrate::pallets::substrate27::SymbolState;

use rand::{Rng, thread_rng};

pub struct MeshGenesisSeeder;

impl MeshGenesisSeeder {
    pub fn seed() -> MeshOrchestrator {
        // -----------------------------
        // 1. Create Genesis Organism
        // -----------------------------
        let genesis_root = GenesisOrganism {
            lineage: vec![0; 32],
            domain: "GENESIS".into(),
            cognitive_state: vec![1, 2, 3],
            federation_id: 27,
        };

        // -----------------------------
        // 2. Create Pantheon Entities
        // -----------------------------
        let mut pantheon = Vec::new();
        for i in 0..9 {
            pantheon.push(PantheonEntity {
                id: vec![i as u8; 32],
                role: format!("ROLE-{}", i),
                lineage: vec![i as u8; 32],
                domain: "GENESIS".into(),
                cognitive_state: vec![i as u8, i as u8 + 1],
            });
        }

        // -----------------------------
        // 3. Create Corridors
        // -----------------------------
        let mut corridors = Vec::new();
        for i in 0..27 {
            corridors.push(Corridor {
                id: i as u32,
                physics: PhysicsState {
                    intensity: 0.1,
                    coherence: 0.9,
                    curvature: 0.01,
                    torsion: 0.01,
                },
            });
        }

        // -----------------------------
        // 4. Seed Substrate 27 Objects
        // -----------------------------
        let mut rng = thread_rng();

        let mut substrate_objects = Vec::new();
        for _ in 0..27 {
            let mut vector = [SymbolState { symbol: 0, state: 0 }; 27];

            for i in 0..27 {
                vector[i] = SymbolState {
                    symbol: i as u8,
                    state: rng.gen_range(0..3),
                };
            }

            let address = Substrate27Address::new(vector);
            substrate_objects.push(address);
        }

        // -----------------------------
        // 5. Create Mesh Orchestrator
        // -----------------------------
        let mut orchestrator = MeshOrchestrator::new(
            corridors,
            pantheon,
            genesis_root,
            Default::default(),
        );

        // -----------------------------
        // 6. Run initial ticks
        // -----------------------------
        orchestrator.run_for(3);

        orchestrator
    }
}
