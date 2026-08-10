#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;
    use sp_std::vec::Vec;
    use crypto5d_rs::{derive_fived_address, FiveDAddress};

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, MaxEncodedLen, TypeInfo)]
    #[scale_info(skip_type_params(T))]
    pub struct AnchorMetadata {
        pub paid: [u8; 32], // Hash of PAID for fixed size or bounded vec
        pub cif_hash: [u8; 32],
    }

    #[pallet::storage]
    #[pallet::getter(fn anchors)]
    pub type Anchors<T: Config> = StorageMap<_, Blake2_128Concat, [u8; 16], AnchorMetadata, OptionQuery>;

    #[pallet::storage]
    #[pallet::getter(fn assets)]
    pub type Assets<T: Config> = StorageMap<_, Blake2_128Concat, [u8; 16], Vec<[u8; 32]>, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        AnchorRegistered { who: T::AccountId, packed: [u8; 16] },
        AssetLinked { who: T::AccountId, packed: [u8; 16], asset_id: [u8; 32] },
    }

    #[pallet::error]
    pub enum Error<T> {
        AnchorAlreadyExists,
        InvalidFiveDAddress,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn register_anchor(
            origin: OriginFor<T>,
            paid: Vec<u8>,
            cif_content: Vec<u8>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            // Zero-Trust input derivation using crypto5d-rs
            let paid_str = sp_std::str::from_utf8(&paid).map_err(|_| Error::<T>::InvalidFiveDAddress)?;
            let cif_str = sp_std::str::from_utf8(&cif_content).map_err(|_| Error::<T>::InvalidFiveDAddress)?;
            
            let fived_addr: FiveDAddress = derive_fived_address(paid_str, cif_str);
            let packed = fived_addr.packed;

            ensure!(!Anchors::<T>::contains_key(&packed), Error::<T>::AnchorAlreadyExists);

            let mut paid_hash = [0u8; 32];
            let len = core::cmp::min(paid.len(), 32);
            paid_hash[..len].copy_from_slice(&paid[..len]);

            let cif_hash = crypto5d_rs::hash_cif_to_struct_hash(paid_str, cif_str);

            let meta = AnchorMetadata {
                paid: paid_hash,
                cif_hash,
            };

            Anchors::<T>::insert(packed, meta);
            Self::deposit_event(Event::AnchorRegistered { who, packed });

            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn link_asset(
            origin: OriginFor<T>,
            packed: [u8; 16],
            asset_id: [u8; 32],
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            Assets::<T>::mutate(packed, |assets| {
                assets.push(asset_id);
            });
            
            Self::deposit_event(Event::AssetLinked { who, packed, asset_id });
            
            Ok(())
        }
    }
}
