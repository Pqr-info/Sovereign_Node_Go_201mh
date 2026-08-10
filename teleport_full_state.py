import os
import zipfile
import paramiko
import sys

mission_id = "174beb6c-e8d5-46c2-936c-f1e37efe7d49"
local_dir = f"C:\\Users\\theal\\.gemini\\antigravity\\brain\\{mission_id}"
zip_path = f"C:\\Users\\theal\\{mission_id}.zip"
remote_zip_path = f"C:\\Users\\aellok\\{mission_id}.zip"
remote_brain_dir = f"C:\\Users\\aellok\\.gemini\\antigravity\\brain\\{mission_id}"

print("Zipping local conversation state...")
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(local_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, local_dir)
            zipf.write(full_path, rel_path)

print("Connecting to max (192.168.12.234)...")
try:
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('192.168.12.234', username='aellok', password='m3sh')
    
    print("Uploading conversation state...")
    sftp = c.open_sftp()
    sftp.put(zip_path, remote_zip_path)
    sftp.close()
    
    print("Extracting on max...")
    cmd1 = f'powershell.exe -Command "Expand-Archive -Path \'{remote_zip_path}\' -DestinationPath \'{remote_brain_dir}\' -Force"'
    stdin, stdout, stderr = c.exec_command(cmd1)
    err = stderr.read().decode().strip()
    if err: print("Extract Error:", err)
    
    print("Launching UI...")
    cmd2 = f'explorer.exe "antigravity://conversation/{mission_id}"'
    c.exec_command(cmd2)
    print("Teleportation complete!")
except Exception as e:
    print("Failed to teleport full state:", e)
