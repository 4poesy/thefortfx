import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, Field, BigResult } from "@/components/calculator-layout";

export const Route = createFileRoute("/calculators/take-profit")({
  head: () => ({
    meta: [
      { title: "Take Profit Calculator — ForexPilot AI" },
      { name: "description", content: "Plan precise take-profit targets using R-multiples or fixed pips." },
    ],
    links: [{ rel: "canonical", href: "/calculators/take-profit" }],
  }),
  component: Comp,
});
function Comp() {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [entry, setEntry] = useState("1.0820");
  const [pips, setPips] = useState("60");
  const pipSize = 0.0001;
  const tp = side === "BUY" ? (+entry) + (+pips) * pipSize : (+entry) - (+pips) * pipSize;
  return (
    <CalculatorLayout
      title="Take Profit Calculator"
      description="Bank profits with the same precision you use to manage risk."
      formula="TP = Entry + pips × pipSize  (BUY)   |   TP = Entry − pips × pipSize  (SELL)"
      inputs={<>
        <Field label="Direction">
          <Select value={side} onValueChange={(v: string) => setSide(v as "BUY" | "SELL")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BUY">Buy</SelectItem>
              <SelectItem value="SELL">Sell</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Entry Price"><Input type="number" step="any" value={entry} onChange={(e) => setEntry(e.target.value)} /></Field>
        <Field label="Take Profit (pips)"><Input type="number" value={pips} onChange={(e) => setPips(e.target.value)} /></Field>
      </>}
      output={<BigResult label="Take Profit Price" value={tp.toFixed(5)} sub={`${pips} pips ${side === "BUY" ? "above" : "below"} entry`} />}
    />
  );
}
