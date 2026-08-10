import paramiko
import json
import os

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('192.168.12.234', username='aellok', password='m3sh')

sftp = c.open_sftp()
max_base = 'C:/Users/theal/.gemini/config/plugins/shared_brain/skills'
ted_base = 'C:/Users/theal/.gemini/config/plugins/shared_brain/skills'

def sync_dir(remote_path, local_path):
    if not os.path.exists(local_path):
        os.makedirs(local_path)
    
    for item in sftp.listdir_attr(remote_path):
        remote_item = remote_path + '/' + item.filename
        local_item = os.path.join(local_path, item.filename)
        
        # We only want to copy .js and .jsx files (and skip SKILL.md since we already have them)
        if item.st_mode & 0o40000: # Directory
            sync_dir(remote_item, local_item)
        elif item.filename.endswith('.js') or item.filename.endswith('.jsx'):
            print(f"Copying {remote_item} to {local_item}")
            sftp.get(remote_item, local_item)

sync_dir(max_base, ted_base)
sftp.close()
c.close()
print("Done syncing JS/JSX files from Max!")
