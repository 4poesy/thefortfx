import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, CheckCircle2 } from "lucide-react";
import { DirectionBadge } from "@/components/badges";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Trade Assistant — Evaluate Any Forex Trade | ForexPilot AI" },
      { name: "description", content: "AI-powered trade analysis: get a confidence score, risk rating, and actionable suggestions for any setup." },
    ],
    links: [{ rel: "canonical", href: "/ai-assistant" }],
  }),
  component: AIPage,
});

function AIPage() {
  const [pair, setPair] = useState("EURUSD");
  const [entry, setEntry] = useState("1.0820");
  const [sl, setSl] = useState("1.0780");
  const [tp, setTp] = useState("1.0920");
  const [out, setOut] = useState<null | { score: number; risk: string; sentiment: string; direction: "BUY" | "SELL"; rec: string; tips: string[] }>(null);

  function analyze(e: React.FormEvent) {
    e.preventDefault();
    const risk = Math.abs(+entry - +sl);
    const reward = Math.abs(+tp - +entry);
    const rr = risk > 0 ? reward / risk : 0;
    const direction: "BUY" | "SELL" = +tp > +entry ? "BUY" : "SELL";
    const score = Math.min(99, Math.round(50 + rr * 15 + (pair === "EURUSD" ? 8 : 4)));
    setOut({
      score,
      risk: rr >= 2 ? "Low" : rr >= 1 ? "Medium" : "High",
      sentiment: direction === "BUY" ? "Bullish" : "Bearish",
      direction,
      rec: rr >= 2 ? direction : "SKIP",
      tips: [
        rr < 2 ? "Increase take profit or tighten stop to reach a 1:2 minimum R:R." : "R:R meets professional minimum of 1:2.",
        "Position size to risk ≤1% of account on this idea.",
        "Confirm setup aligns with daily and 4H bias before execution.",
        "Avoid entry within 30 minutes of high-impact news.",
      ],
    });
  }

  return (
    <Shell>
      <PageHeader eyebrow="AI Assistant" title="Your AI trade analyst" description="Score, evaluate, and improve any forex trade in seconds." />
      <section className="py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Card className="border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Bot className="h-4 w-4" /></div>
              <div><h2 className="font-semibold">Trade Inputs</h2><p className="text-xs text-muted-foreground">Paste your setup — the AI handles the rest.</p></div>
            </div>
            <form className="mt-6 space-y-4" onSubmit={analyze}>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Pair</span>
                <Select value={pair} onValueChange={setPair}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["EURUSD","GBPUSD","USDJPY","XAUUSD","BTCUSD","AUDUSD"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Entry</span>
                <Input type="number" step="any" value={entry} onChange={(e) => setEntry(e.target.value)} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Stop Loss</span>
                  <Input type="number" step="any" value={sl} onChange={(e) => setSl(e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Take Profit</span>
                  <Input type="number" step="any" value={tp} onChange={(e) => setTp(e.target.value)} />
                </label>
              </div>
              <Button type="submit" className="w-full"><Sparkles className="mr-2 h-4 w-4" />Analyze Trade</Button>
            </form>
          </Card>

          <Card className="border-border bg-gradient-to-br from-surface to-surface-elevated p-6">
            <h2 className="text-base font-semibold">AI Analysis</h2>
            {!out ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 py-16 text-center">
                <Bot className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">Submit a trade to see AI analysis.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Trade Score</p>
                  <p className="mt-1 font-mono text-5xl font-bold text-accent">{out.score}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Mini label="Direction" value={<DirectionBadge d={out.direction} />} />
                  <Mini label="Sentiment" value={<Badge className="bg-bullish/15 text-bullish">{out.sentiment}</Badge>} />
                  <Mini label="Risk" value={<Badge className={out.risk === "Low" ? "bg-bullish/15 text-bullish" : out.risk === "Medium" ? "bg-warning/15 text-warning" : "bg-bearish/15 text-bearish"}>{out.risk}</Badge>} />
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Recommendation</p>
                  <p className="mt-1 text-2xl font-bold">{out.rec}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Suggested Improvements</p>
                  <ul className="space-y-2 text-sm">{out.tips.map((t) => <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{t}</li>)}</ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>
    </Shell>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-md border border-border bg-background p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p><div className="mt-2 flex justify-center">{value}</div></div>;
}
