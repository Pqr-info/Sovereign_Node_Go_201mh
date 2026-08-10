import paramiko
import sys
import os

print("Connecting to max...")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')

print("Adding rust-src and compiling on max wsl (Ubuntu-22.04)...")
cmd = 'wsl -d Ubuntu-22.04 -u root -e bash -c "cd /mnt/c/pqr.info/substrate-node-template && source $HOME/.cargo/env && rustup component add rust-src && cargo build --release > build2.log 2>&1"'
i,o,e = c.exec_command(cmd)

print("Exit status build:", o.channel.recv_exit_status())

# Print last 50 lines of log
cmd3 = 'wsl -d Ubuntu-22.04 -u root -e bash -c "tail -n 50 /mnt/c/pqr.info/substrate-node-template/build2.log"'
i,o,e = c.exec_command(cmd3)
sys.stdout.buffer.write(o.read())
