import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, Field, BigResult } from "@/components/calculator-layout";

export const Route = createFileRoute("/calculators/pip-calculator")({
  head: () => ({
    meta: [
      { title: "Pip Calculator — Forex Pip Value | ForexPilot AI" },
      { name: "description", content: "Calculate the value of one pip for any forex pair and lot size." },
    ],
    links: [{ rel: "canonical", href: "/calculators/pip-calculator" }],
  }),
  component: PipCalc,
});

function PipCalc() {
  const [pair, setPair] = useState("EURUSD");
  const [lots, setLots] = useState("1");
  const [pips, setPips] = useState("10");
  const lotSize = pair === "USDJPY" ? 1000 : 10;
  const pipValue = (+lots || 0) * lotSize;
  const total = pipValue * (+pips || 0);
  return (
    <CalculatorLayout
      title="Pip Calculator"
      description="Compute the monetary value of one pip — and total move value — for any pair."
      formula="Pip value (USD) ≈ lot size × pip size × number of lots (≈ $10 per pip for 1 standard lot on USD-quote pairs)."
      inputs={<>
        <Field label="Currency Pair">
          <Select value={pair} onValueChange={setPair}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["EURUSD","GBPUSD","USDJPY","AUDUSD","USDCAD","USDCHF","XAUUSD"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Lot Size (standard)"><Input type="number" step="0.01" value={lots} onChange={(e) => setLots(e.target.value)} /></Field>
        <Field label="Pip Movement"><Input type="number" value={pips} onChange={(e) => setPips(e.target.value)} /></Field>
      </>}
      output={<div className="space-y-4">
        <BigResult label="Pip Value" value={`$${pipValue.toFixed(2)}`} sub="per pip" />
        <BigResult label="Total Move" value={`$${total.toFixed(2)}`} sub={`${pips} pips × ${lots} lots`} />
      </div>}
    />
  );
}
