import paramiko

print("Connecting to max...")
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')
sftp = c.open_sftp()
local_path = r'd:\pqr.info\substrate-node-template\runtime\src\lib.rs'
remote_path = r'C:\pqr.info\substrate-node-template\runtime\src\lib.rs'
print("Uploading lib.rs to max...")
sftp.put(local_path, remote_path)
sftp.close()
c.close()
print("Done!")
