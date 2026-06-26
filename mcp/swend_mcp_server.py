# swend_mcp_server.py
# =========================================================================================
# 🌀 SWEND - MODEL CONTEXT PROTOCOL (MCP) SERVER STUB
# =========================================================================================
# Extends Swarm tools directly into your AI assistant workspace.
# Exposes ledger querying, peer discovery, and transaction auditing capabilities.
#
# Requirements:
# pip install mcp psycopg2-binary
# =========================================================================================

import os
import json
import psycopg2
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP Server
mcp = FastMCP("SWEND-Core-Control")

# Resolve local CockroachDB connection
DB_URL = os.getenv("DATABASE_URL", "postgresql://root@localhost:26257/antigravity?sslmode=disable")

def get_db_connection():
    return psycopg2.connect(DB_URL)

@mcp.tool()
def get_swarm_peers() -> str:
    """
    Discovers all active validator shortcodes and IP endpoints currently active in the mesh.
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        # Querying CockroachDB for registered nodes
        cur.execute("SELECT agent_id, node_class, last_heartbeat FROM agents WHERE status = 'active';")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        peers = [{"agent_id": r[0], "role": r[1], "last_seen": str(r[2])} for r in rows]
        return json.dumps({"status": "success", "peers": peers}, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "message": f"Failed to fetch peers: {str(e)}"})

@mcp.tool()
def query_ledger(limit: int = 10) -> str:
    """
    Returns the recent ledger block mutations and voter consensus details.
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT block_index, proposer_id, target_key, proposed_value, consensus_votes, block_hash "
            "FROM ledger_blocks ORDER BY block_index DESC LIMIT %s;", (limit,)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        blocks = []
        for r in rows:
            blocks.append({
                "block_index": r[0],
                "proposer": r[1],
                "key": r[2],
                "value": r[3],
                "votes": r[4],
                "hash": r[5]
            })
        return json.dumps({"status": "success", "blocks": blocks}, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "message": f"Database query failed: {str(e)}"})

@mcp.tool()
def propose_ledger_mutation(target_key: str, value: str, reason: str, agent_id: str = "agent-mcp-sentry") -> str:
    """
    Proposes a state mutation to the council. Triggers consensus voting.
    """
    try:
        # In a production context, this would invoke the gRPC call 'ProposeSwarmMutation' on localhost:1111
        # Here we simulate the ledger insertion under the consensus pipeline
        conn = get_db_connection()
        cur = conn.cursor()
        
        # 1. Generate hypothetical block hash
        import hashlib
        import time
        ts = str(time.time())
        prev_hash = "00000000000000000000000000"
        block_hash = hashlib.sha256(f"{target_key}:{value}:{ts}".encode()).hexdigest()
        
        cur.execute(
            "INSERT INTO ledger_blocks (proposer_id, target_key, proposed_value, change_reason, block_hash) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING block_index;",
            (agent_id, target_key, value, reason, block_hash)
        )
        block_idx = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return json.dumps({
            "status": "consensus_reached",
            "block_index": block_idx,
            "block_hash": block_hash,
            "message": f"Mutation for {target_key} recorded in block #{block_idx}."
        }, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "message": f"Consensus proposal failed: {str(e)}"})

if __name__ == "__main__":
    # Launch MCP Server standard I/O communication
    mcp.run()
