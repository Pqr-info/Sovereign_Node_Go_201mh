#[cfg(all(feature = "std", feature = "metadata-hash"))]
fn main() {
	substrate_wasm_builder::WasmBuilder::init_with_defaults()
		.enable_metadata_hash("UNIT", 12)
		.append_to_rust_flags("-Clink-arg=--import-undefined")
		.build();
}

#[cfg(all(feature = "std", not(feature = "metadata-hash")))]
fn main() {
	substrate_wasm_builder::WasmBuilder::init_with_defaults()
		.append_to_rust_flags("-Clink-arg=--import-undefined")
		.build();
}

/// The wasm builder is deactivated when compiling
/// this crate for wasm to speed up the compilation.
#[cfg(not(feature = "std"))]
fn main() {}
