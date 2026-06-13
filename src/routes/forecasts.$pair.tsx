import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { heroImages } from "@/lib/hero-images";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, ArrowRight, Calculator, LineChart, BookOpen } from "lucide-react";
import { forecastData } from "@/lib/mock-data";
import { getPairBySlug } from "@/lib/mock-data/pairs";
import { articlesForPair, articles } from "@/lib/mock-data/articles";
import { DirectionBadge } from "@/components/badges";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { seoMeta, toHead } from "@/lib/seo/meta-templates";

export const Route = createFileRoute("/forecasts/$pair")({
  loader: ({ params }) => {
    const f = forecastData(params.pair);
    const pair = getPairBySlug(params.pair);
    if (!f || !pair) throw notFound();
    return { forecast: f, trend: pair.trend };
  },
  head: ({ loaderData }) =>
    loaderData ? toHead(seoMeta.forecast(loaderData.forecast.pair, loaderData.forecast.bullishScore, loaderData.trend, loaderData.forecast.symbol)) : {},
  component: ForecastDetail,
});

function ForecastDetail() {
  const { forecast: f } = Route.useLoaderData();
  const learn = articlesForPair(f.symbol)[0] ?? articles[0];
  return (
    <Shell>
      <PageHeader eyebrow="Forecast" title={`${f.pair} — Market Forecast`} description={f.summary} image={heroImages.forecasts}>
        <div className="space-y-3">
          <Breadcrumb items={[{ name: "Forecasts", href: "/forecasts" }, { name: f.pair }]} />
          <Link to="/forecasts" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-3 w-3" /> All forecasts</Link>
        </div>
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Market Overview</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-1 text-bullish"><TrendingUp className="h-4 w-4" />Bullish Score</span><span className="font-semibold">{f.bullishScore}%</span></div>
                  <Progress value={f.bullishScore} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-1 text-bearish"><TrendingDown className="h-4 w-4" />Bearish Score</span><span className="font-semibold">{f.bearishScore}%</span></div>
                  <Progress value={f.bearishScore} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <DirectionBadge d={f.direction} />
                <span className="text-sm text-muted-foreground">AI bias · {f.confidence}% confidence</span>
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Technical Analysis</h2>
              <div className="mt-4 divide-y divide-border">
                {f.technicals.map((t: { name: string; value: number; signal: string }) => (
                  <div key={t.name} className="flex items-center justify-between py-3 text-sm">
                    <span>{t.name}</span>
                    <span className="font-mono text-muted-foreground">{String(t.value)}</span>
                    <Badge variant="outline" className={t.signal === "Bullish" || t.signal === "Above" ? "border-bullish/30 text-bullish" : "border-bearish/30 text-bearish"}>{t.signal}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Fundamental Analysis</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {f.fundamentals.map((t: string) => <li key={t}>• {t}</li>)}
              </ul>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Forecast Summary</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>{f.summary}</p>
                <p>
                  Price is currently trading {f.direction === "BUY" ? "above" : "below"} its near-term pivot, with sentiment running {f.bullishScore}% bullish against {f.bearishScore}% bearish across aggregated positioning data.
                  The nearest support sits at {f.support[0]}, with deeper demand zones at {f.support[1]} and {f.support[2]}. Resistance is layered at {f.resistance[0]}, {f.resistance[1]}, and {f.resistance[2]}.
                </p>
                <p>
                  Risk management remains essential: high-impact economic events can invalidate any technical outlook within minutes. Size positions appropriately and consult the live signal for entry, stop, and target levels before acting on this forecast.
                </p>
              </div>
              <Link to="/signals/$pair" params={{ pair: f.symbol }}>
                <Button className="mt-5">View Live Signal <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Support Levels</h3>
              <div className="mt-3 space-y-2">
                {f.support.map((p: number, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <span className="text-muted-foreground">S{i + 1}</span>
                    <span className="font-mono font-medium text-bullish">{p}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resistance Levels</h3>
              <div className="mt-3 space-y-2">
                {f.resistance.map((p: number, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <span className="text-muted-foreground">R{i + 1}</span>
                    <span className="font-mono font-medium text-bearish">{p}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Market Sentiment</h3>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-secondary">
                <div className="bg-bullish" style={{ width: `${f.sentiment.bullish}%` }} />
                <div className="bg-bearish" style={{ width: `${f.sentiment.bearish}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-bullish">{f.sentiment.bullish}%</span><span className="text-bearish">{f.sentiment.bearish}%</span>
              </div>
            </Card>
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Go deeper</h3>
              <div className="mt-4 space-y-2 text-sm">
                <Link to="/pairs/$pair" params={{ pair: f.symbol }} className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">
                  <span className="flex items-center gap-2"><LineChart className="h-4 w-4" />{f.pair} pair hub</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/signals/$pair" params={{ pair: f.symbol }} className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">
                  <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Live {f.pair} signal</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/calculators/pip-calculator" search={{ pair: f.symbol }} className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">
                  <span className="flex items-center gap-2"><Calculator className="h-4 w-4" />Pip calculator</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/learn/$slug" params={{ slug: learn.slug }} className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">
                  <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{learn.title.length > 28 ? learn.title.slice(0, 28) + "…" : learn.title}</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Shell>
  );
}
