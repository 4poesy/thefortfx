import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CalculatorLayout, Field, BigResult } from "@/components/calculator-layout";

export const Route = createFileRoute("/calculators/position-size")({
  head: () => ({
    meta: [
      { title: "Position Size Calculator — ForexPilot AI" },
      { name: "description", content: "Calculate the optimal lot size based on account balance, risk percent, and stop loss." },
    ],
    links: [{ rel: "canonical", href: "/calculators/position-size" }],
  }),
  component: Comp,
});
function Comp() {
  const [bal, setBal] = useState("10000");
  const [risk, setRisk] = useState("1");
  const [sl, setSl] = useState("25");
  const riskAmt = (+bal || 0) * (+risk || 0) / 100;
  const lots = (+sl > 0) ? riskAmt / ((+sl) * 10) : 0;
  return (
    <CalculatorLayout
      title="Position Size Calculator"
      description="Trade the right size — every time. Position size is the #1 driver of long-term survival."
      formula="Lot size = (Account balance × risk %) ÷ (stop loss in pips × pip value)."
      inputs={<>
        <Field label="Account Balance (USD)"><Input type="number" value={bal} onChange={(e) => setBal(e.target.value)} /></Field>
        <Field label="Risk per trade (%)"><Input type="number" step="0.1" value={risk} onChange={(e) => setRisk(e.target.value)} /></Field>
        <Field label="Stop Loss (pips)"><Input type="number" value={sl} onChange={(e) => setSl(e.target.value)} /></Field>
      </>}
      output={<div className="space-y-4">
        <BigResult label="Recommended Lot Size" value={lots.toFixed(2)} sub="standard lots" />
        <BigResult label="Risk Amount" value={`$${riskAmt.toFixed(2)}`} sub={`${risk}% of account`} />
      </div>}
    />
  );
}
