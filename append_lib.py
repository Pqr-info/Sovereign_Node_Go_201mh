code = """
impl frame_system::offchain::CreateInherent<pallet_5d_hcp::Call<Runtime>> for Runtime {
    fn create_inherent(call: pallet_5d_hcp::Call<Runtime>) -> Self::Extrinsic {
        UncheckedExtrinsic::new_unsigned(call.into())
    }
    fn is_inherent(call: &Self::Extrinsic) -> bool {
        match call.function {
            RuntimeCall::Hcp(_) => true,
            _ => false,
        }
    }
}
"""

with open(r'd:\pqr.info\substrate-node-template\runtime\src\lib.rs', 'a') as f:
    f.write(code)
