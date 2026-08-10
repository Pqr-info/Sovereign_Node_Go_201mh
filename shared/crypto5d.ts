/**
 * 5D-ASP Cryptography and Canonicalization
 * Handles the mapping of AlphaFold structures to the 5D Tuple (X, Y, Z, I_phase, I_lineage)
 * and the Base-27 recovery passphrase nomenclature.
 */

// Base-27 Dictionary: 27 unique words mapping 1:1 to A-Z and 0
export const BASE_27_DICT = {
    'A': 'ALPHA',    'B': 'BRAVO',   'C': 'CHARLIE', 'D': 'DELTA',
    'E': 'ECHO',     'F': 'FOXTROT', 'G': 'GOLF',    'H': 'HOTEL',
    'I': 'INDIA',    'J': 'JULIET',  'K': 'KILO',    'L': 'LIMA',
    'M': 'MIKE',     'N': 'NOVEMBER','O': 'OSCAR',   'P': 'PAPA',
    'Q': 'QUEBEC',   'R': 'ROMEO',   'S': 'SIERRA',  'T': 'TANGO',
    'U': 'UNIFORM',  'V': 'VICTOR',  'W': 'WHISKEY', 'X': 'XRAY',
    'Y': 'YANKEE',   'Z': 'ZULU',    '0': 'ZERO'
}; }

export const BASE_27_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0";

/**
 * Parses AlphaFold .cif content to derive canonical X, Y, Z coordinates
 * and the Phase/Lineage indices from the 256-bit structural hash.
 */
export async function parseAlphaFoldCIF(cifContent, paid) {
    const msgBuffer = new TextEncoder().encode(paid + cifContent);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
    // Convert 32 bytes to a 256-bit BigInt (H_struct)
    const view = new DataView(hashBuffer);
    let H_struct = 0n;
    for (let i = 0; i < 32; i++) {
        H_struct = (H_struct << 8n) | BigInt(view.getUint8(i));
    }
    
    // Extract Phase (12 bits) and Lineage (12 bits)
    const i_phase = Number((H_struct >> 244n) & 0xFFFn);
    const i_lineage = Number((H_struct >> 232n) & 0xFFFn);
    
    // Extract X, Y, Z (20 bits each)
    const x = Number((H_struct >> 212n) & 0xFFFFFn);
    const y = Number((H_struct >> 192n) & 0xFFFFFn);
    const z = Number((H_struct >> 172n) & 0xFFFFFn);
    
    return { x, y, z, i_phase, i_lineage }; }
}

/**
 * Packs the 5D Tuple into a 128-bit word and encodes as a 27-character Base-27 string
 */
export async function generate5DAddressBase27(x, y, z, i_phase, i_lineage) {
    let N = 0n;
    
    // [127:108] X (20 bits)
    N |= (BigInt(x) << 108n);
    // [107:88] Y (20 bits)
    N |= (BigInt(y) << 88n);
    // [87:68] Z (20 bits)
    N |= (BigInt(z) << 68n);
    // [67:56] Phase (12 bits)
    N |= (BigInt(i_phase) << 56n);
    // [55:44] Lineage (12 bits)
    N |= (BigInt(i_lineage) << 44n);
    
    // Compute ECC/Parity (12 bits) over [127:44]
    const N_high = N >> 44n;
    let ecc = 0n;
    let temp = N_high;
    while(temp > 0n) {
        ecc = (ecc + (temp & 0xFFn)) & 0xFFFn;
        temp >>= 8n;
    }
    // [43:32] ECC
    N |= (ecc << 32n);
    
    // [31:28] Version (4 bits) -> 0x1
    N |= (1n << 28n);
    
    // [27:0] Flags/Reserved -> 0
    // (Implicitly 0)

    // Encode to exactly 27 Base-27 characters
    let base27Str = "";
    temp = N;
    for (let i = 0; i < 27; i++) {
        const rem = Number(temp % 27n);
        base27Str = BASE_27_ALPHABET[rem] + base27Str;
        temp = temp / 27n;
    }
    return base27Str;
}

/**
 * Maps the 27-character Base-27 Address to the 27-word Recovery Passphrase
 */
export function getRecoveryPassphrase(base27Address) {
    let phrase = [];
    for (let i = 0; i < base27Address.length; i++) {
        const char = base27Address[i];
        phrase.push(BASE_27_DICT[char]);
    }
    return phrase.join(" ");
}

if (typeof window !== "undefined") { window.Crypto5D = {
    parseAlphaFoldCIF,
    generate5DAddressBase27,
    getRecoveryPassphrase,
    BASE_27_DICT
}; }


