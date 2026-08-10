import json
import sys
from bs4 import BeautifulSoup

try:
    with open(r'C:\Users\theal\.gemini\antigravity\scratch\copilot_dom_response.json', 'r', encoding='utf-16') as f:
        data = json.load(f)
        
    html = data.get('dom', '')
    soup = BeautifulSoup(html, 'html.parser')
    
    # In Copilot, the messages are usually in cib-message elements, but Shadow DOM might be an issue.
    # However, if gemma-cobrowser returns the flattened DOM or just text, we can extract it.
    # Let's just print all the text in the body.
    text = soup.get_text(separator='\n')
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    print("\n".join(lines[-100:]))
except Exception as e:
    print(f"Error: {e}")
