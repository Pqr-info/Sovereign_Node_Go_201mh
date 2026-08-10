use crate::*;
use frame_support::pallet_prelude::*;
use frame_system::pallet_prelude::*;
use sp_runtime::traits::Saturating;

fn derive_tokens<T: Config>(value: BalanceOf<T>) -> (BalanceOf<T>, BalanceOf<T>) {
    // We convert the u32 factor to BalanceOf<T> using Into or saturating logic.
    // For simplicity in Substrate, we often use saturated conversions.
    // Since BalanceOf<T> typically implements From<u32>, we can do:
    let l_factor: BalanceOf<T> = T::LongevityFactor::get().into();
    let t_factor: BalanceOf<T> = T::TransportFactor::get().into();

    let longevity = value.saturating_mul(l_factor);
    let transport = value.saturating_mul(t_factor);

    (longevity, transport)
}

pub fn do_set_stated_value<T: Config>(
    origin: OriginFor<T>,
    hash: T::Hash,
    value: BalanceOf<T>,
) -> DispatchResult {
    let sender = ensure_signed(origin)?;
    
    let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
    ensure!(owner == sender, Error::<T>::NotOwner);

    // Set the stated value
    StatedValue::<T>::insert(hash, value);

    // Compute derived tokens using Biased mapping
    let (longevity, transport) = derive_tokens::<T>(value);

    // Update purely virtual mesh routing weights
    LongevityTokens::<T>::insert(hash, longevity);
    TransportTokens::<T>::insert(hash, transport);

    Pallet::<T>::deposit_event(Event::StatedValueUpdated(hash, value));
    Ok(())
}
