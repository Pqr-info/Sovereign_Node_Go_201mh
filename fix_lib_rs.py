with open(r'd:\pqr.info\substrate-node-template\runtime\src\lib.rs', 'r') as f:
    lines = f.readlines()

new_lines = lines[:148] + lines[246:]

with open(r'd:\pqr.info\substrate-node-template\runtime\src\lib.rs', 'w') as f:
    f.writelines(new_lines)
