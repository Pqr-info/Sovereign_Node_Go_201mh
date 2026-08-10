import paramiko
import sys

mission_id = "174beb6c-e8d5-46c2-936c-f1e37efe7d49"
remote_zip_path = f"C:\\Users\\aellok\\{mission_id}.zip"
remote_brain_dir = f"C:\\Users\\aellok\\.gemini\\antigravity\\brain\\{mission_id}"

try:
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('192.168.12.234', username='aellok', password='m3sh')
    
    print("Checking home directory...")
    cmd1 = 'cmd.exe /c "echo %USERPROFILE%"'
    stdin, stdout, stderr = c.exec_command(cmd1)
    userprofile = stdout.read().decode().strip()
    print("Remote USERPROFILE:", userprofile)
    
    remote_brain_dir_correct = f"{userprofile}\\.gemini\\antigravity\\brain\\{mission_id}"
    
    print("Creating directory...")
    cmd2 = f'cmd.exe /c "mkdir {remote_brain_dir_correct}"'
    c.exec_command(cmd2)
    
    print("Extracting with tar...")
    cmd3 = f'tar -xf {remote_zip_path} -C {remote_brain_dir_correct}'
    stdin, stdout, stderr = c.exec_command(cmd3)
    err = stderr.read().decode().strip()
    if err: print("Extract Error:", err)
    
    print("Launching UI...")
    cmd4 = f'explorer.exe "antigravity://conversation/{mission_id}"'
    c.exec_command(cmd4)
    print("Done!")
except Exception as e:
    print("Failed to teleport:", e)
