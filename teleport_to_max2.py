import paramiko

try:
    print("Connecting to max (192.168.12.234) to teleport session...")
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('192.168.12.234', username='aellok', password='m3sh')
    
    cmd = 'explorer.exe "antigravity://conversation/174beb6c-e8d5-46c2-936c-f1e37efe7d49"'
    stdin, stdout, stderr = c.exec_command(cmd)
    
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    print("Out:", out)
    print("Err:", err)
        
except Exception as e:
    print("Failed to teleport:", e)
