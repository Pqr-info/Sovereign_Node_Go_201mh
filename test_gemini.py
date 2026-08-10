import urllib.request
import json
import ssl

api_key = "AQ.Ab8RN6L0-vfJfg-nrDnItH99hlP17PyNQRmp1Eo9t_MW070ZuA"
models = [
    'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash-8b',
    'gemini-1.0-pro', 'gemini-pro', 'gemini-2.0-flash',
    'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.5-flash',
    'gemini-omni-flash-preview', 'gemini-3.1-flash-lite',
    'gemini-2.0-flash-lite-001'
]

payload = json.dumps({
    "contents": [{"parts": [{"text": "Hello, how are you?"}]}],
    "generationConfig": {"temperature": 0.7, "maxOutputTokens": 256}
}).encode('utf-8')
headers = {'Content-Type': 'application/json'}

for model in models:
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}'
    req = urllib.request.Request(url, data=payload, headers=headers)
    print(f"Testing {model}...")
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            print(f"  SUCCESS! {response.read().decode()[:50]}")
    except urllib.error.HTTPError as e:
        print(f"  HTTP Error {e.code}: {e.reason}")
    except Exception as e:
        print(f"  Error: {e}")
