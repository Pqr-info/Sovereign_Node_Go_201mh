import { useEffect, useState } from "react";
import { getState } from "../lib/api";

export default function StateCard() {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    getState().then(setState);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-xl border border-purple-500/40">
      <h2 className="text-xl font-semibold mb-4">Sovereign State</h2>
      {state ? (
        <div>
          <p className="text-lg">State: {state.state}</p>
          <p className="text-lg">Lens: {state.lens_mode}</p>
        </div>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}
