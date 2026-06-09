import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { getArticle, articles } from "@/lib/mock-data";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a) throw notFound();
    return { article: a };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.article.title} | ForexPilot AI Learning Center` },
      { name: "description", content: loaderData.article.excerpt },
      { property: "og:title", content: loaderData.article.title },
      { property: "og:description", content: loaderData.article.excerpt },
      { property: "og:type", content: "article" },
    ] : [],
    links: loaderData ? [{ rel: "canonical", href: `/learn/${loaderData.article.slug}` }] : [],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: loaderData.article.title, description: loaderData.article.excerpt, datePublished: loaderData.article.updated,
      }),
    }] : [],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const related = articles.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 3);
  return (
    <Shell>
      <PageHeader eyebrow={a.category} title={a.title} description={a.excerpt}>
        <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-3 w-3" /> Learning Center</Link>
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <article className="lg:col-span-2">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline">{a.category}</Badge>
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{a.readTime} read</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Updated {a.updated}</span>
            </div>
            <div className="prose prose-invert max-w-none space-y-4 text-base leading-relaxed text-muted-foreground">
              <p className="text-lg text-foreground">{a.body}</p>
              <p>Successful trading is built on three pillars: a tested edge, disciplined execution, and rigorous risk management. This article unpacks the principles that separate consistent professionals from the 80% of retail traders who lose money in their first year.</p>
              <h2 className="mt-8 text-xl font-semibold text-foreground">Key Concepts</h2>
              <p>Before applying any technique, internalize these fundamentals. They compound across every trade you take — for better or for worse.</p>
              <ul className="ml-6 list-disc">
                <li>Always define your invalidation level before entering a trade.</li>
                <li>Position size is more important than entry precision.</li>
                <li>Process matters more than any single outcome.</li>
                <li>Edge × frequency × consistency = profit. Skip one and you skip the result.</li>
              </ul>
              <h2 className="mt-8 text-xl font-semibold text-foreground">Putting It Into Practice</h2>
              <p>Translate these ideas into a written checklist. Run every trade through it. If a setup fails even one criterion, skip it — there will be another. Discipline beats brilliance over a 1,000-trade sample.</p>
            </div>
          </article>

          <aside className="space-y-6">
            <Card className="border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Articles</h3>
              <div className="mt-4 space-y-3">
                {related.map((r) => (
                  <Link key={r.slug} to="/learn/$slug" params={{ slug: r.slug }} className="block rounded-lg border border-border bg-background p-3 hover:border-primary/40">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.readTime} · {r.category}</p>
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
