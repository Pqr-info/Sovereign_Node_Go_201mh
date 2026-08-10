#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        pallet_prelude::*,
    };
    use frame_system::pallet_prelude::*;
    use sp_std::collections::btree_map::BTreeMap;
    use sp_std::vec::Vec;
    use frame_support::traits::OnRuntimeUpgrade;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type MaxKeyLength: Get<u32>;
        type MaxValueLength: Get<u32>;
        type MaxShortcodeLength: Get<u32>;
    }

    #[pallet::pallet]
    #[pallet::without_storage_info]
    pub struct Pallet<T>(_);

    #[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo)]
    #[scale_info(skip_type_params(T))]
    pub struct ShardedSecretDescriptor<T: Config> {
        pub key: BoundedVec<u8, T::MaxKeyLength>,
        pub secret_shortcode: BoundedVec<u8, T::MaxShortcodeLength>,
        pub total_shards: u8,
        pub threshold: u8,
        pub node_ids: Vec<BoundedVec<u8, T::MaxKeyLength>>, // logical node IDs
    }

    #[pallet::storage]
    pub type ShardedSecrets<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        BoundedVec<u8, T::MaxKeyLength>, // secret key (e.g. "imagefx")
        ShardedSecretDescriptor<T>,
        OptionQuery,
    >;

    #[pallet::storage]
    #[pallet::getter(fn vault_storage)]
    pub type VaultStorage<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        BoundedVec<u8, T::MaxKeyLength>,
        BTreeMap<BoundedVec<u8, T::MaxKeyLength>, BoundedVec<u8, T::MaxValueLength>>,
        OptionQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        SecretSet(BoundedVec<u8, T::MaxKeyLength>),
    }

    #[pallet::error]
    pub enum Error<T> {
        KeyTooLong,
        ValueTooLong,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn set_secret(
            origin: OriginFor<T>,
            key: BoundedVec<u8, T::MaxKeyLength>,
            entries: BTreeMap<BoundedVec<u8, T::MaxKeyLength>, BoundedVec<u8, T::MaxValueLength>>,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            VaultStorage::<T>::insert(&key, entries);
            Self::deposit_event(Event::SecretSet(key));
            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn set_sharded_secret_descriptor(
            origin: OriginFor<T>,
            key: BoundedVec<u8, T::MaxKeyLength>,
            secret_shortcode: BoundedVec<u8, T::MaxShortcodeLength>,
            total_shards: u8,
            threshold: u8,
            node_ids: Vec<BoundedVec<u8, T::MaxKeyLength>>,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            let desc = ShardedSecretDescriptor {
                key: key.clone(),
                secret_shortcode,
                total_shards,
                threshold,
                node_ids,
            };
            ShardedSecrets::<T>::insert(&key, desc);
            Ok(())
        }
    }

    // Helper for runtime API: convert raw Vec<u8> key to stored map
    impl<T: Config> Pallet<T> {
        pub fn get_secret_raw(key: Vec<u8>) -> Option<BTreeMap<Vec<u8>, Vec<u8>>> {
            let bounded_key =
                BoundedVec::<u8, T::MaxKeyLength>::try_from(key.clone()).ok()?;
            let stored = VaultStorage::<T>::get(bounded_key)?;
            let mut out = BTreeMap::new();
            for (k, v) in stored.into_iter() {
                out.insert(k.into_inner(), v.into_inner());
            }
            Some(out)
        }

        // NEW: get a single shard by key + node_id
        pub fn get_shard_raw(key: Vec<u8>, node_id: Vec<u8>) -> Option<Vec<u8>> {
            let bounded_key =
                BoundedVec::<u8, T::MaxKeyLength>::try_from(key.clone()).ok()?;
            let bounded_node =
                BoundedVec::<u8, T::MaxKeyLength>::try_from(node_id.clone()).ok()?;

            // shard key convention: "shard::<key>::<node_id>"
            let mut shard_key = b"shard::".to_vec();
            shard_key.extend_from_slice(&bounded_key);
            shard_key.extend_from_slice(b"::");
            shard_key.extend_from_slice(&bounded_node);

            let bounded_shard_key =
                BoundedVec::<u8, T::MaxKeyLength>::try_from(shard_key).ok()?;

            let stored = VaultStorage::<T>::get(bounded_shard_key)?;
            // assume single-entry map: { "shard": <bytes> }
            for (_k, v) in stored.into_iter() {
                return Some(v.into_inner());
            }
            None
        }

        // NEW: get sharded descriptor (shortcode, total, threshold, node_ids)
        pub fn get_sharded_descriptor_raw(
            key: Vec<u8>
        ) -> Option<(Vec<u8>, u8, u8, Vec<Vec<u8>>)> {
            let bounded_key =
                BoundedVec::<u8, T::MaxKeyLength>::try_from(key.clone()).ok()?;
            let desc = ShardedSecrets::<T>::get(bounded_key)?;
            let node_ids = desc
                .node_ids
                .into_iter()
                .map(|n| n.into_inner())
                .collect::<Vec<_>>();
            let shortcode = desc.secret_shortcode.into_inner();
            Some((shortcode, desc.total_shards, desc.threshold, node_ids))
        }

        const ALPHABET: &'static [u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        pub fn hash_addr5d(addr5d: &[u8]) -> [u8; 16] {
            sp_io::hashing::blake2_128(addr5d)
        }

        pub fn encode_shortcode_from_bytes(addr5d: &[u8]) -> sp_std::vec::Vec<u8> {
            let digest = Self::hash_addr5d(addr5d);
            let mut value = 0u128;
            for b in digest.iter() {
                value = (value << 8) | (*b as u128);
            }
            let mut chars = sp_std::vec::Vec::new();
            for _ in 0..5 {
                let idx = (value & 0x1F) as usize;
                chars.push(Self::ALPHABET[idx]);
                value >>= 5;
            }
            chars.reverse();
            chars
        }
    }

    pub struct ShardedSecretShortcodeMigration<T>(sp_std::marker::PhantomData<T>);

    impl<T: Config> frame_support::traits::OnRuntimeUpgrade for ShardedSecretShortcodeMigration<T> {
        fn on_runtime_upgrade() -> frame_support::weights::Weight {
            use frame_support::traits::Get;

            let mut weight = frame_support::weights::Weight::zero();

            ShardedSecrets::<T>::translate(|_key, mut desc: ShardedSecretDescriptor<T>| {
                let shortcode_vec = Pallet::<T>::encode_shortcode_from_bytes(&desc.key);

                if let Ok(bounded) =
                    BoundedVec::<u8, T::MaxShortcodeLength>::try_from(shortcode_vec)
                {
                    desc.secret_shortcode = bounded;
                }

                weight += T::DbWeight::get().reads_writes(1, 1);
                Some(desc)
            });

            weight
        }
    }

    impl<T: Config> Pallet<T> {
        pub fn on_runtime_upgrade() -> frame_support::weights::Weight {
            ShardedSecretShortcodeMigration::<T>::on_runtime_upgrade()
        }
    }
}
