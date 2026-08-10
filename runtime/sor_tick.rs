use crate::substrate::evolution::{mesh_tick, EvolutionParams, Corridor};
use crate::agents::pantheon::{GenesisOrganism, PantheonEntity, evolve_lineage};
use crate::runtime::state::{SovereignState, SovereignContext, next_state};
use crate::runtime::lens::SovereignLens;
use crate::agents::osspark::OsSparkKernel;

pub fn sor_tick(
    corridors: &mut [Corridor],
    pantheon: &mut [PantheonEntity],
    genesis_root: &GenesisOrganism,
    state: &mut SovereignState,
    ctx: &SovereignContext,
    params: &EvolutionParams,
    kernel: &mut OsSparkKernel,
    lens: &mut SovereignLens,
) {
    // 1. Advance sovereign state
    let next = next_state(*state, ctx);
    *state = next;

    // 2. Evolve corridor physics mesh-wide
    mesh_tick(corridors, next, ctx, params);

    // 3. Update lineage / pantheon based on state
    evolve_lineage(pantheon, genesis_root, next);

    // 4. Emit symbolic SMF events for current state
    kernel.emit_state(next, corridors, pantheon);

    // 5. Adjust perceptual lens mode
    lens.set_mode_for_state(next);
}
