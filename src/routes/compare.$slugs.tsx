import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, CheckCircle2, ArrowRight } from "lucide-react";
import { parseCompareSlug, type Broker } from "@/lib/mock-data/brokers";
import { pairs } from "@/lib/mock-data/pairs";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { BrokerSchema } from "@/components/seo/JsonLd";
import { DirectionBadge } from "@/components/badges";
import { seoMeta, toHead } from "@/lib/seo/meta-templates";

export const Route = createFileRoute("/compare/$slugs")({
  loader: ({ params }) => {
    const parsed = parseCompareSlug(params.slugs);
    if (!parsed) throw notFound();
    if (parsed.canonical !== params.slugs.toLowerCase()) {
      throw redirect({ to: "/compare/$slugs", params: { slugs: parsed.canonical } });
    }
    return { a: parsed.a, b: parsed.b, slug: parsed.canonical };
  },
  head: ({ loaderData }) =>
    loaderData ? toHead(seoMeta.compare(loaderData.a.name, loaderData.b.name, loaderData.slug)) : {},
  component: ComparePage,
});

function ComparePage() {
  const { a, b } = Route.useLoaderData() as { a: Broker; b: Broker; slug: string };
  const winner = a.overallScore >= b.overallScore ? a : b;
  const featured = pairs.slice(0, 2);

  const rows: { label: string; av: string; bv: string; winner: "a" | "b" | "tie" }[] = [
    { label: "Rating", av: `${a.rating}/5`, bv: `${b.rating}/5`, winner: a.rating === b.rating ? "tie" : a.rating > b.rating ? "a" : "b" },
    { label: "Min Deposit", av: `$${a.minDeposit}`, bv: `$${b.minDeposit}`, winner: a.minDeposit === b.minDeposit ? "tie" : a.minDeposit < b.minDeposit ? "a" : "b" },
    { label: "EUR/USD Spread", av: `${a.spread.eurusd} pips`, bv: `${b.spread.eurusd} pips`, winner: a.spread.eurusd === b.spread.eurusd ? "tie" : a.spread.eurusd < b.spread.eurusd ? "a" : "b" },
    { label: "Max Leverage", av: a.maxLeverage, bv: b.maxLeverage, winner: parseInt(a.maxLeverage.split(":")[1]) === parseInt(b.maxLeverage.split(":")[1]) ? "tie" : parseInt(a.maxLeverage.split(":")[1]) > parseInt(b.maxLeverage.split(":")[1]) ? "a" : "b" },
    { label: "Regulation", av: a.regulation.join(", "), bv: b.regulation.join(", "), winner: a.regulation.length === b.regulation.length ? "tie" : a.regulation.length > b.regulation.length ? "a" : "b" },
    { label: "Platforms", av: a.platforms.join(", "), bv: b.platforms.join(", "), winner: a.platforms.length === b.platforms.length ? "tie" : a.platforms.length > b.platforms.length ? "a" : "b" },
    { label: "Trust Score", av: `${a.trustScore}/100`, bv: `${b.trustScore}/100`, winner: a.trustScore === b.trustScore ? "tie" : a.trustScore > b.trustScore ? "a" : "b" },
    { label: "Fees Score", av: `${a.feesScore}/100`, bv: `${b.feesScore}/100`, winner: a.feesScore === b.feesScore ? "tie" : a.feesScore > b.feesScore ? "a" : "b" },
  ];

  return (
    <Shell>
      <BrokerSchema broker={a} />
      <BrokerSchema broker={b} />
      <PageHeader eyebrow="Broker Comparison" title={`${a.name} vs ${b.name}`} description={`Side-by-side comparison of spreads, regulation, minimum deposit, platforms, and trader ratings — which broker wins in ${new Date().getFullYear()}?`}>
        <Breadcrumb items={[{ name: "Brokers", href: "/brokers" }, { name: `${a.name} vs ${b.name}` }]} />
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Head-to-head cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {[a, b].map((br) => (
              <Card key={br.slug} className={`relative border-border bg-surface p-6 ${br.slug === winner.slug ? "border-primary/50" : ""}`}>
                {br.slug === winner.slug && (
                  <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground"><Trophy className="mr-1 h-3 w-3" />Winner</Badge>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-semibold">{br.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <Link to="/brokers/$broker" params={{ broker: br.slug }} className="text-lg font-semibold transition-colors duration-150 hover:text-primary">{br.name}</Link>
                    <p className="flex items-center gap-1 text-sm text-warning"><Star className="h-3.5 w-3.5 fill-current" />{br.rating} · {br.reviewCount.toLocaleString()} reviews</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{br.description.split(". ")[0]}.</p>
                <Button className="mt-4 w-full">Open Account with {br.name} <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </Card>
            ))}
          </div>

          {/* Comparison table */}
          <Card className="overflow-hidden border-border bg-surface">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-surface-elevated text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Feature</th>
                  <th className="px-4 py-3 text-left">{a.name}</th>
                  <th className="px-4 py-3 text-left">{b.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-3 text-muted-foreground">{r.label}</td>
                    <td className={`px-4 py-3 ${r.winner === "a" ? "font-semibold text-bullish" : ""}`}>{r.av}{r.winner === "a" && " ✓"}</td>
                    <td className={`px-4 py-3 ${r.winner === "b" ? "font-semibold text-bullish" : ""}`}>{r.bv}{r.winner === "b" && " ✓"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Pros */}
          <div className="grid gap-6 sm:grid-cols-2">
            {[a, b].map((br) => (
              <Card key={br.slug} className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-bullish">{br.name} strengths</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {br.pros.map((p) => <li key={p} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bullish" />{p}</li>)}
                </ul>
              </Card>
            ))}
          </div>

          {/* Verdict */}
          <Card className="border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">Verdict: which is better for you?</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p><span className="font-medium text-foreground">For low-cost trading:</span> {a.feesScore >= b.feesScore ? a.name : b.name} edges ahead with a fees score of {Math.max(a.feesScore, b.feesScore)}/100 and EUR/USD spreads from {Math.min(a.spread.eurusd, b.spread.eurusd)} pips.</p>
              <p><span className="font-medium text-foreground">For beginners:</span> {a.minDeposit <= b.minDeposit ? a.name : b.name} is more accessible with a ${Math.min(a.minDeposit, b.minDeposit)} minimum deposit.</p>
              <p><span className="font-medium text-foreground">For trust and safety:</span> {a.trustScore >= b.trustScore ? a.name : b.name} scores {Math.max(a.trustScore, b.trustScore)}/100 on trust with regulation across {(a.trustScore >= b.trustScore ? a : b).regulation.join(", ")}.</p>
              <p><span className="font-medium text-foreground">Overall:</span> {winner.name} wins this comparison with an overall score of {winner.overallScore}/100, but both brokers are well-regulated, established firms — the right choice depends on your deposit size, preferred platform, and trading style.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1">Open Account with {a.name}</Button>
              <Button variant="outline" className="flex-1">Open Account with {b.name}</Button>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Disclosure: TheFortFX may earn a commission. This does not affect our independent ratings.</p>
          </Card>

          {/* Related signals */}
          <Card className="border-border bg-surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trade these pairs with either broker</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {featured.map((p) => (
                <Link key={p.slug} to="/signals/$pair" params={{ pair: p.slug }} className="flex items-center justify-between rounded-md border border-border bg-background p-3 transition-colors duration-150 hover:border-primary/40">
                  <span className="font-mono text-sm font-medium">{p.name}</span>
                  <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{p.confidence}%</span><DirectionBadge d={p.signal} /></div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </Shell>
  );
}
