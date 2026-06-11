import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowRight } from "lucide-react";
import { economicEvents } from "@/lib/mock-data/economic-events";
import { ImpactBadge } from "@/components/badges";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const Route = createFileRoute("/economic-calendar/")({
  head: () => ({
    meta: [
      { title: "Economic Calendar — Forex Events & News | TheFortFX" },
      { name: "description", content: "Real-time forex economic calendar covering central bank decisions, employment data, and high-impact news with forecast and previous readings." },
      { property: "og:title", content: "Economic Calendar — TheFortFX" },
      { property: "og:description", content: "Central bank decisions, employment data, and high-impact forex news." },
      { property: "og:url", content: "/economic-calendar" },
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
    if (q && !e.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (cur !== "all" && e.currency !== cur) return false;
    if (imp !== "all" && e.impact !== imp) return false;
    return true;
  });
  return (
    <Shell>
      <PageHeader eyebrow="Economic Calendar" title="Upcoming market-moving events" description="Stay ahead of central bank decisions, employment data, and high-impact news releases. Click any event for full impact analysis.">
        <Breadcrumb items={[{ name: "Economic Calendar" }]} />
      </PageHeader>
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
                  {["USD", "EUR", "GBP", "JPY", "AUD", "NZD", "CAD", "CHF"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-left">Currency</th>
                    <th className="px-4 py-3 text-left">Event</th>
                    <th className="px-4 py-3 text-left">Impact</th>
                    <th className="px-4 py-3 text-right">Forecast</th>
                    <th className="px-4 py-3 text-right">Previous</th>
                    <th className="px-4 py-3 text-right">Actual</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((e) => (
                    <tr key={e.id} className="transition-colors duration-150 hover:bg-surface-elevated/60">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.date}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{e.time.replace(" UTC", "")}</td>
                      <td className="px-4 py-3 font-medium">{e.currency}</td>
                      <td className="px-4 py-3">
                        <Link to="/economic-calendar/$slug" params={{ slug: e.slug }} className="font-medium transition-colors duration-150 hover:text-primary">{e.title}</Link>
                      </td>
                      <td className="px-4 py-3"><ImpactBadge level={e.impact} /></td>
                      <td className="px-4 py-3 text-right font-mono">{e.forecast}</td>
                      <td className="px-4 py-3 text-right font-mono text-muted-foreground">{e.previous}</td>
                      <td className="px-4 py-3 text-right font-mono">{e.actual ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <Link to="/economic-calendar/$slug" params={{ slug: e.slug }} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          Analysis <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No events match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>
    </Shell>
  );
}
