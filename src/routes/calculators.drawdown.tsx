import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { CalculatorLayout, Field, BigResult } from "@/components/calculator-layout";

export const Route = createFileRoute("/calculators/drawdown")({
  head: () => ({
    meta: [
      { title: "Drawdown Calculator — ForexPilot AI" },
      { name: "description", content: "Visualize portfolio drawdown across a streak of losing trades." },
    ],
    links: [{ rel: "canonical", href: "/calculators/drawdown" }],
  }),
  component: Comp,
});

function Comp() {
  const [bal, setBal] = useState("10000");
  const [risk, setRisk] = useState("2");
  const [losses, setLosses] = useState("10");

  const curve = useMemo(() => {
    const pts: { i: number; bal: number }[] = [];
    let b = +bal || 0;
    for (let i = 0; i <= (+losses || 0); i++) {
      pts.push({ i, bal: b });
      b = b * (1 - (+risk || 0) / 100);
    }
    return pts;
  }, [bal, risk, losses]);

  const finalBal = curve[curve.length - 1]?.bal ?? 0;
  const ddPct = (((+bal || 0) - finalBal) / (+bal || 1)) * 100;
  const max = Math.max(...curve.map((c) => c.bal));
  const min = Math.min(...curve.map((c) => c.bal));
  const range = max - min || 1;
  const width = 320, height = 120;
  const path = curve.map((c, idx) => {
    const x = (idx / (curve.length - 1 || 1)) * width;
    const y = height - ((c.bal - min) / range) * height;
    return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <CalculatorLayout
      title="Drawdown Calculator"
      description="Stress-test your strategy: what happens to your account after N consecutive losses?"
      formula="Balanceₙ = Balance₀ × (1 − risk%)ⁿ"
      inputs={<>
        <Field label="Starting Balance ($)"><Input type="number" value={bal} onChange={(e) => setBal(e.target.value)} /></Field>
        <Field label="Risk per trade (%)"><Input type="number" step="0.1" value={risk} onChange={(e) => setRisk(e.target.value)} /></Field>
        <Field label="Consecutive losses"><Input type="number" value={losses} onChange={(e) => setLosses(e.target.value)} /></Field>
      </>}
      output={<div className="space-y-4">
        <BigResult label="Final Balance" value={`$${finalBal.toFixed(2)}`} sub={`Drawdown: ${ddPct.toFixed(1)}%`} />
        <div className="rounded-xl border border-border bg-background p-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full">
            <defs>
              <linearGradient id="ddFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.22 25)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.65 0.22 25)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${path} L${width},${height} L0,${height} Z`} fill="url(#ddFill)" />
            <path d={path} fill="none" stroke="oklch(0.65 0.22 25)" strokeWidth="2" />
          </svg>
        </div>
      </div>}
    />
  );
}
