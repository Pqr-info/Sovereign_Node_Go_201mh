import re

with open('src/lib.rs', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    "Smf::new(\n            midly::Format::Parallel,\n            midly::Timing::Metrical(midly::num::u15::from(480)),\n        )",
    "Smf::new(midly::Header::new(midly::Format::Parallel, midly::Timing::Metrical(midly::num::u15::from(480))))"
)

with open('src/lib.rs', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed Smf::new")
