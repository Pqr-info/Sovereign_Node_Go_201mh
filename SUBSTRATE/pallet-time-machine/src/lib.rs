#![cfg_attr(not(feature = "std"), no_std)]

pub mod council;

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;
    use crate::council::{CouncilOfFive, QuorumState};

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    }

    #[pallet::storage]
    #[pallet::getter(fn time_machine_active_branch)]
    pub type ActiveBranch<T> = StorageValue<_, u32, ValueQuery>;

    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
    pub enum TemporalStability {
        Stable,
        Chaotic,
        Metastable,
    }

    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
    pub struct TemporalMarker {
        pub id: sp_core::H256,
        pub track_id: u8,
        pub tick: u64,
        pub created_at: u64,
        pub echo_cycle: u32,
    }

    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
    pub enum DampenerState {
        Idle,
        Absorbing,
        Releasing,
        CrestBuffering,
        BreakerSync,
    }

    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
    pub struct TemporalDampener {
        pub id: sp_core::H256,
        pub state: DampenerState,
        pub gradient: f64,
        pub drift_level: f64,
        pub pressure_level: f64,
        pub buffer_depth: u32,
        pub absorption_rate: f64,
        pub release_rate: f64,
        pub last_sync: u64,
        pub linked_spire_glyph: sp_core::H256,
        pub resonance_lock: bool,
        pub max_buffer_depth: u32,
    }

    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
    pub struct DriftStats {
        pub last_tick: u64,
        pub drift_delta: i64,
        pub stability: TemporalStability,
    }

    #[pallet::storage]
    pub type TemporalMarkers<T: Config> = StorageMap<_, Blake2_128Concat, sp_core::H256, TemporalMarker>;

    #[pallet::storage]
    pub type TemporalDrift<T: Config> = StorageMap<_, Blake2_128Concat, (u8, u32), DriftStats>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        BranchRolledBack { branch_id: u32 },
    }

    #[pallet::error]
    pub enum Error<T> {
        QuorumNotAchieved,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn request_rollback(origin: OriginFor<T>, branch_id: u32, quorum_state: QuorumState) -> DispatchResult {
            let _who = ensure_signed(origin)?;

            // Verify the Council of Five Quorum
            ensure!(CouncilOfFive::verify_quorum::<T>(&quorum_state, 0).is_ok(), Error::<T>::QuorumNotAchieved);

            // Execute Rollback
            ActiveBranch::<T>::put(branch_id);
            Self::deposit_event(Event::BranchRolledBack { branch_id });

            Ok(())
        }
    }

    impl<T: Config> Pallet<T> {
        pub fn ingest_temporal_marker(marker: TemporalMarker) {
            let key = (marker.track_id, marker.echo_cycle);
            let mut stats = <TemporalDrift<T>>::get(key).unwrap_or(DriftStats {
                last_tick: marker.tick,
                drift_delta: 0,
                stability: TemporalStability::Stable,
            });
            let delta = marker.tick as i64 - stats.last_tick as i64;
            stats.drift_delta = delta;
            stats.stability = classify_stability(delta);
            stats.last_tick = marker.tick;
            <TemporalDrift<T>>::insert(key, stats);
            <TemporalMarkers<T>>::insert(marker.id, marker);
        }
    }

    impl TemporalDampener {
        pub fn update_gradient(&mut self, pulse: f64, cycle: f64) {
            self.gradient = pulse / cycle;
        }

        pub fn apply_absorption(&mut self, base_rate: f64) {
            if self.gradient > 1.0 {
                self.state = DampenerState::Absorbing;
                self.buffer_depth += 1;
                
                // Logistic scaling to approach an asymptote (Game Theory fix)
                let available_capacity = (self.max_buffer_depth.saturating_sub(self.buffer_depth)) as f64 / self.max_buffer_depth as f64;
                self.absorption_rate += base_rate * available_capacity;
            }
        }

        pub fn breaker_sync(&mut self) {
            self.state = DampenerState::BreakerSync;
            let new_rate = self.release_rate * 0.5;
            self.release_rate = if new_rate > 0.1 { new_rate } else { 0.1 }; // Enforce floor (Game Theory fix)
        }
    }

    fn classify_stability(delta: i64) -> TemporalStability {
        match delta.abs() {
            0..=5 => TemporalStability::Stable,
            6..=50 => TemporalStability::Metastable,
            _ => TemporalStability::Chaotic,
        }
    }
}
