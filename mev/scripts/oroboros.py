import subprocess
import time
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python oroboros.py <command>")
        sys.exit(1)
    
    command = sys.argv[1:]
    print(f"[Oroboros] Tracking command: {' '.join(command)}")
    
    while True:
        try:
            print("[Oroboros] Starting process...")
            process = subprocess.Popen(command)
            process.wait()
            print(f"[Oroboros] Process exited with code {process.returncode}. Restarting in 5 seconds...")
            time.sleep(5)
        except KeyboardInterrupt:
            print("[Oroboros] Terminating...")
            break
        except Exception as e:
            print(f"[Oroboros] Error: {e}. Restarting in 5 seconds...")
            time.sleep(5)

if __name__ == '__main__':
    main()
