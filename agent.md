# Agent Handoff Guide — Developer & AI Assistant Context

This document is designed for AI coding assistants (like Gemini, Cursor, or Claude) or new developers onboarding onto the **TheFortFX** codebase. It outlines the architectural details, file mappings, patterns, and verification pipelines.

---

## 🏛️ Architecture Conventions

TheFortFX is a full-stack React framework built on **TanStack Start**, which combines:
1. **TanStack Router:** File-based type-safe routing.
2. **Vite:** Asset compiling and plugin orchestration.
3. **Nitro:** The server handler and deployment package.
4. **Tailwind CSS v4:** A CSS-first utility library loaded directly inside `src/styles.css`.

---

## 📂 Key Files & Where to Edit

| Target Area | File to Modify | Notes |
| :--- | :--- | :--- |
| **Styling & Themes** | `src/styles.css` | Edit OKLCH variables, classes, utility definitions, or animations. |
| **Global Shell** | `src/routes/__root.tsx` | Contains base HTML `<head>` assets, provider wrappers, and PWA registration hooks. |
| **Site Navigation** | `src/components/layout/Header.tsx` | Contains responsive header navbar, search links, and the `<NotificationCenter />` dropdown. |
| **Watchlist & Settings** | `src/routes/dashboard.tsx` | Handles account profile updates, settings toggle states, and the interactive watchlist dialog checklist. |
| **Signal Feeds** | `src/lib/mock-data.ts` | Mapping file. Derived views are generated here from canonical tables in `src/lib/mock-data/*`. |
| **Advanced Charting** | `src/routes/pairs.$pair.tsx` | Houses the `<TradingViewChart />` widget, loading responsive technical charts based on client-theme state. |

---

## 🧠 Mock Data Guidelines
* **TheFortFX runs entirely on client-side mock data.** No external network fetches or real database integrations are configured yet.
* Canonical data is located in `src/lib/mock-data/` (`pairs.ts`, `brokers.ts`, `economic-events.ts`, `articles.ts`).
* **Do not use placeholder text:** Ensure all listings have logical mock values (e.g. valid prices, realistic signal setups, correct decimal values).
* **Signal Object Schema:** When modifying signal objects, preserve backward-compatible properties so that old widgets don't break:
  * *New Naming:* `slug`, `stop`, `target`, `rMultiple`, `riskLevel`, `lastUpdated`.
  * *Compatibility Aliases:* `symbol`, `stopLoss`, `takeProfit`, `rr`, `risk`, `updated`.

---

## 🚀 Verification Workflow

Before concluding any code changes, verify your additions using the following steps:

1. **Compilation Check:**
   Run the production compiler to verify type-safety, code imports, and route trees:
   ```bash
   bun run build
   ```
2. **Development Server Startup:**
   Start the local dev server to ensure hydration and runtime assets mount correctly:
   ```bash
   bun run dev
   ```
3. **PWA & CSS Verification:**
   Ensure the manifest (`/site.webmanifest`) and service worker (`/sw.js`) are linked in the document head and register cleanly in the browser console.
