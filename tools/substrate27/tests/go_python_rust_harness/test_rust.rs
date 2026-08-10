use std::fs;
use serde::Deserialize;
use substrate27::{Substrate27Address, SymbolState};

#[derive(Deserialize)]
struct VecData {
    symbols: Vec<u8>,
    states: Vec<u8>,
}

fn main() {
    let data = fs::read_to_string("test_vector.json").unwrap();
    let v: VecData = serde_json::from_str(&data).unwrap();

    let mut vec = [SymbolState { symbol: 0, state: 0 }; 27];
    for i in 0..27 {
        vec[i] = SymbolState {
            symbol: v.symbols[i],
            state: v.states[i],
        };
    }

    let addr = Substrate27Address::new(vec);
    let hash = addr.hash();

    println!("Rust Hash: {:x?}", hash);
}
