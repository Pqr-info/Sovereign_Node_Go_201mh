use sp_std::collections::btree_map::BTreeMap;
use solochain_template_runtime::Runtime;

#[test]
fn vault_api_returns_secret() {
    let key = b"imagefx".to_vec();
    let mut map = BTreeMap::new();
    map.insert(b"api_key".to_vec(), b"xyz".to_vec());

    pallet_vault_storage::VaultStorage::<Runtime>::insert(
        key.clone().try_into().unwrap(),
        map.clone()
    );

    let result = pallet_vault_storage::Pallet::<Runtime>::get_secret_raw(key).unwrap();

    assert_eq!(result.get(&b"api_key".to_vec()).unwrap(), &b"xyz".to_vec());
}
