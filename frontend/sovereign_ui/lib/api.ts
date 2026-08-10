export async function getState() {
  return fetch("/api/state").then(r => r.json());
}

export async function getHealth() {
  return fetch("/api/health").then(r => r.json());
}

export async function getTelemetry() {
  return fetch("/api/telemetry").then(r => r.json());
}

export async function getSmf() {
  return fetch("/api/smf").then(r => r.json());
}
