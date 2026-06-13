import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, TrendingDown, Activity, Sparkles, BarChart3, Calculator, Bot, ShieldCheck, Calendar, Building2, BookOpen, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { signals, marketSentiment, economicEvents, brokers } from "@/lib/mock-data";
import heroTrading from "@/assets/hero-trading.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Trading Command Center | TheFortFX" },
      { name: "description", content: "TheFortFX is your trading command center: AI-powered forex signals, forecasts, sentiment, an economic calendar, and pro risk tools — all in one place." },
      { property: "og:title", content: "Your Trading Command Center | TheFortFX" },
      { property: "og:description", content: "AI-powered forex signals, forecasts, sentiment, and risk tools — all in one command center." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const tickerPairs = signals.slice(0, 10);

function HomePage() {
  return (
    <Shell>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60 bg-surface/30">
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-accent pulse-live" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>
                Live signals from 50+ aggregated sources
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your <span className="text-primary">Trading Command Center</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                AI-powered forex signals, forecasts, market sentiment, and professional risk tools — unified in one intelligent platform built for serious traders.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/opportunities"><Button size="lg" className="bg-primary hover:bg-primary/90">View Opportunities <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                <Link to="/calculators"><Button size="lg" variant="outline">Explore Tools</Button></Link>
              </div>
              <Link to="/forecasts" className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                See today's market forecast <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
                <img
                  src={heroTrading}
                  alt="TheFortFX trading command center dashboard with live forex candlestick charts"
                  width={1280}
                  height={832}
                  className="aspect-[16/10] h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-background p-3 shadow-xl sm:block">
                <div className="flex items-center gap-2 text-xs">
                  <Badge className="bg-bullish/15 text-bullish">BUY</Badge>
                  <span className="font-mono text-foreground">EUR/USD</span>
                  <span className="font-mono text-bullish">+0.42%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live ticker */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex gap-8 py-3 ticker-scroll whitespace-nowrap">
              {[...tickerPairs, ...tickerPairs].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-foreground">{s.pair}</span>
                  <span className="font-mono text-muted-foreground">{s.price}</span>
                  <span className={`font-mono text-xs ${s.changePct >= 0 ? "text-bullish" : "text-bearish"}`}>
                    {s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero dashboard preview */}
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <Card className="border-border bg-surface/60 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Top Opportunity</span>
                <Badge className="bg-accent/15 text-accent hover:bg-accent/20">Score 92</Badge>
              </div>
              <p className="mt-3 text-2xl font-bold">XAU/USD</p>
              <p className="text-sm text-muted-foreground">Gold — bullish breakout setup</p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <Badge variant="outline" className="border-bullish/30 text-bullish">BUY</Badge>
                <span className="text-muted-foreground">Confidence 91%</span>
              </div>
            </Card>
            <Card className="border-border bg-surface/60 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Market Sentiment</span>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-2xl font-bold">68% Bullish</p>
              <Progress value={68} className="mt-3" />
              <p className="mt-2 text-xs text-muted-foreground">Aggregated across 12 majors</p>
            </Card>
            <Card className="border-border bg-surface/60 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">AI Trade Score</span>
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-2xl font-bold">EUR/USD · 89</p>
              <p className="text-sm text-muted-foreground">High-probability long setup</p>
              <Link to="/ai-assistant" className="mt-4 inline-flex text-xs text-primary hover:underline">Open AI Assistant <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Card>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-b border-border/60 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["500+", "Currency Pairs Tracked"],
              ["50+", "Daily Market Signals"],
              ["100+", "Risk Tool Calculations"],
              ["24/7", "Market Monitoring"],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{n}</p>
                <p className="mt-1 text-sm text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <Section
        eyebrow="Market Opportunities"
        title="Today's high-probability setups"
        description="Live AI-ranked opportunities across major pairs, commodities, and crypto."
        link={{ to: "/opportunities", label: "View all opportunities" }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {signals.slice(0, 5).map((s) => (
            <Link key={s.symbol} to="/signals/$pair" params={{ pair: s.symbol }}>
              <Card className="group h-full border-border bg-surface p-5 transition-all hover:border-primary/40 hover:bg-surface-elevated">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{s.pair}</span>
                  <Badge className={s.direction === "BUY" ? "bg-bullish/15 text-bullish" : s.direction === "SELL" ? "bg-bearish/15 text-bearish" : "bg-neutral/15 text-neutral"}>
                    {s.direction}
                  </Badge>
                </div>
                <p className="mt-3 font-mono text-2xl font-bold">{s.price}</p>
                <p className={`text-xs font-mono ${s.changePct >= 0 ? "text-bullish" : "text-bearish"}`}>
                  {s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{s.confidence}%</span>
                  </div>
                  <Progress value={s.confidence} />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Risk</span>
                    <Badge variant="outline" className={s.risk === "Low" ? "border-bullish/30 text-bullish" : s.risk === "Medium" ? "border-warning/30 text-warning" : "border-bearish/30 text-bearish"}>{s.risk}</Badge>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">Updated {s.updated}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* SIGNAL CONSENSUS */}
      <Section eyebrow="Signal Consensus" title="What the market is signaling right now" description="Aggregated bullish vs bearish votes across leading analysts and AI models.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {signals.slice(0, 6).map((s) => (
            <Card key={s.symbol} className="border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{s.pair}</span>
                <span className="text-xs text-muted-foreground">{s.sources} sources</span>
              </div>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-secondary">
                <div className="bg-bullish" style={{ width: `${s.sentiment.bullish}%` }} />
                <div className="bg-bearish" style={{ width: `${s.sentiment.bearish}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="flex items-center gap-1 text-bullish"><TrendingUp className="h-3 w-3" />Bullish {s.sentiment.bullish}%</span>
                <span className="flex items-center gap-1 text-bearish"><TrendingDown className="h-3 w-3" />Bearish {s.sentiment.bearish}%</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* MARKET SENTIMENT */}
      <Section eyebrow="Market Sentiment" title="Cross-asset sentiment overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {marketSentiment.map((m) => (
            <Card key={m.category} className="border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{m.category}</span>
                {m.trend === "up" ? <TrendingUp className="h-4 w-4 text-bullish" /> : m.trend === "down" ? <TrendingDown className="h-4 w-4 text-bearish" /> : <Activity className="h-4 w-4 text-neutral" />}
              </div>
              <p className="mt-2 text-3xl font-bold">{m.bullish}%</p>
              <p className="text-xs text-muted-foreground">Bullish</p>
              <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="bg-bullish" style={{ width: `${m.bullish}%` }} />
                <div className="bg-neutral/40" style={{ width: `${m.neutral}%` }} />
                <div className="bg-bearish" style={{ width: `${m.bearish}%` }} />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ECONOMIC EVENTS */}
      <Section eyebrow="Economic Events" title="Upcoming high-impact events" link={{ to: "/economic-calendar", label: "View full calendar" }}>
        <Card className="overflow-hidden border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-surface-elevated text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Currency</th>
                  <th className="px-4 py-3 text-left">Event</th>
                  <th className="px-4 py-3 text-left">Impact</th>
                  <th className="px-4 py-3 text-right">Forecast</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {economicEvents.slice(0, 5).map((e, i) => (
                  <tr key={i} className="hover:bg-surface-elevated/60">
                    <td className="px-4 py-3 font-mono text-muted-foreground">{e.time}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{e.currency}</Badge></td>
                    <td className="px-4 py-3">{e.event}</td>
                    <td className="px-4 py-3"><ImpactBadge level={e.impact} /></td>
                    <td className="px-4 py-3 text-right font-mono">{e.forecast}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* RISK TOOLS */}
      <Section eyebrow="Risk Management" title="Professional trading calculators">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/calculators/pip-calculator", icon: Calculator, title: "Pip Calculator", desc: "Calculate pip value for any pair and lot size." },
            { to: "/calculators/position-size", icon: BarChart3, title: "Position Size Calculator", desc: "Right-size your trades to fit your risk profile." },
            { to: "/calculators/risk-reward", icon: ShieldCheck, title: "Risk Reward Calculator", desc: "Quickly compute your risk/reward ratio." },
            { to: "/calculators/drawdown", icon: TrendingDown, title: "Drawdown Calculator", desc: "Visualize portfolio drawdown over time." },
            { to: "/calculators/stop-loss", icon: Activity, title: "Stop Loss Calculator", desc: "Compute a stop loss in pips or price." },
            { to: "/calculators/take-profit", icon: TrendingUp, title: "Take Profit Calculator", desc: "Plan exit targets with precision." },
          ].map((t) => (
            <Link key={t.to} to={t.to}>
              <Card className="group h-full border-border bg-surface p-5 transition-all hover:border-primary/40 hover:bg-surface-elevated">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <span className="mt-4 inline-flex items-center text-xs text-primary group-hover:underline">Open tool <ArrowRight className="ml-1 h-3 w-3" /></span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* BROKERS */}
      <Section eyebrow="Top Rated Brokers" title="Trusted brokers, independently reviewed" link={{ to: "/brokers", label: "Compare all brokers" }}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brokers.slice(0, 3).map((b) => (
            <Card key={b.slug} className="border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{b.name}</h3>
                <div className="flex items-center gap-1 text-warning"><Sparkles className="h-4 w-4 fill-current" /><span className="text-sm font-medium text-foreground">{b.rating}</span></div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Spread from</p>
              <p className="font-mono text-2xl font-bold">{b.spread}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {b.platforms.slice(0, 3).map((p) => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Regulated by {b.regulation.join(", ")}</div>
              <Link to="/brokers/$broker" params={{ broker: b.slug }} className="mt-4 inline-flex text-xs text-primary hover:underline">Read review <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* AI ASSISTANT PREVIEW */}
      <Section eyebrow="AI Trade Assistant" title="Your AI co-pilot for every trade">
        <Card className="overflow-hidden border-border bg-surface-elevated">
          <div className="grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <Bot className="h-3 w-3" /> TheFortFX
              </div>
              <h3 className="mt-4 text-2xl font-bold sm:text-3xl">Evaluate any trade in seconds</h3>
              <p className="mt-3 text-muted-foreground">Paste your entry, stop loss, and take profit. Get a confidence score, risk rating, sentiment alignment, and actionable improvements.</p>
              <ul className="mt-6 space-y-2 text-sm">
                {["Confidence-scored trade analysis", "Multi-factor risk evaluation", "Sentiment & news alignment", "AI-generated improvement suggestions"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-accent" />{t}</li>
                ))}
              </ul>
              <Link to="/ai-assistant" className="mt-6 inline-flex"><Button>Try AI Assistant <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
            <Card className="border-border bg-background/60 p-6 backdrop-blur">
              <div className="space-y-3 text-sm">
                <Row label="Pair" value="EUR/USD" />
                <Row label="Trade Score" value={<span className="font-mono text-2xl font-bold text-accent">91</span>} />
                <Row label="Sentiment" value={<Badge className="bg-bullish/15 text-bullish">Bullish</Badge>} />
                <Row label="Risk" value={<Badge className="bg-accent/15 text-accent">Low</Badge>} />
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">Recommendation</p>
                  <p className="mt-1 text-lg font-bold text-bullish">BUY</p>
                  <p className="mt-2 text-xs text-muted-foreground">RSI, MACD, and trend filters align with daily bias. Position size within 1% account risk.</p>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </Section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-surface/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start trading with intelligence</h2>
          <p className="mt-4 text-muted-foreground">Join thousands of traders using TheFortFX to make smarter, more disciplined decisions.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register"><Button size="lg" className="bg-primary hover:bg-primary/90">Get started free</Button></Link>
            <Link to="/learn"><Button size="lg" variant="outline"><BookOpen className="mr-2 h-4 w-4" /> Browse Learning Center</Button></Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Section({ eyebrow, title, description, link, children }: { eyebrow: string; title: string; description?: string; link?: { to: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
            {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
          </div>
          {link && <a href={link.to} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">{link.label} <ArrowRight className="h-3 w-3" /></a>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ImpactBadge({ level }: { level: "Low" | "Medium" | "High" }) {
  const cls = level === "High" ? "bg-bearish/15 text-bearish" : level === "Medium" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground";
  return <Badge className={cls}>{level}</Badge>;
}
