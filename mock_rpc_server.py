import http.server
import socketserver
import json

class SimpleHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        print(f"\n--- RECEIVED POST TO {self.path} ---")
        print("Headers:")
        print(self.headers)
        print("Body:")
        print(post_data.decode('utf-8'))
        print("--------------------------------------\n")
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"status": "success", "message": "RPC execute acknowledged by mock server"}
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Listening...")

PORT = 8080
with socketserver.TCPServer(("", PORT), SimpleHTTPRequestHandler) as httpd:
    print(f"Serving mock RPC on port {PORT}")
    httpd.serve_forever()
