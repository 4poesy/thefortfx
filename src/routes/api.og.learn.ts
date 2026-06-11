import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildOgSvg, ogResponse } from "@/lib/og-image";

const categoryColors: Record<string, string> = {
  "Forex Basics": "#3B82F6",
  "Technical Analysis": "#22C55E",
  "Risk Management": "#F59E0B",
  "Fundamental Analysis": "#8B5CF6",
  "Trading Psychology": "#EC4899",
  Strategies: "#14B8A6",
};

export const Route = createFileRoute("/api/og/learn")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const title = (searchParams.get("title") ?? "Forex Guide").slice(0, 80);
        const category = (searchParams.get("category") ?? "Forex Basics").slice(0, 32);
        const color = categoryColors[category] ?? "#22C55E";
        return ogResponse(
          buildOgSvg({
            eyebrow: `TheFortFX · Learning Center · ${category}`,
            title,
            subtitle: "Your Trading Command Center",
            subtitleColor: color,
            stats: [
              { label: "Category", value: category, color },
              { label: "Source", value: "TheFortFX", color: "#FFFFFF" },
              { label: "Format", value: "Guide + Diagram" },
            ],
          }),
        );
      },
    },
  },
});
