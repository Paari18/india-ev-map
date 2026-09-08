import { Link } from "@tanstack/react-router";
import { statusMeta, type Station } from "../data/stations";

const toneClasses: Record<string, { dot: string; text: string }> = {
  accent: { dot: "bg-accent", text: "text-accent" },
  warn: { dot: "bg-warn", text: "text-warn" },
  frost: { dot: "bg-frost", text: "text-frost" },
  destructive: { dot: "bg-destructive", text: "text-destructive" },
};

interface StationCardProps {
  station: Station;
  onSelect?: (station: Station) => void;
}

export function StationCard({ station, onSelect }: StationCardProps) {
  const meta = statusMeta[station.status];
  const tone = toneClasses[meta.tone]!;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;

  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(station);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group block glass-panel-subtle backdrop-blur-md rounded-2xl p-5 hover:border-accent/40 transition cursor-pointer relative"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${tone.dot} animate-pulse`} />
          <span className={`text-xs font-semibold ${tone.text}`}>
            {station.status === "limited" || station.status === "busy"
              ? `${station.freePorts} free`
              : meta.label}
          </span>
        </div>
        <span className="text-xs text-frost/50">🚗 {station.distanceKm} km</span>
      </div>

      <h3 className="mt-3 font-display text-lg font-bold group-hover:text-accent transition">
        {station.name}
      </h3>
      <p className="text-sm text-frost/70">
        {station.totalPorts} ports · ⚡ <strong className="text-foreground">{station.maxPowerKw} kW</strong> · {station.connectors.join(", ")}
      </p>
      <p className="mt-1 text-xs text-frost/50 truncate">
        📍 {station.address}, {station.city}
      </p>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs gap-2">
        <span className="font-bold text-foreground">₹{station.pricePerKwh.toFixed(1)} / kWh</span>

        <div className="flex items-center gap-1.5">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg bg-accent/15 border border-accent/40 text-accent font-bold px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground transition flex items-center gap-1 shadow-sm text-[11px]"
            title="Open in Google Maps"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            <span>Get Directions ↗</span>
          </a>

          <Link
            to="/station/$stationId"
            params={{ stationId: station.id }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg bg-foreground/10 px-2.5 py-1.5 font-semibold text-foreground hover:bg-foreground/20 transition text-[11px]"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
