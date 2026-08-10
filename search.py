import os
for root, dirs, files in os.walk('C:/pqr.info'):
    for file in files:
        if file.endswith(('.py', '.ps1', '.sh', '.json', '.md', '.toml', '.js')):
            try:
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    if 'oroboros' in f.read().lower():
                        print(os.path.join(root, file))
            except:
                pass
