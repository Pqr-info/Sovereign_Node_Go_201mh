---
name: "timeslip-generator"
description: "Generates a Timeslip (CognitiveSessionManifest) and commits it to the Sovereign Mesh when the user invokes the /timeslip command."
---

# Timeslip Generator

When the user asks to generate a timeslip or uses the `/timeslip` command, you must capture the current state of the workspace and decisions made during the session, and commit it as a `CognitiveSessionManifest` (CSM) to the Go Mesh sidecar.

## Steps to Execute
1. Generate a Markdown artifact in your artifacts directory (e.g. `timeslip_{timestamp}.md`) summarizing the work accomplished in the current session.
2. Run the python script `D:\pqr.info\shared\skills\timeslip-generator\scripts\commit_timeslip.py` passing the required arguments: prompt/goal, a short raw context summary, and semantic relations separated by commas.
   - Example: `python D:\pqr.info\shared\skills\timeslip-generator\scripts\commit_timeslip.py "Fix CSS bug" "Replaced legacy rendering with react-pdf" "Resolved rendering bug, PDF generated"`
3. Provide the returned block index to the user.
