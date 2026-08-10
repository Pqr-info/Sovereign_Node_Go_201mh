# PQR Info Swarm VS Code Extension

`pqr-extension` is the editor integration sidecar of the PQR sovereign node ticketing system. It exposes command controls and visualizers directly inside VS Code to help developers track agent memory, ticket lineages, and trigger emergency node repairs.

## Features
* **Heads-Up Display (HUD)**: Inspect real-time status of PQR node gateways, database nodes, and local consensus daemons.
* **Lineage Visualizer**: Displays ticket hierarchy (`GENESIS`, `EVOLUTION`, `CONSEQUENCE`, `CONTEXT`) as a dynamic UI graph inside the editor sidebar.
* **Gemma Swarm Chat Interface**: Allows interacting directly with the local Gemma node models via a custom Webview container.
* **One-Click Maintenance Actions**:
  * `PQR: Initialize Ticketing Fabric` - Seeds database schemas and genesis nodes.
  * `PQR: Setup Vault` - Configures secure token exchanges and clears local temporary `.env` secrets.
  * `PQR: Emergency Sovereign Repair` - Runs diagnostic repairs and rotates SAML certificates.

## Installation & Setup

1. Open the folder in VS Code.
2. Run package setup:
   ```bash
   npm install
   ```
3. Compile the TypeScript source:
   ```bash
   npm run compile
   ```
4. Press `F5` to open a new VS Code window with the extension loaded.
