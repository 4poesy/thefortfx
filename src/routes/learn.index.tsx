import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { articles } from "@/lib/mock-data";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Forex Learning Center — Trade Like a Pro | ForexPilot AI" },
      { name: "description", content: "Free, in-depth forex education: technical analysis, risk management, psychology, and strategy." },
    ],
    links: [{ rel: "canonical", href: "/learn" }],
  }),
  component: LearnPage,
});

const categories = ["All", "Forex Basics", "Technical Analysis", "Fundamental Analysis", "Risk Management", "Trading Psychology", "Strategies"] as const;

function LearnPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const filtered = articles.filter((a) => {
    if (cat !== "All" && a.category !== cat) return false;
    if (q && !a.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  return (
    <Shell>
      <PageHeader eyebrow="Learning Center" title="Master the art and science of forex" description="Curated, in-depth guides written by traders, for traders." />
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="mb-6 border-border bg-surface p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1 text-xs transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link key={a.slug} to="/learn/$slug" params={{ slug: a.slug }}>
                <Card className="group h-full border-border bg-surface p-6 transition-all hover:border-primary/40">
                  <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {a.readTime}</span>
                    <span className="inline-flex items-center text-primary group-hover:underline">Read <ArrowRight className="ml-1 h-3 w-3" /></span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
