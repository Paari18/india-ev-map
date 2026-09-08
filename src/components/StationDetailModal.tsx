import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Station, statusMeta } from "../data/stations";

interface StationDetailModalProps {
  station: Station | null;
  onClose: () => void;
}

export function StationDetailModal({ station, onClose }: StationDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!station) return null;

  const meta = statusMeta[station.status];
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${station.lat}, ${station.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const freePercent = Math.round((station.freePorts / station.totalPorts) * 100);

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-background/95 backdrop-blur-xl p-6 sm:p-7 shadow-2xl z-10 custom-scrollbar animate-slideUp">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: `${meta.hex}20`,
                color: meta.hex,
                border: `1px solid ${meta.hex}50`,
              }}
            >
              ● {meta.label}
            </span>
            <span className="text-xs text-frost/70 font-semibold">{station.network}</span>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-full border border-border bg-ink2/70 text-frost hover:text-foreground hover:bg-ink2 flex items-center justify-center transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Station Title & Location */}
        <div className="mt-4">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {station.name}
          </h2>
          <p className="mt-1 text-sm text-frost/80 flex items-start gap-1.5">
            <span>📍</span>
            <span>
              {station.address}, {station.city}, {station.state} {station.pincode}
            </span>
          </p>
        </div>

        {/* Big Get Directions Action CTA */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl charge-button px-5 py-3.5 font-display font-bold text-sm shadow-xl shadow-accent/20 hover:scale-[1.02] transition active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            <span>Get Directions (Google Maps) ↗</span>
          </a>

          <button
            onClick={handleCopyCoords}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-ink2/80 px-4 py-3.5 text-xs font-bold text-frost hover:text-foreground hover:bg-ink2 transition"
          >
            <span>📋</span>
            <span>{copied ? "✓ GPS Coords Copied!" : `Copy GPS (${station.lat.toFixed(4)}, ${station.lng.toFixed(4)})`}</span>
          </button>
        </div>

        {/* Live Availability Meter */}
        <div className="mt-5 rounded-2xl border border-border bg-ink2/50 p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-foreground">Port Availability</span>
            <span className="font-bold text-accent">
              {station.freePorts} of {station.totalPorts} ports available ({freePercent}%)
            </span>
          </div>
          <div className="w-full bg-ink2 rounded-full h-3 overflow-hidden border border-border">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${freePercent}%`,
                backgroundColor: meta.hex,
              }}
            />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-border bg-ink2/50 p-3.5">
            <span className="text-[10px] uppercase font-bold text-frost/50 block">Max Speed</span>
            <span className="font-display text-xl font-extrabold text-foreground mt-0.5 block">
              {station.maxPowerKw} <span className="text-xs font-normal text-frost/60">kW</span>
            </span>
          </div>
          <div className="rounded-2xl border border-border bg-ink2/50 p-3.5">
            <span className="text-[10px] uppercase font-bold text-frost/50 block">Tariff</span>
            <span className="font-display text-xl font-extrabold text-foreground mt-0.5 block">
              ₹{station.pricePerKwh.toFixed(1)} <span className="text-xs font-normal text-frost/60">/u</span>
            </span>
          </div>
          <div className="rounded-2xl border border-border bg-ink2/50 p-3.5">
            <span className="text-[10px] uppercase font-bold text-frost/50 block">Rating</span>
            <span className="font-display text-xl font-extrabold text-amber-400 mt-0.5 block">
              ★ {station.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Connectors & Amenities */}
        <div className="mt-5 space-y-4">
          {/* Supported Connectors */}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-frost/70 font-bold block mb-2">
              Supported Connectors
            </span>
            <div className="flex flex-wrap gap-2">
              {station.connectors.map((c) => (
                <span
                  key={c}
                  className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs text-accent font-bold flex items-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>{c}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Operating Hours & Amenities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-border bg-ink2/40 p-3">
              <span className="text-[10px] uppercase font-bold text-frost/50 block">Hours of Operation</span>
              <span className="text-xs font-semibold text-foreground mt-0.5 block">
                🕒 {station.hours}
              </span>
            </div>
            <div className="rounded-xl border border-border bg-ink2/40 p-3">
              <span className="text-[10px] uppercase font-bold text-frost/50 block">Distance & Reviews</span>
              <span className="text-xs font-semibold text-foreground mt-0.5 block">
                🚗 {station.distanceKm} km away · {station.reviews} reviews
              </span>
            </div>
          </div>

          {/* Amenities Chips */}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-frost/70 font-bold block mb-2">
              Site Amenities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {station.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-lg border border-border bg-ink2/60 px-2.5 py-1 text-xs text-frost"
                >
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
          <Link
            to="/station/$stationId"
            params={{ stationId: station.id }}
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>View Full Station Page</span>
            <span>→</span>
          </Link>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-accent text-accent-foreground font-display font-bold px-4 py-2 text-xs hover:opacity-95 transition flex items-center gap-1.5 shadow"
          >
            <span>Navigate on Google Maps</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
