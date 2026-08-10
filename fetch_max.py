import paramiko

def run():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('192.168.12.234', username='aellok', password='m3sh')
    
    # Get mesh_os_core.js
    i, o, e = c.exec_command('type C:\\pqr.info\\mev\\atlas-ui\\mesh_os_core.js')
    with open('D:\\pqr.info\\max_mesh_os_core.js', 'w', encoding='utf-8') as f:
        f.write(o.read().decode())
    
    # Get server.js
    i, o, e = c.exec_command('type C:\\pqr.info\\mev\\atlas-ui\\server.js')
    with open('D:\\pqr.info\\max_server.js', 'w', encoding='utf-8') as f:
        f.write(o.read().decode())
        
    # Get index_fs.js
    i, o, e = c.exec_command('type C:\\pqr.info\\index_fs.js')
    with open('D:\\pqr.info\\max_index_fs.js', 'w', encoding='utf-8') as f:
        f.write(o.read().decode())

if __name__ == '__main__':
    run()
