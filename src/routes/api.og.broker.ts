import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildOgSvg, ogResponse } from "@/lib/og-image";

export const Route = createFileRoute("/api/og/broker")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const name = (searchParams.get("name") ?? "Broker").slice(0, 24);
        const rating = (searchParams.get("rating") ?? "4.5").slice(0, 4);
        return ogResponse(buildOgSvg({
          eyebrow: `TheFortFX · Broker Review ${new Date().getFullYear()}`,
          title: name,
          subtitle: `★ ${rating} / 5`,
          subtitleColor: "#F59E0B",
          stats: [
            { label: "Rating", value: `${rating}/5`, color: "#F59E0B" },
            { label: "Review", value: "Independent" },
            { label: "Verdict", value: "Read more" },
          ],
        }));
      },
    },
  },
});
