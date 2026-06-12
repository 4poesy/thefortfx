import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles, ChevronDown, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { to: "/forecasts", label: "Forecasts" },
  { to: "/signals", label: "Signals" },
  { to: "/pairs", label: "Pairs" },
] as const;

const navLinksAfter = [
  { to: "/economic-calendar", label: "Calendar" },
  { to: "/brokers", label: "Brokers" },
  { to: "/learn", label: "Learn" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
] as const;

const toolItems = [
  { to: "/opportunities", label: "Opportunity Scanner" },
  { to: "/calculators/pip-calculator", label: "Pip Calculator" },
  { to: "/calculators/position-size", label: "Position Size Calculator" },
  { to: "/calculators/risk-reward", label: "Risk:Reward Calculator" },
  { to: "/ai-assistant", label: "AI Trade Assistant" },
  { to: "/calculators", label: "All Calculators" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const linkCls = "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-semibold tracking-tight">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="truncate text-foreground">TheFortFX</span>
          <span className="hidden rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline">AI</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={linkCls} activeProps={{ className: "rounded-md px-3 py-2 text-sm text-foreground bg-secondary" }}>
              {l.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className={`${linkCls} flex items-center gap-1`}>
              Tools <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {toolItems.map((t) => (
                <DropdownMenuItem key={t.to} asChild>
                  <Link to={t.to} className="flex w-full cursor-pointer items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-muted-foreground" />{t.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {navLinksAfter.map((l) => (
            <Link key={l.to} to={l.to} className={linkCls} activeProps={{ className: "rounded-md px-3 py-2 text-sm text-foreground bg-secondary" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 xl:flex">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
          <button
            aria-label="Toggle menu"
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground xl:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 xl:hidden">
          <div className="space-y-1 px-4 py-3">
            {[...navLinks, ...navLinksAfter].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tools</p>
              {toolItems.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {t.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-2 pt-3">
              <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
