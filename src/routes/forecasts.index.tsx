import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { signals } from "@/lib/mock-data";
import { DirectionBadge } from "@/components/badges";

export const Route = createFileRoute("/forecasts/")({
  head: () => ({
    meta: [
      { title: "Forex Forecasts — Daily AI Market Outlook | TheFortFX" },
      { name: "description", content: "AI-powered forex forecasts across majors, commodities, and crypto with bullish/bearish scores and technical analysis." },
      { property: "og:title", content: "Forex Forecasts — TheFortFX" },
      { property: "og:description", content: "Daily AI forecasts for the world's most traded currency pairs." },
    ],
    links: [{ rel: "canonical", href: "/forecasts" }],
  }),
  component: ForecastsPage,
});

function ForecastsPage() {
  return (
    <Shell>
      <PageHeader eyebrow="Forecasts" title="Daily Market Forecasts" description="Bullish and bearish scores, technical analysis, and macro context for every major pair." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {signals.map((s) => {
              const bull = s.direction === "BUY" ? s.confidence : 100 - s.confidence;
              return (
                <Link key={s.symbol} to="/forecasts/$pair" params={{ pair: s.symbol }}>
                  <Card className="group h-full border-border bg-surface p-5 transition-all hover:border-primary/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{s.pair}</p>
                        <p className="font-mono text-xs text-muted-foreground">{s.price}</p>
                      </div>
                      <DirectionBadge d={s.direction} />
                    </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs"><span className="flex items-center gap-1 text-bullish"><TrendingUp className="h-3 w-3" />Bullish</span><span>{bull}%</span></div>
                        <Progress value={bull} />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs"><span className="flex items-center gap-1 text-bearish"><TrendingDown className="h-3 w-3" />Bearish</span><span>{100 - bull}%</span></div>
                        <Progress value={100 - bull} />
                      </div>
                    </div>
                    <span className="mt-4 inline-flex items-center text-xs text-primary group-hover:underline">View forecast <ArrowRight className="ml-1 h-3 w-3" /></span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Shell>
  );
}
