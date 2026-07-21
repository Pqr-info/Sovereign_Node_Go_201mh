# The Identity & Access Control Backbone of the Sovereign Mesh
The PQR Identity Fabric governs authentication, authorization, and secure crossboundary communication for the Sovereign Node. It ensures that only verified entities can interact with the Mesh while enabling the Node to safely interface with the global enterprise ecosystem.
🔐 SAML Identity Provider (IdP)
The Sovereign Node operates as a standalone SAML Identity Provider, enabling federated authentication across internal and external systems.
Endpoints
Metadata URL: https://pqr.info/saml/metadata
SSO URL: https://pqr.info/saml/sso
Certificate: Selfsigned RSA2048 (stored securely in Vault)
🔄 Autonomous Certificate Rotation
The MonitoringService performs continuous certificate health checks (every 60 seconds). If the certificate is within 7 days of expiration, the HealingService initiates an autonomous rotation:
Generate a new RSA2048 Key/Cert pair
Store the new pair in Vault
Reload the live AuthService inmemory without downtime
This ensures uninterrupted authentication and zerotrust continuity.
🧱 Cloudflare Access Bypass
The pqr.info domain is protected by Cloudflare Access, enforcing identityaware zerotrust boundaries.
To allow internal Mesh components (especially Healing Agents) to perform external health checks, the system uses Service Tokens stored in Vault.
Service Token Credentials (VaultStored)
CFAccessClientId: c98ca7026f54305b05cd24975a3ce6d2.access
CFAccessClientSecret: ebf3177d992adb0c3db7b088fb5b9e3d83e96649fb9bc5b86a25301af5c8e744
Usage
Every outbound request from the Monitoring Service to pqr.info automatically injects:
Code
CF-Access-Client-Id: <id>
CF-Access-Client-Secret: <secret>
This allows the request to pierce the Cloudflare Access wall for:
forensic probing
uptime verification
certificate checks
external health diagnostics
All without exposing credentials or weakening the zerotrust perimeter.
This version is ready for ingestion by your import script.