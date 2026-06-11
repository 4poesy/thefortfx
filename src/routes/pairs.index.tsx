import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { pairs, type Pair, type PairCategory } from "@/lib/mock-data/pairs";
import { DirectionBadge, RiskBadge } from "@/components/badges";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const Route = createFileRoute("/pairs/")({
  head: () => ({
    meta: [
      { title: "Currency Pairs — Live Rates, Signals & Forecasts | TheFortFX" },
      { name: "description", content: "20 tracked currency pairs, metals, and crypto with live rates, AI signals, forecasts, and full technical analysis hubs." },
      { property: "og:title", content: "Currency Pairs — TheFortFX" },
      { property: "og:description", content: "Live rates, AI signals, and forecasts for 20 tracked instruments." },
      { property: "og:url", content: "/pairs" },
    ],
    links: [{ rel: "canonical", href: "/pairs" }],
  }),
  component: PairsIndex,
});

const categories: ("All" | PairCategory)[] = ["All", "Forex", "Commodities", "Crypto"];

function PairsIndex() {
  const [cat, setCat] = useState<"All" | PairCategory>("All");
  const list = pairs.filter((p) => cat === "All" || p.category === cat);
  return (
    <Shell>
      <PageHeader eyebrow="Markets" title="Currency pair hubs" description="Live rates, AI signal, forecast, key levels, upcoming events, and recommended brokers — everything about each instrument in one place.">
        <Breadcrumb items={[{ name: "Pairs" }]} />
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-md border px-3 py-1.5 text-sm transition-colors duration-150 ${cat === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p: Pair) => (
              <Link key={p.slug} to="/pairs/$pair" params={{ pair: p.slug }}>
                <Card className="h-full border-border bg-surface p-5 transition-colors duration-150 hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-semibold">{p.name}</span>
                    <DirectionBadge d={p.signal} />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-mono text-xl">{p.currentPrice}</span>
                    <span className={`flex items-center gap-0.5 text-xs ${p.changePct >= 0 ? "text-bullish" : "text-bearish"}`}>
                      {p.changePct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {p.changePct >= 0 ? "+" : ""}{p.changePct}%
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline">{p.category}</Badge>
                    <RiskBadge r={p.riskLevel} />
                  </div>
                  <p className="mt-4 inline-flex items-center gap-1 text-xs text-primary">View hub <ArrowRight className="h-3 w-3" /></p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
