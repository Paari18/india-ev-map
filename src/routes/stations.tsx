import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteChrome } from "../components/SiteChrome";
import { StationCard } from "../components/StationCard";
import { IndiaEvMap } from "../components/IndiaEvMap";
import { StationFilterPanel, StationFiltersState } from "../components/StationFilterPanel";
import { StationDetailModal } from "../components/StationDetailModal";
import { stations, Station } from "../data/stations";

type StationSearch = {
  city?: string | undefined;
  type?: "dc" | "ac" | "all" | undefined;
  connector?: string | undefined;
  power?: string | undefined;
  availability?: "available" | "limited" | "all" | undefined;
  amenity?: string | undefined;
  maxPrice?: string | undefined;
  onlyFreePorts?: boolean | undefined;
  view?: "grid" | "split" | "map" | undefined;
};

export const Route = createFileRoute("/stations")({
  validateSearch: (search: Record<string, unknown>): StationSearch => ({
    city: typeof search["city"] === "string" ? search["city"] : undefined,
    type:
      search["type"] === "dc" || search["type"] === "ac" || search["type"] === "all"
        ? (search["type"] as "dc" | "ac" | "all")
        : undefined,
    connector: typeof search["connector"] === "string" ? search["connector"] : undefined,
    power: typeof search["power"] === "string" ? search["power"] : undefined,
    availability:
      search["availability"] === "available" ||
        search["availability"] === "limited" ||
        search["availability"] === "all"
        ? (search["availability"] as "available" | "limited" | "all")
        : undefined,
    amenity: typeof search["amenity"] === "string" ? search["amenity"] : undefined,
    maxPrice: typeof search["maxPrice"] === "string" ? search["maxPrice"] : undefined,
    onlyFreePorts:
      search["onlyFreePorts"] === true || search["onlyFreePorts"] === "true" ? true : undefined,
    view:
      search["view"] === "grid" || search["view"] === "split" || search["view"] === "map"
        ? (search["view"] as "grid" | "split" | "map")
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse EV Charging Stations in India | EvFinder" },
      {
        name: "description",
        content:
          "Filter India's EV charging network by city, charging type (DC Fast / AC), connector type, speed (kW), availability with instant Google Maps GPS directions.",
      },
      { property: "og:title", content: "Browse EV Charging Stations in India" },
      {
        property: "og:description",
        content:
          "Search and filter EV charging stations across India with live port status, speed filters, and Google Maps GPS navigation.",
      },
    ],
  }),
  component: StationsPage,
});

function StationsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/stations" });

  const viewMode = search.view || "split";
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [projectedStation, setProjectedStation] = useState<Station | null>(null);

  const setFilter = (patch: Partial<StationSearch>) => {
    navigate({
      search: (prev: any) => {
        const updated: any = { ...prev, ...patch };
        Object.keys(updated).forEach((k) => {
          if (updated[k] === undefined || updated[k] === null || updated[k] === "") {
            delete updated[k];
          }
        });
        return updated;
      },
    });
  };

  const resetFilters = () =>
    navigate({ search: { view: viewMode } as any });

  // Comprehensive Multi-dimensional Filtering Logic
  const results = useMemo(() => {
    return stations.filter((s) => {
      // 1. City Filter
      if (search.city && s.city.toLowerCase() !== search.city.toLowerCase()) return false;

      // 2. Charging Type (DC Fast vs AC)
      if (search.type === "dc") {
        const isDc =
          s.maxPowerKw >= 50 ||
          s.connectors.some(
            (c) =>
              c.toUpperCase().includes("CCS") ||
              c.toUpperCase().includes("DC") ||
              c.toUpperCase().includes("CHADEMO")
          );
        if (!isDc) return false;
      } else if (search.type === "ac") {
        const isAc = s.connectors.some(
          (c) => c.toUpperCase().includes("AC") || c.toUpperCase().includes("TYPE 2")
        );
        if (!isAc) return false;
      }

      // 3. Connector Type
      if (search.connector && !s.connectors.includes(search.connector)) return false;

      // 4. Charging Speed / Min Power (kW)
      if (search.power && s.maxPowerKw < Number(search.power)) return false;

      // 5. Availability Status
      if (search.availability === "available" && s.status !== "available") return false;
      if (search.availability === "limited" && s.status !== "limited") return false;

      // 6. Free Ports Check
      if (search.onlyFreePorts && s.freePorts <= 0) return false;

      // 7. Max Price
      if (search.maxPrice && s.pricePerKwh > Number(search.maxPrice)) return false;

      // 8. Amenities
      if (
        search.amenity &&
        !s.amenities.some((a) => a.toLowerCase().includes(search.amenity!.toLowerCase()))
      )
        return false;

      return true;
    });
  }, [
    search.city,
    search.type,
    search.connector,
    search.power,
    search.availability,
    search.onlyFreePorts,
    search.maxPrice,
    search.amenity,
  ]);

  const handleSelectStationFromMap = (station: Station) => {
    setSelectedStationId(station.id);
    setProjectedStation(station);
  };

  const handleMapCityChange = (city: string) => {
    setFilter({ city: city === "All India" ? undefined : city });
  };

  return (
    <SiteChrome>
      {/* Header & Controls */}
      <section className="px-6 sm:px-8 lg:px-14 pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="status-chip mb-2">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Advanced EV Filters · Instant GPS Directions
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tight">
              Charging Stations {search.city ? `in ${search.city}` : "Across India"}
            </h1>
            <p className="mt-2 max-w-xl text-frost/70 text-sm">
              Click any charging station to project details and launch exact Google Maps navigation.
            </p>
          </div>

          {/* View Switcher Controls */}
          <div className="flex items-center gap-1 rounded-2xl border border-border bg-ink2/80 p-1.5 self-start md:self-auto backdrop-blur-md shadow-lg">
            <button
              onClick={() => setFilter({ view: "split" })}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${viewMode === "split"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-frost hover:text-foreground"
                }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
              Split View
            </button>
            <button
              onClick={() => setFilter({ view: "map" })}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${viewMode === "map"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-frost hover:text-foreground"
                }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              Map Only
            </button>
            <button
              onClick={() => setFilter({ view: "grid" })}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-frost hover:text-foreground"
                }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Grid View
            </button>
          </div>
        </div>

        {/* Quick Filter Badges Row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border/60 text-xs">
          <span className="text-frost/60 font-semibold text-[11px]">Quick Filters:</span>
          <button
            onClick={() => setFilter({ type: search.type === "dc" ? undefined : "dc" })}
            className={`rounded-full px-3 py-1 font-semibold transition ${search.type === "dc"
                ? "bg-accent text-accent-foreground border border-accent/50 shadow"
                : "border border-border bg-ink2/50 text-frost hover:text-foreground"
              }`}
          >
            ⚡ DC Fast Only
          </button>
          <button
            onClick={() =>
              setFilter({
                availability: search.availability === "available" ? undefined : "available",
              })
            }
            className={`rounded-full px-3 py-1 font-semibold transition ${search.availability === "available"
                ? "bg-emerald-500 text-white border border-emerald-400 shadow"
                : "border border-border bg-ink2/50 text-frost hover:text-foreground"
              }`}
          >
            🟢 Available Now
          </button>
          <button
            onClick={() => setFilter({ power: search.power === "100" ? undefined : "100" })}
            className={`rounded-full px-3 py-1 font-semibold transition ${search.power === "100"
                ? "bg-primary text-primary-foreground border border-primary/50 shadow"
                : "border border-border bg-ink2/50 text-frost hover:text-foreground"
              }`}
          >
            🚀 100 kW+ Rapid
          </button>
          <button
            onClick={() =>
              setFilter({ onlyFreePorts: search.onlyFreePorts ? undefined : true })
            }
            className={`rounded-full px-3 py-1 font-semibold transition ${search.onlyFreePorts
                ? "bg-accent text-accent-foreground border border-accent/50 shadow"
                : "border border-border bg-ink2/50 text-frost hover:text-foreground"
              }`}
          >
            🔌 Has Free Ports
          </button>
          {(search.city ||
            search.type ||
            search.connector ||
            search.power ||
            search.availability ||
            search.amenity ||
            search.maxPrice ||
            search.onlyFreePorts) && (
              <button
                onClick={resetFilters}
                className="text-accent text-xs font-bold hover:underline ml-2"
              >
                Reset All Filters (×)
              </button>
            )}
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="px-6 sm:px-8 lg:px-14 pb-14">
        {/* VIEW: MAP ONLY */}
        {viewMode === "map" && (
          <div className="h-[calc(100vh-220px)] min-h-[550px] rounded-2xl overflow-hidden shadow-2xl">
            <IndiaEvMap
              stations={results}
              selectedStationId={selectedStationId}
              selectedCity={search.city}
              onCityChange={handleMapCityChange}
              onSelectStation={handleSelectStationFromMap}
              height="100%"
              showControls={true}
              showCitySelector={true}
              showLayerSelector={true}
              showRangeOverlay={true}
              enableLocateMe={true}
            />
          </div>
        )}

        {/* VIEW: SPLIT (Sidebar Filter Panel, Interactive Map, Stations List) */}
        {viewMode === "split" && (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left: Comprehensive Filters Sidebar */}
            <aside className="lg:col-span-3 rounded-2xl glass-panel p-5 max-h-[720px] overflow-y-auto custom-scrollbar shadow-xl border border-border/80">
              <StationFilterPanel
                filters={search as StationFiltersState}
                onFilterChange={setFilter}
                onReset={resetFilters}
                totalResults={results.length}
              />
            </aside>

            {/* Middle: Interactive Open Map */}
            <div className="lg:col-span-5 h-[680px] rounded-2xl overflow-hidden shadow-2xl sticky top-6 border border-border/80">
              <IndiaEvMap
                stations={results}
                selectedStationId={selectedStationId}
                selectedCity={search.city}
                onCityChange={handleMapCityChange}
                onSelectStation={handleSelectStationFromMap}
                height="100%"
                showControls={true}
                showCitySelector={false}
                showLayerSelector={true}
                showRangeOverlay={true}
                enableLocateMe={true}
              />
            </div>

            {/* Right: Station Cards List */}
            <div className="lg:col-span-4 space-y-3.5 max-h-[680px] overflow-y-auto custom-scrollbar pr-1">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-frost">
                  {results.length} charging station{results.length === 1 ? "" : "s"} found
                </span>
                <span className="text-[10px] text-frost/60">Click card or pin for details</span>
              </div>

              {results.length === 0 ? (
                <div className="rounded-2xl glass-panel-subtle p-8 text-center text-frost/70 text-xs">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="font-bold text-foreground">No stations match these filters.</p>
                  <p className="mt-1 text-[11px]">Try easing your speed, connector, or availability filters.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 rounded-xl charge-button px-4 py-2 text-xs font-bold shadow"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                results.map((s) => (
                  <div
                    key={s.id}
                    onMouseEnter={() => setSelectedStationId(s.id)}
                    className={`transition rounded-2xl ${selectedStationId === s.id
                        ? "ring-2 ring-accent scale-[1.01]"
                        : ""
                      }`}
                  >
                    <StationCard
                      station={s}
                      onSelect={(st) => {
                        setSelectedStationId(st.id);
                        setProjectedStation(st);
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW: GRID ONLY */}
        {viewMode === "grid" && (
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <aside className="h-fit lg:sticky lg:top-6 rounded-2xl glass-panel p-5 shadow-xl border border-border/80">
              <StationFilterPanel
                filters={search as StationFiltersState}
                onFilterChange={setFilter}
                onReset={resetFilters}
                totalResults={results.length}
              />
            </aside>

            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold text-frost">
                  Showing {results.length} station{results.length === 1 ? "" : "s"}
                  {search.city ? ` in ${search.city}` : " across India"}
                </p>
                {(search.city ||
                  search.type ||
                  search.connector ||
                  search.power ||
                  search.availability ||
                  search.amenity ||
                  search.maxPrice ||
                  search.onlyFreePorts) && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-accent font-semibold hover:underline"
                    >
                      Reset Filters
                    </button>
                  )}
              </div>

              {results.length === 0 ? (
                <div className="rounded-2xl glass-panel-subtle p-12 text-center text-frost">
                  <div className="text-3xl mb-3">⚡</div>
                  <p className="font-bold text-foreground text-base">No stations found matching filters</p>
                  <p className="text-xs text-frost/70 mt-1">Try selecting a different city, speed tier, or connector type.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-5 rounded-full charge-button px-6 py-2.5 text-xs font-bold shadow-lg"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((s) => (
                    <StationCard
                      key={s.id}
                      station={s}
                      onSelect={(st) => {
                        setSelectedStationId(st.id);
                        setProjectedStation(st);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Projected Station Details Modal */}
      <StationDetailModal
        station={projectedStation}
        onClose={() => setProjectedStation(null)}
      />
    </SiteChrome>
  );
}
