---
name: oracle-server-access
description: >
  Retrieve the Oracle Linux Server SSH private key (id_sovereign) from HashiCorp Vault
  and execute SSH commands or interactive sessions against 46.224.219.174.
---

# Oracle Server & HashiCorp Vault Integration

This skill provides persistent instructions and scripts for connecting to the **Oracle Linux Server** (`46.224.219.174`) using the stored **`id_sovereign`** SSH key managed via **HashiCorp Vault**.

## Infrastructure & Configuration Details

* **Target Oracle Host**: `46.224.219.174`
* **Default SSH User**: `opc` (fallback: `root`)
* **SSH Key Identifier**: `id_sovereign`
* **HashiCorp Vault Secret Path**: `secret/data/oracle_server/id_sovereign`
* **Vault HTTP Endpoint**: `http://localhost:8200` (or configured `$VAULT_ADDR`)
* **Local Key Path**: `~/.ssh/id_sovereign` (permissions `0600`)

---

## How to Save `id_sovereign` to HashiCorp Vault

When the user provides or generates the `id_sovereign` key:

```bash
python C:/pqr.info/mev/scripts/vault_oracle_server.py save "C:/Users/theal/.ssh/id_sovereign"
```

Or via direct HTTP API call to HashiCorp Vault:

```bash
curl --request POST \
     --header "X-Vault-Token: $VAULT_TOKEN" \
     --data '{"data": {"id_sovereign": "<PRIVATE_KEY_CONTENT>", "host": "46.224.219.174"}}' \
     http://localhost:8200/v1/secret/data/oracle_server/id_sovereign
```

---

## How to Retrieve `id_sovereign` & Connect to Oracle Server

To log in or run remote commands on the Oracle Linux server:

1. **Fetch Key from Vault**:
   ```bash
   python C:/pqr.info/mev/scripts/vault_oracle_server.py fetch
   ```

2. **Execute SSH Commands**:
   ```bash
   ssh -i ~/.ssh/id_sovereign -o StrictHostKeyChecking=no opc@46.224.219.174 "uname -a; uptime"
   ```

3. **Or run wrapper script**:
   ```bash
   python C:/pqr.info/mev/scripts/vault_oracle_server.py ssh opc
   ```
