import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

interface JournalEntry {
  id: number; pair: string; direction: "BUY" | "SELL"; entry: number; exit: number; size: number; pnl: number; rr: number; notes: string; date: string;
}

const seed: JournalEntry[] = [
  { id: 1, pair: "EUR/USD", direction: "BUY", entry: 1.0820, exit: 1.0895, size: 1.0, pnl: 750, rr: 2.1, notes: "Clean breakout above resistance, held through London close.", date: "Jun 8" },
  { id: 2, pair: "GBP/USD", direction: "SELL", entry: 1.2745, exit: 1.2702, size: 0.5, pnl: 215, rr: 1.8, notes: "Bearish engulfing on H4, took half off at first target.", date: "Jun 7" },
  { id: 3, pair: "XAU/USD", direction: "BUY", entry: 2330, exit: 2318, size: 0.3, pnl: -360, rr: -1.0, notes: "Stopped out on CPI release — avoid trading into news.", date: "Jun 6" },
  { id: 4, pair: "USD/JPY", direction: "BUY", entry: 155.8, exit: 156.7, size: 0.8, pnl: 720, rr: 2.3, notes: "BoJ jawboning faded, took trend continuation.", date: "Jun 5" },
];

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Trading Journal — TheFortFX" },
      { name: "description", content: "Log trades, track win rate, profit factor, and performance statistics." },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
  component: JournalPage,
});

function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(seed);
  const [draft, setDraft] = useState({ pair: "", entry: "", exit: "", size: "", notes: "" });

  const wins = entries.filter((e) => e.pnl > 0);
  const losses = entries.filter((e) => e.pnl < 0);
  const winRate = entries.length ? ((wins.length / entries.length) * 100).toFixed(0) : "0";
  const totalPnl = entries.reduce((a, b) => a + b.pnl, 0);
  const avgRR = entries.length ? (entries.reduce((a, b) => a + b.rr, 0) / entries.length).toFixed(2) : "0";
  const profitFactor = losses.length ? (wins.reduce((a, b) => a + b.pnl, 0) / Math.abs(losses.reduce((a, b) => a + b.pnl, 0))).toFixed(2) : "—";

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.pair) return;
    const entry = +draft.entry, exit = +draft.exit, size = +draft.size || 1;
    const pnl = Math.round((exit - entry) * size * 10000);
    setEntries([{ id: Date.now(), pair: draft.pair.toUpperCase(), direction: exit > entry ? "BUY" : "SELL", entry, exit, size, pnl, rr: pnl > 0 ? 2 : -1, notes: draft.notes, date: "Today" }, ...entries]);
    setDraft({ pair: "", entry: "", exit: "", size: "", notes: "" });
  }

  return (
    <Shell>
      <PageHeader eyebrow="Trade Journal" title="Track every trade. Learn from every outcome." description="Log your trades, analyze your edge, and build the discipline of a professional." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KPI label="Win Rate" value={`${winRate}%`} />
            <KPI label="Total P/L" value={`$${totalPnl.toLocaleString()}`} accent={totalPnl >= 0 ? "bullish" : "bearish"} />
            <KPI label="Profit Factor" value={profitFactor} />
            <KPI label="Avg R:R" value={`1:${avgRR}`} />
            <KPI label="Trades" value={String(entries.length)} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-border bg-surface p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold">Trade History</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr><th className="px-2 py-2 text-left">Date</th><th className="px-2 py-2 text-left">Pair</th><th className="px-2 py-2 text-left">Side</th><th className="px-2 py-2 text-right">Entry</th><th className="px-2 py-2 text-right">Exit</th><th className="px-2 py-2 text-right">P/L</th><th className="px-2 py-2 text-right">R:R</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entries.map((e) => (
                      <tr key={e.id} className="hover:bg-surface-elevated">
                        <td className="px-2 py-3 text-muted-foreground">{e.date}</td>
                        <td className="px-2 py-3 font-medium">{e.pair}</td>
                        <td className="px-2 py-3"><Badge variant="outline" className={e.direction === "BUY" ? "border-bullish/30 text-bullish" : "border-bearish/30 text-bearish"}>{e.direction === "BUY" ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}{e.direction}</Badge></td>
                        <td className="px-2 py-3 text-right font-mono">{e.entry}</td>
                        <td className="px-2 py-3 text-right font-mono">{e.exit}</td>
                        <td className={`px-2 py-3 text-right font-mono ${e.pnl >= 0 ? "text-bullish" : "text-bearish"}`}>{e.pnl >= 0 ? "+" : ""}${e.pnl}</td>
                        <td className="px-2 py-3 text-right">{e.rr > 0 ? `1:${e.rr.toFixed(1)}` : `−1:${Math.abs(e.rr).toFixed(1)}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Log Trade</h2>
              <form className="mt-4 space-y-3" onSubmit={add}>
                <Input placeholder="Pair (e.g. EUR/USD)" value={draft.pair} onChange={(e) => setDraft({ ...draft, pair: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Entry" type="number" step="any" value={draft.entry} onChange={(e) => setDraft({ ...draft, entry: e.target.value })} />
                  <Input placeholder="Exit" type="number" step="any" value={draft.exit} onChange={(e) => setDraft({ ...draft, exit: e.target.value })} />
                </div>
                <Input placeholder="Lot size" type="number" step="any" value={draft.size} onChange={(e) => setDraft({ ...draft, size: e.target.value })} />
                <Textarea placeholder="Notes" rows={3} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
                <Button type="submit" className="w-full"><Plus className="mr-2 h-4 w-4" /> Add Trade</Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function KPI({ label, value, accent }: { label: string; value: string; accent?: "bullish" | "bearish" }) {
  return (
    <Card className="border-border bg-surface p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent === "bullish" ? "text-bullish" : accent === "bearish" ? "text-bearish" : ""}`}>{value}</p>
    </Card>
  );
}
