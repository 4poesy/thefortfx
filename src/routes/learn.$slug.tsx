import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Calculator, ArrowRight } from "lucide-react";
import { getArticleBySlug, getArticleBySlug as bySlug, articles, type Article } from "@/lib/mock-data/articles";
import { getPairBySlug, type Pair } from "@/lib/mock-data/pairs";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { FaqSection } from "@/components/faq-section";
import { DirectionBadge } from "@/components/badges";
import { seoMeta, toHead } from "@/lib/seo/meta-templates";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const h = toHead(seoMeta.article(loaderData.article.title, loaderData.article.excerpt, loaderData.article.slug));
    return {
      ...h,
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: loaderData.article.title,
          description: loaderData.article.excerpt,
          datePublished: loaderData.article.publishedAt,
          author: { "@type": "Organization", name: "ForexPilot AI" },
        }),
      }],
    };
  },
  component: ArticlePage,
});

const calculatorsByCategory: Record<string, { to: string; label: string }[]> = {
  "Forex Basics": [
    { to: "/calculators/pip-calculator", label: "Pip Calculator" },
    { to: "/calculators/position-size", label: "Position Size Calculator" },
  ],
  "Risk Management": [
    { to: "/calculators/position-size", label: "Position Size Calculator" },
    { to: "/calculators/risk-reward", label: "Risk:Reward Calculator" },
    { to: "/calculators/drawdown", label: "Drawdown Calculator" },
  ],
  "Technical Analysis": [
    { to: "/calculators/stop-loss", label: "Stop Loss Calculator" },
    { to: "/calculators/take-profit", label: "Take Profit Calculator" },
  ],
  "Fundamental Analysis": [{ to: "/calculators/position-size", label: "Position Size Calculator" }],
  "Trading Psychology": [{ to: "/calculators/drawdown", label: "Drawdown Calculator" }],
  Strategies: [
    { to: "/calculators/risk-reward", label: "Risk:Reward Calculator" },
    { to: "/calculators/position-size", label: "Position Size Calculator" },
  ],
};

function ArticlePage() {
  const { article: a } = Route.useLoaderData() as { article: Article };
  const related: Article[] = a.relatedSlugs
    .map((s: string) => bySlug(s))
    .filter((x: Article | undefined): x is Article => Boolean(x))
    .slice(0, 3);
  const relatedFinal = related.length >= 2 ? related : articles.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 3);
  const relatedPairs: Pair[] = a.relatedPairs
    .map((s: string) => getPairBySlug(s))
    .filter((x: Pair | undefined): x is Pair => Boolean(x))
    .slice(0, 2);
  const tools = calculatorsByCategory[a.category] ?? [];
  const blocks = a.content.split("\n").filter((l: string) => l.trim().length > 0);
  const faqs = [
    { q: `What is the key takeaway from "${a.title}"?`, a: a.excerpt },
    { q: `How long does it take to read this article?`, a: `About ${a.readTime}. It covers ${a.category.toLowerCase()} concepts in practical, beginner-accessible language with concrete examples.` },
    { q: `Which tools help me apply this?`, a: tools.length ? `Use our free ${tools.map((t) => t.label).join(" and ")} to put these concepts into practice — no registration required.` : "Our free trading calculators help you apply these concepts — no registration required." },
  ];

  return (
    <Shell>
      <PageHeader eyebrow={a.category} title={a.title} description={a.excerpt}>
        <Breadcrumb items={[{ name: "Learn", href: "/learn" }, { name: a.title }]} />
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-8 lg:col-span-2">
            <article>
              <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="outline">{a.category}</Badge>
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{a.readTime} read</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Published {a.publishedAt}</span>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                {blocks.map((block: string, i: number) =>
                  block.startsWith("## ") ? (
                    <h2 key={i} className="mt-8 text-xl font-semibold text-foreground">{block.slice(3)}</h2>
                  ) : (
                    <p key={i} className={i === 0 ? "text-lg text-foreground" : undefined}>{block}</p>
                  ),
                )}
              </div>
            </article>

            <FaqSection faqs={faqs} title="Related questions" />
          </div>

          <aside className="space-y-6">
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Articles</h3>
              <div className="mt-4 space-y-3">
                {relatedFinal.map((r) => (
                  <Link key={r.slug} to="/learn/$slug" params={{ slug: r.slug }} className="block rounded-lg border border-border bg-background p-3 transition-colors duration-150 hover:border-primary/40">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.readTime} · {r.category}</p>
                  </Link>
                ))}
              </div>
            </Card>

            {tools.length > 0 && (
              <Card className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Tools</h3>
                <div className="mt-4 space-y-2 text-sm">
                  {tools.map((t) => (
                    <Link key={t.to} to={t.to} className="flex items-center justify-between rounded-md p-2 text-primary transition-colors duration-150 hover:bg-surface-elevated">
                      <span className="flex items-center gap-2"><Calculator className="h-4 w-4" />{t.label}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {relatedPairs.length > 0 && (
              <Card className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Signals</h3>
                <div className="mt-4 space-y-2">
                  {relatedPairs.map((p) => (
                    <Link key={p.slug} to="/signals/$pair" params={{ pair: p.slug }} className="flex items-center justify-between rounded-md border border-border bg-background p-3 transition-colors duration-150 hover:border-primary/40">
                      <div>
                        <p className="font-mono text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.confidence}% confidence</p>
                      </div>
                      <DirectionBadge d={p.signal} />
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </Shell>
  );
}
