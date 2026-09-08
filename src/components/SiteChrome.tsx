import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-body text-foreground transition-colors duration-300">
      {/* ambient gradient light */}
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-glow -top-40 -left-32 h-[520px] w-[520px] bg-primary/25" />
        <div className="ambient-glow top-1/3 right-[-120px] h-[460px] w-[460px] bg-accent/20" />
        <div className="ambient-glow bottom-[-160px] left-1/4 h-[420px] w-[420px] bg-primary/10" />
      </div>

      {/* kinetic diagonal frosted strips */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-24 left-[8%] h-72 w-40 -skew-x-12 rounded-2xl bg-foreground/[0.03] backdrop-blur-md border border-border" />
        <div className="absolute top-1/2 right-[14%] h-96 w-48 -skew-x-12 rounded-2xl bg-foreground/[0.04] backdrop-blur-md border border-border" />
        <div className="absolute bottom-10 left-[38%] h-56 w-32 -skew-x-12 rounded-2xl bg-accent/5 backdrop-blur-md border border-accent/15" />
      </div>

      <div className="relative">
        <header className="flex items-center justify-between px-6 sm:px-8 lg:px-14 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl charge-button font-display font-black shadow-md shadow-primary/20">
              E
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight">
              EvFinder
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-frost/80">
            <Link
              to="/map"
              className="flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition"
            >
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              Live Map
            </Link>
            <Link to="/stations" className="hover:text-foreground transition">
              Stations Directory
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              to="/map"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-ink2/70 px-4 py-2 text-xs font-semibold text-frost hover:border-accent/40 hover:text-foreground transition"
            >
              <span>🗺️ Open Map</span>
            </Link>
            <Link
              to="/stations"
              className="rounded-full charge-button px-4 py-2 text-xs sm:text-sm font-bold hover:opacity-95 transition shadow-lg"
            >
              Find a charger
            </Link>
          </div>
        </header>

        {children}

        <footer className="px-6 sm:px-8 lg:px-14 pb-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8 text-sm text-frost/60">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-foreground">EvFinder India</span>
            <span className="text-xs text-frost/50">· OpenStreetMap Powered</span>
            <ThemeToggle className="size-7 rounded-lg text-xs" />
          </div>
          <div className="flex flex-wrap gap-6 text-xs sm:text-sm">
            <Link to="/map" className="text-accent hover:underline">
              Live Map
            </Link>
            <Link to="/stations" className="hover:text-foreground transition">
              Stations Directory
            </Link>
            <Link to="/stations" className="hover:text-foreground transition">
              Support
            </Link>
          </div>
          <span>© 2026 EvFinder Energy</span>
        </footer>
      </div>
    </div>
  );
}
