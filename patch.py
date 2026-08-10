import re

with open("d:\\pqr.info\\imagefx\\anchor_proxy.py", "r") as f:
    code = f.read()

# 1. Update HTML_UI
html_addition = """    <img id="result" src="realphoto-dreamt.jpg" alt="Generated Output" style="display:none;" onload="this.style.display='inline'">
    
    <pre id="debugOutput" style="text-align: left; background: #222; color: #ff5555; padding: 10px; display: none; overflow-x: auto; font-size: 12px; margin-top: 20px;"></pre>"""
code = code.replace("""    <img id="result" src="realphoto-dreamt.jpg" alt="Generated Output" style="display:none;" onload="this.style.display='inline'">""", html_addition)

js_fetch_old = """                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt })
                });"""
js_fetch_new = """                const urlParams = new URLSearchParams(window.location.search);
                const isDebug = urlParams.has('debug');
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt, debug: isDebug })
                });"""
code = code.replace(js_fetch_old, js_fetch_new)

js_success_old = """                if (data.status === 'success') {"""
js_success_new = """                if (data.debugInfo) {
                    const dbg = document.getElementById('debugOutput');
                    dbg.textContent = data.debugInfo;
                    dbg.style.display = 'block';
                } else {
                    document.getElementById('debugOutput').style.display = 'none';
                }
                if (data.status === 'success') {"""
code = code.replace(js_success_old, js_success_new)


# 2. Update do_POST
post_start_old = """            try:
                req_json = json.loads(post_data.decode('utf-8'))
                prompt = req_json.get('prompt', 'cybernetic dog navigating a decentralized physical mesh network')
            except:
                prompt = 'cybernetic dog navigating a decentralized physical mesh network'

            print(f"\\n[ANCHOR] Requesting HD Flash CodeGen for: {prompt}")"""

post_start_new = """            try:
                req_json = json.loads(post_data.decode('utf-8'))
                prompt = req_json.get('prompt', 'cybernetic dog navigating a decentralized physical mesh network')
                isDebug = req_json.get('debug', False)
            except:
                prompt = 'cybernetic dog navigating a decentralized physical mesh network'
                isDebug = False

            debug_logs = []
            def log_debug(msg):
                print(msg)
                debug_logs.append(str(msg))

            log_debug(f"\\n[ANCHOR] Requesting HD Flash CodeGen for: {prompt}")"""
code = code.replace(post_start_old, post_start_new)

# Replace print with log_debug in do_POST
def replace_prints(match):
    return match.group(0).replace('print(', 'log_debug(')

parts = code.split('def log_debug(msg):')
if len(parts) == 2:
    parts[1] = re.sub(r'print\([^)]+\)', replace_prints, parts[1])
    parts[1] = parts[1].replace('log_debug(msg)', 'print(msg)', 1)
    parts[1] = parts[1].replace('log_debug("ANCHOR_BACKEND_ONLINE_ON_PORT_80", flush=True)', 'print("ANCHOR_BACKEND_ONLINE_ON_PORT_80", flush=True)')
    code = parts[0] + 'def log_debug(msg):' + parts[1]

# 3. Update the return JSON
return_old = """            self.wfile.write(b'{"status": "success", "image": "realphoto-dreamt.jpg"}')"""
return_new = """            resp_data = {"status": "success", "image": "realphoto-dreamt.jpg"}
            if isDebug:
                resp_data["debugInfo"] = "\\n".join(debug_logs)
            self.wfile.write(json.dumps(resp_data).encode('utf-8'))"""
code = code.replace(return_old, return_new)

with open("d:\\pqr.info\\imagefx\\anchor_proxy.py", "w") as f:
    f.write(code)

print("Patch applied")
