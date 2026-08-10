import paramiko
import sys

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')
i,o,e = c.exec_command('wsl -d Ubuntu-22.04 -u root -e bash -c "tail -n 100 /mnt/c/pqr.info/substrate-node-template/build.log"')
sys.stdout.buffer.write(o.read())
