import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-body text-foreground">
      {/* ambient gradient light */}
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-glow -top-40 -left-32 h-[520px] w-[520px] bg-primary/30" />
        <div className="ambient-glow top-1/3 right-[-120px] h-[460px] w-[460px] bg-accent/20" />
        <div className="ambient-glow bottom-[-160px] left-1/4 h-[420px] w-[420px] bg-frost/10" />
      </div>

      {/* kinetic diagonal frosted strips */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-24 left-[8%] h-72 w-40 -skew-x-12 rounded-2xl bg-foreground/[0.04] backdrop-blur-md border border-border" />
        <div className="absolute top-1/2 right-[14%] h-96 w-48 -skew-x-12 rounded-2xl bg-foreground/[0.05] backdrop-blur-md border border-border" />
        <div className="absolute bottom-10 left-[38%] h-56 w-32 -skew-x-12 rounded-2xl bg-accent/5 backdrop-blur-md border border-accent/15" />
      </div>

      <div className="relative">
        <header className="flex items-center justify-between px-8 lg:px-14 py-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl charge-button font-display font-black text-accent-foreground">
              V
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight">
              VoltGrid
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-frost/80">
            <Link to="/stations" className="hover:text-foreground transition">
              Stations
            </Link>
            <Link to="/stations" className="hover:text-foreground transition">
              Networks
            </Link>
            <Link to="/stations" className="hover:text-foreground transition">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:block rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/90 hover:bg-foreground/5 transition">
              Sign in
            </button>
            <Link
              to="/stations"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-accent transition"
            >
              Find a charger
            </Link>
          </div>
        </header>

        {children}

        <footer className="px-8 lg:px-14 pb-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8 text-sm text-frost/50">
          <span className="font-display font-bold text-foreground">VoltGrid</span>
          <div className="flex gap-6">
            <Link to="/stations" className="hover:text-foreground transition">
              Stations
            </Link>
            <Link to="/stations" className="hover:text-foreground transition">
              For networks
            </Link>
            <Link to="/stations" className="hover:text-foreground transition">
              Support
            </Link>
          </div>
          <span>© 2026 VoltGrid Energy</span>
        </footer>
      </div>
    </div>
  );
}
