#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;
	extern crate alloc;
	use alloc::vec::Vec;

	#[pallet::pallet]
	pub struct Pallet<T>(_);

	#[pallet::config]
	pub trait Config: frame_system::Config {
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
	}

	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		ContinuityEventArchived { payload: Vec<u8>, who: T::AccountId },
	}

	#[pallet::error]
	pub enum Error<T> {
		PayloadTooLarge,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::call_index(0)]
		#[pallet::weight(Weight::from_parts(10_000, 0) + T::DbWeight::get().writes(1))]
		pub fn archive_event(origin: OriginFor<T>, payload: Vec<u8>) -> DispatchResult {
			let who = ensure_signed(origin)?;
			ensure!(payload.len() <= 10240, Error::<T>::PayloadTooLarge);
			Self::deposit_event(Event::ContinuityEventArchived { payload, who });
			Ok(())
		}
	}
}
