import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Target, ShieldCheck, Users, Globe2, TrendingUp, Brain, Building2 } from "lucide-react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TheFortFX — The Trader's Command Center | TheFortFX" },
      { name: "description", content: "TheFortFX is an AI-powered forex intelligence platform built for serious traders. Learn about our mission, the team, and the technology behind our signals, forecasts, and risk tools." },
      { property: "og:title", content: "About TheFortFX — The Trader's Command Center" },
      { property: "og:description", content: "AI-powered forex intelligence built for serious traders — signals, forecasts, sentiment and pro risk tools in one command center." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const stats = [
  { label: "Traders served", value: "120K+" },
  { label: "Pairs monitored", value: "65" },
  { label: "Signal sources", value: "50+" },
  { label: "Avg signal latency", value: "<2s" },
];

const values = [
  { icon: Target, title: "Edge over noise", body: "We surface high-conviction setups and filter the rest. No hype, no shilling — just statistically scored opportunities." },
  { icon: ShieldCheck, title: "Risk-first design", body: "Every tool, from position sizing to drawdown analytics, defends your capital before optimizing returns." },
  { icon: Brain, title: "Explainable AI", body: "We show you the why behind every signal — confluence, sentiment, macro context — never a black box." },
  { icon: Users, title: "Trader-built", body: "Designed by traders who've blown accounts, recovered, and learned what the discretionary trader actually needs." },
];

const team = [
  { name: "Marcus Vale", role: "Co-founder & CEO", bio: "Ex-prop desk, 12 years FX. Built TheFortFX after losing too many setups to bad spreadsheet workflows." },
  { name: "Dr. Naomi Adesina", role: "Head of Research", bio: "PhD in quantitative finance. Designs our signal-confluence and sentiment scoring models." },
  { name: "Kenji Tanaka", role: "Head of Engineering", bio: "Built low-latency execution systems at two Tier-1 banks. Owns the data pipeline." },
  { name: "Sofia Reyes", role: "Head of Product", bio: "Former TradingView PM. Obsessed with shipping interfaces that respect a trader's attention." },
];

function AboutPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="About us"
        title="The trader's command center"
        description="TheFortFX is an AI-powered forex intelligence platform. We're not a broker — we're the layer of analysis, signal generation, and risk control that sits between you and the market."
      >
        <Breadcrumb items={[{ name: "About" }]} />
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-border bg-surface/60 p-6">
              <p className="text-3xl font-bold tracking-tight text-foreground">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our mission</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Give every serious trader an institutional edge.</h2>
            <p className="mt-4 text-muted-foreground">
              Discretionary traders are drowning in tabs: charting platforms, news terminals, calendar sites, broker dashboards, calculators in spreadsheets. We rebuilt the workflow into one focused command center where AI does the heavy lifting and you make the decision.
            </p>
            <p className="mt-3 text-muted-foreground">
              We don't take custody of funds. We don't auto-trade. We don't sell signals to the highest bidder. We're a research and intelligence platform — your edge, not your broker.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title} className="border-border bg-background/60 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary"><v.icon className="h-4 w-4" /></div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{v.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{v.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">The team</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Built by traders, for traders</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <Card key={m.name} className="border-border bg-surface/60 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                {m.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{m.name}</h3>
              <p className="text-xs text-primary">{m.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-surface/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { icon: Globe2, title: "Global coverage", body: "Majors, minors, exotics — plus gold and indices. 24/5 monitoring across every major session." },
            { icon: TrendingUp, title: "Quant + discretionary", body: "Our models fuse technical confluence, order-flow proxies, sentiment, and macro calendar data." },
            { icon: Building2, title: "Independent", body: "We're not owned by a broker. Our broker reviews are honest because we have no incentive to lie." },
          ].map((b) => (
            <div key={b.title}>
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary"><b.icon className="h-4 w-4" /></div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="border-border bg-gradient-to-br from-primary/10 to-accent/5 p-8 sm:p-12">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Start free
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Trade with an edge, not a hunch.</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Join 120,000+ traders using TheFortFX to find, analyze and manage every setup.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/register"><Button size="lg">Create free account</Button></Link>
              <Link to="/pricing"><Button size="lg" variant="outline">See pricing</Button></Link>
            </div>
          </div>
        </Card>
      </section>
    </Shell>
  );
}
