import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteChrome } from "../components/SiteChrome";
import { StationCard } from "../components/StationCard";
import { IndiaEvMap } from "../components/IndiaEvMap";
import { StationDetailModal } from "../components/StationDetailModal";
import { cities, cityCoordinates, stations, Station } from "../data/stations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EvFinder — EV Charging Stations Across India" },
      {
        name: "description",
        content:
          "Find EV charging stations across India. Search 48,200+ charging points by city, connector, power and live availability with instant Google Maps GPS directions.",
      },
      { property: "og:title", content: "EvFinder — EV Charging Stations Across India" },
      {
        property: "og:description",
        content:
          "Search EV charging stations in Delhi, Mumbai, Bengaluru, Hyderabad and 28 states with live availability, GPS tracking and Google Maps directions.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [selectedCity, setSelectedCity] = useState<string>("Bengaluru");
  const [projectedStation, setProjectedStation] = useState<Station | null>(null);

  const nearby = stations.filter((s) => s.city.toLowerCase() === selectedCity.toLowerCase());
  const displayStations = nearby.length > 0 ? nearby.slice(0, 3) : stations.slice(0, 3);
  const allCityNames = Object.keys(cityCoordinates);

  return (
    <SiteChrome>
      {/* Hero Section */}
      <section className="px-6 sm:px-8 lg:px-14 pt-8 pb-8">
        <div className="max-w-3xl">
          <div className="status-chip">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Live
            OpenStreetMap Grid · 28 Indian States
          </div>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
            Charge anywhere
            <br />
            <span className="text-charge-gradient">across India.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-frost/70 leading-relaxed">
            Navigate 48,200+ public EV charging points from Kashmir to Kanyakumari on a free,
            open map. Select any Indian city to find nearby high-speed chargers with instant Google Maps navigation.
          </p>
        </div>

        {/* Hero Interactive Search Bar */}
        <div className="mt-8 max-w-3xl rounded-2xl glass-panel p-4 shadow-2xl shadow-primary/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Interactive City Selector */}
            <div className="rounded-xl border border-border bg-ink2/60 px-4 py-2.5 relative">
              <span className="text-[10px] uppercase tracking-wider text-frost/50 block font-bold">
                Select City
              </span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full mt-0.5 font-semibold text-sm text-foreground bg-transparent focus:outline-none cursor-pointer"
              >
                {allCityNames.map((city) => (
                  <option key={city} value={city} className="bg-background text-foreground">
                    📍 {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-border bg-ink2/60 px-4 py-2.5">
              <span className="text-[10px] uppercase tracking-wider text-frost/50 block font-bold">
                Charging Speed
              </span>
              <p className="mt-0.5 font-semibold text-sm text-foreground">120kW+ · DC Fast</p>
            </div>

            <Link
              to="/map"
              search={{ city: selectedCity }}
              className="grid place-items-center rounded-xl charge-button px-4 py-3 font-display font-bold hover:opacity-95 transition shadow-lg"
            >
              Find in {selectedCity} →
            </Link>
          </div>

          {/* Quick city pills */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-frost/50 text-[11px] font-semibold mr-1">Quick Select:</span>
            {allCityNames.slice(0, 6).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`rounded-full px-3 py-1 font-semibold transition text-xs ${selectedCity === city
                    ? "bg-accent text-accent-foreground border border-accent/40 shadow-sm"
                    : "border border-border text-frost hover:text-foreground hover:bg-ink2/70"
                  }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="px-6 sm:px-8 lg:px-14 py-4 flex flex-wrap gap-4">
        {[
          { v: "48,200+", l: "Charging points mapped" },
          { v: "1,420", l: "Active superhubs" },
          { v: "28", l: "States & UTs covered" },
          { v: "100%", l: "Free & open map data" },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-2xl glass-panel-subtle px-6 py-4"
          >
            <p className="font-display text-3xl font-extrabold text-foreground">{s.v}</p>
            <p className="text-sm text-frost/60">{s.l}</p>
          </div>
        ))}
      </section>

      {/* Featured Interactive Map Showcase */}
      <section className="px-6 sm:px-8 lg:px-14 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-ink2/90 via-background to-ink2/60 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <div className="status-chip mb-2">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Interactive India Grid
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Live EV Grid: {selectedCity}
              </h2>
              <p className="mt-2 text-sm text-frost/70 max-w-xl">
                Explore charging hubs with real-time port status across {selectedCity}. Click any station for details and instant Google Maps directions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/map"
                search={{ city: selectedCity }}
                className="rounded-full charge-button px-5 py-2.5 text-xs sm:text-sm font-display font-bold hover:opacity-95 transition shadow-lg flex items-center gap-2"
              >
                <span>Full Map of {selectedCity}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Embedded Interactive Map */}
          <div className="h-[460px] sm:h-[540px] rounded-2xl overflow-hidden shadow-2xl border border-border">
            <IndiaEvMap
              stations={stations}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              onSelectStation={(st) => setProjectedStation(st)}
              height="100%"
              showControls={true}
              showCitySelector={true}
              showLayerSelector={true}
              showRangeOverlay={true}
              enableLocateMe={true}
            />
          </div>
        </div>
      </section>

      {/* Quick City Filters */}
      <section className="px-6 sm:px-8 lg:px-14 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm text-frost">Explore by Indian City</h3>
          <Link to="/stations" className="text-xs text-accent hover:underline">
            View directory →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCity(c.name)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${selectedCity === c.name
                  ? "border-accent bg-accent/20 text-accent font-bold ring-1 ring-accent/40"
                  : "border-border text-frost hover:border-accent/40 hover:text-foreground hover:bg-ink2"
                }`}
            >
              {c.name} <span className="opacity-60">{c.stations}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Nearby Stations Preview */}
      <section className="px-6 sm:px-8 lg:px-14 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              Charging Hubs in {selectedCity}
            </h2>
            <p className="text-sm text-frost/60 mt-1">
              {displayStations.length} live stations displayed · Click any station for specs & Google Maps navigation
            </p>
          </div>
          <Link
            to="/stations"
            search={{ city: selectedCity }}
            className="text-sm font-semibold text-accent hover:underline"
          >
            View all in {selectedCity} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayStations.map((s) => (
            <StationCard
              key={s.id}
              station={s}
              onSelect={(st) => setProjectedStation(st)}
            />
          ))}
        </div>
      </section>

      {/* Projected Station Details Modal */}
      <StationDetailModal
        station={projectedStation}
        onClose={() => setProjectedStation(null)}
      />
    </SiteChrome>
  );
}
