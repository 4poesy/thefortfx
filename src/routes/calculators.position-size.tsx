import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, Field, BigResult } from "@/components/calculator-layout";
import { pairs } from "@/lib/mock-data/pairs";
import { seoMeta, toHead } from "@/lib/seo/meta-templates";

export const Route = createFileRoute("/calculators/position-size")({
  validateSearch: (s: Record<string, unknown>) => ({
    pair: typeof s.pair === "string" ? s.pair : undefined,
  }),
  head: () => toHead(seoMeta.calculator("Position Size Calculator", "position-size")),
  component: Comp,
});

function Comp() {
  const { pair: searchPair } = Route.useSearch();
  const initial = searchPair && pairs.some((p) => p.slug === searchPair.toLowerCase()) ? searchPair.toLowerCase() : "eurusd";
  const [pair, setPair] = useState(initial);
  const [bal, setBal] = useState("10000");
  const [risk, setRisk] = useState("1");
  const [sl, setSl] = useState("25");
  const selected = pairs.find((p) => p.slug === pair) ?? pairs[0];
  const riskAmt = (+bal || 0) * (+risk || 0) / 100;
  const lots = (+sl > 0) ? riskAmt / ((+sl) * 10) : 0;
  return (
    <CalculatorLayout
      title="Position Size Calculator"
      description="Trade the right size — every time. Position size is the #1 driver of long-term survival."
      formula="Lot size = (Account balance × risk %) ÷ (stop loss in pips × pip value)."
      inputs={<>
        <Field label="Currency Pair">
          <Select value={pair} onValueChange={setPair}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {pairs.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Account Balance (USD)"><Input type="number" value={bal} onChange={(e) => setBal(e.target.value)} /></Field>
        <Field label="Risk per trade (%)"><Input type="number" step="0.1" value={risk} onChange={(e) => setRisk(e.target.value)} /></Field>
        <Field label="Stop Loss (pips)"><Input type="number" value={sl} onChange={(e) => setSl(e.target.value)} /></Field>
      </>}
      output={<div className="space-y-4">
        <BigResult label="Recommended Lot Size" value={lots.toFixed(2)} sub={`standard lots on ${selected.name}`} />
        <BigResult label="Risk Amount" value={`$${riskAmt.toFixed(2)}`} sub={`${risk}% of account`} />
        <div className="space-y-1 text-sm">
          <Link to="/pairs/$pair" params={{ pair: selected.slug }} className="block text-primary hover:underline">View {selected.name} pair hub →</Link>
          <Link to="/calculators/risk-reward" className="block text-primary hover:underline">Check your Risk:Reward ratio →</Link>
        </div>
      </div>}
    />
  );
}
