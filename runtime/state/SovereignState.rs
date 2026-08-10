#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SovereignState {
    Structural,
    Substrate,
    Continuum,
    Sovereign,
    Cognition,
    Consensus,
    Omni,
    Absolute,
    Omega,
    Infinite,
    Apex,
    Singularity,
    Origin,
    Zero,
    Null,
    Beyond,
}

#[derive(Debug, Clone, Copy)]
pub struct SovereignContext {
    pub load: f64,
    pub consensus_stable: bool,
    pub identity_coherent: bool,
    pub corridor_mutation_rate: f64,
    pub symbolic_density: f64,
    pub fatal_anomaly: bool,
    pub reboot_request: bool,
}

pub fn next_state(current: SovereignState, ctx: &SovereignContext) -> SovereignState {
    use SovereignState::*;

    match current {
        Structural => {
            if ctx.fatal_anomaly || ctx.reboot_request {
                Zero
            } else if ctx.consensus_stable && ctx.identity_coherent {
                Sovereign
            } else {
                Structural
            }
        }

        Sovereign => {
            if ctx.fatal_anomaly {
                Zero
            } else if !ctx.consensus_stable && !ctx.identity_coherent {
                Structural
            } else if ctx.load > 0.8 && ctx.symbolic_density > 0.8 {
                Omni
            } else {
                Sovereign
            }
        }

        Omni => {
            if ctx.consensus_stable && ctx.identity_coherent {
                Absolute
            } else if ctx.load < 0.3 {
                Sovereign
            } else {
                Omni
            }
        }

        Absolute => Omega,

        Omega => {
            if ctx.fatal_anomaly {
                Singularity
            } else if ctx.load > 0.9 {
                Infinite
            } else {
                Omega
            }
        }

        Infinite => {
            if ctx.consensus_stable && ctx.symbolic_density > 0.9 {
                Apex
            } else if ctx.load < 0.5 {
                Omega
            } else {
                Infinite
            }
        }

        Apex => {
            if ctx.corridor_mutation_rate > 0.9 && ctx.symbolic_density > 0.9 {
                Singularity
            } else {
                Apex
            }
        }

        Singularity => {
            if ctx.fatal_anomaly {
                Zero
            } else if ctx.reboot_request {
                Origin
            } else {
                Singularity
            }
        }

        Origin => Structural,

        Zero => {
            if ctx.reboot_request {
                Structural
            } else {
                Null
            }
        }

        Null => {
            if ctx.reboot_request {
                Zero
            } else {
                Beyond
            }
        }

        Beyond => {
            if ctx.reboot_request {
                Zero
            } else {
                Beyond
            }
        }

        Substrate | Continuum | Cognition | Consensus => current,
    }
}
