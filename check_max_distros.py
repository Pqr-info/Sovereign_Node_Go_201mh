import paramiko
import sys
import os

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')
i,o,e = c.exec_command('wsl -l -v')
print('STDOUT:', o.read().decode('utf-16'))
print('STDERR:', e.read().decode('utf-16'))
