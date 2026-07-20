use frame_support::pallet_prelude::*;
use scale_info::TypeInfo;

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug)]
pub struct ImageMetadata<T: crate::Config> {
    pub image_hash: T::Hash,
    pub prompt: BoundedVec<u8, T::MaxMetadataLength>,
    pub aspect_ratio: u8,
    pub enhance_detail: bool,
    pub timestamp: u64,
    pub creator: T::AccountId,
    pub copyright_text: BoundedVec<u8, T::MaxMetadataLength>,
    pub render_engine_version: u32,
}
