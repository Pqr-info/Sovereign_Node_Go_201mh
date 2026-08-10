import re

with open('src/lib.rs', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix ControlChange -> Controller
code = code.replace("MidiMessage::ControlChange", "MidiMessage::Controller")

# Fix vec![...].into() in SysEx
code = re.sub(r'vec!\[(.*?)\].into\(\)', r'Box::leak(vec![\1].into_boxed_slice())', code)

with open('src/lib.rs', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed lib.rs")
