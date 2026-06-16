import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp, TrendingDown, Star, Calculator, BookOpen } from "lucide-react";
import { getPairBySlug, relatedPairsFor, type Pair } from "@/lib/mock-data/pairs";
import { eventsForPair, type EconomicEvent } from "@/lib/mock-data/economic-events";
import { articlesForPair, articles, type Article } from "@/lib/mock-data/articles";
import { brokers, type Broker } from "@/lib/mock-data/brokers";
import { DirectionBadge, RiskBadge, ImpactBadge } from "@/components/badges";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { SignalSchema } from "@/components/seo/JsonLd";
import { seoMeta, toHead } from "@/lib/seo/meta-templates";

export const Route = createFileRoute("/pairs/$pair")({
  loader: ({ params }) => {
    const pair = getPairBySlug(params.pair);
    if (!pair) throw notFound();
    return { pair };
  },
  head: ({ loaderData }) =>
    loaderData ? toHead(seoMeta.pairHub(loaderData.pair.name, loaderData.pair.currentPrice, loaderData.pair.signal, loaderData.pair.slug)) : {},
  component: PairHub,
});

function TradingViewChart({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous script
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    let tvSymbol = symbol.toUpperCase().replace("/", "");
    if (tvSymbol === "BTCUSD") {
      tvSymbol = "BINANCE:BTCUSDT";
    } else if (tvSymbol === "ETHUSD") {
      tvSymbol = "BINANCE:ETHUSDT";
    } else if (tvSymbol === "XAUUSD" || tvSymbol === "XAGUSD") {
      tvSymbol = `OANDA:${tvSymbol}`;
    } else {
      tvSymbol = `FX_IDC:${tvSymbol}`;
    }

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      calendar: true,
      support_host: "https://www.tradingview.com"
    });

    container.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container h-[450px] w-full" ref={container} />
  );
}

