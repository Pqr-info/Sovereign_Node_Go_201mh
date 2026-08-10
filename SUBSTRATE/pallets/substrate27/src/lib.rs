#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        pallet_prelude::*,
        Blake2_256,
    };
    use frame_system::pallet_prelude::*;

    // -----------------------------
    // Substrate 27 Address Types
    // -----------------------------

    #[derive(Clone, Encode, Decode, TypeInfo, MaxEncodedLen)]
    pub struct SymbolState {
        pub symbol: u8,   // 0–26
        pub state: u8,    // 0–2
    }

    #[derive(Clone, Encode, Decode, TypeInfo, MaxEncodedLen)]
    pub struct Substrate27Address {
        pub vector: [SymbolState; 27],
    }

    impl Substrate27Address {
        pub fn new(vector: [SymbolState; 27]) -> Self {
            Self { vector }
        }

        pub fn hash(&self) -> [u8; 32] {
            Blake2_256::hash_of(&self.vector).into()
        }
    }

    // -----------------------------
    // Stored Object
    // -----------------------------

    #[derive(Clone, Encode, Decode, TypeInfo, MaxEncodedLen)]
    pub struct SubstrateObject {
        pub address: Substrate27Address,
        pub payload: Vec<u8>,
    }

    // -----------------------------
    // Pallet Config
    // -----------------------------

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    }

    // -----------------------------
    // Storage
    // -----------------------------

    #[pallet::storage]
    #[pallet::getter(fn objects)]
    pub type Objects<T: Config> =
        StorageMap<_, Blake2_128Concat, [u8; 32], SubstrateObject>;

    // -----------------------------
    // Events
    // -----------------------------

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        ObjectStored([u8; 32]),
        ObjectRetrieved([u8; 32]),
    }

    // -----------------------------
    // Errors
    // -----------------------------

    #[pallet::error]
    pub enum Error<T> {
        AddressNotFound,
    }

    // -----------------------------
    // Extrinsics
    // -----------------------------

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Store a Substrate 27 object
        #[pallet::weight(10_000)]
        pub fn store_object(
            origin: OriginFor<T>,
            address: Substrate27Address,
            payload: Vec<u8>,
        ) -> DispatchResult {
            ensure_signed(origin)?;

            let hash = address.hash();
            let obj = SubstrateObject { address, payload };

            Objects::<T>::insert(hash, obj);
            Self::deposit_event(Event::ObjectStored(hash));

            Ok(())
        }

        /// Retrieve a Substrate 27 object
        #[pallet::weight(10_000)]
        pub fn get_object(
            origin: OriginFor<T>,
            hash: [u8; 32],
        ) -> DispatchResult {
            ensure_signed(origin)?;

            ensure!(Objects::<T>::contains_key(hash), Error::<T>::AddressNotFound);

            Self::deposit_event(Event::ObjectRetrieved(hash));
            Ok(())
        }
    }
}
