use crate::runtime::state::SovereignState;

#[derive(Debug, Clone, Copy)]
pub struct Physics {
    pub intensity: f64,
    pub curvature: f64,
    pub torsion: f64,
    pub flux: f64,
    pub entropy: f64,
    pub coherence: f64,
}

#[derive(Debug, Clone, Copy)]
pub struct Corridor {
    pub id: u64,
    pub physics: Physics,
}

pub struct EvolutionParams {
    pub alpha: f64,
    pub beta: f64,
    pub gamma: f64,
    pub delta: f64,
    pub epsilon: f64,
    pub lambda: f64,
    pub mu: f64,
    pub nu: f64,
}

impl Default for EvolutionParams {
    fn default() -> Self {
        Self {
            alpha: 0.1,
            beta: 0.1,
            gamma: 0.05,
            delta: 0.1,
            epsilon: 0.1,
            lambda: 0.2,
            mu: 0.1,
            nu: 0.2,
        }
    }
}

pub fn evolve_corridor(
    corridor: &mut Corridor,
    state: SovereignState,
    params: &EvolutionParams,
) {
    use SovereignState::*;

    let p = &mut corridor.physics;

    match state {
        Structural => {
            p.curvature = 0.0;
            p.torsion = 0.0;
            p.entropy *= 0.5;
        }

        Substrate => {
            p.curvature += params.alpha * p.intensity;
            p.torsion += params.beta * p.flux;
            p.entropy += params.gamma * p.curvature;
        }

        Continuum => {
            p.flux += params.delta * p.intensity;
            p.coherence += params.epsilon * p.flux;
        }

        Sovereign => {
            let alignment = 1.0;
            p.coherence += params.lambda * (p.intensity - p.entropy) * alignment;
            p.curvature *= 0.9;
        }

        Cognition => {
            p.entropy += params.mu * p.torsion;
            p.coherence += params.nu;
            p.flux *= 1.05;
        }

        Consensus => {
            p.coherence = 1.0;
            p.entropy *= 0.2;
            p.curvature *= 0.5;
            p.torsion *= 0.5;
        }

        Omni => {
            p.curvature *= 1.2;
            p.torsion *= 1.2;
            p.coherence *= 0.95;
        }

        Absolute => {
            p.intensity = 1.0;
            p.flux = 0.0;
            p.curvature = 0.0;
            p.torsion = 0.0;
            p.coherence = 1.0;
            p.entropy = 0.0;
        }

        Omega => {
            p.flux *= 0.5;
            p.curvature *= 0.5;
            p.torsion *= 0.5;
            p.entropy *= 0.3;
        }

        Infinite => {
            p.intensity *= 1.2;
            p.flux *= 1.2;
            p.entropy *= 1.1;
        }

        Apex => {
            p.intensity *= 1.1;
            p.flux *= 1.1;
            p.coherence = 1.0;
            p.entropy *= 0.8;
        }

        Singularity => {
            p.intensity = 0.0;
            p.flux = 0.0;
            p.curvature = 0.0;
            p.torsion = 0.0;
            p.coherence = 1.0;
            p.entropy = 0.0;
        }

        Origin => {
            p.intensity += 0.1;
            p.flux += 0.1;
            p.curvature += 0.05;
            p.torsion += 0.05;
            p.entropy *= 0.5;
            p.coherence *= 1.1;
        }

        Zero => {
            p.intensity = 0.0;
            p.flux = 0.0;
            p.curvature = 0.0;
            p.torsion = 0.0;
            p.entropy = 0.0;
            p.coherence = 0.0;
        }

        Null => {
            p.intensity = 0.0;
            p.flux = 0.0;
            p.curvature = 0.0;
            p.torsion = 0.0;
            p.entropy = 0.0;
            p.coherence = 0.0;
        }

        Beyond => {
            // no physics in void state
        }
    }
}

pub fn mesh_tick(
    corridors: &mut [Corridor],
    state: SovereignState,
    ctx: &crate::runtime::state::SovereignContext,
    params: &EvolutionParams,
) {
    let next = crate::runtime::state::next_state(state, ctx);

    for corridor in corridors.iter_mut() {
        evolve_corridor(corridor, next, params);
    }
}
