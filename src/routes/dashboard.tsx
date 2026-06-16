import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { heroImages } from "@/lib/hero-images";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Star, TrendingUp, BookOpen, Activity, Bot, User, Sliders, UserCheck, StarOff, Check } from "lucide-react";
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
  const [watchlist, setWatchlist] = useState<typeof signals>(signals.slice(0, 4));
  const [profile, setProfile] = useState({ name: "Jane Doe", email: "jane.doe@thefortfx.ai" });
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [gridBg, setGridBg] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  
  const saved = signals.slice(2, 6);

  const toggleWatchlistPair = (symbol: string) => {
    const exists = watchlist.some((s) => s.symbol === symbol);
    if (exists) {
      setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
    } else {
      const pairToAdd = signals.find((s) => s.symbol === symbol);
      if (pairToAdd) {
        setWatchlist((prev) => [...prev, pairToAdd]);
      }
    }
  };

  return (
    <Shell>
      <PageHeader eyebrow="Dashboard" title={`Welcome back, ${profile.name}`} description="Your personalized trading command center." image={heroImages.trading} />
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="overview">Market Overview</TabsTrigger>
              <TabsTrigger value="settings">Account & Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* KPI Section */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KPI label="Win Rate" value="64%" trend="+3.2%" icon={TrendingUp} />
                <KPI label="Profit Factor" value="1.84" trend="+0.12" icon={Activity} />
                <KPI label="Avg R:R" value="1:2.1" trend="+0.05" icon={Bot} />
                <KPI label="Open Trades" value={String(watchlist.length)} trend={`${watchlist.filter(w => w.direction === 'BUY').length} buy, ${watchlist.filter(w => w.direction === 'SELL').length} sell`} icon={Star} />
              </div>

              {/* Main Content Area */}
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-border bg-surface p-6 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">My Watchlist</h2>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">Manage Watchlist</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md border border-border bg-surface shadow-2xl">
                        <DialogHeader>
                          <DialogTitle>Manage Watchlist</DialogTitle>
                          <DialogDescription>
                            Select the currency pairs and instruments to track on your dashboard.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-80 overflow-y-auto divide-y divide-border pr-2">
                          {signals.map((s) => {
                            const isTracked = watchlist.some((w) => w.symbol === s.symbol);
                            return (
                              <div key={s.symbol} className="flex items-center justify-between py-2.5">
                                <span className="font-medium text-sm">{s.pair}</span>
                                <Button
                                  size="sm"
                                  variant={isTracked ? "destructive" : "outline"}
                                  onClick={() => toggleWatchlistPair(s.symbol)}
                                  className="h-8 text-xs"
                                >
                                  {isTracked ? <><StarOff className="mr-1 h-3 w-3" /> Remove</> : <><Check className="mr-1 h-3 w-3" /> Add</>}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mt-4 divide-y divide-border">
                    {watchlist.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        Your watchlist is empty. Click "Manage Watchlist" above to add pairs.
                      </div>
                    ) : (
                      watchlist.map((s) => (
                        <Link key={s.symbol} to="/signals/$pair" params={{ pair: s.symbol }} className="flex items-center justify-between py-3 hover:bg-surface-elevated rounded-md px-2 transition-colors">
                          <div className="flex items-center gap-3">
                            <Star className="h-4 w-4 text-warning fill-current" />
                            <div>
                              <p className="font-medium text-sm">{s.pair}</p>
                              <p className="font-mono text-xs text-muted-foreground">{s.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`font-mono text-sm ${s.changePct >= 0 ? "text-bullish" : "text-bearish"}`}>{s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%</span>
                            <DirectionBadge d={s.direction} />
                          </div>
                        </Link>
                      ))
                    )}
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
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border bg-surface p-6 md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Profile Settings</h2>
                    <p className="text-xs text-muted-foreground mt-1">Configure your personal trader profile info.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Name</span>
                      <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</span>
                      <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </label>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Subscription Status: Pro Trader Tier</p>
                      <p className="text-xs text-muted-foreground">Your account has full access to advanced indicators, live feeds, and layout settings.</p>
                    </div>
                  </div>
                </Card>

                <Card className="border-border bg-surface p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2"><Sliders className="h-5 w-5 text-primary" /> Platform Preferences</h2>
                    <p className="text-xs text-muted-foreground mt-1">Customize your terminal interface behavior.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Notification Sounds</p>
                        <p className="text-[11px] text-muted-foreground">Play a ping sound when a new signal lands.</p>
                      </div>
                      <Switch checked={soundAlerts} onCheckedChange={soundAlerts => setSoundAlerts(soundAlerts)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Grid Layout Background</p>
                        <p className="text-[11px] text-muted-foreground">Render micro-grid background behind pages.</p>
                      </div>
                      <Switch checked={gridBg} onCheckedChange={gridBg => setGridBg(gridBg)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Compact Interface Mode</p>
                        <p className="text-[11px] text-muted-foreground">Denser padding and smaller card typography.</p>
                      </div>
                      <Switch checked={compactMode} onCheckedChange={compactMode => setCompactMode(compactMode)} />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

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
