import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildOgSvg, ogResponse } from "@/lib/og-image";

export const Route = createFileRoute("/api/og/forecast")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const pair = (searchParams.get("pair") ?? "EURUSD").slice(0, 12);
        const bullish = Math.min(100, Math.max(0, parseInt(searchParams.get("bullish") ?? "60", 10) || 60));
        const trend = (searchParams.get("trend") ?? "Neutral").slice(0, 16);
        const color = bullish >= 55 ? "#22C55E" : bullish <= 45 ? "#EF4444" : "#6B7280";
        return ogResponse(buildOgSvg({
          eyebrow: "ForexPilot AI · Daily Forecast",
          title: pair,
          subtitle: trend,
          subtitleColor: color,
          stats: [
            { label: "Bullish", value: `${bullish}%`, color: "#22C55E" },
            { label: "Bearish", value: `${100 - bullish}%`, color: "#EF4444" },
            { label: "Outlook", value: trend, color },
          ],
        }));
      },
    },
  },
});
