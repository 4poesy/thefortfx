import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { getEventBySlug } from "@/lib/mock-data/economic-events";
import { getPairBySlug, type Pair } from "@/lib/mock-data/pairs";
import { ImpactBadge } from "@/components/badges";
import { DirectionBadge } from "@/components/badges";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { seoMeta, toHead } from "@/lib/seo/meta-templates";

export const Route = createFileRoute("/economic-calendar/$slug")({
  loader: ({ params }) => {
    const event = getEventBySlug(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) =>
    loaderData ? toHead(seoMeta.economicEvent(loaderData.event.title, loaderData.event.currency, loaderData.event.date, loaderData.event.slug)) : {},
  component: EventDetail,
});

function EventDetail() {
  const { event: e } = Route.useLoaderData();
  const affected: Pair[] = e.affectedPairs
    .map((s: string) => getPairBySlug(s))
    .filter((p: Pair | undefined): p is Pair => Boolean(p));
  return (
    <Shell>
      <PageHeader eyebrow={`${e.currency} · Economic Event`} title={e.title} description={e.description}>
        <Breadcrumb items={[{ name: "Economic Calendar", href: "/economic-calendar" }, { name: e.title }]} />
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border bg-surface p-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{e.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{e.time}</span>
                <ImpactBadge level={e.impact} />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Stat label="Forecast" value={e.forecast} highlight />
                <Stat label="Previous" value={e.previous} />
                <Stat label="Actual" value={e.actual ?? "Pending"} />
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">What this event measures</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Markets react to the deviation between the actual print and the {e.forecast} consensus — not the absolute number.
                A meaningful beat typically strengthens the {e.currency} in the minutes after release, while a miss weakens it.
                Spreads widen and slippage increases around the timestamp, so position sizing should be reduced or trades avoided entirely through the release window.
              </p>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Historical impact analysis</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <Row k="Average move in affected majors (last 12 releases)" v={e.impact === "High" ? "45–80 pips" : e.impact === "Medium" ? "20–40 pips" : "5–15 pips"} />
                <Row k="Typical reaction window" v={e.impact === "High" ? "First 30 minutes, often with reversal" : "First 10–15 minutes"} />
                <Row k="Surprise frequency (beat/miss > consensus band)" v={e.impact === "High" ? "~38% of releases" : "~24% of releases"} />
                <Row k="Recommended approach" v={e.impact === "High" ? "Stand aside through release; trade confirmed direction after" : "Monitor; manageable with reduced size"} />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Affected pairs</h3>
              <div className="mt-4 space-y-2">
                {affected.map((p) => p && (
                  <Link key={p.slug} to="/signals/$pair" params={{ pair: p.slug }} className="flex items-center justify-between rounded-md border border-border bg-background p-3 transition-colors duration-150 hover:border-primary/40">
                    <div>
                      <p className="font-mono text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.confidence}% confidence</p>
                    </div>
                    <DirectionBadge d={p.signal} />
                  </Link>
                ))}
              </div>
            </Card>
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Prepare for this event</h3>
              <div className="mt-4 space-y-2 text-sm">
                <Link to="/calculators/position-size" className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">Position Size Calculator <ArrowRight className="h-3.5 w-3.5" /></Link>
                <Link to="/economic-calendar" className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">Full Economic Calendar <ArrowRight className="h-3.5 w-3.5" /></Link>
                <Link to="/learn/$slug" params={{ slug: "trading-the-economic-calendar" }} className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">How to trade news events <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 text-center ${highlight ? "border-primary/30 bg-primary/5" : "border-border bg-background"}`}>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold">{value}</p>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-0"><span>{k}</span><span className="shrink-0 font-medium text-foreground">{v}</span></div>;
}
