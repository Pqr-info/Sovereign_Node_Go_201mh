#![cfg_attr(not(feature = "std"), no_std)]

extern crate alloc;

use alloc::string::{String, ToString};
use alloc::vec::Vec;
use alloc::format;
use sha2::{Sha256, Digest};

pub const BASE_27_ALPHABET: &[u8; 27] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ0";

#[derive(Clone, Eq, PartialEq, Debug, Default)]
pub struct FiveDAddress {
    pub packed: [u8; 16],
    pub base27: [u8; 27],
}

pub fn canonicalize_cif(cif_content: &str) -> String {
    let mut atom_site_columns = Vec::new();
    let mut atoms = Vec::new();
    
    for line in cif_content.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("_atom_site.") {
            atom_site_columns.push(trimmed[11..].trim().to_string());
        } else if trimmed.starts_with("ATOM") || trimmed.starts_with("HETATM") {
            let cols: Vec<&str> = trimmed.split_whitespace().collect();
            let mut chain = "";
            let mut res = "";
            let mut atom_name = "";
            let mut x_val = 0.0f64;
            let mut y_val = 0.0f64;
            let mut z_val = 0.0f64;
            
            if !atom_site_columns.is_empty() {
                for (c, &col_val) in cols.iter().enumerate() {
                    if c < atom_site_columns.len() {
                        let col_name = &atom_site_columns[c];
                        match col_name.as_str() {
                            "label_asym_id" => chain = col_val,
                            "label_seq_id" => res = col_val,
                            "label_atom_id" => atom_name = col_val,
                            "Cartn_x" => x_val = col_val.parse::<f64>().unwrap_or(0.0),
                            "Cartn_y" => y_val = col_val.parse::<f64>().unwrap_or(0.0),
                            "Cartn_z" => z_val = col_val.parse::<f64>().unwrap_or(0.0),
                            _ => {}
                        }
                    }
                }
            } else {
                if cols.len() >= 13 {
                    chain = cols[6];
                    res = cols[8];
                    atom_name = cols[3];
                    x_val = cols[10].parse::<f64>().unwrap_or(0.0);
                    y_val = cols[11].parse::<f64>().unwrap_or(0.0);
                    z_val = cols[12].parse::<f64>().unwrap_or(0.0);
                }
            }
            
            if x_val == 0.0 { x_val = 0.0; }
            if y_val == 0.0 { y_val = 0.0; }
            if z_val == 0.0 { z_val = 0.0; }
            
            let res_int = res.parse::<i32>().unwrap_or(0);
            atoms.push((chain.to_string(), res_int, atom_name.to_string(), x_val, y_val, z_val));
        }
    }
    
    atoms.sort_by(|a, b| {
        let cmp_chain = a.0.cmp(&b.0);
        if cmp_chain != core::cmp::Ordering::Equal {
            return cmp_chain;
        }
        let cmp_res = a.1.cmp(&b.1);
        if cmp_res != core::cmp::Ordering::Equal {
            return cmp_res;
        }
        a.2.cmp(&b.2)
    });
    
    let mut canonical = Vec::new();
    for a in atoms {
        canonical.push(format!("{}:{}:{}:{:.3}:{:.3}:{:.3}", a.0, a.1, a.2, a.3, a.4, a.5));
    }
    canonical.join("\n")
}

pub fn hash_cif_to_struct_hash(paid: &str, cif_content: &str) -> [u8; 32] {
    let mut hasher = Sha256::new();
    let canonical = canonicalize_cif(cif_content);
    hasher.update(paid.as_bytes());
    hasher.update(canonical.as_bytes());
    hasher.finalize().into()
}

