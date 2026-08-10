//! A collection of node-specific RPC methods.
//! Substrate provides the `sc-rpc` crate, which defines the core RPC layer
//! used by Substrate nodes. This file extends those RPC definitions with
//! capabilities that are specific to this project's runtime configuration.

#![warn(missing_docs)]

use std::sync::Arc;

use jsonrpsee::proc_macros::rpc;
use jsonrpsee::RpcModule;
use sc_transaction_pool_api::TransactionPool;
use solochain_template_runtime::{opaque::Block, AccountId, Balance, Nonce};
use sp_api::ProvideRuntimeApi;
use solochain_template_runtime::apis::{VaultApi, ShortcodeApi};
use sp_block_builder::BlockBuilder;
use sp_blockchain::{Error as BlockChainError, HeaderBackend, HeaderMetadata};

/// Full client dependencies.
pub struct FullDeps<C, P> {
	/// The client instance to use.
	pub client: Arc<C>,
	/// Transaction pool instance.
	pub pool: Arc<P>,
}

/// Instantiate all full RPC extensions.
pub fn create_full<C, P>(
	deps: FullDeps<C, P>,
) -> Result<RpcModule<()>, Box<dyn std::error::Error + Send + Sync>>
where
	C: ProvideRuntimeApi<Block>,
	C: HeaderBackend<Block> + HeaderMetadata<Block, Error = BlockChainError> + 'static,
	C: Send + Sync + 'static,
	C::Api: substrate_frame_rpc_system::AccountNonceApi<Block, AccountId, Nonce>,
	C::Api: pallet_transaction_payment_rpc::TransactionPaymentRuntimeApi<Block, Balance>,
	C::Api: BlockBuilder<Block>,
	C::Api: solochain_template_runtime::apis::VaultApi<Block>,
	C::Api: solochain_template_runtime::apis::ShortcodeApi<Block>,
	P: TransactionPool + 'static,
{
	use pallet_transaction_payment_rpc::{TransactionPayment, TransactionPaymentApiServer};
	use substrate_frame_rpc_system::{System, SystemApiServer};

	let mut module = RpcModule::new(());
	let FullDeps { client, pool } = deps;

	module.merge(System::new(client.clone(), pool.clone()).into_rpc())?;
	module.merge(TransactionPayment::new(client.clone()).into_rpc())?;
	module.merge(VaultRpcApiServer::into_rpc(VaultRpcHandler::new(client.clone(), pool.clone())))?;
	module.merge(ShortcodeRpcApiServer::into_rpc(ShortcodeRpcHandler::new(client.clone(), pool.clone())))?;

	// Extend this RPC with a custom API by using the following syntax.
	// `YourRpcStruct` should have a reference to a client, which is needed
	// to call into the runtime.
	// `module.merge(YourRpcTrait::into_rpc(YourRpcStruct::new(ReferenceToClient, ...)))?;`

	// You probably want to enable the `rpc v2 chainSpec` API as well
	//
	// let chain_name = chain_spec.name().to_string();
	// let genesis_hash = client.block_hash(0).ok().flatten().expect("Genesis block exists; qed");
	// let properties = chain_spec.properties();
	// module.merge(ChainSpec::new(chain_name, genesis_hash, properties).into_rpc())?;

	Ok(module)
}

#[rpc(server)]
pub trait VaultRpcApi {
    #[method(name = "vault_getSecret")]
    fn vault_getSecret(&self, key: String) -> jsonrpsee::core::RpcResult<std::collections::HashMap<String, String>>;

    #[method(name = "vault_getShard")]
    fn vault_getShard(&self, key: String, node_id: String) -> jsonrpsee::core::RpcResult<String>;

    #[method(name = "vault_getShardedDescriptor")]
    fn vault_getShardedDescriptor(&self, key: String) -> jsonrpsee::core::RpcResult<(u8, u8, Vec<String>)>;
}

pub struct VaultRpcHandler<C, P> {
    client: Arc<C>,
    pool: Arc<P>,
}

impl<C, P> VaultRpcHandler<C, P> {
    pub fn new(client: Arc<C>, pool: Arc<P>) -> Self {
        Self { client, pool }
    }
}

