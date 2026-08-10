import paramiko
import sys
import os

print("Connecting to max...")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')

print("Fixing apt and installing on max wsl (Ubuntu-22.04)...")
cmd = 'wsl -d Ubuntu-22.04 -u root -e bash -c "dpkg --configure -a && apt update && DEBIAN_FRONTEND=noninteractive apt install -y clang libclang-dev protobuf-compiler cmake curl build-essential && curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y > install.log 2>&1 && source $HOME/.cargo/env && rustup default stable && rustup target add wasm32-unknown-unknown"'
i,o,e = c.exec_command(cmd)
print("Exit status install:", o.channel.recv_exit_status())

print("Building...")
cmd2 = 'wsl -d Ubuntu-22.04 -u root -e bash -c "cd /mnt/c/pqr.info/substrate-node-template && source $HOME/.cargo/env && cargo build --release > build.log 2>&1"'
i,o,e = c.exec_command(cmd2)

print("Exit status build:", o.channel.recv_exit_status())

# Print last 100 lines of log
cmd3 = 'wsl -d Ubuntu-22.04 -u root -e bash -c "tail -n 100 /mnt/c/pqr.info/substrate-node-template/build.log"'
i,o,e = c.exec_command(cmd3)
print("Log end:", o.read().decode('utf-8', errors='ignore'))
