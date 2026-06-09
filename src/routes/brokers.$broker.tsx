import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { getBroker } from "@/lib/mock-data";

export const Route = createFileRoute("/brokers/$broker")({
  loader: ({ params }) => {
    const b = getBroker(params.broker);
    if (!b) throw notFound();
    return { broker: b };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.broker.name} Review 2026 — Spreads, Regulation, Platforms | ForexPilot AI` },
      { name: "description", content: `${loaderData.broker.name} review: ${loaderData.broker.summary}` },
      { property: "og:title", content: `${loaderData.broker.name} — Independent Review` },
    ] : [],
    links: loaderData ? [{ rel: "canonical", href: `/brokers/${loaderData.broker.slug}` }] : [],
  }),
  component: BrokerDetail,
});

function BrokerDetail() {
  const { broker: b } = Route.useLoaderData();
  return (
    <Shell>
      <PageHeader eyebrow="Broker Review" title={b.name} description={b.summary}>
        <Link to="/brokers" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-3 w-3" /> All brokers</Link>
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Overview</h2>
                <div className="flex items-center gap-1 text-warning"><Star className="h-5 w-5 fill-current" /><span className="text-lg font-semibold text-foreground">{b.rating}</span><span className="text-sm text-muted-foreground">/5</span></div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Spread from" value={b.spread} />
                <Stat label="Min Deposit" value={b.minDeposit} />
                <Stat label="Leverage" value={b.leverage} />
                <Stat label="Platforms" value={String(b.platforms.length)} />
              </div>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-bullish">Pros</h3>
                <ul className="mt-3 space-y-2 text-sm">{b.pros.map((p: string) => <li key={p} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bullish" />{p}</li>)}</ul>
              </Card>
              <Card className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-bearish">Cons</h3>
                <ul className="mt-3 space-y-2 text-sm">{b.cons.map((p: string) => <li key={p} className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-bearish" />{p}</li>)}</ul>
              </Card>
            </div>

            <Card className="border-border bg-surface p-6">
              <h3 className="text-lg font-semibold">Regulation & Platforms</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><Shield className="h-3 w-3" />Regulated by</p>
                  <div className="flex flex-wrap gap-2">{b.regulation.map((r: string) => <Badge key={r} variant="outline">{r}</Badge>)}</div>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Trading platforms</p>
                  <div className="flex flex-wrap gap-2">{b.platforms.map((p: string) => <Badge key={p}>{p}</Badge>)}</div>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h3 className="text-lg font-semibold">Review Summary</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.summary} Pricing is competitive across most asset classes, and customer support is responsive 24/5. Suitable for both beginners and experienced traders looking for institutional-grade execution.</p>
            </Card>
          </div>

          <Card className="h-fit border-border bg-gradient-to-br from-primary/10 to-accent/10 p-6">
            <p className="text-xs uppercase tracking-wider text-primary">Open an account</p>
            <h3 className="mt-2 text-2xl font-bold">Get started with {b.name}</h3>
            <p className="mt-3 text-sm text-muted-foreground">Minimum deposit just {b.minDeposit}. Trade on {b.platforms.slice(0, 2).join(" & ")}.</p>
            <Button className="mt-6 w-full">Visit {b.name} <ArrowRight className="ml-2 h-4 w-4" /></Button>
            <p className="mt-3 text-[11px] text-muted-foreground">Disclosure: ForexPilot AI may earn a commission. This does not affect our independent ratings.</p>
          </Card>
        </div>
      </section>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-background p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 font-mono text-base font-semibold">{value}</p></div>;
}
