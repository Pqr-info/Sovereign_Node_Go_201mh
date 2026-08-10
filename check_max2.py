import paramiko
import sys

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')
i,o,e = c.exec_command('wsl -e bash -c "find /mnt/c/pqr.info /mnt/d/pqr.info -type d -name \'pallet-time-machine\' -o -name \'jetweb-time-machine\' 2>/dev/null"')
print('STDOUT:', o.read().decode())
print('STDERR:', e.read().decode())
