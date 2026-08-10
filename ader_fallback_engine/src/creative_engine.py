import hashlib
import time
import os
import json
import zipfile
from datetime import datetime

class StatePreserver:
    def __init__(self, workspace_path: str, save_dir: str):
        self.workspace_path = workspace_path
        self.save_dir = save_dir
        os.makedirs(self.save_dir, exist_ok=True)
        
    def preserve_state(self, context_messages: list):
        """Zips the workspace and saves the agent context."""
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        archive_name = os.path.join(self.save_dir, f"state_{timestamp}.zip")
        
        # Zip the workspace
        if os.path.exists(self.workspace_path):
            with zipfile.ZipFile(archive_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(self.workspace_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, self.workspace_path)
                        zipf.write(file_path, arcname)
                        
        # Save the context
        manifest_path = os.path.join(self.save_dir, f"context_{timestamp}.json")
        with open(manifest_path, 'w') as f:
            json.dump(context_messages, f, indent=4)
            
        return archive_name, manifest_path


class SpacebookCreativeEngine:
    def __init__(self):
        self.metaphors = {
            "closed_loop_quantum_state": {
                "particle": "Quark",
                "action": "Inject random noise to break the deterministic loop.",
                "creative_prompt": "You are stuck in a time loop. To escape, you must introduce a random, chaotic idea that breaks your current pattern."
            },
            "stagnation_void": {
                "particle": "Neutrino",
                "action": "Step back and review the broader system architecture.",
                "creative_prompt": "You are drifting in the void. Zoom out and write a summary of the entire project before writing any new code."
            }
        }
        
    def generate_anomaly(self, impasse_type: str, coordinates: tuple) -> dict:
        """Generates a deterministic anomaly based on time and coordinates."""
        timestamp = time.time()
        seed = f"{coordinates[0]},{coordinates[1]}_{timestamp}"
        anomaly_hash = hashlib.sha256(seed.encode()).hexdigest()
        
        metaphor = self.metaphors.get(impasse_type, {
            "particle": "Qubit",
            "action": "Re-evaluate current state.",
            "creative_prompt": "You are in an unknown quantum state. Try an entirely different approach."
        })
        
        return {
            "anomaly_id": anomaly_hash[:12],
            "timestamp": timestamp,
            "impasse": impasse_type,
            "solution": metaphor
        }
