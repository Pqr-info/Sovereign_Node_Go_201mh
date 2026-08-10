import paramiko
import sys

try:
    print("Connecting to max (192.168.12.234) to teleport session...")
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('192.168.12.234', username='aellok', password='m3sh')
    
    # Launch the Antigravity Windows Client via the custom URI protocol
    cmd = 'powershell.exe -Command "Start-Process \'antigravity://conversation/174beb6c-e8d5-46c2-936c-f1e37efe7d49\'"'
    stdin, stdout, stderr = c.exec_command(cmd)
    
    error = stderr.read().decode().strip()
    if error:
        print("Error launching client:", error)
    else:
        print("Successfully launched Antigravity client on max!")
        
except Exception as e:
    print("Failed to teleport:", e)
