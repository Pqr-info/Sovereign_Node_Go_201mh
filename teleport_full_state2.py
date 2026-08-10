import paramiko
import sys

mission_id = "174beb6c-e8d5-46c2-936c-f1e37efe7d49"
remote_zip_path = f"C:\\Users\\aellok\\{mission_id}.zip"
remote_brain_dir = f"C:\\Users\\aellok\\.gemini\\antigravity\\brain\\{mission_id}"

try:
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('192.168.12.234', username='aellok', password='m3sh')
    
    print("Creating directory...")
    cmd1 = f'powershell.exe -Command "New-Item -ItemType Directory -Force -Path \'{remote_brain_dir}\'"'
    stdin, stdout, stderr = c.exec_command(cmd1)
    
    print("Extracting...")
    cmd2 = f'powershell.exe -Command "Expand-Archive -Path \'{remote_zip_path}\' -DestinationPath \'{remote_brain_dir}\' -Force"'
    stdin, stdout, stderr = c.exec_command(cmd2)
    err = stderr.read().decode().strip()
    if err: print("Extract Error:", err)
    
    print("Launching UI...")
    cmd3 = f'explorer.exe "antigravity://conversation/{mission_id}"'
    c.exec_command(cmd3)
    print("Done!")
except Exception as e:
    print("Failed to teleport:", e)
