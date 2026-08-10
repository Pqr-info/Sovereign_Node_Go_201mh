import urllib.request
import json
import sys

md_path = r'C:\Users\theal\.gemini\antigravity\brain\174beb6c-e8d5-46c2-936c-f1e37efe7d49\implementation_plan.md'
with open(md_path, 'r', encoding='utf-8') as f:
    md_content = f.read()

prompt = "Here is the implementation plan for surfgo.net. Please review it and provide architectural feedback:\n\n" + md_content

req = urllib.request.Request(
    'http://localhost:3456/api/copilot/chat',
    data=json.dumps({"prompt": prompt}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8').encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding))
except Exception as e:
    print(f"Failed: {e}")
