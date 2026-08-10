import paramiko

mission_id = "174beb6c-e8d5-46c2-936c-f1e37efe7d49"
remote_zip_path = f"C:\\Users\\aellok\\{mission_id}.zip"
remote_brain_dir = f"C:\\Users\\aellok\\.gemini\\antigravity\\brain\\{mission_id}"

try:
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('192.168.12.234', username='aellok', password='m3sh')
    
    python_cmd = f"""
import zipfile
import os
os.makedirs(r'{remote_brain_dir}', exist_ok=True)
with zipfile.ZipFile(r'{remote_zip_path}', 'r') as zip_ref:
    zip_ref.extractall(r'{remote_brain_dir}')
print("Extracted successfully with python!")
"""
    
    cmd2 = f'python -c "{python_cmd.replace(chr(10), ";").replace(";;", ";")}"'
    stdin, stdout, stderr = c.exec_command(cmd2)
    err = stderr.read().decode().strip()
    out = stdout.read().decode().strip()
    if err: print("Extract Error:", err)
    if out: print("Out:", out)
    
    print("Launching UI...")
    cmd3 = f'explorer.exe "antigravity://conversation/{mission_id}"'
    c.exec_command(cmd3)
    print("Done!")
except Exception as e:
    print("Failed to teleport:", e)
