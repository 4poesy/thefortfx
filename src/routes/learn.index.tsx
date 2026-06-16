import { createFileRoute, Link } from "@tanstack/react-router";
import { heroImages } from "@/lib/hero-images";
import { useMemo, useState } from "react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ArrowRight, Star, Sparkles, ArrowUpRight } from "lucide-react";
import { articles, type ArticleCategory } from "@/lib/mock-data/articles";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn Forex — Trading Education Library | TheFortFX" },
      {
        name: "description",
        content:
          "TheFortFX Learning Center: 24 in-depth guides on forex basics, technical analysis, risk management, fundamentals, psychology, and proprietary trading strategies.",
      },
      { property: "og:title", content: "Learn Forex — Trading Education Library | TheFortFX" },
      {
        property: "og:description",
        content:
          "Proprietary forex education: 24 deeply-structured guides with diagrams, FAQs, and worked examples.",
      },
      { property: "og:url", content: "/learn" },
    ],
    links: [{ rel: "canonical", href: "/learn" }],
  }),
  component: LearnPage,
});

const categoryColors: Record<ArticleCategory, string> = {
  "Forex Basics": "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "Technical Analysis": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "Risk Management": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "Fundamental Analysis": "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "Trading Psychology": "bg-pink-500/15 text-pink-300 border-pink-500/30",
  Strategies: "bg-teal-500/15 text-teal-300 border-teal-500/30",
};

const categories = [
  "All",
  "Forex Basics",
  "Technical Analysis",
  "Fundamental Analysis",
  "Risk Management",
  "Trading Psychology",
  "Strategies",
] as const;
type Cat = (typeof categories)[number];

function LearnPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("All");

  const featured = useMemo(() => articles.find((a) => a.slug === "the-fort-method"), []);
  const rest = useMemo(() => articles.filter((a) => a.slug !== "the-fort-method"), []);

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: articles.length };
    for (const a of articles) m[a.category] = (m[a.category] ?? 0) + 1;
    return m;
  }, []);

  const filtered = useMemo(() => {
    return rest.filter((a) => {
      if (cat !== "All" && a.category !== cat) return false;
      if (q && !`${a.title} ${a.excerpt}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [rest, cat, q]);

  return (
    <Shell>
      <PageHeader
        eyebrow="Learning Center"
        title="Master the art and science of forex"
        description="24 in-depth guides written by traders, for traders. Every article includes diagrams, worked examples, and proprietary frameworks from the TheFortFX desk."
      image={heroImages.learn} />

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Featured Fort Method hero */}
          {featured && (
            <Link
              to="/learn/$slug"
              params={{ slug: featured.slug }}
              className="group mb-10 block"
            >
              <Card className="relative overflow-hidden border-primary/40 bg-surface p-8 transition-all hover:border-primary/60 sm:p-10">
                <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/3 translate-x-1/3 rounded-full bg-primary/20 blur-3xl" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Star className="h-3 w-3 fill-primary" /> TheFortFX Signature Strategy
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-base text-muted-foreground">{featured.excerpt}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> {featured.readTime} read
                      </span>
                      <span>·</span>
                      <span>{featured.category}</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform group-hover:translate-x-1">
                    Read the framework <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Search + tabs */}
          <Card className="mb-6 border-border bg-surface p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search 24 articles..."
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    cat === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                  <span className="ml-1.5 text-[10px] opacity-70">{counts[c] ?? 0}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Articles grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }}>
                <Card className="group h-full border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40">
                  <Badge variant="outline" className={`text-[10px] ${categoryColors[a.category]}`}>
                    {a.category}
                  </Badge>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {a.readTime}
                    </span>
                    <span className="inline-flex items-center text-primary group-hover:underline">
                      Read <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
            {filtered.length === 0 && (
              <Card className="col-span-full border-dashed border-border bg-surface/40 p-10 text-center text-sm text-muted-foreground">
                <Sparkles className="mx-auto mb-2 h-5 w-5 text-primary" />
                No articles match your search. Try a different keyword or clear the filter.
              </Card>
            )}
          </div>

          {/* BabyPips Integration Section */}
          <div className="mt-16 border-t border-border pt-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">External Resources</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Beginner School of Pipsology</h2>
                <p className="mt-2 text-muted-foreground max-w-2xl text-sm leading-relaxed">
                  New to trading? We've mapped the advanced analytics of <span className="font-semibold text-foreground">TheFortFX</span> to the world-famous beginner curriculum from <span className="font-semibold text-foreground">BabyPips.com</span>. We highly recommend completing their lessons to build a strong foundation.
                </p>
              </div>
              <a href="https://www.babypips.com/learn" target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  Visit BabyPips Academy <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pipsologyLevels.map((lvl) => (
                <Card key={lvl.name} className="flex flex-col justify-between border-border bg-surface p-5 hover:border-primary/30 transition-colors">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">{lvl.stage}</span>
                    <h3 className="mt-2 text-base font-bold text-foreground">{lvl.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{lvl.desc}</p>
                    <ul className="mt-3 space-y-1 text-xs">
                      {lvl.topics.map((t) => (
                        <li key={t} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-accent" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 pt-3 border-t border-border/40">
                    <a href={lvl.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80">
                      Learn on BabyPips <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

const pipsologyLevels = [
  {
    stage: "Beginner",
    name: "Preschool & Kindergarten",
    desc: "What is forex? Who trades it? How does transaction sizing work? When can you trade, and how do you buy and sell?",
    topics: ["What is Forex?", "Three Trading Sessions", "Buy vs Sell Execution", "Pip and Lot Math"],
    url: "https://www.babypips.com/learn/forex#undergraduate-senior",
  },
  {
    stage: "Intermediate",
    name: "Elementary & Middle School",
    desc: "Understand candlestick charts, identifying support and resistance lines, and drawing trend lines to see market structure.",
    topics: ["Support and Resistance", "Japanese Candlesticks", "Moving Averages", "Common Chart Patterns"],
    url: "https://www.babypips.com/learn/forex#elementary-school",
  },
  {
    stage: "Advanced",
    name: "High School & Summer",
    desc: "Develop advanced entry tools: using Fibonacci retracements, pivot points, oscillator divergence, and building a system.",
    topics: ["Fibonacci Tools", "Pivot Points", "MACD & RSI Divergence", "Building a Trade System"],
    url: "https://www.babypips.com/learn/forex#high-school",
  },
  {
    stage: "Expert",
    name: "Undergraduate & Beyond",
    desc: "Incorporate fundamental analysis, currency correlations, retail sentiment indexes, and disciplined trade psychology.",
    topics: ["Retail Sentiment", "Interest Rate Macro", "Multi-Timeframe Analysis", "Risk & Drawdown Rules"],
    url: "https://www.babypips.com/learn/forex#undergraduate-freshman",
  },
];
