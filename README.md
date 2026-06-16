# TheFortFX — AI-Powered Forex Intelligence Command Center

**TheFortFX** is a premium, production-quality fintech SaaS platform built for professional traders. The application provides confidence-scored signal consensus, daily forecasts, an interactive Opportunity Scanner, a Trading Journal, a complete Risk Calculator Hub, and an AI Trade Assistant.

The platform is designed with a premium, high-trust fintech aesthetic inspired by tools like TradingView, Bloomberg Terminal, and Stripe.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework:** [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (Full-Stack React Framework)
- **Routing & Fetching:** [TanStack Router](https://tanstack.com/router/latest) (Type-Safe Routing) + [TanStack Query](https://tanstack.com/query/latest) (Cache & State Management)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first configuration, native CSS variables, OKLCH wide-gamut colors)
- **Package Manager:** [Bun](https://bun.sh/) (Fast dependency resolution and lockfiles)
- **Server Platform:** [Nitro](https://nitro.unjs.io/) (SSR build engine)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
├── public/
│   ├── site.webmanifest     # PWA manifest settings
│   ├── sw.js                # PWA service worker with offline fallback cache
│   └── robots.txt           # SEO rules
├── src/
│   ├── assets/              # Static media assets & images
│   ├── components/
│   │   ├── layout/          # Layout Shell, Header, Footer
│   │   ├── seo/             # JSON-LD Schema components & Breadcrumb
│   │   └── ui/              # Radix/Shadcn primitives (Tabs, Dialog, Card)
│   ├── lib/
│   │   ├── seo/             # Programmatic SEO meta-templates
│   │   ├── mock-data/       # Canonical mock database files (Pairs, Brokers, Events, Articles)
│   │   └── mock-data.ts     # Derived views & adapters
│   ├── routes/              # TanStack Router file-based pages & server entries
│   ├── styles.css           # Global stylesheet & Tailwind configurations
│   ├── router.tsx           # Router instance definition
│   ├── start.ts             # Client-side hydration script
│   └── server.ts            # Server-side Nitro wrap & SSR handler
├── vite.config.ts           # Vite plugin configurations
└── package.json             # Scripts & dependencies
```

---

## 🚀 Getting Started

Ensure you have [Bun](https://bun.sh/) installed locally.

### 1. Install Dependencies
```bash
bun install
```

### 2. Run Development Server
```bash
bun run dev
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser to view the application.

### 3. Production Build
Builds the client-side SPA bundle and server-side SSR environment:
```bash
bun run build
```

---

## 📱 Progressive Web App (PWA)

TheFortFX is fully installable as an app on iOS, Android, and Desktop.
- **Manifest:** Configured in `public/site.webmanifest` to run in a borderless `standalone` frame.
- **Offline Caching:** Configured in `public/sw.js` to cache page structures, styles, scripts, and fonts for immediate launch.

---

## 🔍 Programmatic SEO & Schema Specs

The website incorporates strict SEO standards ready for indexing thousands of programmatic pages:
- **Title & Metas:** Built templates (`src/lib/seo/meta-templates.ts`) that populate page titles and Open Graph cards dynamically.
- **Breadcrumbs:** Breadcrumbs with automatic URL segment parsing are rendered on all inner routes.
- **Structured JSON-LD Data:** 
  - `SignalSchema` on signal pages
  - `BrokerSchema` on broker pages
  - `FaqSchema` on broker, calculator, and educational articles
  - `BreadcrumbSchema` on all dynamic routes
