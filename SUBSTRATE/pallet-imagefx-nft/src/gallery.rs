use crate::*;
use frame_support::pallet_prelude::*;
use frame_system::pallet_prelude::*;
use frame_support::traits::{Currency, ExistenceRequirement};

pub fn do_list_for_sale<T: Config>(
    origin: OriginFor<T>,
    hash: T::Hash,
    listing: types::Listing<BalanceOf<T>>,
) -> DispatchResult {
    let sender = ensure_signed(origin)?;
    
    let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
    ensure!(owner == sender, Error::<T>::NotOwner);

    GalleryListings::<T>::insert(hash, listing.clone());

    Pallet::<T>::deposit_event(Event::ListedForSale(hash, listing));
    Ok(())
}

pub fn do_buy_license<T: Config>(
    origin: OriginFor<T>,
    hash: T::Hash,
    license: types::LicenseType,
) -> DispatchResult {
    let buyer = ensure_signed(origin)?;
    
    let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
    let listing = GalleryListings::<T>::get(hash).ok_or(Error::<T>::NotForSale)?;

    ensure!(buyer != owner, Error::<T>::NotOwner); // Buyer cannot be owner

    let price = match license {
        types::LicenseType::SingleUse => listing.single_use_price,
        types::LicenseType::MultiPurpose => listing.multi_purpose_price,
        types::LicenseType::FullCopyright => listing.full_copyright_price,
    }.ok_or(Error::<T>::LicenseNotAvailable)?;

    // Transfer funds from buyer to owner
    T::Currency::transfer(&buyer, &owner, price, ExistenceRequirement::KeepAlive)
        .map_err(|_| Error::<T>::InsufficientFunds)?;

    if license == types::LicenseType::FullCopyright {
        // Transfer NFT ownership
        NFTOwner::<T>::insert(hash, buyer.clone());
        // Remove from gallery
        GalleryListings::<T>::remove(hash);
        Pallet::<T>::deposit_event(Event::FullCopyrightPurchased(hash, owner, buyer, price));
    } else {
        // Grant usage license
        GrantedLicenses::<T>::insert(hash, buyer.clone(), license.clone());
        Pallet::<T>::deposit_event(Event::LicensePurchased(hash, buyer, license, price));
    }

    Ok(())
}
