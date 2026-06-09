import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Calculator, BarChart3, ShieldCheck, TrendingDown, Activity, TrendingUp, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/calculators/")({
  head: () => ({
    meta: [
      { title: "Forex Trading Calculators — Free Tools | ForexPilot AI" },
      { name: "description", content: "Professional forex calculators: pip value, position size, risk/reward, stop loss, take profit, and drawdown." },
    ],
    links: [{ rel: "canonical", href: "/calculators" }],
  }),
  component: CalcHub,
});

const tools = [
  { to: "/calculators/pip-calculator", icon: Calculator, title: "Pip Calculator", desc: "Calculate the monetary value of a pip for any pair and lot size." },
  { to: "/calculators/position-size", icon: BarChart3, title: "Position Size Calculator", desc: "Determine the correct lot size based on account risk." },
  { to: "/calculators/risk-reward", icon: ShieldCheck, title: "Risk/Reward Calculator", desc: "Evaluate a trade's risk-to-reward ratio in seconds." },
  { to: "/calculators/drawdown", icon: TrendingDown, title: "Drawdown Calculator", desc: "Visualize portfolio drawdown across a losing streak." },
  { to: "/calculators/stop-loss", icon: Activity, title: "Stop Loss Calculator", desc: "Compute a stop-loss price from your risk in pips." },
  { to: "/calculators/take-profit", icon: TrendingUp, title: "Take Profit Calculator", desc: "Set precise profit targets aligned with your R:R." },
];

function CalcHub() {
  return (
    <Shell>
      <PageHeader eyebrow="Tools" title="Professional Trading Calculators" description="The same risk math used by institutional desks — free, fast, and beautifully designed." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.to} to={t.to}>
                <Card className="group h-full border-border bg-surface p-6 transition-all hover:border-primary/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><t.icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                  <span className="mt-4 inline-flex items-center text-xs text-primary group-hover:underline">Open <ArrowRight className="ml-1 h-3 w-3" /></span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
