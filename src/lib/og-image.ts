// Shared SVG OG-image builder used by the /api/og/* server routes.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface OgStat {
  label: string;
  value: string;
  color?: string;
}

export function buildOgSvg({ eyebrow, title, subtitle, subtitleColor, stats }: {
  eyebrow: string;
  title: string;
  subtitle: string;
  subtitleColor: string;
  stats: OgStat[];
}): string {
  const statBoxes = stats
    .map((s, i) => {
      const x = 60 + i * 280;
      return `
    <g>
      <rect x="${x}" y="440" width="252" height="120" rx="12" fill="#111827" stroke="#1F2937"/>
      <text x="${x + 24}" y="482" font-family="Arial, sans-serif" font-size="18" fill="#6B7280">${esc(s.label)}</text>
      <text x="${x + 24}" y="528" font-family="Arial, sans-serif" font-size="34" font-weight="600" fill="${s.color ?? "#FFFFFF"}">${esc(s.value)}</text>
    </g>`;
    })
    .join("");

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0B0F19"/>
  <rect x="0" y="0" width="1200" height="6" fill="${subtitleColor}"/>
  <text x="60" y="140" font-family="Arial, sans-serif" font-size="26" fill="#6B7280">${esc(eyebrow)}</text>
  <text x="60" y="250" font-family="Arial, sans-serif" font-size="88" font-weight="700" fill="#FFFFFF">${esc(title)}</text>
  <text x="60" y="340" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="${subtitleColor}">${esc(subtitle)}</text>
  ${statBoxes}
  <text x="1140" y="600" text-anchor="end" font-family="Arial, sans-serif" font-size="20" fill="#374151">forexpilot.ai</text>
</svg>`;
}

export const ogResponse = (svg: string) =>
  new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });

export const directionColor = (d: string) => (d === "BUY" ? "#22C55E" : d === "SELL" ? "#EF4444" : "#6B7280");
