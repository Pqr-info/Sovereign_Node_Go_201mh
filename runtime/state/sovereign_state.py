# Sovereign State Machine (SSM)
# Canonical Path: D:/pqr.info/runtime/state/sovereign_state.py

class SovereignStateMachine:
    def __init__(self):
        self.current_state = "INIT"
        print(f"[SovereignState] Machine initialized. Current state: {self.current_state}")

    def transition_to(self, next_state):
        old_state = self.current_state
        self.current_state = next_state
        print(f"[SovereignState] Transitioned from {old_state} to {self.current_state}")
        return self.current_state

if __name__ == "__main__":
    ssm = SovereignStateMachine()
    ssm.transition_to("RUNNING")
