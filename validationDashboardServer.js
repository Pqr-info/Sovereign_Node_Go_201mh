---

### Security and UX notes

- **Access token storage**: kept in memory only to reduce XSS risk.  
- **Refresh token cookie**: `httpOnly` cookie is set by server; client uses `credentials: include`.  
- **Single-flight refresh**: prevents concurrent refresh requests.  
- **Retry semantics**: wrapper retries once after refresh to avoid duplicate side effects.  
- **Error handling**: surface clear messages to operators and clear in-memory token on refresh failure.  
- **WS token flow**: `fetchWsToken` uses `apiFetch` so it benefits from automatic refresh. Use `wss://` in production.

---

### Next steps

- Add a small `/api/me` endpoint if not present.  
- Replace any remaining demo header usage in the UI with the `apiFetch` wrapper and session/JWT auth.  
- Optionally add a small login redirect from the dashboard to `/login` when `apiFetch` returns 401 and refresh fails.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-07-09T02:46:31-05:00.
</ADDITIONAL_METADATA>

{{ CHECKPOINT 6 }}
 **The earlier parts of this conversation have been truncated due to its long length. The following content summarizes the truncated context so that you may continue your work. **


# User Requests
The following were user requests from the truncated conversation in chronological order:
1. ### Overview

A compact **wss TLS wrapper** to run the authenticated WebSocket broadcaster over TLS. This includes deterministic instructions to generate a self‑signed certificate for local testing, a TLS‑enabled Node server that upgrades authenticated WebSocket connections, a client connection example using `wss://`, and optional Nginx reverse proxy configuration for production TLS termination.

---

### Generate a self signed certificate for local testing

Run these commands on your dev machine to create a certificate and key. Save them under a secure directory such as `certs/`.
