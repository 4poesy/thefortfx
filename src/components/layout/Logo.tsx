import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Base line */}
      <path d="M3 21h18" />
      {/* Fortress crenellations resembling ascending candlestick bars */}
      <path d="M5 21V11h3v3h4V8h3v5h4V5h2v16" />
      {/* Breakout diagonal trend line */}
      <path d="M9 16l3-3 3 3 6-6" />
      {/* Trend line arrowhead */}
      <path d="M17 7h4v4" />
    </svg>
  );
}
