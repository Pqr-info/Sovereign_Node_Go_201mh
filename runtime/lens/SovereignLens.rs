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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LensMode {
    Structural,
    Substrate,
    Continuum,
    Sovereign,
    Cognitive,
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

pub struct SovereignLens {
    pub mode: LensMode,
}

impl SovereignLens {
    pub fn new() -> Self {
        Self {
            mode: LensMode::Structural,
        }
    }

    pub fn set_mode_for_state(&mut self, state: SovereignState) {
        use SovereignState::*;
        use LensMode::*;

        self.mode = match state {
            Structural => Structural,
            Substrate => Substrate,
            Continuum => Continuum,
            Sovereign => Sovereign,
            Cognition => Cognitive,
            Consensus => Consensus,
            Omni => Omni,
            Absolute => Absolute,
            Omega => Omega,
            Infinite => Infinite,
            Apex => Apex,
            Singularity => Singularity,
            Origin => Origin,
            Zero => Zero,
            Null => Null,
            Beyond => Beyond,
        };
    }
}
