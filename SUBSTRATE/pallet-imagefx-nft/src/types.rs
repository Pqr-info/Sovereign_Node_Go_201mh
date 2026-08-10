use codec::{Decode, Encode, MaxEncodedLen, DecodeWithMemTracking};
use scale_info::TypeInfo;
use sp_std::prelude::*;

#[derive(Clone, Encode, Decode, PartialEq, frame_support::pallet_prelude::RuntimeDebug, TypeInfo, MaxEncodedLen, DecodeWithMemTracking)]
pub enum LicenseType {
    SingleUse,
    MultiPurpose,
    FullCopyright,
}

#[derive(Clone, Encode, Decode, PartialEq, frame_support::pallet_prelude::RuntimeDebug, TypeInfo, MaxEncodedLen, DecodeWithMemTracking)]
pub struct Listing<Balance> {
    pub single_use_price: Option<Balance>,
    pub multi_purpose_price: Option<Balance>,
    pub full_copyright_price: Option<Balance>,
}
