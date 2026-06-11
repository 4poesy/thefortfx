import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildOgSvg, ogResponse, directionColor } from "@/lib/og-image";

export const Route = createFileRoute("/api/og/signal")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const pair = (searchParams.get("pair") ?? "EURUSD").slice(0, 12);
        const direction = (searchParams.get("direction") ?? "BUY").slice(0, 8).toUpperCase();
        const confidence = (searchParams.get("confidence") ?? "85").slice(0, 3);
        const color = directionColor(direction);
        return ogResponse(buildOgSvg({
          eyebrow: "TheFortFX · Live Signal",
          title: pair,
          subtitle: direction,
          subtitleColor: color,
          stats: [
            { label: "Confidence", value: `${confidence}%` },
            { label: "Signal", value: direction, color },
            { label: "Updated", value: "Live" },
          ],
        }));
      },
    },
  },
});
