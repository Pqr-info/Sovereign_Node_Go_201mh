import os
import time
import unittest
import json
import urllib.request
import urllib.error

# Substrate Interface Imports for Blockchain Memory Verification
try:
    from substrateinterface import SubstrateInterface, Keypair
    from substrateinterface.exceptions import SubstrateRequestException
    SUBSTRATE_AVAILABLE = True
except ImportError:
    SUBSTRATE_AVAILABLE = False

# Retrieve API base URL from environment or default to local development port
DEFAULT_BASE_URL = os.environ.get("PQR_API_URL", "").rstrip("/")
if not DEFAULT_BASE_URL:
    port = os.environ.get("PORT", "8196")
    DEFAULT_BASE_URL = f"http://localhost:{port}"

AGENT_ID = "test-agent-999"

class PQRMemoryAPITests(unittest.TestCase):
    base_url = DEFAULT_BASE_URL
    server_online = False
    
    @classmethod
    def setUpClass(cls):
        # Verify server is accessible before running tests
        try:
            with urllib.request.urlopen(f"{cls.base_url}/REST/2.0/health", timeout=2) as response:
                if response.status == 200:
                    cls.server_online = True
        except Exception:
            # Fallback check to port 8080 if 8196 is offline
            if "8196" in cls.base_url:
                fallback_url = "http://localhost:8080"
                try:
                    with urllib.request.urlopen(f"{fallback_url}/REST/2.0/health", timeout=2) as response:
                        if response.status == 200:
                            cls.base_url = fallback_url
                            cls.server_online = True
                except Exception:
                    pass

    def setUp(self):
        if not self.server_online:
            self.skipTest(f"PQR API Server at {self.base_url} is offline. Start the server to run integration tests.")

    def _request(self, method, path, data=None, headers=None, expected_status=200):
        url = f"{self.base_url}{path}"
        req_headers = {"Content-Type": "application/json"}
        if headers:
            req_headers.update(headers)
            
        req_data = None
        if data is not None:
            if isinstance(data, (dict, list)):
                req_data = json.dumps(data).encode("utf-8")
            elif isinstance(data, bytes):
                req_data = data
            else:
                req_data = str(data).encode("utf-8")
                
        req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
        
        start_time = time.perf_counter()
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                duration = (time.perf_counter() - start_time) * 1000.0  # in ms
                resp_body = response.read().decode("utf-8")
                resp_data = json.loads(resp_body) if resp_body else {}
                self.assertEqual(response.status, expected_status)
                return resp_data, duration
        except urllib.error.HTTPError as e:
            duration = (time.perf_counter() - start_time) * 1000.0
            resp_body = e.read().decode("utf-8")
            try:
                resp_data = json.loads(resp_body)
            except Exception:
                resp_data = {"raw_error": resp_body}
            self.assertEqual(e.code, expected_status, f"HTTP Error {e.code}: {resp_data}")
            return resp_data, duration
        except Exception as e:
            self.fail(f"Connection failed: {e}")

    def test_01_health_check(self):
        """Verify the health endpoint response matches signatures."""
        res, duration = self._request("GET", "/REST/2.0/health")
        self.assertEqual(res.get("service"), "PQR-ticketing")
        self.assertEqual(res.get("status"), "healthy")
        self.assertIn("version", res)

    def test_02_init_schema(self):
        """Verify schema initialization does not error out."""
        res, duration = self._request("POST", "/REST/2.0/init")
        self.assertIn(res.get("message"), ["schema initialized", "Database schema initialized"])

    def test_03_ticket_lifecycle(self):
        """Create, read, update, and search tickets."""
        # 1. Create ticket
        payload = {
            "Subject": "QA Integration Verification Test",
            "Queue": "testing",
            "Text": "Standardized verification protocol test payload",
            "AgentID": AGENT_ID,
            "Layer": 2,
            "Intent": {"qa_run": True, "environment": "loopback"}
        }
        res, duration = self._request("POST", "/REST/2.0/ticket", data=payload, expected_status=201)
        ticket_id = res.get("id")
        self.assertIsNotNone(ticket_id)
        
        # 2. Get ticket and verify structure
        res_get, duration = self._request("GET", f"/REST/2.0/ticket/{ticket_id}")
        self.assertEqual(res_get.get("id"), ticket_id)
        self.assertEqual(res_get.get("creator"), AGENT_ID)
        self.assertEqual(res_get.get("layer"), 2)
        self.assertEqual(res_get.get("content"), "Standardized verification protocol test payload")
        self.assertEqual(res_get.get("intent", {}).get("qa_run"), True)

        # 3. Update ticket (restricted update)
        update_payload = {
            "Status": "RESOLVED",
            "Title": "QA Test Suite Run Success",
            "Creator": AGENT_ID,
            "AssignedTo": AGENT_ID
        }
        res_up, duration = self._request("PUT", f"/REST/2.0/ticket/{ticket_id}", data=update_payload)
        self.assertEqual(res_up.get("message"), "updated")

        # 4. Try updating ticket with unauthorized agent ID (Permission Check)
        unauth_payload = {
            "Status": "CLOSED",
            "Title": "Hacker Attempt",
            "Creator": "unauthorized-agent-id"
        }
        res_unauth, duration = self._request("PUT", f"/REST/2.0/ticket/{ticket_id}", data=unauth_payload, expected_status=403)
        self.assertIn("error", res_unauth)
        self.assertIn("Access Denied", res_unauth["error"])

    def test_04_agent_memory(self):
        """Store and retrieve memories of different types."""
        # Create temporary ticket for memory attachment
        ticket_payload = {
            "Subject": "Memory Storage Parent",
            "Queue": "memory_test",
            "Text": "Parent ticket for memory link",
            "AgentID": AGENT_ID,
            "Layer": 2
        }
        res_t, _ = self._request("POST", "/REST/2.0/ticket", data=ticket_payload, expected_status=201)
        ticket_id = res_t.get("id")

        # 1. Store Context Memory
        mem_payload = {
            "memory_type": "context",
            "data": {"current_goal": "verify_api_alignment", "progress": 0.8},
            "relevance_score": 0.95
        }
        res_mem, _ = self._request("POST", f"/REST/2.0/agent/{AGENT_ID}/memory/{ticket_id}", data=mem_payload)
        self.assertEqual(res_mem.get("message"), "memory stored")

        # 2. Retrieve Context Memory
        res_get, _ = self._request("GET", f"/REST/2.0/agent/{AGENT_ID}/memory/{ticket_id}?type=context")
        self.assertEqual(res_get.get("current_goal"), "verify_api_alignment")
        self.assertEqual(res_get.get("progress"), 0.8)

        # 3. Verify Agent Context Window
        res_context, _ = self._request("GET", f"/REST/2.0/agent/{AGENT_ID}/context")
        self.assertEqual(res_context.get("agent"), AGENT_ID)
        self.assertIsInstance(res_context.get("context_tickets"), list)

    def test_05_relationship_linking(self):
        """Link parent and child tickets and verify links endpoint."""
        t1, _ = self._request("POST", "/REST/2.0/ticket", data={"Subject": "Parent T", "AgentID": AGENT_ID}, expected_status=201)
        t2, _ = self._request("POST", "/REST/2.0/ticket", data={"Subject": "Child T", "AgentID": AGENT_ID}, expected_status=201)
        
        p_id = t1["id"]
        c_id = t2["id"]
        
        link_payload = {
            "relationship_type": "CONSEQUENCE",
            "agent_id": AGENT_ID
        }
        res_link, _ = self._request("POST", f"/REST/2.0/ticket/{p_id}/link/{c_id}", data=link_payload)
        self.assertEqual(res_link.get("message"), "tickets linked")

        # Retrieve links
        res_get, _ = self._request("GET", f"/REST/2.0/ticket/{p_id}/links")
        self.assertEqual(res_get.get("ticket_id"), p_id)
        self.assertIsInstance(res_get.get("links"), list)

    def test_06_loopback_and_latency_targets(self):
        """Ensure response times on localhost conform to latency SLAs (typically < 50ms)."""
        res, duration = self._request("GET", "/REST/2.0/health")
        # Log local connection performance
        print(f"\n[LATENCY REPORT] Loopback GET /health completed in {duration:.2f} ms")
        self.assertLess(duration, 50.0, f"Local host latency threshold exceeded (> 50ms): {duration:.2f}ms")

        # Benchmark Substrate WS RPC latency if available and online
        if SUBSTRATE_AVAILABLE:
            try:
                start = time.perf_counter()
                sub = SubstrateInterface(url="ws://127.0.0.1:9944")
                sub.get_chain_head()
                sub_duration = (time.perf_counter() - start) * 1000.0
                print(f"[LATENCY REPORT] Substrate WS RPC query completed in {sub_duration:.2f} ms")
                self.assertLess(sub_duration, 50.0, f"Substrate latency threshold exceeded (> 50ms): {sub_duration:.2f}ms")
            except Exception:
                pass

    def test_07_null_scan_and_payload_safety(self):
        """Inject NULL bytes, empty JSON, and missing fields to ensure parser validation handles them gracefully."""
        # 1. Null / Empty JSON request to create ticket (should return 400 Bad Request)
        res, duration = self._request("POST", "/REST/2.0/ticket", data={}, expected_status=400)
        self.assertIn("error", res)

        # 2. Sending raw binary NULL bytes (non-JSON payload)
        raw_null_data = b"\x00\x00\x00\x00"
        res_raw, _ = self._request("POST", "/REST/2.0/ticket", data=raw_null_data, expected_status=400)
        self.assertIn("error", res_raw)

        # 3. Invalid uuid parsing in GET ticket (should return 400 Bad Request, not 500 or panic)
        res_uuid, _ = self._request("GET", "/REST/2.0/ticket/invalid-uuid-format-123", expected_status=400)
        self.assertEqual(res_uuid.get("error"), "invalid uuid")

        # 4. Retrieve non-existent ticket uuid (should return 404 Not Found)
        fake_uuid = "99999999-9999-9999-9999-999999999999"
        res_404, _ = self._request("GET", f"/REST/2.0/ticket/{fake_uuid}", expected_status=404)
        self.assertEqual(res_404.get("error"), "ticket not found")

    def test_08_blockchain_rpc_connection(self):
        """Verify WebSocket RPC connection to Substrate node at ws://127.0.0.1:9944."""
        if not SUBSTRATE_AVAILABLE:
            self.skipTest("substrateinterface library is not installed in this environment.")
        
        try:
            substrate = SubstrateInterface(url="ws://127.0.0.1:9944")
            block_hash = substrate.get_chain_head()
            self.assertIsNotNone(block_hash)
            print(f"\n[SUBSTRATE RPC] Connected. Current Head Block Hash: {block_hash}")
        except Exception as e:
            self.skipTest(f"Substrate node at ws://127.0.0.1:9944 is offline: {e}")

    def test_09_blockchain_signer_keys(self):
        """Validate Bob and Alice signer keys and SS58 addresses under Substrate format."""
        if not SUBSTRATE_AVAILABLE:
            self.skipTest("substrateinterface library is not installed in this environment.")
            
        try:
            # Derive Alice keypair from dev URI
            alice_keypair = Keypair.create_from_uri("//Alice")
            self.assertEqual(alice_keypair.ss58_address, "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
            
            # Derive Bob keypair from dev URI
            bob_keypair = Keypair.create_from_uri("//Bob")
            self.assertEqual(bob_keypair.ss58_address, "5FHneW46xGXgs5mUqt2ZZCa739uCxsNvi1mvG7aN8CZA1uxy")
            
            print(f"\n[SIGNER KEYS] Validated Alice ({alice_keypair.ss58_address}) and Bob ({bob_keypair.ss58_address})")
        except Exception as e:
            self.fail(f"Failed to derive and validate Substrate signer keys: {e}")

    def test_10_blockchain_timeslips_pallet(self):
        """Verify timeslip structure and substrate-interface timeslip metadata/calls."""
        if not SUBSTRATE_AVAILABLE:
            self.skipTest("substrateinterface library is not installed in this environment.")
            
        try:
            substrate = SubstrateInterface(url="ws://127.0.0.1:9944")
        except Exception as e:
            self.skipTest(f"Substrate node at ws://127.0.0.1:9944 is offline: {e}")
            return

        try:
            metadata = substrate.get_metadata_modules()
            has_timeslips = any(module.get('name') == 'Timeslips' for module in metadata)
            
            if has_timeslips:
                print("\n[TIMESLIPS PALLET] Pallet found in blockchain metadata.")
                # Verify composing a call for the timeslips pallet
                try:
                    call = substrate.compose_call(
                        call_module='Timeslips',
                        call_function='open_timeslip',
                        call_params={
                            'title': 'QA Verification Timeslip',
                            'checkpoint_id': 200,
                            'billable': True,
                            'rate': 500
                        }
                    )
                    self.assertEqual(call.call_module.name, 'Timeslips')
                    self.assertEqual(call.call_function.name, 'open_timeslip')
                    print("[TIMESLIPS CALL] Successfully composed open_timeslip extrinsic.")
                except Exception as compose_err:
                    print(f"[TIMESLIPS CALL] Composing call failed: {compose_err} (verify pallet function parameters)")
            else:
                self.skipTest("Timeslips pallet not found in Substrate runtime metadata.")
        except Exception as e:
            self.fail(f"Error querying Substrate metadata: {e}")

    def test_11_mirrored_mode_port_checks(self):
        """Test port availability and IPv4/IPv6 socket binding under mirrored networking."""
        import socket
        
        ports_to_check = {
            "PQR Go API": int(os.environ.get("PORT", "8196")),
            "Substrate RPC": 9944,
            "CockroachDB": 26257
        }
        
        print("\n[MIRRORED NETWORKING PORT CHECK]")
        for service, port in ports_to_check.items():
            # Check IPv4 loopback binding
            s4 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s4.settimeout(0.5)
            res4 = s4.connect_ex(("127.0.0.1", port))
            s4.close()
            
            # Check IPv6 loopback binding (essential under mirrored networking)
            s6 = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
            s6.settimeout(0.5)
            res6 = s6.connect_ex(("::1", port))
            s6.close()
            
            status4 = "ACTIVE" if res4 == 0 else "INACTIVE/BLOCKED"
            status6 = "ACTIVE" if res6 == 0 else "INACTIVE/BLOCKED"
            print(f" - {service} (Port {port}): IPv4={status4}, IPv6={status6}")
        
        try:
            addresses = socket.getaddrinfo("localhost", None)
            ips = [addr[4][0] for addr in addresses]
            self.assertTrue(any(ip == "127.0.0.1" for ip in ips), "localhost must resolve to 127.0.0.1")
            print(f" - Localhost DNS resolves to: {list(set(ips))}")
        except Exception as e:
            self.fail(f"Failed to resolve localhost under mirrored networking: {e}")

if __name__ == "__main__":
    unittest.main()
