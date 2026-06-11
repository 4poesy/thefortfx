import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signals } from "@/lib/mock-data";
import { DirectionBadge, RiskBadge } from "@/components/badges";

export const Route = createFileRoute("/signals/")({
  head: () => ({
    meta: [
      { title: "Live Forex Signals — TheFortFX" },
      { name: "description", content: "Browse AI-aggregated forex signals with confidence scores, entries, and risk levels across 500+ pairs." },
      { property: "og:title", content: "Live Forex Signals — TheFortFX" },
      { property: "og:description", content: "Confidence-scored signals across majors, commodities, and crypto." },
    ],
    links: [{ rel: "canonical", href: "/signals" }],
  }),
  component: SignalsPage,
});

function SignalsPage() {
  const [q, setQ] = useState("");
  const [dir, setDir] = useState<string>("all");
  const [risk, setRisk] = useState<string>("all");
  const [conf, setConf] = useState<string>("all");

  const filtered = signals.filter((s) => {
    if (q && !s.pair.toLowerCase().includes(q.toLowerCase())) return false;
    if (dir !== "all" && s.direction !== dir) return false;
    if (risk !== "all" && s.risk !== risk) return false;
    if (conf === "high" && s.confidence < 80) return false;
    if (conf === "med" && (s.confidence < 60 || s.confidence >= 80)) return false;
    if (conf === "low" && s.confidence >= 60) return false;
    return true;
  });

  return (
    <Shell>
      <PageHeader eyebrow="Signals" title="Live Trading Signals" description="AI-aggregated signal consensus across major forex pairs, commodities, and crypto." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="mb-6 border-border bg-surface p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search currency pair..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Select value={dir} onValueChange={setDir}>
                <SelectTrigger><SelectValue placeholder="Direction" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All directions</SelectItem>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                  <SelectItem value="NEUTRAL">Neutral</SelectItem>
                </SelectContent>
              </Select>
              <Select value={risk} onValueChange={setRisk}>
                <SelectTrigger><SelectValue placeholder="Risk" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All risk</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <Select value={conf} onValueChange={setConf}>
                <SelectTrigger><SelectValue placeholder="Confidence" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any confidence</SelectItem>
                  <SelectItem value="high">High (80%+)</SelectItem>
                  <SelectItem value="med">Medium (60-79%)</SelectItem>
                  <SelectItem value="low">Low (&lt;60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <Link key={s.symbol} to="/signals/$pair" params={{ pair: s.symbol }}>
                <Card className="group h-full border-border bg-surface p-5 transition-all hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{s.pair}</p>
                      <p className="font-mono text-xs text-muted-foreground">{s.price}</p>
                    </div>
                    <DirectionBadge d={s.direction} />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Row label="Confidence" value={`${s.confidence}%`} />
                    <Progress value={s.confidence} />
                    <Row label="Entry" value={s.entry} mono />
                    <Row label="Stop Loss" value={s.stopLoss} mono />
                    <Row label="Take Profit" value={s.takeProfit} mono />
                    <Row label="R:R" value={`1:${s.rr.toFixed(2)}`} />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Risk</span>
                      <RiskBadge r={s.risk} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{s.sources} sources</span>
                    <span>Updated {s.updated}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card className="mt-6 border-border bg-surface p-10 text-center text-sm text-muted-foreground">No signals match your filters.</Card>
          )}
        </div>
      </section>
    </Shell>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono" : ""}>{value}</span>
    </div>
  );
}