pub fn struct_hash_to_tuple(hash: &[u8; 32]) -> (u32, u32, u32, u16, u16) {
    // Convert 32 bytes to a 256-bit representation
    // To match JS implementation exactly, we need to extract bits correctly.
    // In JS: H_struct = (H_struct << 8n) | BigInt(view.getUint8(i));
    // This is basically parsing the 32 bytes as a big-endian 256-bit integer.
    
    // We only need the top bytes to get the fields.
    // [255:244] Phase (12 bits)
    // [243:232] Lineage (12 bits)
    // [231:212] X (20 bits)
    // [211:192] Y (20 bits)
    // [191:172] Z (20 bits)
    
    // Byte indices (big-endian):
    // bytes[0..1] -> [255:240]
    // bytes[0] = [255:248]
    // bytes[1] = [247:240]
    // bytes[2] = [239:232]
    // bytes[3] = [231:224]
    
    // To extract easily, we can read chunks as u32 or u64 big-endian and shift.
    
    let mut bytes = [0u8; 8];
    bytes.copy_from_slice(&hash[0..8]);
    let top64 = u64::from_be_bytes(bytes); // Bits [255:192]
    
    // Phase: top 12 bits -> top64 >> 52
    let i_phase = (top64 >> 52) as u16 & 0xFFF;
    
    // Lineage: next 12 bits -> (top64 >> 40)
    let i_lineage = (top64 >> 40) as u16 & 0xFFF;
    
    // X: next 20 bits -> (top64 >> 20)
    let x = (top64 >> 20) as u32 & 0xFFFFF;
    
    // Y: next 20 bits -> top64
    let y = top64 as u32 & 0xFFFFF;
    
    // Z: next 20 bits -> need bits [191:172].
    // Those are in hash[8..11] (bytes 8, 9, 10).
    // Let's read hash[7..11] as u32 to get bits [199:168]
    let mut z_bytes = [0u8; 4];
    z_bytes.copy_from_slice(&hash[7..11]);
    let next32 = u32::from_be_bytes(z_bytes); // Bits [199:168]
    
    // We want [191:172], which is bits [23:4] of next32
    let z = (next32 >> 4) & 0xFFFFF;
    
    (x, y, z, i_phase, i_lineage)
}

pub fn tuple_to_packed(x: u32, y: u32, z: u32, i_phase: u16, i_lineage: u16) -> [u8; 16] {
    // Pack into a 128-bit word (array of 16 bytes, big endian)
    // [127:108] X (20 bits)
    // [107:88] Y (20 bits)
    // [87:68] Z (20 bits)
    // [67:56] Phase (12 bits)
    // [55:44] Lineage (12 bits)
    // [43:32] ECC (12 bits)
    // [31:28] Version (4 bits) -> 0x1
    // [27:0] Flags/Reserved -> 0
    
    let mut n0 = 0u64; // High 64 bits [127:64]
    let mut n1 = 0u64; // Low 64 bits [63:0]
    
    // X goes into [127:108] -> n0 [63:44]
    n0 |= (x as u64) << 44;
    // Y goes into [107:88] -> n0 [43:24]
    n0 |= (y as u64) << 24;
    // Z goes into [87:68] -> n0 [23:4]
    n0 |= (z as u64) << 4;
    // Phase goes into [67:56]. [67:64] goes to n0 [3:0], [63:56] goes to n1 [63:56]
    n0 |= ((i_phase as u64) >> 8) & 0xF;
    n1 |= ((i_phase as u64) & 0xFF) << 56;
    // Lineage goes into [55:44] -> n1 [55:44]
    n1 |= (i_lineage as u64) << 44;
    
    // Compute ECC/Parity (12-bit CRC) over [127:44]
    let n_high = ((n0 as u128) << 20) | ((n1 as u128) >> 44);
    let mut crc = 0u16;
    let poly = 0x80F;
    for i in (0..=83).rev() {
        let bit = ((n_high >> i) & 1) as u16;
        let crc_top = (crc >> 11) & 1;
        crc = (crc << 1) & 0xFFF;
        if (crc_top ^ bit) != 0 {
            crc ^= poly;
        }
    }
    let ecc = crc as u64;
    
    // [43:32] ECC -> n1 [43:32]
    n1 |= ecc << 32;
    
    // [31:28] Version -> 0x1
    n1 |= 1u64 << 28;
    
    let mut packed = [0u8; 16];
    packed[0..8].copy_from_slice(&n0.to_be_bytes());
    packed[8..16].copy_from_slice(&n1.to_be_bytes());
    packed
}

pub fn packed_to_base27(packed: &[u8; 16]) -> [u8; 27] {
    let mut temp = u128::from_be_bytes(*packed);
    let mut base27 = [0u8; 27];
    
    for i in (0..27).rev() {
        let rem = (temp % 27) as usize;
        base27[i] = BASE_27_ALPHABET[rem];
        temp /= 27;
    }
    base27
}

pub fn derive_fived_address(paid: &str, cif_content: &str) -> FiveDAddress {
    let hash = hash_cif_to_struct_hash(paid, cif_content);
    let (x, y, z, phase, lineage) = struct_hash_to_tuple(&hash);
    let packed = tuple_to_packed(x, y, z, phase, lineage);
    let base27 = packed_to_base27(&packed);
    
    FiveDAddress { packed, base27 }
}

