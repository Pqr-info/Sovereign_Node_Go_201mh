import paramiko
import sys
import os

print("Connecting to max...")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')

print("Compiling on max wsl...")
cmd = 'wsl -e bash -c "cd /mnt/c/pqr.info/substrate-node-template && cargo build --release"'
i,o,e = c.exec_command(cmd)

# Print output in real-time
for line in iter(o.readline, ""):
    print(line, end="")
for line in iter(e.readline, ""):
    print("ERR:", line, end="")

print("Done!")
