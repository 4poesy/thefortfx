import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { getSignal, signals, forecastData } from "@/lib/mock-data";
import { DirectionBadge, RiskBadge } from "@/components/badges";

export const Route = createFileRoute("/signals/$pair")({
  loader: ({ params }) => {
    const signal = getSignal(params.pair);
    if (!signal) throw notFound();
    return { signal, forecast: forecastData(params.pair)! };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.signal.pair} Signal — ${loaderData.signal.direction} @ ${loaderData.signal.confidence}% confidence | ForexPilot AI` },
      { name: "description", content: `Live ${loaderData.signal.pair} signal: ${loaderData.signal.direction} with entry ${loaderData.signal.entry}, SL ${loaderData.signal.stopLoss}, TP ${loaderData.signal.takeProfit}.` },
      { property: "og:title", content: `${loaderData.signal.pair} Signal — ForexPilot AI` },
      { property: "og:description", content: `${loaderData.signal.direction} signal with ${loaderData.signal.confidence}% confidence.` },
    ] : [],
    links: loaderData ? [{ rel: "canonical", href: `/signals/${loaderData.signal.symbol}` }] : [],
  }),
  component: SignalDetail,
});

function SignalDetail() {
  const { signal: s, forecast: f } = Route.useLoaderData();
  const related = signals.filter((x) => x.symbol !== s.symbol).slice(0, 4);

  return (
    <Shell>
      <PageHeader
        eyebrow={`Signal · ${s.updated}`}
        title={`${s.pair} — ${s.direction}`}
        description={`Confidence ${s.confidence}% · ${s.sources} aggregated sources · Risk ${s.risk}`}
      >
        <Link to="/signals" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-3 w-3" /> Back to signals</Link>
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Current Signal</h2>
                <DirectionBadge d={s.direction} />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Entry" value={s.entry} />
                <Stat label="Stop Loss" value={s.stopLoss} />
                <Stat label="Take Profit" value={s.takeProfit} />
                <Stat label="Risk : Reward" value={`1:${s.rr.toFixed(2)}`} />
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs"><span className="text-muted-foreground">Confidence Score</span><span className="font-medium">{s.confidence}%</span></div>
                <Progress value={s.confidence} />
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Market Sentiment</h2>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-secondary">
                <div className="bg-bullish" style={{ width: `${s.sentiment.bullish}%` }} />
                <div className="bg-bearish" style={{ width: `${s.sentiment.bearish}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="flex items-center gap-1 text-bullish"><TrendingUp className="h-4 w-4" />Bullish {s.sentiment.bullish}%</span>
                <span className="flex items-center gap-1 text-bearish"><TrendingDown className="h-4 w-4" />Bearish {s.sentiment.bearish}%</span>
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Supporting Factors</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {f.fundamentals.map((t) => (
                  <li key={t} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{t}</span></li>
                ))}
                <li className="flex gap-3"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><span>News risk monitoring active for upcoming high-impact events.</span></li>
              </ul>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Recent Updates</h2>
              <ol className="mt-4 space-y-3 text-sm">
                <li className="flex gap-3 text-muted-foreground"><span className="font-mono text-xs">{s.updated}</span><span>Signal refreshed — confidence at {s.confidence}%.</span></li>
                <li className="flex gap-3 text-muted-foreground"><span className="font-mono text-xs">22 min ago</span><span>Sentiment shift detected across {s.sources} aggregated sources.</span></li>
                <li className="flex gap-3 text-muted-foreground"><span className="font-mono text-xs">1 hr ago</span><span>{s.pair} entered breakout territory above key resistance.</span></li>
              </ol>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Risk Analysis</h3>
              <div className="mt-4 space-y-3">
                <Row label="Volatility" value={<RiskBadge r={s.risk} />} />
                <Row label="Position size" value="1% account risk" />
                <Row label="Drawdown limit" value="2.5%" />
                <Row label="News exposure" value={<Badge variant="outline">Moderate</Badge>} />
              </div>
              <Button className="mt-6 w-full">Add to Watchlist</Button>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Signals</h3>
              <div className="mt-4 space-y-2">
                {related.map((r) => (
                  <Link key={r.symbol} to="/signals/$pair" params={{ pair: r.symbol }} className="flex items-center justify-between rounded-md p-2 hover:bg-surface-elevated">
                    <span className="text-sm font-medium">{r.pair}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{r.confidence}%</span>
                      <DirectionBadge d={r.direction} />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold">{value}</p>
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span>{value}</div>;
}
