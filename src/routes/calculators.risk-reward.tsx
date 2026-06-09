import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CalculatorLayout, Field, BigResult } from "@/components/calculator-layout";

export const Route = createFileRoute("/calculators/risk-reward")({
  head: () => ({
    meta: [
      { title: "Risk/Reward Calculator — ForexPilot AI" },
      { name: "description", content: "Calculate the risk/reward ratio for any trade setup." },
    ],
    links: [{ rel: "canonical", href: "/calculators/risk-reward" }],
  }),
  component: Comp,
});
function Comp() {
  const [entry, setEntry] = useState("1.0820");
  const [sl, setSl] = useState("1.0790");
  const [tp, setTp] = useState("1.0900");
  const risk = Math.abs(+entry - +sl);
  const reward = Math.abs(+tp - +entry);
  const rr = risk > 0 ? reward / risk : 0;
  return (
    <CalculatorLayout
      title="Risk/Reward Calculator"
      description="A 1:2 minimum keeps you profitable at a 40% win rate. Run the numbers before you trade."
      formula="R:R = |TP − Entry| ÷ |Entry − SL|"
      inputs={<>
        <Field label="Entry Price"><Input type="number" step="any" value={entry} onChange={(e) => setEntry(e.target.value)} /></Field>
        <Field label="Stop Loss"><Input type="number" step="any" value={sl} onChange={(e) => setSl(e.target.value)} /></Field>
        <Field label="Take Profit"><Input type="number" step="any" value={tp} onChange={(e) => setTp(e.target.value)} /></Field>
      </>}
      output={<div className="space-y-4">
        <BigResult label="Risk : Reward" value={`1:${rr.toFixed(2)}`} sub={rr >= 2 ? "Excellent setup" : rr >= 1 ? "Acceptable" : "Skip this trade"} />
        <div className="grid grid-cols-2 gap-3">
          <BigResult label="Risk" value={risk.toFixed(4)} />
          <BigResult label="Reward" value={reward.toFixed(4)} />
        </div>
      </div>}
    />
  );
}