function PairHub() {
  const { pair: p } = Route.useLoaderData() as { pair: Pair };
  const events: EconomicEvent[] = eventsForPair(p.slug).slice(0, 4);
  const recBrokers: Broker[] = brokers.filter((b) => b.isTopRated).slice(0, 3);
  const learn: Article[] = articlesForPair(p.slug).slice(0, 3);
  const learnFinal = learn.length >= 3 ? learn : [...learn, ...articles.filter((a) => !learn.includes(a))].slice(0, 3);
  const related: Pair[] = relatedPairsFor(p.slug);
  const dec = p.currentPrice > 1000 ? 0 : p.currentPrice > 100 ? 2 : 4;
  const spreadPips = p.category === "Forex" ? 0.6 : p.category === "Commodities" ? 2.5 : 12;
  const bid = +(p.currentPrice - (spreadPips / 2) * (dec === 4 ? 0.0001 : dec === 2 ? 0.01 : 1)).toFixed(dec === 0 ? 0 : dec + 1);
  const ask = +(p.currentPrice + (spreadPips / 2) * (dec === 4 ? 0.0001 : dec === 2 ? 0.01 : 1)).toFixed(dec === 0 ? 0 : dec + 1);
  const up = p.changePct >= 0;

  return (
    <Shell>
      <SignalSchema pair={p.name} direction={p.signal} confidence={p.confidence} entry={p.entry} sl={p.stopLoss} tp={p.takeProfit} />
      {/* Hero */}
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Pairs", href: "/pairs" }, { name: p.name }]} />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-3xl font-bold sm:text-4xl">{p.name}</h1>
                <Badge variant="outline">{p.category}</Badge>
                <DirectionBadge d={p.signal} />
              </div>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{p.description}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-3xl font-bold">{p.currentPrice}</p>
              <p className={`flex items-center justify-end gap-1 text-sm ${up ? "text-bullish" : "text-bearish"}`}>
                {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {up ? "+" : ""}{p.change24h} ({up ? "+" : ""}{p.changePct}%) 24h
              </p>
            </div>
          </div>
          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <QuickStat label="Bid" value={String(bid)} />
            <QuickStat label="Ask" value={String(ask)} />
            <QuickStat label="Spread" value={`${spreadPips} pips`} />
            <QuickStat label="Daily Range" value={`${p.supportLevels[0]} – ${p.resistanceLevels[0]}`} />
            <QuickStat label="Weekly Range" value={`${p.supportLevels[2]} – ${p.resistanceLevels[2]}`} />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            {/* Interactive TradingView Chart */}
            <Card className="overflow-hidden border border-border bg-surface p-0">
              <div className="border-b border-border bg-surface-elevated/40 px-6 py-4">
                <h2 className="text-base font-semibold">Interactive Live Chart</h2>
              </div>
              <div className="h-[450px] bg-background">
                <TradingViewChart symbol={p.name} />
              </div>
            </Card>

            {/* Signal + forecast compact cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-border bg-surface p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Current Signal</h2>
                  <DirectionBadge d={p.signal} />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <KV k="Entry" v={String(p.entry)} />
                  <KV k="Stop Loss" v={String(p.stopLoss)} />
                  <KV k="Take Profit" v={String(p.takeProfit)} />
                  <KV k="Risk : Reward" v={p.riskReward} />
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Confidence</span><span>{p.confidence}%</span></div>
                  <Progress value={p.confidence} />
                </div>
                <Link to="/signals/$pair" params={{ pair: p.slug }}>
                  <Button variant="outline" className="mt-5 w-full">Full signal analysis <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </Card>
              <Card className="border-border bg-surface p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Current Forecast</h2>
                  <Badge variant="outline">{p.trend}</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex h-3 overflow-hidden rounded-full bg-secondary">
                    <div className="bg-bullish" style={{ width: `${p.bullishPct}%` }} />
                    <div className="bg-bearish" style={{ width: `${p.bearishPct}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-bullish">Bullish {p.bullishPct}%</span>
                    <span className="text-bearish">Bearish {p.bearishPct}%</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <KV k="Opportunity Score" v={`${p.opportunityScore}/100`} />
                  <KV k="News Risk" v={p.newsRisk} />
                  <KV k="Risk Level" v={p.riskLevel} />
                </div>
                <Link to="/forecasts/$pair" params={{ pair: p.slug }}>
                  <Button variant="outline" className="mt-5 w-full">Read full forecast <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </Card>
            </div>

            {/* Support & resistance */}
            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Key Support & Resistance</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-bullish">Support</p>
                  <div className="mt-2 space-y-2">
                    {p.supportLevels.map((lvl, i) => (
                      <div key={i} className="flex justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"><span className="text-muted-foreground">S{i + 1}</span><span className="font-mono text-bullish">{lvl}</span></div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-bearish">Resistance</p>
                  <div className="mt-2 space-y-2">
                    {p.resistanceLevels.map((lvl, i) => (
                      <div key={i} className="flex justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"><span className="text-muted-foreground">R{i + 1}</span><span className="font-mono text-bearish">{lvl}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Upcoming events */}
            <Card className="border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming events affecting {p.name}</h2>
                <Link to="/economic-calendar" className="text-xs text-primary hover:underline">Full calendar</Link>
              </div>
              <div className="mt-4 divide-y divide-border">
                {events.length > 0 ? events.map((e) => (
                  <Link key={e.id} to="/economic-calendar/$slug" params={{ slug: e.slug }} className="flex items-center justify-between gap-3 py-3 text-sm transition-colors duration-150 hover:text-primary">
                    <span className="font-mono text-xs text-muted-foreground">{e.date}</span>
                    <span className="flex-1 font-medium">{e.currency} · {e.title}</span>
                    <ImpactBadge level={e.impact} />
                  </Link>
                )) : (
                  <p className="py-3 text-sm text-muted-foreground">No high-impact events scheduled for this pair in the next two weeks. Monitor the full calendar for updates.</p>
                )}
              </div>
            </Card>

            {/* Learn articles */}
            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Learn more</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {learnFinal.map((a) => (
                  <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }} className="rounded-lg border border-border bg-background p-4 transition-colors duration-150 hover:border-primary/40">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <p className="mt-2 text-sm font-medium leading-snug">{a.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.readTime} · {a.category}</p>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recommended brokers for {p.name}</h3>
              <div className="mt-4 space-y-3">
                {recBrokers.map((b) => (
                  <div key={b.slug} className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <Link to="/brokers/$broker" params={{ broker: b.slug }} className="font-semibold transition-colors duration-150 hover:text-primary">{b.name}</Link>
                      <span className="flex items-center gap-1 text-sm text-warning"><Star className="h-3.5 w-3.5 fill-current" />{b.rating}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">EUR/USD spread {b.spread.eurusd} pips · Min ${b.minDeposit}</p>
                    <Button size="sm" className="mt-3 w-full">Open Account <ArrowRight className="ml-1 h-3 w-3" /></Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tools for {p.name}</h3>
              <div className="mt-4 space-y-2 text-sm">
                <Link to="/calculators/pip-calculator" search={{ pair: p.slug }} className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">
                  <span className="flex items-center gap-2"><Calculator className="h-4 w-4" />Pip value for {p.name}</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/calculators/position-size" search={{ pair: p.slug }} className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">
                  <span className="flex items-center gap-2"><Calculator className="h-4 w-4" />Position size for {p.name}</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/calculators/risk-reward" className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">
                  <span className="flex items-center gap-2"><Calculator className="h-4 w-4" />Risk:Reward calculator</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related pairs</h3>
              <div className="mt-4 space-y-2">
                {related.map((r) => (
                  <Link key={r.slug} to="/pairs/$pair" params={{ pair: r.slug }} className="flex items-center justify-between rounded-md p-2 transition-colors duration-150 hover:bg-surface-elevated">
                    <span className="font-mono text-sm font-medium">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${r.changePct >= 0 ? "text-bullish" : "text-bearish"}`}>{r.changePct >= 0 ? "+" : ""}{r.changePct}%</span>
                      <DirectionBadge d={r.signal} />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Risk snapshot</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Risk level</span><RiskBadge r={p.riskLevel} /></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">News risk</span><RiskBadge r={p.newsRisk} /></div>
                <KV k="Trend" v={p.trend} />
                <KV k="Last updated" v={p.lastUpdated} />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
function KV({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{k}</span><span className="font-mono font-medium">{v}</span></div>;
}
