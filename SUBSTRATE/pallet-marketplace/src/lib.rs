#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        pallet_prelude::*,
        traits::{Currency, ReservableCurrency},
        CloneNoBound, PartialEqNoBound, EqNoBound, DebugNoBound,
    };
    use frame_system::pallet_prelude::*;

    pub type BalanceOf<T> =
        <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

    #[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, MaxEncodedLen, codec::DecodeWithMemTracking, RuntimeDebug)]
    pub enum ListingCategory {
        NFT,
        DigitalGood,
        Subscription,
        GiftCard,
        Physical,
    }

    #[derive(Encode, Decode, CloneNoBound, PartialEqNoBound, EqNoBound, TypeInfo, DebugNoBound)]
    #[scale_info(skip_type_params(T))]
    pub struct VendorProfile<T: Config> {
        pub owner: T::AccountId,
        pub name: BoundedVec<u8, T::MaxVendorNameLength>,
        pub metadata_url: BoundedVec<u8, T::MaxMetadataUrlLength>,
        pub active: bool,
    }

    #[derive(Encode, Decode, CloneNoBound, PartialEqNoBound, EqNoBound, TypeInfo, DebugNoBound)]
    #[scale_info(skip_type_params(T))]
    pub struct Listing<T: Config> {
        pub vendor: T::AccountId,
        pub price: BalanceOf<T>,
        pub category: ListingCategory,
        pub metadata_url: BoundedVec<u8, T::MaxMetadataUrlLength>,
        pub active: bool,
    }

    #[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, MaxEncodedLen, codec::DecodeWithMemTracking, RuntimeDebug)]
    pub enum EscrowStatus {
        PendingFulfillment,
        Fulfilled,
        Completed,
        Disputed,
    }

    #[derive(Encode, Decode, CloneNoBound, PartialEqNoBound, EqNoBound, TypeInfo, DebugNoBound)]
    #[scale_info(skip_type_params(T))]
    pub struct EscrowState<T: Config> {
        pub buyer: T::AccountId,
        pub vendor: T::AccountId,
        pub listing_id: u64,
        pub amount: BalanceOf<T>,
        pub status: EscrowStatus,
    }

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;

        type MaxVendorNameLength: Get<u32>;
        type MaxMetadataUrlLength: Get<u32>;

        type MarketplaceFeeBps: Get<u32>; // basis points
        type TreasuryAccount: Get<Self::AccountId>;
    }

    #[pallet::pallet]
    #[pallet::without_storage_info]
    pub struct Pallet<T>(_);

    #[pallet::storage]
    #[pallet::getter(fn vendors)]
    pub type Vendors<T: Config> =
        StorageMap<_, Blake2_128Concat, T::AccountId, VendorProfile<T>, OptionQuery>;

    #[pallet::storage]
    #[pallet::getter(fn listings)]
    pub type Listings<T: Config> =
        StorageMap<_, Blake2_128Concat, u64, Listing<T>, OptionQuery>;

    #[pallet::storage]
    #[pallet::getter(fn next_listing_id)]
    pub type NextListingId<T: Config> = StorageValue<_, u64, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn escrows)]
    pub type Escrow<T: Config> =
        StorageMap<_, Blake2_128Concat, u64, EscrowState<T>, OptionQuery>;

    #[pallet::storage]
    #[pallet::getter(fn next_order_id)]
    pub type NextOrderId<T: Config> = StorageValue<_, u64, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn reputation)]
    pub type Reputation<T: Config> =
        StorageMap<_, Blake2_128Concat, T::AccountId, u32, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        VendorRegistered(T::AccountId),
        ListingCreated(u64, T::AccountId),
        PurchaseInitiated(u64, T::AccountId, T::AccountId, BalanceOf<T>),
        OrderFulfilled(u64),
        DeliveryConfirmed(u64),
        ReputationUpdated(T::AccountId, u32),
    }

    #[pallet::error]
    pub enum Error<T> {
        VendorAlreadyRegistered,
        VendorNotFound,
        ListingNotFound,
        ListingInactive,
        InsufficientBalance,
        EscrowNotFound,
        InvalidEscrowStatus,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn register_vendor(
            origin: OriginFor<T>,
            name: BoundedVec<u8, T::MaxVendorNameLength>,
            metadata_url: BoundedVec<u8, T::MaxMetadataUrlLength>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            ensure!(
                !Vendors::<T>::contains_key(&who),
                Error::<T>::VendorAlreadyRegistered
            );

            let profile = VendorProfile::<T> {
                owner: who.clone(),
                name,
                metadata_url,
                active: true,
            };

            Vendors::<T>::insert(&who, profile);
            Reputation::<T>::insert(&who, 0);

            Self::deposit_event(Event::VendorRegistered(who));
            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn create_listing(
            origin: OriginFor<T>,
            price: BalanceOf<T>,
            category: ListingCategory,
            metadata_url: BoundedVec<u8, T::MaxMetadataUrlLength>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            let vendor = Vendors::<T>::get(&who).ok_or(Error::<T>::VendorNotFound)?;
            ensure!(vendor.active, Error::<T>::VendorNotFound);

            let id = NextListingId::<T>::get();
            NextListingId::<T>::put(id + 1);

            let listing = Listing::<T> {
                vendor: who.clone(),
                price,
                category,
                metadata_url,
                active: true,
            };

            Listings::<T>::insert(id, listing);

            Self::deposit_event(Event::ListingCreated(id, who));
            Ok(())
        }

        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn purchase(
            origin: OriginFor<T>,
            listing_id: u64,
        ) -> DispatchResult {
            let buyer = ensure_signed(origin)?;

            let listing = Listings::<T>::get(listing_id).ok_or(Error::<T>::ListingNotFound)?;
            ensure!(listing.active, Error::<T>::ListingInactive);

            let amount = listing.price;
            let vendor = listing.vendor.clone();

            // Lock funds in escrow (reserve from buyer)
            T::Currency::reserve(&buyer, amount)
                .map_err(|_| Error::<T>::InsufficientBalance)?;

            let order_id = NextOrderId::<T>::get();
            NextOrderId::<T>::put(order_id + 1);

            let escrow = EscrowState::<T> {
                buyer: buyer.clone(),
                vendor: vendor.clone(),
                listing_id,
                amount,
                status: EscrowStatus::PendingFulfillment,
            };

            Escrow::<T>::insert(order_id, escrow);

            Self::deposit_event(Event::PurchaseInitiated(order_id, buyer, vendor, amount));
            Ok(())
        }

        #[pallet::call_index(3)]
        #[pallet::weight(10_000)]
        pub fn fulfill_order(
            origin: OriginFor<T>,
            order_id: u64,
            _fulfillment_proof: BoundedVec<u8, T::MaxMetadataUrlLength>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            Escrow::<T>::try_mutate(order_id, |maybe_state| -> DispatchResult {
                let state = maybe_state.as_mut().ok_or(Error::<T>::EscrowNotFound)?;

                ensure!(state.vendor == who, Error::<T>::VendorNotFound);
                ensure!(
                    matches!(state.status, EscrowStatus::PendingFulfillment),
                    Error::<T>::InvalidEscrowStatus
                );

                state.status = EscrowStatus::Fulfilled;
                Ok(())
            })?;

            Self::deposit_event(Event::OrderFulfilled(order_id));
            Ok(())
        }

        #[pallet::call_index(4)]
        #[pallet::weight(10_000)]
        pub fn confirm_delivery(
            origin: OriginFor<T>,
            order_id: u64,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            Escrow::<T>::try_mutate(order_id, |maybe_state| -> DispatchResult {
                let state = maybe_state.as_mut().ok_or(Error::<T>::EscrowNotFound)?;

                ensure!(state.buyer == who, Error::<T>::VendorNotFound);
                ensure!(
                    matches!(state.status, EscrowStatus::Fulfilled),
                    Error::<T>::InvalidEscrowStatus
                );

                state.status = EscrowStatus::Completed;

                // Release funds: unreserve from buyer, transfer to vendor minus fee
                let amount = state.amount;
                T::Currency::unreserve(&state.buyer, amount);

                let fee_bps = T::MarketplaceFeeBps::get();
                let fee = amount * fee_bps.into() / 10_000u32.into();
                let net = amount - fee;

                T::Currency::transfer(
                    &state.buyer,
                    &T::TreasuryAccount::get(),
                    fee,
                    frame_support::traits::ExistenceRequirement::KeepAlive,
                )?;

                T::Currency::transfer(
                    &state.buyer,
                    &state.vendor,
                    net,
                    frame_support::traits::ExistenceRequirement::KeepAlive,
                )?;

                Ok(())
            })?;

            // Simple reputation bump
            Reputation::<T>::mutate(
                Escrow::<T>::get(order_id).unwrap().vendor.clone(),
                |rep| *rep = rep.saturating_add(1),
            );

            Self::deposit_event(Event::DeliveryConfirmed(order_id));
            Ok(())
        }
    }
}
