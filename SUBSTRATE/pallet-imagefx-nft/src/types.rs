use codec::{Decode, Encode};
use scale_info::TypeInfo;
use frame_support::pallet_prelude::MaxEncodedLen;
use sp_std::prelude::*;

#[derive(Clone, Encode, Decode, PartialEq, frame_support::pallet_prelude::RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub enum LicenseType {
    SingleUse,
    MultiPurpose,
    FullCopyright,
}

#[derive(Clone, Encode, Decode, PartialEq, frame_support::pallet_prelude::RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub struct Listing<Balance> {
    pub single_use_price: Option<Balance>,
    pub multi_purpose_price: Option<Balance>,
    pub full_copyright_price: Option<Balance>,
}
