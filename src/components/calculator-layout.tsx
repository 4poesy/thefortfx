import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export function CalculatorLayout({ title, description, inputs, output, formula }: { title: string; description: string; inputs: ReactNode; output: ReactNode; formula?: string }) {
  return (
    <Shell>
      <PageHeader eyebrow="Calculator" title={title} description={description}>
        <Link to="/calculators" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-3 w-3" /> All calculators</Link>
      </PageHeader>
      <section className="py-10">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Card className="border-border bg-surface p-6">
            <h2 className="text-base font-semibold">Inputs</h2>
            <div className="mt-4 space-y-4">{inputs}</div>
          </Card>
          <Card className="border-border bg-gradient-to-br from-surface to-surface-elevated p-6">
            <h2 className="text-base font-semibold">Result</h2>
            <div className="mt-4">{output}</div>
            {formula && <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground"><span className="font-medium text-foreground">Formula:</span> {formula}</p>}
          </Card>
        </div>
      </section>
    </Shell>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function BigResult({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-4xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
