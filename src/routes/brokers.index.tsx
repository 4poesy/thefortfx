import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Shield, ArrowRight } from "lucide-react";
import { brokers } from "@/lib/mock-data";

export const Route = createFileRoute("/brokers/")({
  head: () => ({
    meta: [
      { title: "Best Forex Brokers 2026 — Reviews & Comparison | ForexPilot AI" },
      { name: "description", content: "Independent forex broker reviews. Compare regulation, spreads, platforms, and leverage." },
    ],
    links: [{ rel: "canonical", href: "/brokers" }],
  }),
  component: BrokersPage,
});

function BrokersPage() {
  return (
    <Shell>
      <PageHeader eyebrow="Brokers" title="Top-rated forex brokers" description="Independently reviewed brokers ranked on regulation, execution, spreads, and platform quality." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brokers.map((b) => (
              <Card key={b.slug} className="border-border bg-surface p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{b.name}</h3>
                  <div className="flex items-center gap-1 text-warning"><Star className="h-4 w-4 fill-current" /><span className="text-sm font-medium text-foreground">{b.rating}</span></div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Spread from</p>
                <p className="font-mono text-2xl font-bold">{b.spread}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <Info label="Min deposit" value={b.minDeposit} />
                  <Info label="Leverage" value={b.leverage} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {b.platforms.map((p) => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Shield className="h-3 w-3" /> {b.regulation.join(" · ")}</div>
                <div className="mt-4 flex gap-2">
                  <Link to="/brokers/$broker" params={{ broker: b.slug }} className="flex-1"><Button variant="outline" className="w-full">Read review</Button></Link>
                  <Button className="flex-1">Visit broker <ArrowRight className="ml-1 h-3 w-3" /></Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-border bg-background p-2"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-0.5 font-medium">{value}</p></div>;
}
