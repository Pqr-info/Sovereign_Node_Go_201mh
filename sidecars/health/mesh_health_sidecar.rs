use crate::substrate::evolution::Corridor;
use crate::agents::pantheon::PantheonEntity;
use crate::runtime::state::SovereignState;

#[derive(Debug, Clone)]
pub struct MeshHealth {
    pub corridor_stress: f64,
    pub coherence_index: f64,
    pub lineage_stability: f64,
    pub symbolic_density: f64,
    pub state_stability: f64,
    pub warnings: Vec<String>,
}

pub struct MeshHealthSidecar;

impl MeshHealthSidecar {
    pub fn new() -> Self {
        Self
    }

    pub fn evaluate(
        &self,
        corridors: &[Corridor],
        pantheon: &[PantheonEntity],
        state: SovereignState,
    ) -> MeshHealth {
        let mut warnings = Vec::new();

        // 1. Corridor stress = average curvature + torsion
        let corridor_stress = corridors
            .iter()
            .map(|c| c.physics.curvature + c.physics.torsion)
            .sum::<f64>()
            / (corridors.len().max(1) as f64);

        if corridor_stress > 1.5 {
            warnings.push("High corridor stress detected".into());
        }

        // 2. Coherence index = average coherence
        let coherence_index = corridors
            .iter()
            .map(|c| c.physics.coherence)
            .sum::<f64>()
            / (corridors.len().max(1) as f64);

        if coherence_index < 0.4 {
            warnings.push("Low mesh coherence".into());
        }

        // 3. Lineage stability = % of pantheon sharing same lineage root
        let lineage_stability = if pantheon.is_empty() {
            1.0
        } else {
            let root = &pantheon[0].lineage;
            let matches = pantheon
                .iter()
                .filter(|p| p.lineage == *root)
                .count() as f64;

            matches / (pantheon.len() as f64)
        };

        if lineage_stability < 0.5 {
            warnings.push("Pantheon lineage divergence detected".into());
        }

        // 4. Symbolic density = average cognitive_state length
        let symbolic_density = pantheon
            .iter()
            .map(|p| p.cognitive_state.len() as f64)
            .sum::<f64>()
            / (pantheon.len().max(1) as f64);

        if symbolic_density > 200.0 {
            warnings.push("High symbolic density (possible overload)".into());
        }

        // 5. State stability = heuristic based on sovereign state
        let state_stability = match state {
            SovereignState::Structural => 0.9,
            SovereignState::Substrate => 0.8,
            SovereignState::Continuum => 0.85,
            SovereignState::Sovereign => 1.0,
            SovereignState::Cognition => 0.7,
            SovereignState::Consensus => 1.0,
            SovereignState::Omni => 0.6,
            SovereignState::Absolute => 1.0,
            SovereignState::Omega => 0.5,
            SovereignState::Infinite => 0.4,
            SovereignState::Apex => 0.9,
            SovereignState::Singularity => 0.3,
            SovereignState::Origin => 0.8,
            SovereignState::Zero => 0.2,
            SovereignState::Null => 0.1,
            SovereignState::Beyond => 0.0,
        };

        if state_stability < 0.4 {
            warnings.push("Sovereign state instability detected".into());
        }

        MeshHealth {
            corridor_stress,
            coherence_index,
            lineage_stability,
            symbolic_density,
            state_stability,
            warnings,
        }
    }
}
