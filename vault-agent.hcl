pid_file = "./vault/agent.pid"

auto_auth {
  method "token" {
    token = "${env.VAULT_TOKEN}"
  }

  sink "file" {
    path = "./vault/token"
  }
}

template {
  source      = "./vault/swend.ctmpl"
  destination = "./vault/swend.env"
}
