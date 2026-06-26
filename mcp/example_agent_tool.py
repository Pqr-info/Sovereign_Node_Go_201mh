# example_agent_tool.py
# =========================================================================================
# 🌀 SWEND - MCP AGENT TOOL USE DEMONSTRATION
# =========================================================================================
# This script illustrates how an agent can programmatically call tools on the SWEND
# MCP server to discover peer networks and record state transactions.
# =========================================================================================

import json
from swend_mcp_server import get_swarm_peers, query_ledger, propose_ledger_mutation

def simulate_agent_deliberation():
    print("🤖 Agent initializing Swarm inspection...")

    # 1. Discover peers participating in the consensus
    print("\n🔍 Step 1: Discovering active swarm peers...")
    peers_response = get_swarm_peers()
    print("Peer List Output:")
    print(peers_response)

    # 2. Query the consensus ledger history
    print("\n📜 Step 2: Querying the local ledger history...")
    ledger_response = query_ledger(limit=3)
    print("Recent Ledger Blocks:")
    print(ledger_response)

    # 3. Propose a system schema adjustment mutation
    print("\n⚡ Step 3: Proposing a state mutation payload...")
    mutation_response = propose_ledger_mutation(
        target_key="config/active_runlevel",
        value="7",
        reason="Upgrading system to Runlevel 7 (Starbirth protocol ignition)",
        agent_id="agent-sentry-mcp"
    )
    print("Mutation Transaction Receipt:")
    print(mutation_response)

if __name__ == "__main__":
    simulate_agent_deliberation()
