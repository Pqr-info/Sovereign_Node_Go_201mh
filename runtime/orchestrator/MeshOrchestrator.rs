use crate::runtime::sor_tick::sor_tick;
use crate::runtime::state::{SovereignState, SovereignContext};
use crate::runtime::lens::SovereignLens;
use crate::substrate::evolution::{EvolutionParams, Corridor};
use crate::agents::pantheon::{PantheonEntity, GenesisOrganism};
use crate::agents::osspark::OsSparkKernel;

pub struct MeshOrchestrator {
    pub corridors: Vec<Corridor>,
    pub pantheon: Vec<PantheonEntity>,
    pub genesis_root: GenesisOrganism,
    pub state: SovereignState,
    pub ctx: SovereignContext,
    pub params: EvolutionParams,
    pub kernel: OsSparkKernel,
    pub lens: SovereignLens,
}

impl MeshOrchestrator {
    pub fn new(
        corridors: Vec<Corridor>,
        pantheon: Vec<PantheonEntity>,
        genesis_root: GenesisOrganism,
        ctx: SovereignContext,
    ) -> Self {
        Self {
            corridors,
            pantheon,
            genesis_root,
            state: SovereignState::Structural,
            ctx,
            params: EvolutionParams::default(),
            kernel: OsSparkKernel::new(),
            lens: SovereignLens::new(),
        }
    }

    pub fn tick(&mut self) {
        sor_tick(
            &mut self.corridors,
            &mut self.pantheon,
            &self.genesis_root,
            &mut self.state,
            &self.ctx,
            &self.params,
            &mut self.kernel,
            &mut self.lens,
        );
    }

    pub fn run_for(&mut self, ticks: usize) {
        for _ in 0..ticks {
            self.tick();
        }
    }

    pub fn current_state(&self) -> SovereignState {
        self.state
    }

    pub fn current_lens(&self) -> crate::runtime::lens::LensMode {
        self.lens.mode
    }

    pub fn export_smf(&self) -> &midly::Smf<'static> {
        &self.kernel.smf
    }
}
