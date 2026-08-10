import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "sync_backchannel.py"

spec = importlib.util.spec_from_file_location("sync_backchannel", MODULE_PATH)
sync_backchannel = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync_backchannel)


class SyncBackchannelSchemaTests(unittest.TestCase):
    def test_ensure_backchannel_schema_adds_cognitive_fields(self):
        data = {"messages": []}

        result = sync_backchannel.ensure_backchannel_schema(
            data,
            owner="bcpd",
            active_agent="bcpd",
            active_file="cmd/bcpd/main.go",
            active_runlevel="PQRL7",
            active_container="mesh-adapter",
        )

        self.assertEqual(result["owner"], "bcpd")
        self.assertIsNone(result["intent"])
        self.assertTrue(result["copilot_sync"])
        self.assertEqual(result["context"]["workspace"], str(ROOT))
        self.assertEqual(result["context"]["active_file"], "cmd/bcpd/main.go")
        self.assertEqual(result["context"]["active_agent"], "bcpd")
        self.assertEqual(result["context"]["active_runlevel"], "PQRL7")
        self.assertEqual(result["context"]["active_container"], "mesh-adapter")
        self.assertEqual(result["vscode_hook"], "http://localhost:17351/update")


if __name__ == "__main__":
    unittest.main()
