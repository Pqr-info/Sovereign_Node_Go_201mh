#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

use frame_support::pallet_prelude::*;
use sp_std::vec::Vec;
use codec::{Decode, Encode};
use scale_info::TypeInfo;
use sp_runtime::transaction_validity::{InvalidTransaction, TransactionSource, TransactionValidity, ValidTransaction};

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, Debug)]
pub struct LeaseRuntimeView {
    pub lease_id: u64,
    pub host_id: Vec<u8>,
    pub shortcode: Vec<u8>,
    pub process_fingerprint: Vec<u8>,
    pub role: Vec<u8>,
    pub ports: Vec<u16>,
    pub addr5d: Vec<u8>,
    pub ttl_epoch: u64,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, Debug)]
pub struct RouteHintRuntimeView {
    pub from_addr5d: Vec<u8>,
    pub to_addr5d: Vec<u8>,
    pub hops: Vec<Vec<u8>>,
}

#[frame_support::pallet]
pub mod pallet {
    use super::*;
    use frame_support::traits::OnRuntimeUpgrade;
    use frame_system::pallet_prelude::*;

    #[pallet::config]
    pub trait Config: frame_system::Config + frame_system::offchain::CreateInherent<Call<Self>> {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        
        type MaxHostIdLength: Get<u32>;
        type MaxShortcodeLength: Get<u32>;
        type MaxMetadataLength: Get<u32>;
        type MaxFingerprintLength: Get<u32>;
        type MaxRoleLength: Get<u32>;
        type MaxPorts: Get<u32>;
        type MaxAddrLength: Get<u32>;
        type MaxHops: Get<u32>;
    }

    #[derive(Encode, Decode, codec::DecodeWithMemTracking, codec::MaxEncodedLen, CloneNoBound, PartialEqNoBound, EqNoBound, TypeInfo, DebugNoBound)]
    #[scale_info(skip_type_params(T))]
    pub struct Lease<T: Config> {
        pub lease_id: u64,
        pub host_id: BoundedVec<u8, T::MaxHostIdLength>,
        pub shortcode: BoundedVec<u8, T::MaxShortcodeLength>,
        pub process_fingerprint: BoundedVec<u8, T::MaxFingerprintLength>,
        pub role: BoundedVec<u8, T::MaxRoleLength>,
        pub ports: BoundedVec<u16, T::MaxPorts>,
        pub addr5d: BoundedVec<u8, T::MaxAddrLength>,
        pub ttl_epoch: u64,
    }

    use frame_support::{CloneNoBound, PartialEqNoBound, EqNoBound, DebugNoBound};

    #[derive(Encode, Decode, codec::DecodeWithMemTracking, codec::MaxEncodedLen, CloneNoBound, PartialEqNoBound, EqNoBound, TypeInfo, DebugNoBound)]
    #[scale_info(skip_type_params(T))]
    pub struct HostProfile<T: Config> {
        pub host_id: BoundedVec<u8, T::MaxHostIdLength>,
        pub host_shortcode: BoundedVec<u8, T::MaxShortcodeLength>,
        pub metadata: BoundedVec<u8, T::MaxMetadataLength>,
        pub mass: u32,
    }

    #[derive(Encode, Decode, codec::DecodeWithMemTracking, codec::MaxEncodedLen, CloneNoBound, PartialEqNoBound, EqNoBound, TypeInfo, DebugNoBound)]
    #[scale_info(skip_type_params(T))]
    pub struct RouteHint<T: Config> {
        pub from_addr5d: BoundedVec<u8, T::MaxAddrLength>,
        pub to_addr5d: BoundedVec<u8, T::MaxAddrLength>,
        pub hops: BoundedVec<BoundedVec<u8, T::MaxAddrLength>, T::MaxHops>,
    }

    #[pallet::pallet]
    #[pallet::without_storage_info]
    pub struct Pallet<T>(_);

    #[pallet::storage]
    pub type Hosts<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        BoundedVec<u8, T::MaxHostIdLength>,
        HostProfile<T>,
        OptionQuery,
    >;

