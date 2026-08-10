import paramiko
import sys
import os

print("Connecting to max...")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')

print("Extracting and compiling on max wsl (Ubuntu-22.04)...")
cmd = 'wsl -d Ubuntu-22.04 -u root -e bash -c "cd /mnt/c/pqr.info && tar -xzf substrate.tar.gz && cd substrate-node-template && apt update && DEBIAN_FRONTEND=noninteractive apt install -y clang libclang-dev protobuf-compiler cmake curl build-essential && curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source $HOME/.cargo/env && rustup default stable && rustup target add wasm32-unknown-unknown && cargo build --release"'
i,o,e = c.exec_command(cmd)

for line in iter(o.readline, ""):
    print(line, end="")
for line in iter(e.readline, ""):
    print("ERR:", line, end="")

print("Done!")
