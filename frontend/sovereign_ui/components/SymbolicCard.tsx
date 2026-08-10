import { useEffect, useState } from "react";
import { getSmf } from "../lib/api";

export default function SymbolicCard() {
  const [smf, setSmf] = useState<any>(null);

  useEffect(() => {
    getSmf().then(setSmf);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-xl border border-violet-500/40">
      <h2 className="text-xl font-semibold mb-4">Symbolic Output</h2>
      {smf ? (
        <div>
          <p>Tracks: {smf.tracks}</p>
          <p>Events: {smf.events}</p>
        </div>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}
