use codec::{Decode, Encode};
use frame_support::pallet_prelude::*;
use scale_info::TypeInfo;
use sp_std::vec::Vec;

pub type TokenId = u64;

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
#[scale_info(skip_type_params(T))]
pub struct ImageFxMetadata<T: crate::Config> {
    pub creator: T::AccountId,
    pub image_hash: [u8; 32],
    pub prompt: BoundedVec<u8, ConstU32<1024>>,
    pub aspect_ratio: BoundedVec<u8, ConstU32<32>>,
    pub enhance_detail: bool,
    pub timestamp: u64,
    pub copyright_text: BoundedVec<u8, ConstU32<128>>,
    pub render_engine_version: BoundedVec<u8, ConstU32<32>>,
}
