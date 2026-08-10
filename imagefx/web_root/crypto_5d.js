/**
 * 5D-ASP Cryptography and Canonicalization
 * Handles the mapping of AlphaFold structures to the 5D Tuple (X, Y, Z, I_phase, I_lineage)
 * and the Base-27 recovery passphrase nomenclature.
 */

// Base-27 Dictionary: 27 unique words mapping 1:1 to A-Z and 0
const BASE_27_DICT = {
    'A': 'ALPHA',    'B': 'BRAVO',   'C': 'CHARLIE', 'D': 'DELTA',
    'E': 'ECHO',     'F': 'FOXTROT', 'G': 'GOLF',    'H': 'HOTEL',
    'I': 'INDIA',    'J': 'JULIET',  'K': 'KILO',    'L': 'LIMA',
    'M': 'MIKE',     'N': 'NOVEMBER','O': 'OSCAR',   'P': 'PAPA',
    'Q': 'QUEBEC',   'R': 'ROMEO',   'S': 'SIERRA',  'T': 'TANGO',
    'U': 'UNIFORM',  'V': 'VICTOR',  'W': 'WHISKEY', 'X': 'XRAY',
    'Y': 'YANKEE',   'Z': 'ZULU',    '0': 'ZERO'
};

const BASE_27_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0";

function canonicalizeCIF(cifContent) {
    const lines = cifContent.split('\n');
    let atoms = [];
    let atomSiteColumns = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('_atom_site.')) {
            atomSiteColumns.push(line.substring(11).trim());
        } else if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
            const cols = line.split(/\s+/);
            let chain = "", res = "", atomName = "";
            let x = 0, y = 0, z = 0;
            
            if (atomSiteColumns.length > 0) {
                for (let c = 0; c < cols.length && c < atomSiteColumns.length; c++) {
                    const colName = atomSiteColumns[c];
                    const val = cols[c];
                    if (colName === 'label_asym_id') chain = val;
                    else if (colName === 'label_seq_id') res = val;
                    else if (colName === 'label_atom_id') atomName = val;
                    else if (colName === 'Cartn_x') x = parseFloat(val) || 0;
                    else if (colName === 'Cartn_y') y = parseFloat(val) || 0;
                    else if (colName === 'Cartn_z') z = parseFloat(val) || 0;
                }
            } else {
                if (cols.length >= 13) {
                    chain = cols[6];
                    res = cols[8];
                    atomName = cols[3];
                    x = parseFloat(cols[10]) || 0;
                    y = parseFloat(cols[11]) || 0;
                    z = parseFloat(cols[12]) || 0;
                }
            }
            
            const resInt = parseInt(res) || 0;
            atoms.push({ chain, resInt, atomName, x, y, z });
        }
    }
    
    atoms.sort((a, b) => {
        if (a.chain < b.chain) return -1;
        if (a.chain > b.chain) return 1;
        if (a.resInt !== b.resInt) return a.resInt - b.resInt;
        if (a.atomName < b.atomName) return -1;
        if (a.atomName > b.atomName) return 1;
        return 0;
    });
    
    let canonical = [];
    for (const a of atoms) {
        canonical.push(`${a.chain}:${a.resInt}:${a.atomName}:${a.x.toFixed(3)}:${a.y.toFixed(3)}:${a.z.toFixed(3)}`);
    }
    return canonical.join('\n');
}

/**
 * Parses AlphaFold .cif content to derive canonical X, Y, Z coordinates
 * and the Phase/Lineage indices from the 256-bit structural hash.
 */
async function parseAlphaFoldCIF(cifContent, paid) {
    const canonicalContent = canonicalizeCIF(cifContent);
    const msgBuffer = new TextEncoder().encode(paid + canonicalContent);
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
    
    return { x, y, z, i_phase, i_lineage };
}

/**
 * Packs the 5D Tuple into a 128-bit word and encodes as a 27-character Base-27 string
 */
async function generate5DAddressBase27(x, y, z, i_phase, i_lineage) {
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
    
    // Compute ECC/Parity (12-bit CRC) over [127:44]
    const N_high = N >> 44n;
    let crc = 0;
    const poly = 0x80F;
    for (let i = 83; i >= 0; i--) {
        const bit = Number((N_high >> BigInt(i)) & 1n);
        const crcTop = (crc >> 11) & 1;
        crc = (crc << 1) & 0xFFF;
        if (crcTop ^ bit) {
            crc ^= poly;
        }
    }
    let ecc = BigInt(crc);
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
function getRecoveryPassphrase(base27Address) {
    let phrase = [];
    for (let i = 0; i < base27Address.length; i++) {
        const char = base27Address[i];
        phrase.push(BASE_27_DICT[char]);
    }
    return phrase.join(" ");
}

window.Crypto5D = {
    parseAlphaFoldCIF,
    generate5DAddressBase27,
    getRecoveryPassphrase,
    canonicalizeCIF,
    BASE_27_DICT
};

