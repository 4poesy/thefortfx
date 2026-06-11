// Programmatic SEO meta templates. Canonicals/og:urls are relative paths —
// browsers and crawlers resolve them against the live host.
const SITE_NAME = "TheFortFX";
const YEAR = new Date().getFullYear();

export interface MetaResult {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
}

export const seoMeta = {
  signal: (pair: string, direction: string, confidence: number, slug: string): MetaResult => ({
    title: `${pair} Signal Today – ${direction} | ${confidence}% Confidence | ${SITE_NAME}`,
    description: `Live ${pair} forex signal: ${direction} with ${confidence}% confidence score. Real-time entry zone, stop loss, take profit, and risk analysis.`,
    canonical: `/signals/${slug}`,
    ogTitle: `${pair} ${direction} Signal – ${confidence}% Confidence`,
    ogDescription: `TheFortFX is showing a ${direction} signal on ${pair} with ${confidence}% confidence.`,
    ogImage: `/api/og/signal?pair=${encodeURIComponent(pair)}&direction=${direction}&confidence=${confidence}`,
    ogType: "article",
  }),

  forecast: (pair: string, bullish: number, trend: string, slug: string): MetaResult => ({
    title: `${pair} Forecast – ${trend} Outlook | ${SITE_NAME}`,
    description: `${pair} forex forecast: ${bullish}% bullish sentiment. Technical and fundamental analysis with key support and resistance levels updated daily.`,
    canonical: `/forecasts/${slug}`,
    ogImage: `/api/og/forecast?pair=${encodeURIComponent(pair)}&bullish=${bullish}&trend=${encodeURIComponent(trend)}`,
    ogType: "article",
  }),

  pairHub: (pair: string, price: number, signal: string, slug: string): MetaResult => ({
    title: `${pair} Live Rate, Signal & Forecast – ${SITE_NAME}`,
    description: `${pair} live rate: ${price}. Current signal: ${signal}. Full technical analysis, forecast, support/resistance levels, and top broker recommendations.`,
    canonical: `/pairs/${slug}`,
  }),

  broker: (name: string, rating: number, regulation: string[], slug: string): MetaResult => ({
    title: `${name} Review ${YEAR} – Is It Legit? Rating: ${rating}/5 | ${SITE_NAME}`,
    description: `Honest ${name} broker review: regulation (${regulation.join(", ")}), spreads, platforms, pros and cons. ${rating}/5 stars from real traders.`,
    canonical: `/brokers/${slug}`,
    ogImage: `/api/og/broker?name=${encodeURIComponent(name)}&rating=${rating}`,
    ogType: "article",
  }),

  compare: (a: string, b: string, slug: string): MetaResult => ({
    title: `${a} vs ${b} – Which Broker Is Better in ${YEAR}? | ${SITE_NAME}`,
    description: `${a} vs ${b}: side-by-side comparison of spreads, regulation, minimum deposit, platforms, and trader ratings. Find out which broker wins.`,
    canonical: `/compare/${slug}`,
  }),

  calculator: (tool: string, slugPath: string, pair?: string): MetaResult => ({
    title: `${tool}${pair ? ` for ${pair}` : ""} – Free Forex Calculator | ${SITE_NAME}`,
    description: `Use our free ${tool.toLowerCase()} instantly. ${pair ? `Pre-configured for ${pair}. ` : ""}No registration needed. Accurate pip values, position sizes, and risk calculations.`,
    canonical: `/calculators/${slugPath}`,
  }),

  article: (title: string, excerpt: string, slug: string): MetaResult => ({
    title: `${title} | ${SITE_NAME}`,
    description: excerpt,
    canonical: `/learn/${slug}`,
    ogType: "article",
  }),

  economicEvent: (title: string, currency: string, date: string, slug: string): MetaResult => ({
    title: `${currency} ${title} – Impact Analysis & Forecast | ${SITE_NAME}`,
    description: `${title} (${currency}) on ${date}: forecast, previous reading, and impact analysis on major forex pairs.`,
    canonical: `/economic-calendar/${slug}`,
  }),
};

// Convert a MetaResult into TanStack head() shape.
export const toHead = (m: MetaResult) => ({
  meta: [
    { title: m.title },
    { name: "description", content: m.description },
    { property: "og:title", content: m.ogTitle ?? m.title },
    { property: "og:description", content: m.ogDescription ?? m.description },
    { property: "og:url", content: m.canonical },
    ...(m.ogType ? [{ property: "og:type", content: m.ogType }] : []),
    ...(m.ogImage ? [{ property: "og:image", content: m.ogImage }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: m.title },
    { name: "twitter:description", content: m.description },
  ],
  links: [{ rel: "canonical", href: m.canonical }],
});
