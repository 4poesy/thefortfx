import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles, ChevronDown, Wrench, Bell, Volume2, VolumeX, Flame, CalendarRange, CheckCircle2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
          <NotificationCenter />
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

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "signal" | "news" | "system";
}

const initialNotifications: Notification[] = [
  { id: "1", title: "EUR/USD Buy Signal", body: "New high-confidence Buy setup detected (89% Confidence). Entry: 1.0820.", time: "2m ago", read: false, type: "signal" },
  { id: "2", title: "High Impact News Alert", body: "US Core CPI (YoY) coming up in 30 minutes. High volatility expected.", time: "15m ago", read: false, type: "news" },
  { id: "3", title: "Take Profit Reached", body: "USD/JPY long position hit target at 157.40 (+108 pips).", time: "1h ago", read: true, type: "signal" },
  { id: "4", title: "Welcome to TheFortFX", body: "Verify your email to unlock live advanced chart analysis tools.", time: "1d ago", read: true, type: "system" },
];

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="View notifications"
          className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-bearish text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 sm:w-96 border border-border bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-border bg-surface-elevated/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute sound" : "Unmute sound"}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-bearish" />}
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-muted-foreground">
              <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <span>No notifications yet.</span>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-3 px-4 py-3 text-left transition-colors ${n.read ? "bg-transparent" : "bg-primary/5 hover:bg-primary/10"}`}
              >
                <div className="mt-0.5 shrink-0">
                  {n.type === "signal" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bullish/10 text-bullish">
                      <Flame className="h-3.5 w-3.5" />
                    </div>
                  ) : n.type === "news" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warning/10 text-warning">
                      <CalendarRange className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1 font-sans">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground leading-none">{n.title}</p>
                    <span className="font-mono text-[9px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">{n.body}</p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => toggleRead(n.id)}
                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                    >
                      <Check className="h-3 w-3" />
                      {n.read ? "Mark unread" : "Mark read"}
                    </button>
                    <span className="text-[10px] text-muted-foreground/30">|</span>
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="text-[10px] text-bearish hover:underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
