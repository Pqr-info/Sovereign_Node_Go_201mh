import glob

go_files = glob.glob('**/*.go', recursive=True)
count = 0
for f in go_files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        new_content = content
        new_content = new_content.replace('"github.com/pqr-info/substrate/proto"', '"pqr.info/proto"')
        new_content = new_content.replace('"github.com/pqr-info/sovereign_mesh/connectors"', '"pqr.info/connectors"')
        new_content = new_content.replace('"pqr.info/tools/substrate27/go/substrate27"', '"pqr.info/SUBSTRATE/tooling"')
        new_content = new_content.replace('"github.com/pqr-info/substrate', '"pqr.info/SUBSTRATE')

        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            count += 1
    except Exception:
        pass
print(f'Updated {count} files')
