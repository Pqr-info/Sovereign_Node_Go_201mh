#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

pub mod metadata;
pub mod mint;
pub mod gallery;
pub mod types;
pub mod metrics;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        pallet_prelude::*,
        traits::{Currency, ReservableCurrency, Time},
    };
    use frame_system::pallet_prelude::*;
    use crate::metadata::{NftMetadata, ImageMetadata, ProteinMetadata, NftClass, NftRecord};
    use crate::types::{LicenseType, Listing};

    pub type BalanceOf<T> = <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;
        type Time: Time;
        
        #[pallet::constant]
        type MaxMetadataLength: Get<u32>;
        
        #[pallet::constant]
        type BaseMintFeeCents: Get<u32>;

        #[pallet::constant]
        type LongevityFactor: Get<u32>;

        #[pallet::constant]
        type TransportFactor: Get<u32>;
    }

    #[pallet::pallet]
    #[pallet::without_storage_info]
    pub struct Pallet<T>(_);

    /// Oracle conversion rate: 1 USD Cent = X units of native currency
    #[pallet::storage]
    #[pallet::getter(fn usd_cent_conversion_rate)]
    pub type UsdCentConversionRate<T: Config> = StorageValue<_, BalanceOf<T>, ValueQuery>;

    /// Account that receives minting fees
    #[pallet::storage]
    #[pallet::getter(fn treasury_account)]
    pub type TreasuryAccount<T: Config> = StorageValue<_, T::AccountId, OptionQuery>;

    /// Store the NFTs (Polymorphic wrapper)
    #[pallet::storage]
    #[pallet::getter(fn nfts)]
    pub type NFTs<T: Config> = StorageMap<
        _, Blake2_128Concat, T::Hash, NftRecord<T>, OptionQuery
    >;

    /// Track which NFT Classes are strictly immutable
    #[pallet::storage]
    #[pallet::getter(fn immutable_class)]
    pub type ImmutableClass<T: Config> = StorageMap<
        _, Blake2_128Concat, NftClass, bool, ValueQuery
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
        _, Blake2_128Concat, T::Hash, Listing<BalanceOf<T>>, OptionQuery
    >;

    /// Store granted licenses per NFT Hash and Account
    #[pallet::storage]
    #[pallet::getter(fn granted_licenses)]
    pub type GrantedLicenses<T: Config> = StorageDoubleMap<
        _, Blake2_128Concat, T::Hash, Blake2_128Concat, T::AccountId, LicenseType, OptionQuery
    >;

    /// Stated intrinsic value of the NFT
    #[pallet::storage]
    #[pallet::getter(fn stated_value)]
    pub type StatedValue<T: Config> = StorageMap<
        _, Blake2_128Concat, T::Hash, BalanceOf<T>, OptionQuery
    >;

    /// Longevity tokens assigned based on Stated Value
    #[pallet::storage]
    #[pallet::getter(fn longevity_tokens)]
    pub type LongevityTokens<T: Config> = StorageMap<
        _, Blake2_128Concat, T::Hash, BalanceOf<T>, OptionQuery
    >;

    /// Transport tokens assigned based on Stated Value
    #[pallet::storage]
    #[pallet::getter(fn transport_tokens)]
    pub type TransportTokens<T: Config> = StorageMap<
        _, Blake2_128Concat, T::Hash, BalanceOf<T>, OptionQuery
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        MintedImage(T::Hash, T::AccountId, BalanceOf<T>), // hash, minter, fee paid
        MintedProtein(T::Hash, T::AccountId, BalanceOf<T>), // hash, minter, fee paid
        Transferred(T::Hash, T::AccountId, T::AccountId),
        Burned(T::Hash),
        ListedForSale(T::Hash, Listing<BalanceOf<T>>),
        Delisted(T::Hash),
        LicensePurchased(T::Hash, T::AccountId, LicenseType, BalanceOf<T>), // hash, buyer, license, price
        FullCopyrightPurchased(T::Hash, T::AccountId, T::AccountId, BalanceOf<T>), // hash, old_owner, new_owner, price
        ConversionRateUpdated(BalanceOf<T>),
        StatedValueUpdated(T::Hash, BalanceOf<T>), // hash, new stated value
    }

    #[pallet::error]
    pub enum Error<T> {
        NFTNotFound,
        NFTAlreadyExists,
        NotOwner,
        NotForSale,
        InsufficientFunds,
        TreasuryNotSet,
        RequireAdmin,
        LicenseNotAvailable,
        ImmutableAsset,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn set_conversion_rate(origin: OriginFor<T>, new_rate: BalanceOf<T>) -> DispatchResult {
            // Require admin or Root
            ensure_root(origin)?;
            UsdCentConversionRate::<T>::put(new_rate);
            Self::deposit_event(Event::ConversionRateUpdated(new_rate));
            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn set_treasury(origin: OriginFor<T>, treasury: T::AccountId) -> DispatchResult {
            ensure_root(origin)?;
            TreasuryAccount::<T>::put(treasury);
            Ok(())
        }

        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn mint_image(origin: OriginFor<T>, metadata: ImageMetadata<T>) -> DispatchResult {
            crate::mint::do_mint_image::<T>(origin, metadata)
        }

        #[pallet::call_index(7)]
        #[pallet::weight(10_000)]
        pub fn mint_protein(origin: OriginFor<T>, metadata: ProteinMetadata<T>) -> DispatchResult {
            crate::mint::do_mint_protein::<T>(origin, metadata)
        }
        
        #[pallet::call_index(8)]
        #[pallet::weight(10_000)]
        pub fn set_immutable_class(origin: OriginFor<T>, class: NftClass, is_immutable: bool) -> DispatchResult {
            ensure_root(origin)?;
            ImmutableClass::<T>::insert(class, is_immutable);
            Ok(())
        }

        #[pallet::call_index(9)]
        #[pallet::weight(10_000)]
        pub fn update_metadata(origin: OriginFor<T>, hash: T::Hash, _new_data: Vec<u8>) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            
            let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
            ensure!(owner == sender, Error::<T>::NotOwner);

            let record = NFTs::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
            
            // Critical Immutability Enforcement
            ensure!(
                !ImmutableClass::<T>::get(record.class),
                Error::<T>::ImmutableAsset
            );

            // ... update logic for mutable classes (e.g., ImageFX) ...
            
            Ok(())
        }

        #[pallet::call_index(3)]
        #[pallet::weight(10_000)]
        pub fn transfer(origin: OriginFor<T>, to: T::AccountId, hash: T::Hash) -> DispatchResult {
            crate::mint::do_transfer::<T>(origin, to, hash)
        }

        #[pallet::call_index(4)]
        #[pallet::weight(10_000)]
        pub fn list_for_sale(origin: OriginFor<T>, hash: T::Hash, listing: Listing<BalanceOf<T>>) -> DispatchResult {
            crate::gallery::do_list_for_sale::<T>(origin, hash, listing)
        }

        #[pallet::call_index(5)]
        #[pallet::weight(10_000)]
        pub fn buy_license(origin: OriginFor<T>, hash: T::Hash, license: LicenseType) -> DispatchResult {
            crate::gallery::do_buy_license::<T>(origin, hash, license)
        }

        #[pallet::call_index(6)]
        #[pallet::weight(10_000)]
        pub fn set_stated_value(origin: OriginFor<T>, hash: T::Hash, value: BalanceOf<T>) -> DispatchResult {
            crate::metrics::do_set_stated_value::<T>(origin, hash, value)
        }
    }
}
