import re

with open('src/lib.rs', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix Smf::new
code = code.replace("Smf::new(\n            midly::Format::Parallel,\n            midly::Timing::Metrical(midly::num::u15::from(480)),\n        )", "Smf::new(midly::Header::new(midly::Format::Parallel, midly::Timing::Metrical(midly::num::u15::from(480))))")

# We had an issue with `let track` being removed but `track.push` still remaining.
# Let's restore the file to the original and re-apply cleanly.

