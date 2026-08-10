import os
import time
from dead_end_detector import DeadEndDetector
from creative_engine import StatePreserver, SpacebookCreativeEngine

def main():
    print("Initializing Spacebook 5D Agent Fallback System...")
    workspace = os.path.join(os.getcwd(), "test_workspace")
    save_dir = os.path.join(os.getcwd(), "..", "saved_states")
    
    # Setup test workspace
    os.makedirs(workspace, exist_ok=True)
    with open(os.path.join(workspace, "test.txt"), "w") as f:
        f.write("initial state")
        
    detector = DeadEndDetector(workspace)
    preserver = StatePreserver(workspace, save_dir)
    engine = SpacebookCreativeEngine()
    
    print("Simulating agent actions (Looping)...")
    for i in range(4):
        detector.log_action("I am stuck on this python script")
        status = detector.check_status()
        if status:
            print(f"!!! Dead End Detected: {status} !!!")
            print("Preserving agent state...")
            archive, manifest = preserver.preserve_state([{"role": "agent", "content": "I am stuck"}])
            print(f"State preserved at {archive}")
            
            print("Generating Spacebook Creative Anomaly...")
            anomaly = engine.generate_anomaly(status, (52.5200, 13.4050))
            print(f"Anomaly ID: {anomaly['anomaly_id']}")
            print(f"Particle: {anomaly['solution']['particle']}")
            print(f"Creative Prompt: {anomaly['solution']['creative_prompt']}")
            break

if __name__ == "__main__":
    main()
