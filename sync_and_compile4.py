import paramiko
import sys
import os

print("Connecting to max...")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')

print("Uploading substrate2.tar.gz...")
sftp = c.open_sftp()
sftp.put('d:\\pqr.info\\substrate2.tar.gz', 'C:\\pqr.info\\substrate2.tar.gz')
sftp.close()

print("Extracting and compiling on max wsl (Ubuntu-22.04)...")
cmd = 'wsl -d Ubuntu-22.04 -u root -e bash -c "cd /mnt/c/pqr.info && tar -xzf substrate2.tar.gz && cd substrate-node-template && source $HOME/.cargo/env && cargo build --release > build.log 2>&1"'
i,o,e = c.exec_command(cmd)

print("Exit status build:", o.channel.recv_exit_status())

# Print last 50 lines of log
cmd3 = 'wsl -d Ubuntu-22.04 -u root -e bash -c "tail -n 50 /mnt/c/pqr.info/substrate-node-template/build.log"'
i,o,e = c.exec_command(cmd3)
print("Log end:", o.read().decode('utf-8', errors='ignore'))
