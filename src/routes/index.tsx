import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteChrome } from "../components/SiteChrome";
import { StationCard } from "../components/StationCard";
import { cities, stations } from "../data/stations";
import indiaMap from "../assets/india-grid-map.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoltGrid — EV Charging Stations Across India" },
      {
        name: "description",
        content:
          "Find EV charging stations across India. Search 48,200+ charging points by city, connector, power and live availability.",
      },
      { property: "og:title", content: "VoltGrid — EV Charging Stations Across India" },
      {
        property: "og:description",
        content:
          "Search EV charging stations in Delhi, Mumbai, Bengaluru, Hyderabad and 28 states with live availability and pricing.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const nearby = stations.filter((s) => s.city === "Bengaluru").slice(0, 3);

  return (
    <SiteChrome>
      <section className="px-8 lg:px-14 pt-10 pb-8">
        <div className="max-w-3xl">
          <div className="status-chip">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Live
            network · 28 states
          </div>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
            Charge anywhere
            <br />
            <span className="text-charge-gradient">across India.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-frost/70 leading-relaxed">
            Navigate 48,200+ public EV charging points from Delhi to Kanyakumari.
            Filter by power, network, and live availability — then plug in and go.
          </p>
        </div>

        <div className="mt-8 max-w-3xl rounded-2xl glass-panel p-4 shadow-2xl shadow-primary/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-ink2/60 px-4 py-3">
              <span className="text-[11px] uppercase tracking-wider text-frost/50">
                Location
              </span>
              <p className="mt-1 font-medium text-foreground">Bengaluru, KA</p>
            </div>
            <div className="rounded-xl border border-border bg-ink2/60 px-4 py-3">
              <span className="text-[11px] uppercase tracking-wider text-frost/50">
                Power
              </span>
              <p className="mt-1 font-medium text-foreground">11kW · DC Fast</p>
            </div>
            <Link
              to="/stations"
              className="grid place-items-center rounded-xl charge-button px-4 py-3 font-display font-bold hover:opacity-95 transition"
            >
              Find stations
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border px-3 py-1 text-frost/70">
              Anytime
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-frost/70">
              24×7
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-frost/70">
              UPI payment
            </span>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-accent">
              Free parking
            </span>
          </div>
        </div>
      </section>

      <section className="px-8 lg:px-14 py-4 flex flex-wrap gap-4">
        {[
          { v: "48,200+", l: "Charging points" },
          { v: "1,420", l: "Stations live now" },
          { v: "32", l: "Partner networks" },
          { v: "74k", l: "Drivers on board" },
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

      <section className="px-8 lg:px-14 py-6">
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <Link
              key={c.name}
              to="/stations"
              search={{ city: c.name }}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-frost/70 hover:border-accent/40 hover:text-foreground transition"
            >
              {c.name} <span className="text-frost/40">{c.stations}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-8 lg:px-14 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              Near Bengaluru
            </h2>
            <p className="text-sm text-frost/60 mt-1">
              Sorted by distance · {nearby.length} stations
            </p>
          </div>
          <Link
            to="/stations"
            className="text-sm font-semibold text-accent hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {nearby.map((s) => (
            <StationCard key={s.id} station={s} />
          ))}
        </div>
      </section>

      <section className="px-8 lg:px-14 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-ink2 to-background p-8 lg:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                One tap to the
                <br />
                nearest live charger.
              </h2>
              <p className="mt-4 max-w-md text-frost/70">
                Real-time plug status, network pricing, and turn-by-turn routing in a
                single lightweight app.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/stations"
                  className="rounded-full charge-button px-6 py-3 font-display font-bold hover:opacity-95 transition"
                >
                  Browse all stations
                </Link>
              </div>
            </div>
            <img
              src={indiaMap}
              alt="Map of India showing glowing EV charging station nodes across major cities"
              width={1024}
              height={768}
              loading="lazy"
              className="w-full aspect-[4/3] rounded-2xl object-cover border border-border"
            />
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
