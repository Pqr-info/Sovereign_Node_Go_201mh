use sha3::{Sha3_256, Digest};
use crate::runtime::state::SovereignState;

#[derive(Debug, Clone)]
pub struct PantheonEntity {
    pub id: Vec<u8>,
    pub role: String,
    pub lineage: Vec<u8>,
    pub domain: String,
    pub cognitive_state: Vec<u8>,
}

#[derive(Debug, Clone)]
pub struct GenesisOrganism {
    pub lineage: Vec<u8>,
    pub domain: String,
    pub cognitive_state: Vec<u8>,
    pub federation_id: u64,
}

pub fn evolve_lineage(
    pantheon: &mut [PantheonEntity],
    parent: &GenesisOrganism,
    state: SovereignState,
) {
    use SovereignState::*;

    match state {
        Sovereign | Cognition | Consensus => {
            // Normal evolutionary propagation
            for entity in pantheon.iter_mut() {
                let mut hasher = Sha3_256::new();
                hasher.update(&entity.lineage);
                hasher.update(&parent.lineage);
                hasher.update(&entity.cognitive_state);

                let new_lineage = hasher.finalize().to_vec();
                entity.lineage = new_lineage.clone();
                entity.id = new_lineage;
            }
        }

        Omni | Absolute | Omega | Apex => {
            // High‑order consolidation: compress lineage
            for entity in pantheon.iter_mut() {
                let mut hasher = Sha3_256::new();
                hasher.update(&entity.lineage);

                let new_lineage = hasher.finalize().to_vec();
                entity.lineage = new_lineage.clone();
                entity.id = new_lineage;
            }
        }

        Infinite => {
            // Branching: spawn derivative organisms (hook for future expansion)
            // You may append new PantheonEntity or GenesisOrganism here.
        }

        Singularity => {
            // Collapse: converge lineage to a single root
            let mut hasher = Sha3_256::new();
            hasher.update(&parent.lineage);
            let root = hasher.finalize().to_vec();

            for entity in pantheon.iter_mut() {
                entity.lineage = root.clone();
                entity.id = root.clone();
            }
        }

        Origin => {
            // Re‑seed: use parent as new root for future propagation
            for entity in pantheon.iter_mut() {
                entity.lineage = parent.lineage.clone();
                entity.id = parent.lineage.clone();
            }
        }

        Zero | Null | Beyond => {
            // Reset: lineage cleared or held in abeyance
            for entity in pantheon.iter_mut() {
                entity.lineage.clear();
            }
        }

        Structural | Substrate | Continuum => {
            // No lineage mutation in purely structural regimes
        }
    }
}
