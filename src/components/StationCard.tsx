import { Link } from "@tanstack/react-router";
import { statusMeta, type Station } from "../data/stations";

const toneClasses: Record<string, { dot: string; text: string }> = {
  accent: { dot: "bg-accent", text: "text-accent" },
  warn: { dot: "bg-warn", text: "text-warn" },
  frost: { dot: "bg-frost", text: "text-frost" },
  destructive: { dot: "bg-destructive", text: "text-destructive" },
};

export function StationCard({ station }: { station: Station }) {
  const meta = statusMeta[station.status];
  const tone = toneClasses[meta.tone]!;

  return (
    <Link
      to="/station/$stationId"
      params={{ stationId: station.id }}
      className="group block glass-panel-subtle backdrop-blur-md rounded-2xl p-5 hover:border-accent/40 transition"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${tone.dot}`} />
          <span className={`text-xs font-semibold ${tone.text}`}>
            {station.status === "limited" || station.status === "busy"
              ? `${station.freePorts} free`
              : meta.label}
          </span>
        </div>
        <span className="text-xs text-frost/50">{station.distanceKm} km</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold">{station.name}</h3>
      <p className="text-sm text-frost/60">
        {station.totalPorts} {station.connectors[0]} · {station.maxPowerKw}kW ·{" "}
        {station.hours}
      </p>
      <p className="mt-1 text-xs text-frost/40">
        {station.network} · {station.city}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-frost/50">₹{station.pricePerKwh.toFixed(1)} / kWh</span>
        <span className="rounded-lg bg-foreground/10 px-3 py-1.5 font-semibold text-foreground group-hover:bg-accent group-hover:text-accent-foreground transition">
          Details
        </span>
      </div>
    </Link>
  );
}
