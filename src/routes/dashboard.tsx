import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bell, Star, TrendingUp, BookOpen, Activity, Bot } from "lucide-react";
import { signals, opportunities } from "@/lib/mock-data";
import { DirectionBadge } from "@/components/badges";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TheFortFX" },
      { name: "description", content: "Your personalized forex dashboard: watchlist, saved signals, recent forecasts, and performance overview." },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const watchlist = signals.slice(0, 4);
  const saved = signals.slice(2, 6);

  return (
    <Shell>
      <PageHeader eyebrow="Dashboard" title="Welcome back, Trader" description="Your personalized trading command center." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI label="Win Rate" value="64%" trend="+3.2%" icon={TrendingUp} />
            <KPI label="Profit Factor" value="1.84" trend="+0.12" icon={Activity} />
            <KPI label="Avg R:R" value="1:2.1" trend="+0.05" icon={Bot} />
            <KPI label="Open Trades" value="3" trend="2 winning" icon={Star} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-border bg-surface p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Watchlist</h2>
                <Button size="sm" variant="outline">Add pair</Button>
              </div>
              <div className="mt-4 divide-y divide-border">
                {watchlist.map((s) => (
                  <Link key={s.symbol} to="/signals/$pair" params={{ pair: s.symbol }} className="flex items-center justify-between py-3 hover:bg-surface-elevated">
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-warning" />
                      <div>
                        <p className="font-medium">{s.pair}</p>
                        <p className="font-mono text-xs text-muted-foreground">{s.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-mono text-sm ${s.changePct >= 0 ? "text-bullish" : "text-bearish"}`}>{s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%</span>
                      <DirectionBadge d={s.direction} />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Opportunity Alerts</h2>
              <div className="mt-4 space-y-3">
                {opportunities.slice(0, 4).map((o) => (
                  <div key={o.symbol} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary"><Bell className="h-4 w-4" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{o.pair} · Score {o.score}</p>
                      <p className="text-xs text-muted-foreground">{o.sentiment} bias · {o.trend} trend</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Saved Signals</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {saved.map((s) => (
                  <Link key={s.symbol} to="/signals/$pair" params={{ pair: s.symbol }} className="rounded-lg border border-border bg-background p-3 hover:border-primary/40">
                    <div className="flex items-center justify-between"><span className="font-medium">{s.pair}</span><DirectionBadge d={s.direction} /></div>
                    <Progress value={s.confidence} className="mt-3" />
                    <p className="mt-1 text-xs text-muted-foreground">{s.confidence}% confidence</p>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Performance Overview</h2>
              <div className="mt-4 space-y-4">
                <Bar label="EUR/USD" value={82} positive />
                <Bar label="XAU/USD" value={68} positive />
                <Bar label="GBP/USD" value={-22} />
                <Bar label="USD/JPY" value={54} positive />
                <Bar label="BTC/USD" value={91} positive />
              </div>
              <Link to="/journal" className="mt-6 inline-flex"><Button variant="outline"><BookOpen className="mr-2 h-4 w-4" />Open trading journal</Button></Link>
            </Card>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function KPI({ label, value, trend, icon: Icon }: { label: string; value: string; trend: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="border-border bg-surface p-5">
      <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><Icon className="h-4 w-4 text-primary" /></div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-accent">{trend}</p>
    </Card>
  );
}
function Bar({ label, value, positive }: { label: string; value: number; positive?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs"><span>{label}</span><span className={positive ? "text-bullish" : "text-bearish"}>{value > 0 ? "+" : ""}{value}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className={positive ? "h-full bg-bullish" : "h-full bg-bearish"} style={{ width: `${Math.min(100, Math.abs(value))}%` }} />
      </div>
    </div>
  );
}
