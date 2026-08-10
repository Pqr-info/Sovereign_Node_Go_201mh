import requests

def test_vault_adapter_imagefx():
    r = requests.get(
        "http://localhost:8200/v1/secret/data/imagefx",
        headers={"X-Vault-Token": "test"},
        timeout=3,
    )
    assert r.status_code == 200
    j = r.json()
    assert "data" in j
    assert "data" in j["data"]
    assert "api_key" in j["data"]["data"]
