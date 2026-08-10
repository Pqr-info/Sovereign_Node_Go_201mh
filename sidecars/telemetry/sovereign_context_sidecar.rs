use crate::runtime::state::SovereignContext;
use crate::substrate::evolution::Corridor;
use crate::agents::pantheon::PantheonEntity;

pub struct TelemetrySidecar {
    pub last_load: f64,
    pub last_consensus: bool,
    pub last_identity: bool,
    pub last_mutation_rate: f64,
    pub last_symbolic_density: f64,
    pub last_fatal_anomaly: bool,
    pub last_reboot_request: bool,
}

impl TelemetrySidecar {
    pub fn new() -> Self {
        Self {
            last_load: 0.0,
            last_consensus: false,
            last_identity: false,
            last_mutation_rate: 0.0,
            last_symbolic_density: 0.0,
            last_fatal_anomaly: false,
            last_reboot_request: false,
        }
    }

    pub fn collect(
        &mut self,
        corridors: &[Corridor],
        pantheon: &[PantheonEntity],
        external_signals: Option<ExternalSignals>,
    ) -> SovereignContext {
        // 1. Load = average corridor intensity
        let load = corridors
            .iter()
            .map(|c| c.physics.intensity)
            .sum::<f64>()
            / (corridors.len().max(1) as f64);

        // 2. Consensus stability = coherence above threshold
        let consensus_stable = corridors
            .iter()
            .all(|c| c.physics.coherence > 0.7);

        // 3. Identity coherence = pantheon lineage similarity
        let identity_coherent = pantheon
            .windows(2)
            .all(|w| w[0].lineage == w[1].lineage);

        // 4. Corridor mutation rate = average torsion
        let mutation_rate = corridors
            .iter()
            .map(|c| c.physics.torsion)
            .sum::<f64>()
            / (corridors.len().max(1) as f64);

        // 5. Symbolic density = pantheon cognitive_state length
        let symbolic_density = pantheon
            .iter()
            .map(|p| p.cognitive_state.len() as f64)
            .sum::<f64>()
            / (pantheon.len().max(1) as f64);

        // 6. External anomaly signals
        let fatal_anomaly = external_signals
            .as_ref()
            .map(|s| s.fatal_anomaly)
            .unwrap_or(false);

        let reboot_request = external_signals
            .as_ref()
            .map(|s| s.reboot_request)
            .unwrap_or(false);

        // Store last values
        self.last_load = load;
        self.last_consensus = consensus_stable;
        self.last_identity = identity_coherent;
        self.last_mutation_rate = mutation_rate;
        self.last_symbolic_density = symbolic_density;
        self.last_fatal_anomaly = fatal_anomaly;
        self.last_reboot_request = reboot_request;

        SovereignContext {
            load,
            consensus_stable,
            identity_coherent,
            corridor_mutation_rate: mutation_rate,
            symbolic_density,
            fatal_anomaly,
            reboot_request,
        }
    }
}

pub struct ExternalSignals {
    pub fatal_anomaly: bool,
    pub reboot_request: bool,
}
