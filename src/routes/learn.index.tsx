import { createFileRoute, Link } from "@tanstack/react-router";
import { heroImages } from "@/lib/hero-images";
import { useMemo, useState } from "react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ArrowRight, Star, Sparkles } from "lucide-react";
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
      / image={heroImages.learn}>

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
        </div>
      </section>
    </Shell>
  );
}