impl<C, P> VaultRpcApiServer for VaultRpcHandler<C, P>
where
    C: ProvideRuntimeApi<Block> + HeaderBackend<Block> + Send + Sync + 'static,
    C::Api: solochain_template_runtime::apis::VaultApi<Block>,
    P: TransactionPool + 'static,
{
    fn vault_getSecret(&self, key: String) -> jsonrpsee::core::RpcResult<std::collections::HashMap<String, String>> {
        let api = self.client.runtime_api();
        let best_hash = self.client.info().best_hash;
        
        let result = api.vault_get_secret(best_hash, key.into_bytes()).map_err(|e| {
            jsonrpsee::core::Error::Custom(format!("Runtime error: {:?}", e))
        })?;

        if let Some(map) = result {
            let mut out = std::collections::HashMap::new();
            for (k, v) in map {
                out.insert(
                    String::from_utf8_lossy(&k).to_string(),
                    String::from_utf8_lossy(&v).to_string(),
                );
            }
            Ok(out)
        } else {
            Ok(std::collections::HashMap::new())
        }
    }

    fn vault_getShard(&self, key: String, node_id: String) -> jsonrpsee::core::RpcResult<String> {
        let api = self.client.runtime_api();
        let best_hash = self.client.info().best_hash;
        
        let result = api.vault_get_shard(best_hash, key.into_bytes(), node_id.into_bytes()).map_err(|e| {
            jsonrpsee::core::Error::Custom(format!("Runtime error: {:?}", e))
        })?;

        if let Some(bytes) = result {
            Ok(String::from_utf8_lossy(&bytes).to_string())
        } else {
            Ok(String::new())
        }
    }

    fn vault_getShardedDescriptor(&self, key: String) -> jsonrpsee::core::RpcResult<(u8, u8, Vec<String>)> {
        let api = self.client.runtime_api();
        let best_hash = self.client.info().best_hash;
        
        let result = api.vault_get_sharded_descriptor(best_hash, key.into_bytes()).map_err(|e| {
            jsonrpsee::core::Error::Custom(format!("Runtime error: {:?}", e))
        })?;

        if let Some((total, threshold, node_ids)) = result {
            let ids = node_ids
                .into_iter()
                .map(|b| String::from_utf8_lossy(b.as_ref()).to_string())
                .collect::<Vec<_>>();
            Ok((total, threshold, ids))
        } else {
            Ok((0, 0, Vec::new()))
        }
    }
}

#[rpc(server)]
pub trait ShortcodeRpcApi {
    #[method(name = "shortcode_resolve")]
    fn shortcode_resolve(&self, code: String) -> jsonrpsee::core::RpcResult<serde_json::Value>;
}

pub struct ShortcodeRpcHandler<C, P> {
    client: Arc<C>,
    pool: Arc<P>,
}

impl<C, P> ShortcodeRpcHandler<C, P> {
    pub fn new(client: Arc<C>, pool: Arc<P>) -> Self {
        Self { client, pool }
    }
}

impl<C, P> ShortcodeRpcApiServer for ShortcodeRpcHandler<C, P>
where
    C: ProvideRuntimeApi<Block> + HeaderBackend<Block> + Send + Sync + 'static,
    C::Api: solochain_template_runtime::apis::ShortcodeApi<Block>,
    P: TransactionPool + 'static,
{
    fn shortcode_resolve(&self, code: String) -> jsonrpsee::core::RpcResult<serde_json::Value> {
        let api = self.client.runtime_api();
        let best_hash = self.client.info().best_hash;

        let result = api.resolve_shortcode(best_hash, code.into_bytes()).map_err(|e| {
            jsonrpsee::core::Error::Custom(format!("Runtime error: {:?}", e))
        })?;

        if let Some(res) = result {
            let addr5d_str = String::from_utf8_lossy(&res.addr5d).to_string();
            Ok(serde_json::json!({
                "addr5d": addr5d_str,
                "ipv6_suffix": res.ipv6_suffix,
                "lease_id": res.lease_id,
            }))
        } else {
            Ok(serde_json::Value::Null)
        }
    }
}
