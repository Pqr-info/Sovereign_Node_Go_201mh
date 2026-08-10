package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		html := `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SpaceBook 5D (HTMX Prototype)</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <style>
        body { background: #000; color: #fff; font-family: 'Inter', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); }
    </style>
</head>
<body>
    <div class="glass" style="max-width: 600px; margin: 4rem auto;">
        <h1>SpaceBook 5D</h1>
        <p>Go HTMX prototype. Click to verify mesh connection:</p>
        <button hx-post="/ping" hx-target="#result">Ping Mesh</button>
        <div id="result" style="margin-top: 1rem;"></div>
    </div>
</body>
</html>`
		fmt.Fprint(w, html)
	})

	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "<span style='color: #4ade80;'>Pong from Zeta.mh Mesh Node (Go backend)</span>")
	})

	fmt.Println("HTMX UI Prototype running on :8080")
	http.ListenAndServe(":8080", nil)
}
