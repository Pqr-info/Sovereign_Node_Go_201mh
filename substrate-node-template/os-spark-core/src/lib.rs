#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode};
use scale_info::TypeInfo;
use sp_arithmetic::{FixedU128, FixedPointNumber};

/// A 5-Dimensional Vertex Position [T, S, L, C, O]
/// We use FixedU128 to maintain deterministic math on the Substrate blockchain.
#[derive(Clone, Encode, Decode, PartialEq, Eq, Default, TypeInfo, Debug)]
pub struct VertexPosition {
    pub dimensions: [FixedU128; 5],
}

impl VertexPosition {
    /// Create a new 5D vertex position
    pub fn new(t: FixedU128, s: FixedU128, l: FixedU128, c: FixedU128, o: FixedU128) -> Self {
        Self {
            dimensions: [t, s, l, c, o],
        }
    }

    /// Verifies the `61@ on leg of 3` topological invariant.
    /// In our 0-indexed array, "leg of 3" is index 2.
    pub fn verify_61_invariant(&self) -> bool {
        let target = FixedU128::from(61u128);
        self.dimensions[2] == target
    }

    /// Calculates Euclidean distance squared between two positions.
    /// We avoid square roots on-chain to save compute; distance^2 is sufficient for sorting/routing.
    pub fn distance_squared_to(&self, other: &Self) -> FixedU128 {
        let mut sum = FixedU128::from(0u128);
        for i in 0..5 {
            let diff = if self.dimensions[i] > other.dimensions[i] {
                self.dimensions[i] - other.dimensions[i]
            } else {
                other.dimensions[i] - self.dimensions[i]
            };
            sum = sum + (diff * diff);
        }
        sum
    }
}

/// A Wallet Address mapped to a 5D vertex
#[derive(Clone, Encode, Decode, PartialEq, Eq, Default, TypeInfo, Debug)]
pub struct WalletAddress {
    pub position: VertexPosition,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_61_invariant() {
        let mut pos = VertexPosition::new(
            FixedU128::from(0u128),
            FixedU128::from(0u128),
            FixedU128::from(0u128),
            FixedU128::from(0u128),
            FixedU128::from(0u128),
        );
        assert!(!pos.verify_61_invariant());

        pos.dimensions[2] = FixedU128::from(61u128);
        assert!(pos.verify_61_invariant());
    }

    #[test]
    fn test_distance_squared() {
        let pos1 = VertexPosition::new(
            FixedU128::from(1u128),
            FixedU128::from(2u128),
            FixedU128::from(3u128),
            FixedU128::from(4u128),
            FixedU128::from(5u128),
        );
        let pos2 = VertexPosition::new(
            FixedU128::from(1u128),
            FixedU128::from(2u128),
            FixedU128::from(3u128),
            FixedU128::from(4u128),
            FixedU128::from(6u128),
        );
        
        let dist_sq = pos1.distance_squared_to(&pos2);
        assert_eq!(dist_sq, FixedU128::from(1u128));
    }
}

