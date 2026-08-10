import StateCard from "../components/StateCard";
import HealthCard from "../components/HealthCard";
import TelemetryCard from "../components/TelemetryCard";
import SymbolicCard from "../components/SymbolicCard";
import PantheonCard from "../components/PantheonCard";
import CorridorCard from "../components/CorridorCard";

export default function SovereignUI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Sovereign Organism Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StateCard />
        <HealthCard />
        <TelemetryCard />
        <SymbolicCard />
        <PantheonCard />
        <CorridorCard />
      </div>
    </div>
  );
}
