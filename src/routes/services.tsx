import { createFileRoute, Link } from "@tanstack/react-router";
import { heroImages } from "@/lib/hero-images";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, LineChart, Compass, Shield, Brain, BookOpen, ChevronRight, Activity } from "lucide-react";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Platform Services & Features — TheFortFX" },
      { name: "description", content: "Explore the full suite of AI-powered forex intelligence services at TheFortFX. Signals, forecasts, calculators, and our AI Trade Assistant." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: TrendingUp,
    title: "AI Forex Signals",
    desc: "Actionable entry, stop-loss, and take-profit targets with automated confidence scoring and confluence metrics. No guessing — just objective trade setups.",
    link: "/signals",
    linkText: "View Live Signals",
  },
  {
    icon: LineChart,
    title: "Market Forecasts",
    desc: "Daily technical and fundamental analysis projections across major, minor, and commodity pairs. Plan your day with institutional-grade structural mapping.",
    link: "/forecasts",
    linkText: "Read Forecasts",
  },
  {
    icon: Compass,
    title: "Opportunity Scanner",
    desc: "Monitor live relative strength indexes, technical moving confluences, and retail sentiment shifts. Discover high-probability opportunities instantly.",
    link: "/opportunities",
    linkText: "Open Scanner",
  },
  {
    icon: Shield,
    title: "Risk Hub & Calculators",
    desc: "Calculate position sizing, pip value, drawdown threshold, and risk-to-reward metrics. Every calculation is designed to preserve your capital first.",
    link: "/calculators",
    linkText: "Access Calculators",
  },
  {
    icon: Brain,
    title: "AI Trade Assistant",
    desc: "Submit your planned setup to our intelligent trading co-pilot. Receive immediate, data-backed reviews of your risk exposure and technical alignment.",
    link: "/ai-assistant",
    linkText: "Consult AI Assistant",
  },
  {
    icon: BookOpen,
    title: "Trading Journal",
    desc: "Track your trades, record setup screenshots, and automatically calculate Win/Loss ratios and R-multiple returns. Review your mistakes to grow.",
    link: "/journal",
    linkText: "Open Trading Journal",
  },
];

function ServicesPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Platform Features"
        title="Our Services"
        description="TheFortFX brings institutional-grade analytics, automation, and risk control directly into the discretionary trader's workflow."
        image={heroImages.trading}
      >
        <Breadcrumb items={[{ name: "Services" }]} />
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.title} className="flex flex-col justify-between border-border bg-surface p-8 transition-colors hover:border-primary/30">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-border/40">
                <Link to={s.link} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80">
                  {s.linkText} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Activity className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Ready to take control of your trading?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Get instant access to signals, forecasts, our opportunity scanner, and risk tools in one central dashboard.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Get Started Now
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
