import http.server, socketserver, ssl, threading, os

os.chdir("/root/web_root")
Handler = http.server.SimpleHTTPRequestHandler

# HTTP Server on Port 80
def run_http():
    with socketserver.TCPServer(("0.0.0.0", 80), Handler) as httpd:
        httpd.serve_forever()

# HTTPS Server on Port 443
def run_https():
    with socketserver.TCPServer(("0.0.0.0", 443), Handler) as httpsd:
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(certfile="/root/cert.pem", keyfile="/root/key.pem")
        httpsd.socket = context.wrap_socket(httpsd.socket, server_side=True)
        httpsd.serve_forever()

threading.Thread(target=run_http, daemon=True).start()
run_https()
