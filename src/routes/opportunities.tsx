import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, TrendingUp } from "lucide-react";
import { opportunities } from "@/lib/mock-data";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Top Trading Opportunities Today — ForexPilot AI" },
      { name: "description", content: "Daily AI-ranked top forex trading opportunities scored on trend strength, sentiment, and news risk." },
      { property: "og:title", content: "Top Trading Opportunities — ForexPilot AI" },
    ],
    links: [{ rel: "canonical", href: "/opportunities" }],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  return (
    <Shell>
      <PageHeader eyebrow="Opportunity Scanner" title="Today's top trading opportunities" description="AI-ranked leaderboard of the highest-probability setups across global FX, commodities, and crypto." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {opportunities.map((o) => (
              <Link key={o.symbol} to="/signals/$pair" params={{ pair: o.symbol }}>
                <Card className="group flex flex-col items-stretch gap-4 border-border bg-surface p-5 transition-all hover:border-primary/40 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4 sm:w-64">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${o.rank === 1 ? "bg-warning/15 text-warning" : o.rank <= 3 ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {o.rank === 1 ? <Trophy className="h-5 w-5" /> : `#${o.rank}`}
                    </div>
                    <div>
                      <p className="font-semibold">{o.pair}</p>
                      <p className="text-xs text-muted-foreground">Opportunity score</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-2xl font-bold text-foreground">{o.score}</span>
                      <span className="flex items-center gap-1 text-accent"><Flame className="h-3 w-3" />{o.trend}</span>
                    </div>
                    <Progress value={o.score} className="mt-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:w-80">
                    <Cell label="Trend" value={o.trend} />
                    <Cell label="News Risk" value={<Badge variant="outline" className={o.newsRisk === "Low" ? "border-bullish/30 text-bullish" : o.newsRisk === "Medium" ? "border-warning/30 text-warning" : "border-bearish/30 text-bearish"}>{o.newsRisk}</Badge>} />
                    <Cell label="Sentiment" value={<span className={o.sentiment === "Bullish" ? "text-bullish" : o.sentiment === "Bearish" ? "text-bearish" : "text-neutral"}>{o.sentiment}</span>} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
