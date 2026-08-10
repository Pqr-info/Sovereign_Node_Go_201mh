import os, tarfile, paramiko, sys

print('Archiving locally...')
with tarfile.open('d:\\pqr.info\\update.tar.gz', 'w:gz') as tar:
    tar.add('d:\\pqr.info\\SUBSTRATE\\pallet-5d-hcp', arcname='SUBSTRATE/pallet-5d-hcp')
    tar.add('d:\\pqr.info\\SUBSTRATE\\pallet-imagefx-nft', arcname='SUBSTRATE/pallet-imagefx-nft')
    tar.add('d:\\pqr.info\\substrate-node-template\\runtime', arcname='substrate-node-template/runtime')
    tar.add('d:\\pqr.info\\substrate-node-template\\node', arcname='substrate-node-template/node')

print('Connecting to max...')
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')
sftp = c.open_sftp()
print('Uploading archive...')
sftp.put('d:\\pqr.info\\update.tar.gz', 'C:\\pqr.info\\update.tar.gz')
sftp.close()

print('Extracting and compiling on max wsl (Ubuntu-22.04)...')
cmd = 'wsl -d Ubuntu-22.04 -u root -e bash -c "cd /mnt/c/pqr.info && tar -xzf update.tar.gz && cd substrate-node-template && source $HOME/.cargo/env && cargo build --release > build3.log 2>&1"'
i,o,e = c.exec_command(cmd)
print('Exit status build:', o.channel.recv_exit_status())

cmd3 = 'wsl -d Ubuntu-22.04 -u root -e bash -c "tail -n 50 /mnt/c/pqr.info/substrate-node-template/build3.log"'
i,o,e = c.exec_command(cmd3)
sys.stdout.buffer.write(o.read())
c.close()
