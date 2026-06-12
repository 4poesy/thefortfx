import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { pairs } from "@/lib/mock-data/pairs";
import { brokers, comparisonPairs, compareSlug } from "@/lib/mock-data/brokers";
import { economicEvents } from "@/lib/mock-data/economic-events";
import { articles } from "@/lib/mock-data/articles";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/", "/signals", "/forecasts", "/pairs", "/opportunities", "/economic-calendar",
          "/calculators", "/calculators/pip-calculator", "/calculators/position-size",
          "/calculators/risk-reward", "/calculators/drawdown", "/calculators/stop-loss",
          "/calculators/take-profit", "/brokers", "/learn", "/ai-assistant", "/pricing",
          "/about", "/contact", "/legal/terms", "/legal/privacy", "/legal/risk",
        ];
        const dyn = [
          ...pairs.map((p) => `/pairs/${p.slug}`),
          ...pairs.map((p) => `/signals/${p.slug}`),
          ...pairs.map((p) => `/forecasts/${p.slug}`),
          ...brokers.map((b) => `/brokers/${b.slug}`),
          ...comparisonPairs.map(([a, b]) => `/compare/${compareSlug(a, b)}`),
          ...articles.map((a) => `/learn/${a.slug}`),
          ...economicEvents.map((e) => `/economic-calendar/${e.slug}`),
        ];
        const urls = [...staticPaths, ...dyn].map((p) =>
          `  <url><loc>${BASE_URL}${p}</loc><changefreq>daily</changefreq></url>`
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
