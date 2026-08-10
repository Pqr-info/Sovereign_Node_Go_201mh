import paramiko
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')
sftp = c.open_sftp()
sftp.get(r'C:\pqr.info\substrate-node-template\build3.log', r'd:\pqr.info\build3_current.log')
sftp.close()
c.close()
