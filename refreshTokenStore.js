// refreshTokenStore.js
// Simpl
<truncated 10822 bytes>
9. ### Overview

A complete, deterministic implementation of **login**, **access JWT issuance**, **refresh token rotation**, and **logout** endpoints wired to a simple user store. Uses short‑lived access JWTs and server‑side refresh tokens stored via the existing `refreshTokenStore.js`. Includes secure cookie handling, password hashing, and example client flows.

---

### Files to add

- **`userStore.js`** — simple file‑backed user store with bcrypt password hashing.  
- **`jwtIssuer.js`** — helper to issue access JWTs.  
- **`authRoutes.js`** — Express routes: `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `POST /api/auth/revoke-refresh` (admin).  
- Reuses **`refreshTokenStore.js`** you already added.

---

### userStore.js
