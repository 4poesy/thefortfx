import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { signals, brokers, articles } from "@/lib/mock-data";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/", "/signals", "/forecasts", "/opportunities", "/economic-calendar",
          "/calculators", "/calculators/pip-calculator", "/calculators/position-size",
          "/calculators/risk-reward", "/calculators/drawdown", "/calculators/stop-loss",
          "/calculators/take-profit", "/brokers", "/learn", "/ai-assistant", "/pricing",
        ];
        const dyn = [
          ...signals.map((s) => `/signals/${s.symbol}`),
          ...signals.map((s) => `/forecasts/${s.symbol}`),
          ...brokers.map((b) => `/brokers/${b.slug}`),
          ...articles.map((a) => `/learn/${a.slug}`),
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
