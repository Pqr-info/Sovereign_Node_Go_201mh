import paramiko

try:
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('192.168.12.234', username='aellok', password='m3sh')
    
    stdin, stdout, stderr = c.exec_command('cmd.exe /c dir C:\\Users')
    print("Users:", stdout.read().decode().strip())
    
    stdin, stdout, stderr = c.exec_command('cmd.exe /c dir C:\\Users\\aellok\\.gemini')
    print(".gemini:", stdout.read().decode().strip())
except Exception as e:
    print(e)
