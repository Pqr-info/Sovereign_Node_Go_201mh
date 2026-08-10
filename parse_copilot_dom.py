import json
import sys

def extract_text(node):
    text = ""
    if node.get("nodeType") == 3: # Text node
        return node.get("nodeValue", "").strip()
    
    if "children" in node:
        for child in node["children"]:
            t = extract_text(child)
            if t:
                text += t + "\n"
    
    # Check shadow root
    if "shadowRoot" in node:
        t = extract_text(node["shadowRoot"])
        if t:
            text += t + "\n"
            
    return text.strip()

try:
    with open(r'C:\Users\theal\.gemini\antigravity\scratch\copilot_dom_response.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Find all text and print the last 2000 characters
    all_text = extract_text(data.get("root", {}))
    
    if all_text:
        # Copilot DOM is huge. We just want the most recent messages.
        # We can split by newline and take the last 50 non-empty lines.
        lines = [line.strip() for line in all_text.split('\n') if line.strip()]
        print("\n".join(lines[-50:]))
    else:
        print("No text extracted.")
except Exception as e:
    print(f"Error: {e}")
