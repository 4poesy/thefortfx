import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, Field, BigResult } from "@/components/calculator-layout";
import { pairs } from "@/lib/mock-data/pairs";
import { seoMeta, toHead } from "@/lib/seo/meta-templates";

export const Route = createFileRoute("/calculators/pip-calculator")({
  validateSearch: (s: Record<string, unknown>) => ({
    pair: typeof s.pair === "string" ? s.pair : undefined,
  }),
  head: () => toHead(seoMeta.calculator("Pip Calculator", "pip-calculator")),
  component: PipCalc,
});

function PipCalc() {
  const { pair: searchPair } = Route.useSearch();
  const initial = searchPair && pairs.some((p) => p.slug === searchPair.toLowerCase()) ? searchPair.toLowerCase() : "eurusd";
  const [pair, setPair] = useState(initial);
  const [lots, setLots] = useState("1");
  const [pips, setPips] = useState("10");
  const selected = pairs.find((p) => p.slug === pair) ?? pairs[0];
  const lotSize = pair.endsWith("jpy") ? 1000 / 156 * 100 : 10;
  const pipValue = (+lots || 0) * +lotSize.toFixed(2);
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
              {pairs.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Lot Size (standard)"><Input type="number" step="0.01" value={lots} onChange={(e) => setLots(e.target.value)} /></Field>
        <Field label="Pip Movement"><Input type="number" value={pips} onChange={(e) => setPips(e.target.value)} /></Field>
      </>}
      output={<div className="space-y-4">
        <BigResult label="Pip Value" value={`$${pipValue.toFixed(2)}`} sub="per pip" />
        <BigResult label="Total Move" value={`$${total.toFixed(2)}`} sub={`${pips} pips × ${lots} lots`} />
        <div className="space-y-1 text-sm">
          <Link to="/pairs/$pair" params={{ pair: selected.slug }} className="block text-primary hover:underline">View {selected.name} pair hub →</Link>
          <Link to="/calculators/position-size" search={{ pair: selected.slug }} className="block text-primary hover:underline">Size a {selected.name} position →</Link>
        </div>
      </div>}
    />
  );
}
