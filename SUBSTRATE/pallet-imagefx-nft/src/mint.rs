use crate::*;
use frame_support::pallet_prelude::*;
use frame_system::pallet_prelude::*;

pub fn do_mint<T: Config>(
    origin: OriginFor<T>,
    metadata: metadata::ImageMetadata<T>,
) -> DispatchResult {
    let creator = ensure_signed(origin)?;
    
    // Hash of metadata acts as unique NFT ID
    let hash = T::Hashing::hash_of(&metadata);

    ensure!(!NFTs::<T>::contains_key(hash), Error::<T>::NFTAlreadyExists);

    NFTs::<T>::insert(hash, metadata);
    NFTOwner::<T>::insert(hash, creator.clone());

    Pallet::<T>::deposit_event(Event::Minted(hash, creator));
    Ok(())
}

pub fn do_transfer<T: Config>(
    origin: OriginFor<T>,
    to: T::AccountId,
    hash: T::Hash,
) -> DispatchResult {
    let sender = ensure_signed(origin)?;
    
    let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
    ensure!(owner == sender, Error::<T>::NotOwner);

    NFTOwner::<T>::insert(hash, to.clone());
    
    // If it was listed for sale, delist it upon transfer
    GalleryListings::<T>::remove(hash);

    Pallet::<T>::deposit_event(Event::Transferred(hash, sender, to));
    Ok(())
}

pub fn do_burn<T: Config>(
    origin: OriginFor<T>,
    hash: T::Hash,
) -> DispatchResult {
    let sender = ensure_signed(origin)?;
    
    let owner = NFTOwner::<T>::get(hash).ok_or(Error::<T>::NFTNotFound)?;
    ensure!(owner == sender, Error::<T>::NotOwner);

    NFTs::<T>::remove(hash);
    NFTOwner::<T>::remove(hash);
    GalleryListings::<T>::remove(hash);

    Pallet::<T>::deposit_event(Event::Burned(hash));
    Ok(())
}
