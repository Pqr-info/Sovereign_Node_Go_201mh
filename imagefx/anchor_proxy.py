import http.server
import socketserver
import json
import os
import base64
import urllib.request
import urllib.error
import urllib.parse
import re
import subprocess
import uuid
import shutil

PORT = 80
DIRECTORY = '/app/media'
API_KEY = os.environ.get('GEMINI_API_KEY', '')

HTML_UI = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ImageFX Sovereign Node</title>
    <style>
        body { font-family: monospace; background-color: #121212; color: #00ff00; text-align: center; padding: 20px; }
        input[type="text"] { width: 90%; max-width: 600px; padding: 15px; margin: 20px 0; background: #222; border: 1px solid #00ff00; color: #00ff00; font-family: monospace; }
        button { padding: 15px 30px; background: #00ff00; color: #121212; border: none; cursor: pointer; font-weight: bold; font-family: monospace; margin: 5px; }
        button:hover { background: #00cc00; }
        #dlBtn { background: #0088ff; color: #ffffff; }
        #dlBtn:hover { background: #0066cc; }
        img { max-width: 100%; margin-top: 30px; border: 1px solid #333; }
        .loader { display: none; margin-top: 20px; color: #ffaa00; }
        select, input[type="checkbox"] { background: #222; border: 1px solid #00ff00; color: #00ff00; font-family: monospace; padding: 10px; margin: 10px; }
        .controls { margin-bottom: 20px; }
    </style>
</head>
<body>
    <h2>ImageFX [HD Flash CodeGen Pipeline]</h2>
    <input type="text" id="prompt" placeholder="Enter generation prompt..." value="cybernetic dog navigating a decentralized physical mesh network">
    <div class="controls">
        <label for="aspectRatio">Aspect Ratio: </label>
        <select id="aspectRatio">
            <option value="square" selected>Square (1:1)</option>
            <option value="widescreen">Widescreen (16:9)</option>
            <option value="portrait">Portrait (9:16)</option>
        </select>
        &nbsp;&nbsp;&nbsp;
        <input type="checkbox" id="enhanceDetail" checked>
        <label for="enhanceDetail">Masterpiece Details</label>
    </div>
    <br>
    <button onclick="generateImage()">EXECUTE RENDER</button>
    <button id="dlBtn" style="display:none;" onclick="downloadRender()">SAVE TO DEVICE</button>
    <div id="loader" class="loader">Generating code & rendering HD image... Please wait.</div>
    <br>
    <img id="result" src="realphoto-dreamt.jpg" alt="Generated Output" style="display:none;" onload="this.style.display='inline'">
    
    <pre id="debugOutput" style="text-align: left; background: #222; color: #ff5555; padding: 10px; display: none; overflow-x: auto; font-size: 12px; margin-top: 20px;"></pre>
    
    <div style="margin-top: 20px; font-size: 12px; color: #888; max-width: 600px; margin-left: auto; margin-right: auto;">
        <p><i>Note: We will be minting an NFT from the generated image and the owner of the NFT is the owner of the copyright. Any NFTs not purchased become the intellectual property of pqr.info.</i></p>
    </div>

    <script>
        async function generateImage() {
            const prompt = document.getElementById('prompt').value;
            const aspectRatio = document.getElementById('aspectRatio').value;
            const enhanceDetail = document.getElementById('enhanceDetail').checked;
            const loader = document.getElementById('loader');
            const img = document.getElementById('result');
            const dlBtn = document.getElementById('dlBtn');
            
            loader.style.display = 'block';
            img.style.opacity = '0.3';
            dlBtn.style.display = 'none';

            try {
                const urlParams = new URLSearchParams(window.location.search);
                const isDebug = urlParams.has('debug');
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt, aspectRatio: aspectRatio, enhanceDetail: enhanceDetail, debug: isDebug })
                });
                const data = await response.json();
                
                if (data.debugInfo) {
                    const dbg = document.getElementById('debugOutput');
                    dbg.textContent = data.debugInfo;
                    dbg.style.display = 'block';
                } else {
                    document.getElementById('debugOutput').style.display = 'none';
                }
                if (data.status === 'success') {
                    img.src = data.image + '?t=' + new Date().getTime();
                    img.style.display = 'inline';
                    dlBtn.style.display = 'inline-block';
                } else {
                    alert('Generation routing failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Network connection error');
            } finally {
                loader.style.display = 'none';
                img.style.opacity = '1';
            }
        }

        function downloadRender() {
            const prompt = document.getElementById('prompt').value;
            const safeName = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 40);
            const timestamp = new Date().getTime();
            const filename = 'imagefx_' + safeName + '_' + timestamp + '.jpg';
            
            const a = document.createElement('a');
            a.href = document.getElementById('result').src;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    </script>
</body>
</html>"""

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        if not os.path.exists(DIRECTORY):
            os.makedirs(DIRECTORY)
        super().__init__(*args, directory=DIRECTORY, **kwargs)
        
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path).path
        if parsed_path in ['', '/', '/index.html']:
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(HTML_UI.encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path).path
        if parsed_path == '/generate':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                req_json = json.loads(post_data.decode('utf-8'))
                prompt = req_json.get('prompt', 'cybernetic dog navigating a decentralized physical mesh network')
                aspectRatio = req_json.get('aspectRatio', 'square')
                enhanceDetail = req_json.get('enhanceDetail', True)
                isDebug = req_json.get('debug', False)
            except:
                prompt = 'cybernetic dog navigating a decentralized physical mesh network'
                aspectRatio = 'square'
                enhanceDetail = True
                isDebug = False

            debug_logs = []
            def log_debug(msg):
                print(msg)
                debug_logs.append(str(msg))

            if aspectRatio == 'widescreen':
                width, height = 1280, 720
            elif aspectRatio == 'portrait':
                width, height = 720, 1280
            else:
                width, height = 1080, 1080
            
            actual_prompt = prompt
            if enhanceDetail:
                actual_prompt = f"{prompt}, (masterpiece:1.2, highly detailed:1.2, ultra-sharp, vivid lighting, digital art, intricate textures)"

            log_debug(f"\n[ANCHOR] Requesting HD Flash CodeGen for: {actual_prompt}")

            sys_prompt = f"Write a complete valid Python script that generates a photorealistic digital art representation of '{actual_prompt}' by downloading it from the Pollinations.ai API. Construct the URL as 'https://image.pollinations.ai/prompt/[URL_ENCODED_PROMPT]?width={width}&height={height}&nologo=true'. Use urllib.request with a 'User-Agent: Mozilla/5.0' header to download it. CRITICAL REQUIREMENTS: 1. SCRIPT MUST FAIL FAST: If the download fails, print an error and exit with a non-zero status without attempting watermarking. 2. WATERMARKING: After successfully downloading, you MUST use the 'PIL' (Pillow) library to open the image. Use ImageDraw and ImageFont (use a default font or arial) to render the text 'Copyright 2026 pqr.info' in the bottom right corner. Render the text TWICE: first in black at offset (x+2, y+2) for a drop shadow, then in white at (x,y). Save the final watermarked image strictly as 'gemini_render.jpg' (always as JPEG). Only output python code."

            payload = json.dumps({
                "contents": [{"parts": [{"text": sys_prompt}]}],
                "generationConfig": {"responseMimeType": "text/plain"}
            }).encode('utf-8')
            
            headers = {
                'Content-Type': 'application/json',
                'X-goog-api-key': API_KEY
            }
            req = urllib.request.Request(url, data=payload, headers=headers)
            fallback_path = os.path.join(DIRECTORY, 'realphoto-dreamt.jpg')
            success = False

            try:
                with urllib.request.urlopen(req, timeout=60) as response:
                    raw_resp = response.read().decode()
                    res_data = json.loads(raw_resp)
                    code_script = None
                    try:
                        if 'candidates' in res_data:
                            content_text = res_data['candidates'][0]['content']['parts'][0]['text']
                            match = re.search(r'```python\n?(.*?)\n?```', content_text, re.DOTALL | re.IGNORECASE)
                            if match:
                                code_script = match.group(1).strip()
                            else:
                                cleaned = content_text.replace('```python', '').replace('```', '')
                                code_script = cleaned.strip()
                    except Exception as parse_e:
                         log_debug(f"[ANCHOR_ERROR] Script parsing failed: {parse_e}")
                         
                    if code_script:
                        script_name = f"render_{uuid.uuid4().hex[:8]}.py"
                        render_path = 'gemini_render.jpg'
                        if os.path.exists(render_path):
                            os.remove(render_path)
                        with open(script_name, 'w') as f:
                            f.write(code_script)
                            
                        try:
                            result = subprocess.run(['python3', script_name], capture_output=True, text=True, timeout=30)
                            log_debug(f"[SCRIPT_STDOUT] {result.stdout}")
                            if result.returncode == 0 and os.path.exists(render_path):
                                shutil.move(render_path, fallback_path)
                                success = True
                                log_debug("[ANCHOR] HD Flash script executed successfully and image rendered")
                            else:
                                log_debug(f"[ANCHOR_ERROR] Script Execution Failed Return Code {result.returncode}")
                                log_debug(f"[SCRIPT_STDERR] {result.stderr}")
                                log_debug(f"Render path exists: {os.path.exists(render_path)}")
                        except subprocess.TimeoutExpired:
                            log_debug("[ANCHOR_ERROR] Script execution timed out")
                        finally:
                            if os.path.exists(script_name):
                                os.remove(script_name)
                    else:
                        log_debug("[ANCHOR_ERROR] No valid Python code extracted")
            except urllib.error.HTTPError as e:
                log_debug(f"[ANCHOR_ERROR] Flash API Request failed: {e}")
                try:
                    log_debug(f"[ANCHOR_ERROR] Details: {e.read().decode('utf-8')}")
                except:
                    pass
            except Exception as e:
                log_debug(f"[ANCHOR_ERROR] Flash API Request failed: {e}")
                
            if not success:
                log_debug("[ANCHOR] Falling back to 1x1 diagnostic JPEG")
                valid_jpeg_b64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
                with open(fallback_path, 'wb') as f:
                    f.write(base64.b64decode(valid_jpeg_b64))

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            resp_data = {"status": "success", "image": "realphoto-dreamt.jpg"}
            if isDebug:
                resp_data["debugInfo"] = "\n".join(debug_logs)
            self.wfile.write(json.dumps(resp_data).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
            
class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(('0.0.0.0', PORT), ProxyHandler) as httpd:
    print("ANCHOR_BACKEND_ONLINE_ON_PORT_80", flush=True)
    httpd.serve_forever()
