import paramiko
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')
i,o,e = c.exec_command('powershell -Command "Get-ChildItem -Path C:\\Users\\theal,C:\\pqr.info -Recurse -Filter index_fs.js -ErrorAction SilentlyContinue | Select-Object FullName"')
print('STDOUT:', o.read().decode())
print('STDERR:', e.read().decode())
