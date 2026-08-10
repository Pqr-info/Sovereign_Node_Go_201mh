#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        pallet_prelude::*,
        traits::Get,
        BoundedVec,
    };
    use frame_system::pallet_prelude::*;

    // The `Pallet` struct serves as a placeholder to implement traits, methods and dispatchables
    #[pallet::pallet]
    pub struct Pallet<T>(_);

    pub type TimeslipId = u64;
    pub type RelationId = u64;
    pub type AgentId = BoundedVec<u8, ConstU32<64>>;

    #[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, PartialEq, Eq, RuntimeDebug, codec::DecodeWithMemTracking)]
    pub enum TimeslipStatus {
        Open,
        Closed,
        Invalidated,
    }

    #[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, PartialEq, Eq, RuntimeDebug, codec::DecodeWithMemTracking)]
    pub enum RelationTarget {
        Timeslip(TimeslipId),
        Agent(AgentId),
        Decision(TimeslipId),
    }

    #[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, PartialEq, Eq, RuntimeDebug, codec::DecodeWithMemTracking)]
    pub enum RelationKind {
        DependsOn,
        Mentions,
        AssignedTo,
        DerivedFrom,
        DuplicateOf,
        RelatedTo,
    }

    #[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, PartialEq, Eq, RuntimeDebug, codec::DecodeWithMemTracking)]
    pub struct RelationEdge {
        pub id: RelationId,
        pub from: TimeslipId,
        pub to: RelationTarget,
        pub kind: RelationKind,
    }

    #[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, PartialEq, Eq, RuntimeDebug, codec::DecodeWithMemTracking)]
    pub struct Timeslip {
        pub id: TimeslipId,
        pub synthetic_id: BoundedVec<u8, ConstU32<64>>,
        pub title: BoundedVec<u8, ConstU32<256>>,
        pub status: TimeslipStatus,
        pub checkpoint_id: BoundedVec<u8, ConstU32<128>>,
        pub billable: bool,
        pub rate: u64, // using integer (e.g., cents or pico-tokens) for simplicity
        pub start_time: u64,
        pub end_time: u64,
        pub cost: u64,
        pub rollback_note: Option<BoundedVec<u8, ConstU32<256>>>,
        pub created_by: AgentId,
        pub assigned_to: Option<AgentId>,
    }

    #[derive(Encode, Decode, TypeInfo, MaxEncodedLen, Clone, PartialEq, Eq, RuntimeDebug, codec::DecodeWithMemTracking)]
    pub struct TimeslipReply {
        pub id: u64,
        pub timeslip_id: TimeslipId,
        pub author: AgentId,
        pub body: BoundedVec<u8, ConstU32<1024>>,
        pub created_at: u64,
    }

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

        #[pallet::constant]
        type MaxRelationsPerTimeslip: Get<u32>;

        #[pallet::constant]
        type MaxTimeslipsPerAgent: Get<u32>;

        #[pallet::constant]
        type MaxRepliesPerTimeslip: Get<u32>;
    }

    #[pallet::storage]
    pub type Timeslips<T: Config> =
        StorageMap<_, Blake2_128Concat, TimeslipId, Timeslip, OptionQuery>;

    #[pallet::storage]
    pub type TimeslipRelations<T: Config> =
        StorageMap<_, Blake2_128Concat, TimeslipId, BoundedVec<RelationEdge, T::MaxRelationsPerTimeslip>, ValueQuery>;

    #[pallet::storage]
    pub type TimeslipReplies<T: Config> =
        StorageMap<_, Blake2_128Concat, TimeslipId, BoundedVec<TimeslipReply, T::MaxRepliesPerTimeslip>, ValueQuery>;

    #[pallet::storage]
    pub type AgentTimeslips<T: Config> =
        StorageMap<_, Blake2_128Concat, AgentId, BoundedVec<TimeslipId, T::MaxTimeslipsPerAgent>, ValueQuery>;

    #[pallet::storage]
    pub type NextTimeslipId<T: Config> =
        StorageValue<_, TimeslipId, ValueQuery>;

    #[pallet::storage]
    pub type NextRelationId<T: Config> =
        StorageValue<_, RelationId, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        TimeslipOpened {
            timeslip_id: TimeslipId,
            who: T::AccountId,
        },
        TimeslipClosed {
            timeslip_id: TimeslipId,
            who: T::AccountId,
        },
        TimeslipInvalidated {
            timeslip_id: TimeslipId,
            who: T::AccountId,
        },
        RelationAdded {
            relation_id: RelationId,
            from_timeslip: TimeslipId,
            to: RelationTarget,
            kind: RelationKind,
        },
        TimeslipReplied {
            timeslip_id: TimeslipId,
        },
    }

    #[pallet::error]
    pub enum Error<T> {
        UnknownTimeslip,
        TooManyRelationsPerTimeslip,
        TooManyTimeslipsForAgent,
        TooManyRepliesPerTimeslip,
        NotOpen,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn open_timeslip(
            origin: OriginFor<T>,
            mut ts: Timeslip,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            let timeslip_id = NextTimeslipId::<T>::get();
            NextTimeslipId::<T>::put(timeslip_id + 1);

            ts.id = timeslip_id;
            ts.status = TimeslipStatus::Open;

            Timeslips::<T>::insert(timeslip_id, ts.clone());
            TimeslipRelations::<T>::insert(timeslip_id, BoundedVec::default());
            TimeslipReplies::<T>::insert(timeslip_id, BoundedVec::default());

            if let Some(agent) = ts.assigned_to.clone() {
                AgentTimeslips::<T>::mutate(agent, |list| {
                    if !list.contains(&timeslip_id) {
                        let _ = list.try_push(timeslip_id);
                    }
                });
            }

            Self::deposit_event(Event::TimeslipOpened { timeslip_id, who });
            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn close_timeslip(
            origin: OriginFor<T>,
            timeslip_id: TimeslipId,
            end_time: u64,
            cost: u64,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            Timeslips::<T>::try_mutate(timeslip_id, |ts_opt| -> DispatchResult {
                let ts = ts_opt.as_mut().ok_or(Error::<T>::UnknownTimeslip)?;
                ensure!(ts.status == TimeslipStatus::Open, Error::<T>::NotOpen);
                ts.status = TimeslipStatus::Closed;
                ts.end_time = end_time;
                ts.cost = cost;
                Ok(())
            })?;

            Self::deposit_event(Event::TimeslipClosed { timeslip_id, who });
            Ok(())
        }

        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn add_relation(
            origin: OriginFor<T>,
            from_timeslip: TimeslipId,
            to: RelationTarget,
            kind: RelationKind,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            ensure!(Timeslips::<T>::contains_key(from_timeslip), Error::<T>::UnknownTimeslip);

            let relation_id = NextRelationId::<T>::get();
            NextRelationId::<T>::put(relation_id + 1);

            let edge = RelationEdge {
                id: relation_id,
                from: from_timeslip,
                to,
                kind,
            };

            TimeslipRelations::<T>::mutate(from_timeslip, |edges| {
                edges.try_push(edge.clone()).map_err(|_| Error::<T>::TooManyRelationsPerTimeslip)
            })?;

            Self::deposit_event(Event::RelationAdded {
                relation_id,
                from_timeslip,
                to: edge.to,
                kind: edge.kind,
            });

            Ok(())
        }

        #[pallet::call_index(3)]
        #[pallet::weight(10_000)]
        pub fn reply_timeslip(
            origin: OriginFor<T>,
            timeslip_id: TimeslipId,
            body: BoundedVec<u8, ConstU32<1024>>,
            author: AgentId,
            created_at: u64,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            ensure!(Timeslips::<T>::contains_key(timeslip_id), Error::<T>::UnknownTimeslip);

            let reply = TimeslipReply {
                id: 0,
                timeslip_id,
                author,
                body,
                created_at,
            };

            TimeslipReplies::<T>::mutate(timeslip_id, |replies| {
                replies.try_push(reply).map_err(|_| Error::<T>::TooManyRepliesPerTimeslip)
            })?;

            Self::deposit_event(Event::TimeslipReplied { timeslip_id });
            Ok(())
        }
    }
}
