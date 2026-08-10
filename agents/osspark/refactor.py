import re

with open('src/lib.rs', 'r', encoding='utf-8') as f:
    code = f.read()

trait_def = """
pub trait SovereignGossip {
    fn on_event(&mut self, track_idx: usize, event: &midly::TrackEvent<'static>);
}
"""

code = code.replace("pub struct OsSparkKernel {", trait_def + "\npub struct OsSparkKernel {\n    pub gossip_model: Option<Box<dyn SovereignGossip>>,")
code = code.replace("pub fn new() -> Self {", "pub fn new(gossip_model: Option<Box<dyn SovereignGossip>>) -> Self {")
code = code.replace("Self { smf, tick: 0 }", "Self { smf, tick: 0, gossip_model }")

push_event_fn = """
    pub fn push_event(&mut self, idx: usize, event: TrackEvent<'static>) {
        if let Some(ref mut model) = self.gossip_model {
            model.on_event(idx, &event);
        }
        self.track_mut(idx).push(event);
    }
"""

code = code.replace("    fn track_mut(&mut self, idx: usize) -> &mut Track<'static> {", push_event_fn + "\n    fn track_mut(&mut self, idx: usize) -> &mut Track<'static> {")

def replace_push(match):
    idx = match.group(1)
    body = match.group(2)
    return body.replace("track.push(", f"self.push_event({idx}, ")

code = re.sub(r"let track = self\.track_mut\((\d+)\);(.*?)(?=^\s*//|^\s*fn|^\s*\})", replace_push, code, flags=re.MULTILINE | re.DOTALL)

with open('src/lib.rs', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
