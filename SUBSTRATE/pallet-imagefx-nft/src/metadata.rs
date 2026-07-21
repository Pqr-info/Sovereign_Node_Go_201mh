use frame_support::pallet_prelude::*;
use scale_info::TypeInfo;

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug)]
pub enum NftClass {
    ImageFx,
    Protein,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug)]
pub struct ImageMetadata<T: crate::Config> {
    pub image_hash: T::Hash,
    pub prompt: BoundedVec<u8, T::MaxMetadataLength>,
    pub aspect_ratio: u8,
    pub enhance_detail: bool,
    pub timestamp: <<T as crate::Config>::Time as frame_support::traits::Time>::Moment,
    pub creator: T::AccountId,
    pub copyright_text: BoundedVec<u8, T::MaxMetadataLength>,
    pub render_engine_version: u32,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug)]
pub struct ProteinMetadata<T: crate::Config> {
    pub model_hash: T::Hash,
    pub addr5d: BoundedVec<u8, T::MaxMetadataLength>,
    pub data_root: T::Hash,
    pub organ: BoundedVec<u8, T::MaxMetadataLength>,
    pub state_space: u32,
    pub parent_hash: Option<T::Hash>,
    pub version_number: u32,
    pub creation_timestamp: <<T as crate::Config>::Time as frame_support::traits::Time>::Moment,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug)]
pub enum NftMetadata<T: crate::Config> {
    Image(ImageMetadata<T>),
    Protein(ProteinMetadata<T>),
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, TypeInfo, MaxEncodedLen, RuntimeDebug)]
pub struct NftRecord<T: crate::Config> {
    pub class: NftClass,
    pub metadata: NftMetadata<T>,
}
