#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

pub mod types;
pub mod metadata;
pub mod mint;
pub mod gallery;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;
    use crate::types::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    }

    #[pallet::storage]
    #[pallet::getter(fn image_nfts)]
    pub type ImageNFTs<T: Config> = StorageMap<_, Blake2_128Concat, TokenId, ImageFxMetadata<T>, OptionQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        NFTMinted { owner: T::AccountId, token_id: TokenId },
    }

    #[pallet::error]
    pub enum Error<T> {
        TokenAlreadyExists,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {}
}
