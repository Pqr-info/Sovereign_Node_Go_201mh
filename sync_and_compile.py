import paramiko
import sys
import os

print("Connecting to max...")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')

print("Uploading substrate.tar.gz...")
sftp = c.open_sftp()
sftp.put('d:\\pqr.info\\substrate.tar.gz', 'C:\\pqr.info\\substrate.tar.gz')
sftp.close()

print("Extracting and compiling on max wsl...")
# Untar inside WSL to /mnt/c/pqr.info/
# Then run cargo build --release
cmd = 'wsl -e bash -c "cd /mnt/c/pqr.info && tar -xzf substrate.tar.gz && cd substrate-node-template && source ~/.cargo/env && cargo build --release"'
i,o,e = c.exec_command(cmd)

# Print output in real-time
for line in iter(o.readline, ""):
    print(line, end="")
for line in iter(e.readline, ""):
    print("ERR:", line, end="")

print("Done!")
