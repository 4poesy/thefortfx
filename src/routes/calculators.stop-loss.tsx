import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, Field, BigResult } from "@/components/calculator-layout";

export const Route = createFileRoute("/calculators/stop-loss")({
  head: () => ({
    meta: [
      { title: "Stop Loss Calculator — ForexPilot AI" },
      { name: "description", content: "Compute the stop-loss price for any pair based on entry and risk in pips." },
    ],
    links: [{ rel: "canonical", href: "/calculators/stop-loss" }],
  }),
  component: Comp,
});
function Comp() {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [entry, setEntry] = useState("1.0820");
  const [pips, setPips] = useState("25");
  const pipSize = 0.0001;
  const sl = side === "BUY" ? (+entry) - (+pips) * pipSize : (+entry) + (+pips) * pipSize;
  return (
    <CalculatorLayout
      title="Stop Loss Calculator"
      description="Set a disciplined invalidation point — and never trade without one."
      formula="SL = Entry − pips × pipSize  (BUY)   |   SL = Entry + pips × pipSize  (SELL)"
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
        <Field label="Stop Loss (pips)"><Input type="number" value={pips} onChange={(e) => setPips(e.target.value)} /></Field>
      </>}
      output={<BigResult label="Stop Loss Price" value={sl.toFixed(5)} sub={`${pips} pips ${side === "BUY" ? "below" : "above"} entry`} />}
    />
  );
}
