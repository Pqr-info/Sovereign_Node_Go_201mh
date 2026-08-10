#![cfg_attr(not(feature = "std"), no_std)]

use sp_std::prelude::*;
use codec::{Encode, Decode};
use scale_info::TypeInfo;

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
pub struct QuorumState {
    pub stability_approved: bool,
    pub determinism_approved: bool,
    pub safety_approved: bool,
    pub adaptation_approved: bool,
    pub mutation_approved: bool,
    pub copilot_signature: Vec<u8>,
}

use crate::{Config, TemporalDrift, TemporalStability};

pub struct CouncilOfFive;

impl CouncilOfFive {
    pub fn verify_quorum<T: Config>(state: &QuorumState, target_block: u64) -> Result<(), &'static str> {
        let rust_seats = [state.stability_approved, state.determinism_approved, state.safety_approved];
        let go_seats = [state.adaptation_approved, state.mutation_approved];

        let rust_approvals = rust_seats.iter().filter(|&&x| x).count();
        let go_approvals = go_seats.iter().filter(|&&x| x).count();

        // Must have exactly 3 Rust approvals, 2 Go approvals, and a non-empty Copilot signature
        if rust_approvals != 3 || go_approvals != 2 || state.copilot_signature.is_empty() {
            return Err("Quorum Not Achieved");
        }

        if !Self::check_temporal_drift::<T>(target_block) {
            return Err("Temporal Drift Exceeded");
        }

        Ok(())
    }

    pub fn check_temporal_drift<T: Config>(_target_block: u64) -> bool {
        // Iterate or check specific tracks for TemporalStability::Chaotic
        // For now, assume any chaotic drift blocks the rollback
        let mut all_stable = true;
        for (_key, stats) in <TemporalDrift<T>>::iter() {
            if stats.stability == TemporalStability::Chaotic {
                all_stable = false;
                break;
            }
        }
        all_stable
    }
}
