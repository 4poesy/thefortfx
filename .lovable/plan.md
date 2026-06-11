## Goal

Implement the complete `/learn` Learning Center exactly as specified in your prompt: 24 proprietary articles, 15 SVG diagrams, a category-filtered hub with "The Fort Method" hero, FAQ accordions, JSON-LD schemas, internal linking, and a dynamic OG image route.

## What I'll build

### 1. Mock data — `src/lib/mock-data/articles.ts` (rewrite)
- Replace the current 20-article set with the **24 canonical articles** from your spec (exact slugs, titles, categories, excerpts, FAQs, readTime, publishedAt, relatedPairs, relatedSlugs).
- Extend the `Article` type to include: `faqs`, `keyTakeaway`, `body` (structured H2/H3 sections), and an optional `diagram` key mapping to one of the 15 components.
- I will author the body content in TheFortFX's premium, structured voice (no filler, no generic copy) — typically 500–800 words per article across 3–5 H2 sections, plus H3 sub-sections where the spec implies a step-by-step.
- Maintain backwards-compat exports (so `signals`/`brokers` etc. still work elsewhere).

### 2. SVG diagrams — `src/components/learn/diagrams/`
All 15 components built per spec, using TheFortFX tokens (`#0B0F19`, `#22C55E`, `#3B82F6`, `#F59E0B`, `#1F2937`):
1. `CandlestickDiagram` 2. `MovingAverageDiagram` 3. `ParabolicSARDiagram` 4. `FractalsDiagram` 5. `RSIDiagram` 6. `StochasticDiagram` 7. `SupportResistanceDiagram` 8. `TrendlineDiagram` 9. `FibonacciDiagram` 10. `MACDDiagram` 11. `IchimokuDiagram` 12. `LotSizeTableDiagram` (table-style) 13. `StopLossTakeProfitDiagram` 14. `FortMethodDiagram` (7-step flowchart) 15. `PendingOrdersDiagram`
- Plus a small `diagram-registry.ts` to map slug → component.

### 3. Article page — `src/routes/learn.$slug.tsx` (rewrite)
- Breadcrumb (with `BreadcrumbSchema`)
- Header: `CategoryBadge` + `ReadTimeBadge` + H1 + excerpt
- Key Takeaway card (left green border, dark surface)
- Diagram rendered after takeaway (when mapped)
- Body rendered as semantic H2/H3 + paragraphs
- FAQ section using `<details>` accordion + `FaqSchema`
- Related Tools section (1 calculator chosen by category rule)
- Read Next section (2 related articles from `relatedSlugs`)
- 1 signal/pair link from `relatedPairs`
- `head()` with title `${title} | TheFortFX`, description = excerpt, OG type=article, canonical, OG image pointing at new `/api/og/learn`

### 4. Hub page — `src/routes/learn.index.tsx` (rewrite)
- Featured hero card for **The Fort Method** labeled "⭐ TheFortFX Signature Strategy"
- Client-side category filter tabs: All | Forex Basics | Technical Analysis | Fundamental Analysis | Risk Management | Trading Psychology | Strategies (with live counts)
- Article grid with category badge, read-time, excerpt, "Read article" CTA
- Page meta: `Learn Forex — Trading Education Library | TheFortFX`

### 5. OG image route — `src/routes/api.og.learn.ts`
- Server route reusing `og-image.ts` builder
- Category color map per spec
- Title + category badge + "TheFortFX · Your Trading Command Center" footer

### 6. Sitemap — already consumes `articles.map(...)`, will auto-pick up the 24 new slugs.

## Out of scope (won't change)
- Other routes, the global header/footer, signals/brokers/calculators data — unchanged.
- The previous 20 article slugs will be replaced; any external references to them will 404. (The spec mandates the new slug set.)

## Heads-up
- Article body copy is **not** included in your spec, so I will write it in TheFortFX's proprietary voice based on the topic and FAQs. If you'd prefer to supply the body text, say so and I'll skip generating it.
- Estimated output: ~24 article bodies + 15 diagrams + 3 route rewrites + 1 server route — substantial but contained.

Reply "go" (or with any tweaks) and I'll execute.