import hashlib
import time
import os

class DeadEndDetector:
    def __init__(self, workspace_path: str):
        self.workspace_path = workspace_path
        self.history = []
        self.max_history = 10
        self.loop_threshold = 3
        
    def log_action(self, action_output: str):
        """Log an agent action to detect loops."""
        action_hash = hashlib.sha256(action_output.encode()).hexdigest()
        self.history.append(action_hash)
        if len(self.history) > self.max_history:
            self.history.pop(0)
            
    def is_looping(self) -> bool:
        """Detect if the agent is caught in a loop."""
        if len(self.history) < self.loop_threshold:
            return False
            
        recent = self.history[-1]
        count = self.history.count(recent)
        return count >= self.loop_threshold
        
    def is_stagnant(self, max_idle_seconds: int = 300) -> bool:
        """Detect if the workspace hasn't been modified in a while."""
        if not os.path.exists(self.workspace_path):
            return False
            
        try:
            mtime = os.path.getmtime(self.workspace_path)
            if time.time() - mtime > max_idle_seconds:
                return True
        except Exception:
            pass
            
        return False
        
    def check_status(self) -> str:
        """Returns the status string if a dead end is detected, else None."""
        if self.is_looping():
            return "closed_loop_quantum_state"
        if self.is_stagnant():
            return "stagnation_void"
        return None
