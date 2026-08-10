import { useEffect, useState } from "react";
import { getHealth } from "../lib/api";

export default function HealthCard() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    getHealth().then(setHealth);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-xl border border-teal-500/40">
      <h2 className="text-xl font-semibold mb-4">Mesh Health</h2>
      {health ? (
        <ul className="space-y-2">
          <li>Stress: {health.corridor_stress.toFixed(3)}</li>
          <li>Coherence: {health.coherence_index.toFixed(3)}</li>
          <li>Lineage Stability: {health.lineage_stability.toFixed(3)}</li>
          <li>Symbolic Density: {health.symbolic_density.toFixed(3)}</li>
          <li>State Stability: {health.state_stability.toFixed(3)}</li>
          {health.warnings.length > 0 && (
            <li className="text-red-400 mt-2">
              Warnings: {health.warnings.join(", ")}
            </li>
          )}
        </ul>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}
