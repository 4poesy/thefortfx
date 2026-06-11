import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Calculator, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { getArticleBySlug, articles, type Article } from "@/lib/mock-data/articles";
import { getPairBySlug, type Pair } from "@/lib/mock-data/pairs";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { FaqSchema } from "@/components/seo/JsonLd";
import { DirectionBadge } from "@/components/badges";
import { diagramRegistry } from "@/components/learn/diagrams";

const SITE_NAME = "TheFortFX";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return {};
    const a = loaderData.article;
    const ogImage = `/api/og/learn?title=${encodeURIComponent(a.title)}&category=${encodeURIComponent(a.category)}`;
    return {
      meta: [
        { title: `${a.title} | ${SITE_NAME}` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/learn/${params.slug}` },
        { property: "og:image", content: ogImage },
        { property: "article:published_time", content: a.publishedAt },
        { property: "article:section", content: a.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: a.title },
        { name: "twitter:description", content: a.excerpt },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: `/learn/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            datePublished: a.publishedAt,
            articleSection: a.category,
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME },
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

const calculatorByCategory: Record<string, { to: string; label: string }> = {
  "Forex Basics": { to: "/calculators/pip-calculator", label: "Pip Calculator" },
  "Risk Management": { to: "/calculators/position-size", label: "Position Size Calculator" },
  "Technical Analysis": { to: "/calculators/risk-reward", label: "Risk:Reward Calculator" },
  "Fundamental Analysis": { to: "/economic-calendar", label: "Economic Calendar" },
  "Trading Psychology": { to: "/calculators/drawdown", label: "Drawdown Calculator" },
  Strategies: { to: "/calculators/risk-reward", label: "Risk:Reward Calculator" },
};

function ArticlePage() {
  const { article: a } = Route.useLoaderData() as { article: Article };

  const related: Article[] = a.relatedSlugs
    .map((s) => getArticleBySlug(s))
    .filter((x): x is Article => Boolean(x))
    .slice(0, 2);
  const relatedFinal =
    related.length >= 2
      ? related
      : articles.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 2);

  const relatedPair: Pair | undefined = a.relatedPairs
    .map((s) => getPairBySlug(s))
    .filter((x): x is Pair => Boolean(x))[0];

  const tool = calculatorByCategory[a.category];
  const Diagram = a.diagram ? diagramRegistry[a.diagram] : undefined;

  // Parse body into semantic blocks
  const blocks = a.body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((line) => {
      if (line.startsWith("### ")) return { type: "h3", text: line.slice(4) } as const;
      if (line.startsWith("## ")) return { type: "h2", text: line.slice(3) } as const;
      return { type: "p", text: line } as const;
    });

  return (
    <Shell>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Learn", href: "/learn" }, { name: a.title }]} />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/15 text-primary hover:bg-primary/20">{a.category}</Badge>
            <Badge variant="outline" className="gap-1">
              <BookOpen className="h-3 w-3" />
              {a.readTime} read
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {a.publishedAt}
            </Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{a.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{a.excerpt}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <article className="space-y-8 lg:col-span-2">
            {/* Key Takeaway */}
            <Card className="border-l-4 border-l-primary border-y border-r border-border bg-surface p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Key takeaway
              </div>
              <p className="mt-2 text-base leading-relaxed text-foreground">{a.keyTakeaway}</p>
            </Card>

            {/* Diagram */}
            {Diagram && (
              <div>
                <Diagram />
              </div>
            )}

            {/* Body */}
            <div className="prose prose-invert max-w-none space-y-4 text-base leading-relaxed text-muted-foreground">
              {blocks.map((b, i) => {
                if (b.type === "h2")
                  return (
                    <h2 key={i} className="mt-8 text-2xl font-semibold text-foreground">
                      {b.text}
                    </h2>
                  );
                if (b.type === "h3")
                  return (
                    <h3 key={i} className="mt-6 text-lg font-semibold text-foreground">
                      {b.text}
                    </h3>
                  );
                return (
                  <p key={i} dangerouslySetInnerHTML={{ __html: b.text }} />
                );
              })}
            </div>

            {/* FAQ */}
            <section aria-labelledby="faq-heading" className="rounded-xl border border-border bg-surface p-6">
              <h2 id="faq-heading" className="text-xl font-semibold text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="mt-4 divide-y divide-border">
                {a.faqs.map((f, i) => (
                  <details key={i} className="group py-3">
                    <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium text-foreground">
                      <span>{f.q}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
              <FaqSchema faqs={a.faqs} />
            </section>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {tool && (
              <Card className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Tool</h3>
                <Link
                  to={tool.to}
                  className="mt-3 flex items-center justify-between rounded-md border border-border bg-background p-3 text-primary transition-colors duration-150 hover:border-primary/40"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Calculator className="h-4 w-4" />
                    {tool.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Card>
            )}

            {relatedPair && (
              <Card className="border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live Pair</h3>
                <Link
                  to="/signals/$pair"
                  params={{ pair: relatedPair.slug }}
                  className="mt-3 flex items-center justify-between rounded-md border border-border bg-background p-3 transition-colors duration-150 hover:border-primary/40"
                >
                  <div>
                    <p className="font-mono text-sm font-medium">{relatedPair.name}</p>
                    <p className="text-xs text-muted-foreground">{relatedPair.confidence}% confidence</p>
                  </div>
                  <DirectionBadge d={relatedPair.signal} />
                </Link>
              </Card>
            )}

            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Read Next</h3>
              <div className="mt-3 space-y-3">
                {relatedFinal.map((r) => (
                  <Link
                    key={r.slug}
                    to="/learn/$slug"
                    params={{ slug: r.slug }}
                    className="block rounded-lg border border-border bg-background p-3 transition-colors duration-150 hover:border-primary/40"
                  >
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {r.readTime} · {r.category}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
