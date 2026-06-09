import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { economicEvents } from "@/lib/mock-data";
import { ImpactBadge } from "@/components/badges";

export const Route = createFileRoute("/economic-calendar")({
  head: () => ({
    meta: [
      { title: "Economic Calendar — Forex Events & News | ForexPilot AI" },
      { name: "description", content: "Real-time forex economic calendar covering central bank decisions, employment data, and high-impact news." },
    ],
    links: [{ rel: "canonical", href: "/economic-calendar" }],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [q, setQ] = useState("");
  const [cur, setCur] = useState("all");
  const [imp, setImp] = useState("all");
  const filtered = economicEvents.filter((e) => {
    if (q && !e.event.toLowerCase().includes(q.toLowerCase())) return false;
    if (cur !== "all" && e.currency !== cur) return false;
    if (imp !== "all" && e.impact !== imp) return false;
    return true;
  });
  return (
    <Shell>
      <PageHeader eyebrow="Economic Calendar" title="Today's market-moving events" description="Stay ahead of central bank decisions, employment data, and high-impact news releases." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="mb-6 border-border bg-surface p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search event..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Select value={cur} onValueChange={setCur}>
                <SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All currencies</SelectItem>
                  {["USD", "EUR", "GBP", "JPY", "AUD", "NZD"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={imp} onValueChange={setImp}>
                <SelectTrigger><SelectValue placeholder="Impact" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All impact</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

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
                    <th className="px-4 py-3 text-right">Previous</th>
                    <th className="px-4 py-3 text-right">Actual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((e, i) => (
                    <tr key={i} className="hover:bg-surface-elevated/60">
                      <td className="px-4 py-3 font-mono text-muted-foreground">{e.time}</td>
                      <td className="px-4 py-3 font-medium">{e.currency}</td>
                      <td className="px-4 py-3">{e.event}</td>
                      <td className="px-4 py-3"><ImpactBadge level={e.impact} /></td>
                      <td className="px-4 py-3 text-right font-mono">{e.forecast}</td>
                      <td className="px-4 py-3 text-right font-mono text-muted-foreground">{e.previous}</td>
                      <td className="px-4 py-3 text-right font-mono">{e.actual ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>
    </Shell>
  );
}
