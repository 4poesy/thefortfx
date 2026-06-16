# TheFortFX — Code Style & Platform Rules

This document outlines the strict styling, architectural, and quality rules that must be followed on every commit in the **TheFortFX** codebase.

---

## 🎨 Styling & Theme Rules

1. **Dark Mode First:** 
   - The application style is dark-first. Backgrounds must use `#0B0F19` or `#111827` (`var(--background)` / `var(--surface)`).
   - Text colors are `#FFFFFF` (`var(--foreground)`) and `#D1D5DB` (`var(--muted-foreground)`).
2. **Fintech Accent Palette:**
   - Green (Bullish / Success): `#22C55E` (`var(--bullish)` / `var(--accent)`)
   - Blue (Information / Primary): `#3B82F6` (`var(--primary)`)
   - Red (Bearish / Destructive): `oklch(0.65 0.22 25)` (`var(--bearish)` / `var(--destructive)`)
3. **No Box Shadows:** 
   - Use border colors (`border border-border`) for depth and layout separations instead of shadows.
4. **Cards & Badges:**
   - Cards must use `bg-surface` (`#111827`), `border border-border` (`#1F2937` or equivalent), and `rounded-xl` (`12px`).
   - Badges are small pill shapes, color-coded by directional sentiment (green for Buy/Bullish, red for Sell/Bearish, gray for Neutral).
5. **Transitions:** 
   - All interactive elements (links, buttons, tab triggers) must have hover transitions (`transition-all duration-150 ease-in-out`).

---

## 🏗️ TypeScript & Coding Standards

1. **Type-Safety:** 
   - Strict TypeScript checking is enabled. No `any` types should be introduced.
   - Route load responses, parameters, schemas, and mock inputs must be properly typed.
2. **File Structure:**
   - Put page layouts in `src/routes/`.
   - Put layout structures (Header, Footer, Shell) in `src/components/layout/`.
   - Put atomic UI widgets in `src/components/ui/`.
3. **Derived Data Views:**
   - Raw datasets reside inside `src/lib/mock-data/`.
   - Any custom calculations, mapping, filters, or adapter routines must be implemented in `src/lib/mock-data.ts` to keep page files thin.

---

## 🔍 Internal Linking & SEO Rules

To satisfy programmatic index requirements:
- **Signals details page (`/signals/[pair]`):** Must link to `/pairs/[pair]`, `/forecasts/[pair]`, and the position size calculator pre-filled with the pair slug.
- **Forecasts details page (`/forecasts/[pair]`):** Must link to `/pairs/[pair]`, `/signals/[pair]`, and at least one relevant education article.
- **Pairs hub page (`/pairs/[pair]`):** Must link to corresponding signal pages, forecast pages, recommended brokers, related learn articles, and pip value calculators.
- **Articles page (`/learn/[slug]`):** Must link to 2 related articles, 1 risk calculator, and 1 relevant signal chart page.
- **Brokers reviews page (`/brokers/[broker]`):** Must link to competitor comparison pages and related signals.
- **Calculators page (`/calculators/[tool]`):** Must link to the pair hubs for selected instruments.

---

## ❓ FAQ Schema Requirements

The following pages **must** implement a visible FAQ Accordion UI backed by the `<FaqSchema>` JSON-LD script:
1. Every Broker Review details page (minimum of 5 questions).
2. Every Calculator page (3–5 how-to questions).
3. Every Educational Article page (3–5 related curriculum questions).

---

## 📝 Commit Conventions

Use semantic commit formats:
- `feat:` for new UI components or layouts.
- `fix:` for fixing bugs, TypeScript compile issues, or broken links.
- `docs:` for updating readme, agent, or style guides.
- `style:` for tweaking colors, padding, CSS classes, or animations.
- `refactor:` for rearranging directory mock data or adapter structures.
