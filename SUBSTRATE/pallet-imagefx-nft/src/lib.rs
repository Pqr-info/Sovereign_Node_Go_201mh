#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

pub mod metadata;
pub mod mint;
pub mod gallery;
pub mod types;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        pallet_prelude::*,
        traits::{Currency, ReservableCurrency},
    };
    use frame_system::pallet_prelude::*;
    use crate::metadata::ImageMetadata;

    pub type BalanceOf<T> = <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;
        #[pallet::constant]
        type MaxMetadataLength: Get<u32>;
    }

    #[pallet::pallet]
    #[pallet::without_storage_info]
    pub struct Pallet<T>(_);

    /// Store the NFTs
    #[pallet::storage]
    #[pallet::getter(fn nfts)]
    pub type NFTs<T: Config> = StorageMap<
        _, Blake2_128Concat, T::Hash, ImageMetadata<T>, OptionQuery
    >;

    /// Store owner balances (who owns which NFT hash)
    #[pallet::storage]
    #[pallet::getter(fn nft_owner)]
    pub type NFTOwner<T: Config> = StorageMap<
        _, Blake2_128Concat, T::Hash, T::AccountId, OptionQuery
    >;

    /// Store gallery listings (NFTs for sale)
    #[pallet::storage]
    #[pallet::getter(fn gallery_listings)]
    pub type GalleryListings<T: Config> = StorageMap<
        _, Blake2_128Concat, T::Hash, BalanceOf<T>, OptionQuery
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        Minted(T::Hash, T::AccountId),
        Transferred(T::Hash, T::AccountId, T::AccountId),
        Burned(T::Hash),
        ListedForSale(T::Hash, BalanceOf<T>),
        Delisted(T::Hash),
        Sold(T::Hash, T::AccountId, T::AccountId, BalanceOf<T>),
    }

    #[pallet::error]
    pub enum Error<T> {
        NFTNotFound,
        NFTAlreadyExists,
        NotOwner,
        NotForSale,
        InsufficientFunds,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn mint(origin: OriginFor<T>, metadata: ImageMetadata<T>) -> DispatchResult {
            crate::mint::do_mint::<T>(origin, metadata)
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn transfer(origin: OriginFor<T>, to: T::AccountId, hash: T::Hash) -> DispatchResult {
            crate::mint::do_transfer::<T>(origin, to, hash)
        }

        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn burn(origin: OriginFor<T>, hash: T::Hash) -> DispatchResult {
            crate::mint::do_burn::<T>(origin, hash)
        }

        #[pallet::call_index(3)]
        #[pallet::weight(10_000)]
        pub fn list_for_sale(origin: OriginFor<T>, hash: T::Hash, price: BalanceOf<T>) -> DispatchResult {
            crate::gallery::do_list_for_sale::<T>(origin, hash, price)
        }

        #[pallet::call_index(4)]
        #[pallet::weight(10_000)]
        pub fn delist(origin: OriginFor<T>, hash: T::Hash) -> DispatchResult {
            crate::gallery::do_delist::<T>(origin, hash)
        }

        #[pallet::call_index(5)]
        #[pallet::weight(10_000)]
        pub fn buy(origin: OriginFor<T>, hash: T::Hash) -> DispatchResult {
            crate::gallery::do_buy::<T>(origin, hash)
        }
    }
}
