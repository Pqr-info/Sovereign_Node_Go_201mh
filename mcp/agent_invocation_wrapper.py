import json
import subprocess
import sys
import uuid

class AntigravityMcpWrapper:
    """
    Ticket-scoped MCP invocation wrapper for sovereign-native-tools.
    Enforces capability validation and ticket-scoped boundaries.
    """
    def __init__(self, ticket_id: str, agent_id: str):
        self.ticket_id = ticket_id or str(uuid.uuid4())
        self.agent_id = agent_id or "antigravity-core"
        self.wsl_python = "/home/aellok/sovereign_mesh/.venv/bin/python3"
        self.mcp_script = "/home/aellok/sovereign_mesh/grpc_node/mgsh_mcp.py"

    def execute_tool(self, tool_name: str, arguments: dict) -> dict:
        """
        Executes a process-based MCP tool through the WSL process bridge.
        """
        print(f"[GOVERNANCE] Invoking {tool_name} | Scope: {self.ticket_id} | Agent: {self.agent_id}")
        
        # Enforce capability gate check
        if not self._verify_capability_gate(tool_name):
            return {
                "status": "error",
                "error": f"Capability gate violation: tool '{tool_name}' not allowed for Ticket ID {self.ticket_id}"
            }

        # Build execution payload matching the process protocol
        payload = {
            "jsonrpc": "2.0",
            "method": f"tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments,
                "context": {
                    "ticket_id": self.ticket_id,
                    "agent_id": self.agent_id
                }
            },
            "id": 1
        }

        try:
            # Route execution through WSL processes
            cmd = ["wsl", "-e", self.wsl_python, self.mcp_script, "--native-mcp", "json"]
            proc = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            stdout, stderr = proc.communicate(input=json.dumps(payload), timeout=15)
            
            if proc.returncode != 0:
                return {
                    "status": "error",
                    "error": f"Subprocess exited with code {proc.returncode}. Stderr: {stderr.strip()}"
                }
                
            response = json.loads(stdout)
            return response.get("result", response)
            
        except subprocess.TimeoutExpired:
            proc.kill()
            return {"status": "error", "error": "Execution timed out"}
        except Exception as e:
            return {"status": "error", "error": f"Invocation failure: {str(e)}"}

    def _verify_capability_gate(self, tool_name: str) -> bool:
        """
        Mock ticket-scoped capability validation rule checking.
        """
        allowed_prefix = "sovereign."
        return tool_name.startswith(allowed_prefix)

if __name__ == "__main__":
    # Demo invocation validation
    ticket = str(uuid.uuid4())
    client = AntigravityMcpWrapper(ticket, "antigravity-core")
    
    # Test local mock metrics check
    res = client.execute_tool("sovereign.get_system_metrics", {})
    print(f"Metrics Output: {res}")
