// JSON-LD structured data components. Rendered inline in the page body — valid for crawlers.
import type { Broker } from "@/lib/mock-data/brokers";

function Ld({ schema }: { schema: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function SignalSchema({ pair, direction, confidence, entry, sl, tp }: { pair: string; direction: string; confidence: number; entry: number; sl: number; tp: number }) {
  return (
    <Ld schema={{
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      name: `${pair} Forex Signal`,
      description: `${direction} signal for ${pair} with ${confidence}% confidence`,
      feesAndCommissionsSpecification: `Entry: ${entry}, Stop Loss: ${sl}, Take Profit: ${tp}`,
      provider: { "@type": "Organization", name: "ForexPilot AI" },
    }} />
  );
}

export function BrokerSchema({ broker }: { broker: Broker }) {
  return (
    <Ld schema={{
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: { "@type": "FinancialService", name: broker.name, description: broker.description },
      reviewRating: { "@type": "Rating", ratingValue: broker.rating, bestRating: 5 },
      author: { "@type": "Organization", name: "ForexPilot AI" },
    }} />
  );
}

export function AggregateRatingSchema({ broker }: { broker: Broker }) {
  return (
    <Ld schema={{
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: broker.name,
      aggregateRating: { "@type": "AggregateRating", ratingValue: broker.rating, reviewCount: broker.reviewCount, bestRating: 5 },
    }} />
  );
}

export function FaqSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <Ld schema={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }} />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  return (
    <Ld schema={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        ...(item.url ? { item: item.url } : {}),
      })),
    }} />
  );
}

export function HowToSchema({ tool, steps }: { tool: string; steps: string[] }) {
  return (
    <Ld schema={{
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use the ${tool}`,
      step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
    }} />
  );
}
