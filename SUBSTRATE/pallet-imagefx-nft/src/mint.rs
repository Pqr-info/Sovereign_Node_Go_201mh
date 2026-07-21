use crate::*;
use frame_support::pallet_prelude::*;
use frame_system::pallet_prelude::*;
use frame_support::traits::{Currency, ExistenceRequirement};
use sp_runtime::traits::{Saturating, Zero, CheckedMul};
use crate::metadata::{NftMetadata, ImageMetadata, ProteinMetadata, NftClass, NftRecord};

pub fn do_mint_image<T: Config>(
    origin: OriginFor<T>,
    metadata: ImageMetadata<T>,
) -> DispatchResult {
    let creator = ensure_signed(origin)?;
    
    // Hash of metadata acts as unique NFT ID
    let hash = T::Hashing::hash_of(&metadata);
    ensure!(!NFTs::<T>::contains_key(hash), Error::<T>::NFTAlreadyExists);

    // Calculate minting fee
    let rate = UsdCentConversionRate::<T>::get();
    let base_fee: u32 = T::BaseMintFeeCents::get();
    
    let base_fee_balance: BalanceOf<T> = base_fee.into();
    let total_fee = rate.checked_mul(&base_fee_balance).unwrap_or(Zero::zero());

    if !total_fee.is_zero() {
        let treasury = TreasuryAccount::<T>::get().ok_or(Error::<T>::TreasuryNotSet)?;
        T::Currency::transfer(&creator, &treasury, total_fee, ExistenceRequirement::KeepAlive)
            .map_err(|_| Error::<T>::InsufficientFunds)?;
    }

    let record = NftRecord {
        class: NftClass::ImageFx,
        metadata: NftMetadata::Image(metadata),
    };
    NFTs::<T>::insert(hash, record);
    NFTOwner::<T>::insert(hash, creator.clone());

    Pallet::<T>::deposit_event(Event::MintedImage(hash, creator, total_fee));
    Ok(())
}

pub fn do_mint_protein<T: Config>(
    origin: OriginFor<T>,
    metadata: ProteinMetadata<T>,
) -> DispatchResult {
    let creator = ensure_signed(origin)?;
    
    // Ensure parent lineage exists if specified
    if let Some(parent_hash) = metadata.parent_hash {
        ensure!(NFTs::<T>::contains_key(parent_hash), Error::<T>::NFTNotFound);
    }

    // Hash of metadata acts as unique NFT ID
    let hash = T::Hashing::hash_of(&metadata);
    ensure!(!NFTs::<T>::contains_key(hash), Error::<T>::NFTAlreadyExists);

    // Calculate minting fee
    let rate = UsdCentConversionRate::<T>::get();
    let base_fee: u32 = T::BaseMintFeeCents::get();
    
    let base_fee_balance: BalanceOf<T> = base_fee.into();
    let total_fee = rate.checked_mul(&base_fee_balance).unwrap_or(Zero::zero());

    if !total_fee.is_zero() {
        let treasury = TreasuryAccount::<T>::get().ok_or(Error::<T>::TreasuryNotSet)?;
        T::Currency::transfer(&creator, &treasury, total_fee, ExistenceRequirement::KeepAlive)
            .map_err(|_| Error::<T>::InsufficientFunds)?;
    }

    let record = NftRecord {
        class: NftClass::Protein,
        metadata: NftMetadata::Protein(metadata),
    };
    NFTs::<T>::insert(hash, record);
    NFTOwner::<T>::insert(hash, creator.clone());

    Pallet::<T>::deposit_event(Event::MintedProtein(hash, creator, total_fee));
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
