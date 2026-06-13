import { createFileRoute, Link } from "@tanstack/react-router";
import { heroImages } from "@/lib/hero-images";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — TheFortFX" },
      { name: "description", content: "Simple, transparent pricing for AI-powered forex intelligence." },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

const plans = [
  { name: "Starter", price: "$0", period: "forever", desc: "Explore the platform.", cta: "Get started", features: ["10 signals/day", "Economic calendar", "All calculators", "Community access"], highlight: false },
  { name: "Pro", price: "$29", period: "/month", desc: "For serious traders.", cta: "Start free trial", features: ["Unlimited signals & forecasts", "AI Trade Assistant", "Custom watchlists & alerts", "Trade journal & analytics", "Priority support"], highlight: true },
  { name: "Institutional", price: "Custom", period: "", desc: "For teams & funds.", cta: "Contact sales", features: ["Everything in Pro", "API access", "Multi-seat workspaces", "Dedicated account manager", "SSO & compliance"], highlight: false },
];

function Pricing() {
  return (
    <Shell>
      <PageHeader eyebrow="Pricing" title="Built for traders at every stage" description="Start free. Upgrade when you're ready. Cancel anytime." / image={heroImages.trading}>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.name} className={`relative border-border p-8 ${p.highlight ? "border-primary/50 bg-primary/10 glow-primary" : "bg-surface"}`}>
                {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground"><Sparkles className="-mt-0.5 mr-1 inline h-3 w-3" />Most popular</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                  <span className="mb-1 text-sm text-muted-foreground">{p.period}</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm">{p.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-accent" />{f}</li>)}</ul>
                <Link to="/register" className="mt-8 block"><Button className={`w-full ${p.highlight ? "" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>{p.cta}</Button></Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