    #[pallet::storage]
    pub type Leases<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        u64,
        Lease<T>,
        OptionQuery,
    >;

    #[pallet::storage]
    pub type NextLeaseId<T: Config> = StorageValue<_, u64, ValueQuery>;

    #[pallet::storage]
    pub type RouteHints<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        BoundedVec<u8, T::MaxAddrLength>,
        sp_std::vec::Vec<RouteHint<T>>,
        ValueQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        HostRegistered(BoundedVec<u8, T::MaxHostIdLength>),
        LeaseRequested(u64),
        LeaseRenewed(u64),
        LeaseReleased(u64),
        RouteHintPushed(BoundedVec<u8, T::MaxAddrLength>),
    }

    #[pallet::error]
    pub enum Error<T> {
        HostNotFound,
        LeaseNotFound,
        Unauthorized,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn register_host(
            origin: OriginFor<T>,
            host_id: BoundedVec<u8, T::MaxHostIdLength>,
            host_shortcode: BoundedVec<u8, T::MaxShortcodeLength>,
            metadata: BoundedVec<u8, T::MaxMetadataLength>,
            mass: u32,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            let profile = HostProfile {
                host_id: host_id.clone(),
                host_shortcode,
                metadata,
                mass,
            };
            Hosts::<T>::insert(&host_id, profile);
            Self::deposit_event(Event::HostRegistered(host_id));
            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn request_lease(
            origin: OriginFor<T>,
            host_id: BoundedVec<u8, T::MaxHostIdLength>,
            shortcode: BoundedVec<u8, T::MaxShortcodeLength>,
            process_fingerprint: BoundedVec<u8, T::MaxFingerprintLength>,
            role: BoundedVec<u8, T::MaxRoleLength>,
            addr5d: BoundedVec<u8, T::MaxAddrLength>,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            ensure!(Hosts::<T>::contains_key(&host_id), Error::<T>::HostNotFound);

            let lease_id = NextLeaseId::<T>::get();
            NextLeaseId::<T>::put(lease_id + 1);

            let ports = BoundedVec::default(); 
            let ttl_epoch = 1000; // default ttl, could be block number + X

            let lease = Lease {
                lease_id,
                host_id,
                shortcode,
                process_fingerprint,
                role,
                ports,
                addr5d,
                ttl_epoch,
            };

            Leases::<T>::insert(lease_id, lease);
            Self::deposit_event(Event::LeaseRequested(lease_id));
            Ok(())
        }

        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn renew_lease(
            origin: OriginFor<T>,
            lease_id: u64,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            let mut lease = Leases::<T>::get(lease_id).ok_or(Error::<T>::LeaseNotFound)?;
            lease.ttl_epoch += 1000;
            Leases::<T>::insert(lease_id, lease);
            Self::deposit_event(Event::LeaseRenewed(lease_id));
            Ok(())
        }

        #[pallet::call_index(3)]
        #[pallet::weight(10_000)]
        pub fn release_lease(
            origin: OriginFor<T>,
            lease_id: u64,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            ensure!(Leases::<T>::contains_key(lease_id), Error::<T>::LeaseNotFound);
            Leases::<T>::remove(lease_id);
            Self::deposit_event(Event::LeaseReleased(lease_id));
            Ok(())
        }

        #[pallet::call_index(4)]
        #[pallet::weight(10_000)]
        pub fn push_route_hint(
            origin: OriginFor<T>,
            hint: RouteHint<T>,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            let mut hints = RouteHints::<T>::get(&hint.from_addr5d);
            hints.push(hint.clone());
            RouteHints::<T>::insert(&hint.from_addr5d, hints);
            Self::deposit_event(Event::RouteHintPushed(hint.from_addr5d));
            Ok(())
        }
        #[pallet::call_index(5)]
        #[pallet::weight(10_000)]
        pub fn push_route_hint_batch(
            origin: OriginFor<T>,
            addr5d: BoundedVec<u8, T::MaxAddrLength>,
            hints: sp_std::vec::Vec<RouteHint<T>>,
        ) -> DispatchResult {
            ensure_none(origin)?; // Unsigned off-chain transaction
            RouteHints::<T>::insert(addr5d.clone(), hints);
            Self::deposit_event(Event::RouteHintPushed(addr5d));
            Ok(())
        }
    }

    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
        fn offchain_worker(block_number: BlockNumberFor<T>) {
            let _ = Self::run_offchain_worker(block_number);
        }
    }

    #[pallet::validate_unsigned]
    impl<T: Config> ValidateUnsigned for Pallet<T> {
        type Call = Call<T>;

        fn validate_unsigned(
            _source: TransactionSource,
            call: &Self::Call,
        ) -> TransactionValidity {
            if let Call::push_route_hint_batch { addr5d: _, hints: _ } = call {
                ValidTransaction::with_tag_prefix("HcpOffchainWorker")
                    .priority(100)
                    .and_provides(b"route_hints".to_vec())
                    .longevity(5)
                    .propagate(true)
                    .build()
            } else {
                InvalidTransaction::Call.into()
            }
        }
    }

    impl<T: Config> Pallet<T> {
        const ALPHABET: &'static [u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        pub fn hash_addr5d(addr5d: &[u8]) -> [u8; 16] {
            let hash = sp_io::hashing::blake2_128(addr5d);
            hash
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

        // NEW: resolve shortcode to addr5d, ipv6_suffix, and lease_id
        pub fn resolve_shortcode_raw(code: sp_std::vec::Vec<u8>) -> Option<(sp_std::vec::Vec<u8>, u64, u64)> {
            // Because shortcodes are 5 chars and we don't have a reverse index,
            // we scan the Leases map. In production this would be indexed.
            for (lease_id, lease) in Leases::<T>::iter() {
                if lease.shortcode.as_slice() == code.as_slice() {
                    return Some((lease.addr5d.into_inner(), lease_id, lease_id));
                }
            }
            None
        }

        fn run_offchain_worker(_block_number: BlockNumberFor<T>) -> Result<(), &'static str> {
            let role_vault = b"ROLE_VAULT_ADAPTER".to_vec();
            
            let leases: sp_std::vec::Vec<Lease<T>> = Leases::<T>::iter()
                .filter(|(_, lease)| lease.role.to_vec() == role_vault)
                .map(|(_, lease)| lease)
                .collect();
            let hosts: sp_std::vec::Vec<HostProfile<T>> = Hosts::<T>::iter()
                .map(|(_, host)| host)
                .collect();

            for lease in leases.iter() {
                let addr = lease.addr5d.clone();
                let neighbors = Self::compute_8nn(&addr, &leases, &hosts);

                let hints = neighbors
                    .into_iter()
                    .map(|n| RouteHint::<T> {
                        from_addr5d: addr.clone(),
                        to_addr5d: n.addr5d.clone(),
                        hops: BoundedVec::try_from(sp_std::vec![n.addr5d.clone()]).unwrap_or_default(),
                    })
                    .collect::<sp_std::vec::Vec<_>>();

                Self::submit_route_hints_update(addr.clone(), hints)?;
            }

            Ok(())
        }

        fn compute_8nn(
            addr: &BoundedVec<u8, T::MaxAddrLength>,
            leases: &[Lease<T>],
            hosts: &[HostProfile<T>],
        ) -> sp_std::vec::Vec<Lease<T>> {
            let mut scored = leases
                .iter()
                .filter(|l| l.addr5d != *addr)
                .filter_map(|l| {
                    let host = hosts.iter().find(|h| h.host_id == l.host_id)?;
                    let d = Self::distance(addr, &l.addr5d, host.mass);
                    Some((d, l.clone()))
                })
                .collect::<sp_std::vec::Vec<_>>();

            scored.sort_by_key(|(d, _)| *d);
            scored.into_iter().take(8).map(|(_, l)| l).collect()
        }

        fn distance(
            a: &BoundedVec<u8, T::MaxAddrLength>,
            b: &BoundedVec<u8, T::MaxAddrLength>,
            mass_b: u32,
        ) -> u32 {
            let hamming: u32 = a.iter()
                .zip(b.iter())
                .map(|(x, y)| if x == y { 0 } else { 1 })
                .sum();
            hamming.saturating_sub(mass_b)
        }

        fn submit_route_hints_update(
            addr: BoundedVec<u8, T::MaxAddrLength>,
            hints: sp_std::vec::Vec<RouteHint<T>>,
        ) -> Result<(), &'static str> {
            use frame_system::offchain::SubmitTransaction;
            let call = Call::<T>::push_route_hint_batch { addr5d: addr, hints };
            let xt = T::create_inherent(call.into());
            SubmitTransaction::<T, Call<T>>::submit_transaction(xt)
                .map_err(|_| "submit failed")
        }

        pub fn hcp_get_lease_raw(lease_id: u64) -> Option<LeaseRuntimeView> {
            let lease = Leases::<T>::get(lease_id)?;
            Some(LeaseRuntimeView {
                lease_id: lease.lease_id,
                host_id: lease.host_id.into_inner(),
                shortcode: lease.shortcode.into_inner(),
                process_fingerprint: lease.process_fingerprint.into_inner(),
                role: lease.role.into_inner(),
                ports: lease.ports.into_inner(),
                addr5d: lease.addr5d.into_inner(),
                ttl_epoch: lease.ttl_epoch,
            })
        }

        pub fn hcp_get_leases_for_host_raw(host_id: Vec<u8>) -> Vec<LeaseRuntimeView> {
            let mut out = Vec::new();
            for (_id, lease) in Leases::<T>::iter() {
                if lease.host_id.to_vec() == host_id {
                    out.push(LeaseRuntimeView {
                        lease_id: lease.lease_id,
                        host_id: lease.host_id.clone().into_inner(),
                        shortcode: lease.shortcode.clone().into_inner(),
                        process_fingerprint: lease.process_fingerprint.clone().into_inner(),
                        role: lease.role.clone().into_inner(),
                        ports: lease.ports.clone().into_inner(),
                        addr5d: lease.addr5d.clone().into_inner(),
                        ttl_epoch: lease.ttl_epoch,
                    });
                }
            }
            out
        }

        pub fn hcp_get_route_hints_raw(addr5d: Vec<u8>) -> Vec<RouteHintRuntimeView> {
            let bounded_addr = BoundedVec::<u8, T::MaxAddrLength>::try_from(addr5d).ok();
            if let Some(addr) = bounded_addr {
                let hints = RouteHints::<T>::get(addr);
                hints.into_iter().map(|h| RouteHintRuntimeView {
                    from_addr5d: h.from_addr5d.into_inner(),
                    to_addr5d: h.to_addr5d.into_inner(),
                    hops: h.hops.into_iter().map(|hop| hop.into_inner()).collect(),
                }).collect()
            } else {
                Vec::new()
            }
        }
    }

    pub struct LeaseShortcodeMigration<T>(sp_std::marker::PhantomData<T>);

    impl<T: Config> frame_support::traits::OnRuntimeUpgrade for LeaseShortcodeMigration<T> {
        fn on_runtime_upgrade() -> frame_support::weights::Weight {
            use frame_support::traits::Get;

            let mut weight = frame_support::weights::Weight::zero();

            Leases::<T>::translate(|_lease_id, mut lease: Lease<T>| {
                let shortcode_vec = Pallet::<T>::encode_shortcode_from_bytes(&lease.addr5d);

                if let Ok(bounded) =
                    BoundedVec::<u8, T::MaxShortcodeLength>::try_from(shortcode_vec)
                {
                    lease.shortcode = bounded;
                }

                weight += T::DbWeight::get().reads_writes(1, 1);
                Some(lease)
            });

            weight
        }
    }

    impl<T: Config> Pallet<T> {
        pub fn on_runtime_upgrade() -> frame_support::weights::Weight {
            LeaseShortcodeMigration::<T>::on_runtime_upgrade()
        }
    }
}
