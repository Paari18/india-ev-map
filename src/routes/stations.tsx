import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteChrome } from "../components/SiteChrome";
import { StationCard } from "../components/StationCard";
import { cities, stations } from "../data/stations";

type StationSearch = {
  city?: string | undefined;
  connector?: string | undefined;
  power?: string | undefined;
};

export const Route = createFileRoute("/stations")({
  validateSearch: (search: Record<string, unknown>): StationSearch => ({
    city: typeof search["city"] === "string" ? search["city"] : undefined,
    connector: typeof search["connector"] === "string" ? search["connector"] : undefined,
    power: typeof search["power"] === "string" ? search["power"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse EV Charging Stations in India | VoltGrid" },
      {
        name: "description",
        content:
          "Browse and filter EV charging stations across Indian cities by connector type, charging speed, network and live availability.",
      },
      { property: "og:title", content: "Browse EV Charging Stations in India" },
      {
        property: "og:description",
        content:
          "Filter India's EV charging network by city, connector, power and availability.",
      },
    ],
  }),
  component: StationsPage,
});

const connectors = ["CCS2", "Type 2 AC", "CHAdeMO", "Bharat DC-001"];
const powers = [
  { key: "50", label: "50 kW+" },
  { key: "100", label: "100 kW+" },
  { key: "150", label: "150 kW+" },
];

function StationsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/stations" });

  const setFilter = (patch: StationSearch) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const results = useMemo(() => {
    return stations.filter((s) => {
      if (search.city && s.city !== search.city) return false;
      if (search.connector && !s.connectors.includes(search.connector)) return false;
      if (search.power && s.maxPowerKw < Number(search.power)) return false;
      return true;
    });
  }, [search.city, search.connector, search.power]);

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "border border-accent/40 bg-accent/15 text-accent"
        : "border border-border text-frost/70 hover:text-foreground"
    }`;

  return (
    <SiteChrome>
      <section className="px-8 lg:px-14 pt-6 pb-4">
        <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tight">
          All charging stations
        </h1>
        <p className="mt-3 max-w-xl text-frost/70">
          Every public EV charging point on the VoltGrid network, filtered live.
        </p>
      </section>

      <div className="px-8 lg:px-14 pb-14 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="h-fit lg:sticky lg:top-6 rounded-2xl glass-panel p-5 space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold">Filters</span>
            <button
              className="text-xs text-accent hover:underline"
              onClick={() =>
                navigate({ search: {} as StationSearch })
              }
            >
              Reset
            </button>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-frost/50 mb-2">
              City
            </p>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <button
                  key={c.name}
                  className={chip(search.city === c.name)}
                  onClick={() =>
                    setFilter({ city: search.city === c.name ? undefined : c.name })
                  }
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-frost/50 mb-2">
              Connector
            </p>
            <div className="flex flex-wrap gap-2">
              {connectors.map((c) => (
                <button
                  key={c}
                  className={chip(search.connector === c)}
                  onClick={() =>
                    setFilter({
                      connector: search.connector === c ? undefined : c,
                    })
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-frost/50 mb-2">
              Charging speed
            </p>
            <div className="flex flex-wrap gap-2">
              {powers.map((p) => (
                <button
                  key={p.key}
                  className={chip(search.power === p.key)}
                  onClick={() =>
                    setFilter({ power: search.power === p.key ? undefined : p.key })
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <p className="text-sm text-frost/60 mb-5">
            {results.length} station{results.length === 1 ? "" : "s"}
            {search.city ? ` in ${search.city}` : " across India"}
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl glass-panel-subtle p-10 text-center text-frost/60">
              No stations match these filters yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map((s) => (
                <StationCard key={s.id} station={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
