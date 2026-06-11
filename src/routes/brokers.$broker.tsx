import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, CheckCircle2, XCircle, ArrowRight, Scale } from "lucide-react";
import { getBrokerBySlug, brokers, compareSlug, type Broker } from "@/lib/mock-data/brokers";
import { pairs } from "@/lib/mock-data/pairs";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { BrokerSchema, AggregateRatingSchema } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/faq-section";
import { DirectionBadge } from "@/components/badges";
import { seoMeta, toHead } from "@/lib/seo/meta-templates";

export const Route = createFileRoute("/brokers/$broker")({
  loader: ({ params }) => {
    const broker = getBrokerBySlug(params.broker);
    if (!broker) throw notFound();
    return { broker };
  },
  head: ({ loaderData }) =>
    loaderData ? toHead(seoMeta.broker(loaderData.broker.name, loaderData.broker.rating, loaderData.broker.regulation, loaderData.broker.slug)) : {},
  component: BrokerDetail,
});

function BrokerDetail() {
  const { broker: b } = Route.useLoaderData() as { broker: Broker };
  const competitors = brokers.filter((x) => x.slug !== b.slug).sort((x, y) => y.overallScore - x.overallScore).slice(0, 3);
  const featuredPairs = pairs.slice(0, 3);
  const faqs = [
    { q: `Is ${b.name} legit and regulated?`, a: `Yes. ${b.name} is regulated by ${b.regulation.join(", ")}, holds client funds in segregated accounts, and has operated since ${b.founded} from its headquarters in ${b.headquarters}.` },
    { q: `What is the minimum deposit at ${b.name}?`, a: `The minimum deposit at ${b.name} is ${b.minDeposit === 0 ? "$0 — there is no minimum" : `$${b.minDeposit}`}. Smaller accounts can also use reduced position sizes to keep risk proportional.` },
    { q: `What spreads does ${b.name} offer?`, a: `Typical spreads at ${b.name} are ${b.spread.eurusd} pips on EUR/USD, ${b.spread.gbpusd} pips on GBP/USD, and ${b.spread.xauusd} pips on gold (XAU/USD), depending on account type and market conditions.` },
    { q: `Which platforms can I use with ${b.name}?`, a: `${b.name} supports ${b.platforms.join(", ")}. All platforms are available on desktop, web, and mobile.` },
    { q: `What is the maximum leverage at ${b.name}?`, a: `${b.name} offers leverage up to ${b.maxLeverage}, subject to the regulations of your region and the instrument traded. Remember that higher leverage amplifies both gains and losses.` },
  ];

  return (
    <Shell>
      <BrokerSchema broker={b} />
      <AggregateRatingSchema broker={b} />
      <PageHeader eyebrow={`Broker Review ${new Date().getFullYear()}`} title={b.name} description={b.description}>
        <Breadcrumb items={[{ name: "Brokers", href: "/brokers" }, { name: b.name }]} />
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            {/* Score cards */}
            <Card className="border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Scores</h2>
                <div className="flex items-center gap-1 text-warning">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-lg font-semibold text-foreground">{b.rating}</span>
                  <span className="text-sm text-muted-foreground">/5 · {b.reviewCount.toLocaleString()} reviews</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <Score label="Overall" value={b.overallScore} />
                <Score label="Trust" value={b.trustScore} />
                <Score label="Fees" value={b.feesScore} />
                <Score label="Platform" value={b.platformScore} />
              </div>
            </Card>

            {/* Pros & cons */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-bullish">Pros</h3>
                <ul className="mt-3 space-y-2 text-sm">{b.pros.map((p) => <li key={p} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bullish" />{p}</li>)}</ul>
              </Card>
              <Card className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-bearish">Cons</h3>
                <ul className="mt-3 space-y-2 text-sm">{b.cons.map((p) => <li key={p} className="flex gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-bearish" />{p}</li>)}</ul>
              </Card>
            </div>

            {/* Key facts */}
            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Key Facts</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Fact k="Founded" v={String(b.founded)} />
                <Fact k="Headquarters" v={b.headquarters} />
                <Fact k="Min Deposit" v={b.minDeposit === 0 ? "$0" : `$${b.minDeposit}`} />
                <Fact k="Max Leverage" v={b.maxLeverage} />
                <Fact k="Platforms" v={b.platforms.join(", ")} />
                <Fact k="Regulation" v={b.regulation.join(", ")} />
              </div>
              <div className="mt-4">
                <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><Shield className="h-3 w-3" />Regulated by</p>
                <div className="flex flex-wrap gap-2">{b.regulation.map((r) => <Badge key={r} variant="outline">{r}</Badge>)}</div>
              </div>
            </Card>

            {/* Spread comparison */}
            <Card className="overflow-hidden border-border bg-surface">
              <div className="p-6 pb-0"><h2 className="text-lg font-semibold">Typical Spreads</h2></div>
              <table className="mt-4 w-full text-sm">
                <thead className="border-b border-border bg-surface-elevated text-xs uppercase text-muted-foreground">
                  <tr><th className="px-6 py-3 text-left">Instrument</th><th className="px-6 py-3 text-right">Spread</th><th className="px-6 py-3 text-right">vs. Industry Avg</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <SpreadRow name="EUR/USD" v={b.spread.eurusd} avg={0.6} />
                  <SpreadRow name="GBP/USD" v={b.spread.gbpusd} avg={0.9} />
                  <SpreadRow name="XAU/USD" v={b.spread.xauusd} avg={2.8} />
                </tbody>
              </table>
            </Card>

            {/* Review summary */}
            <Card className="border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Review Summary</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                With an overall score of {b.overallScore}/100, {b.name} ranks {b.isTopRated ? "among our top-rated brokers" : "as a solid mid-tier choice"} in {new Date().getFullYear()}.
                Trust ({b.trustScore}/100) is underpinned by {b.regulation.length} regulatory licenses, while pricing earns {b.feesScore}/100 with EUR/USD spreads from {b.spread.eurusd} pips.
                It is best suited to traders who value {b.pros[0]?.toLowerCase()}.
              </p>
            </Card>

            {/* FAQ */}
            <FaqSection faqs={faqs} title={`${b.name} — Frequently Asked Questions`} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="h-fit border-border bg-gradient-to-br from-primary/10 to-accent/10 p-6">
              <p className="text-xs uppercase tracking-wider text-primary">Open an account</p>
              <h3 className="mt-2 text-2xl font-bold">Get started with {b.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground">Minimum deposit {b.minDeposit === 0 ? "$0" : `$${b.minDeposit}`}. Trade on {b.platforms.slice(0, 2).join(" & ")}.</p>
              <Button className="mt-6 w-full">Open Account with {b.name} <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <p className="mt-3 text-[11px] text-muted-foreground">Disclosure: TheFortFX may earn a commission. This does not affect our independent ratings.</p>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground"><Scale className="h-4 w-4" />Compare with competitors</h3>
              <div className="mt-4 space-y-2">
                {competitors.map((c) => (
                  <Link key={c.slug} to="/compare/$slugs" params={{ slugs: compareSlug(b.slug, c.slug) }} className="flex items-center justify-between rounded-md border border-border bg-background p-3 text-sm transition-colors duration-150 hover:border-primary/40">
                    <span>{b.name} vs {c.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trade with {b.name}</h3>
              <div className="mt-4 space-y-2">
                {featuredPairs.map((p) => (
                  <Link key={p.slug} to="/signals/$pair" params={{ pair: p.slug }} className="flex items-center justify-between rounded-md p-2 transition-colors duration-150 hover:bg-surface-elevated">
                    <span className="font-mono text-sm font-medium">{p.name}</span>
                    <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{p.confidence}%</span><DirectionBadge d={p.signal} /></div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  const color = value >= 90 ? "text-bullish" : value >= 80 ? "text-primary" : "text-warning";
  return (
    <div className="rounded-lg border border-border bg-background p-4 text-center">
      <p className={`font-mono text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label} / 100</p>
    </div>
  );
}
function Fact({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
function SpreadRow({ name, v, avg }: { name: string; v: number; avg: number }) {
  const better = v <= avg;
  return (
    <tr>
      <td className="px-6 py-3 font-mono">{name}</td>
      <td className="px-6 py-3 text-right font-mono">{v} pips</td>
      <td className={`px-6 py-3 text-right text-xs ${better ? "text-bullish" : "text-warning"}`}>{better ? `${((1 - v / avg) * 100).toFixed(0)}% below avg` : `${((v / avg - 1) * 100).toFixed(0)}% above avg`}</td>
    </tr>
  );
}
