// Manages public galleries and secondary market sales (purchasing the NFTs)
use crate::*;
use frame_support::pallet_prelude::*;

impl<T: Config> Pallet<T> {
    pub fn list_for_sale(token_id: types::TokenId, price: u128) -> DispatchResult {
        // Add to public gallery
        Ok(())
    }
}
