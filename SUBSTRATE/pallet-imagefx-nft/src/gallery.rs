use crate::*;
use frame_support::pallet_prelude::*;
use frame_system::pallet_prelude::*;
use frame_support::traits::{Currency, ExistenceRequirement};

pub fn do_list_for_sale<T: Config>(
    origin: OriginFor<T>,
    hash: T::Hash,
    price: BalanceOf<T>,
) -> DispatchResult {
    let sender = ensure_signed(origin)?;
    
    let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
    ensure!(owner == sender, Error::<T>::NotOwner);

    GalleryListings::<T>::insert(hash, price);

    Pallet::<T>::deposit_event(Event::ListedForSale(hash, price));
    Ok(())
}

pub fn do_delist<T: Config>(
    origin: OriginFor<T>,
    hash: T::Hash,
) -> DispatchResult {
    let sender = ensure_signed(origin)?;
    
    let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
    ensure!(owner == sender, Error::<T>::NotOwner);
    ensure!(GalleryListings::<T>::contains_key(hash), Error::<T>::NotForSale);

    GalleryListings::<T>::remove(hash);

    Pallet::<T>::deposit_event(Event::Delisted(hash));
    Ok(())
}

pub fn do_buy<T: Config>(
    origin: OriginFor<T>,
    hash: T::Hash,
) -> DispatchResult {
    let buyer = ensure_signed(origin)?;
    
    let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
    let price = GalleryListings::<T>::get(hash).ok_or(Error::<T>::NotForSale)?;

    // Ensure buyer is not buying their own NFT
    ensure!(buyer != owner, Error::<T>::NotOwner); // Better to create a specific error, but this works for now

    // Transfer funds from buyer to owner
    T::Currency::transfer(&buyer, &owner, price, ExistenceRequirement::KeepAlive)
        .map_err(|_| Error::<T>::InsufficientFunds)?;

    // Transfer NFT ownership
    NFTOwner::<T>::insert(hash, buyer.clone());
    
    // Remove from gallery
    GalleryListings::<T>::remove(hash);

    Pallet::<T>::deposit_event(Event::Sold(hash, owner, buyer, price));
    Ok(())
}
