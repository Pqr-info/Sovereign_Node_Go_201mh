import { useEffect, useState } from "react";
import { getTelemetry } from "../lib/api";

export default function TelemetryCard() {
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    getTelemetry().then(setTelemetry);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-xl border border-amber-500/40">
      <h2 className="text-xl font-semibold mb-4">Telemetry</h2>
      {telemetry ? (
        <ul className="space-y-2">
          <li>Load: {telemetry.load.toFixed(3)}</li>
          <li>Consensus: {telemetry.consensus_stable ? "Stable" : "Unstable"}</li>
          <li>Identity: {telemetry.identity_coherent ? "Coherent" : "Divergent"}</li>
          <li>Mutation Rate: {telemetry.mutation_rate.toFixed(3)}</li>
          <li>Symbolic Density: {telemetry.symbolic_density.toFixed(3)}</li>
        </ul>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}
