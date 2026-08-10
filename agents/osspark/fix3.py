import re

with open('src/lib.rs', 'r', encoding='utf-8') as f:
    code = f.read()

# We need to map each emit function to its track idx to replace the remaining track.push
# Or just find the closest `self.push_event(IDX, ` before it.

lines = code.split('\n')
current_idx = None
for i, line in enumerate(lines):
    m = re.search(r'self\.push_event\((\d+),', line)
    if m:
        current_idx = m.group(1)
    if 'track.push(' in line and current_idx is not None:
        lines[i] = line.replace('track.push(', f'self.push_event({current_idx}, ')
    # For emit_beyond and null
    if 'fn emit_beyond' in line or 'fn emit_null' in line:
        current_idx = None

code = '\n'.join(lines)

with open('src/lib.rs', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed track.push()")
