import paramiko
import sys

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')
i,o,e = c.exec_command('wsl -d Ubuntu-22.04 -u root -e bash -c "ls -la /mnt/c/pqr.info/qwen"')
print(o.read().decode('utf-8', errors='ignore'))
print("ERR:", e.read().decode('utf-8', errors='ignore'))
