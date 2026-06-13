import { Link } from "@tanstack/react-router";
import { Sparkles, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>TheFortFX</span>
              <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              AI-powered forex intelligence for serious traders. Forecasts, signals, sentiment, and professional risk tools — in one platform.
            </p>
            <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" placeholder="your@email.com" className="bg-background" />
              <Button type="submit">Subscribe</Button>
            </form>
            <div className="mt-6 flex items-center gap-3 text-muted-foreground">
              <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="h-5 w-5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-foreground"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          <Column title="Resources" links={[
            ["/signals", "Signals"],
            ["/forecasts", "Forecasts"],
            ["/opportunities", "Opportunities"],
            ["/economic-calendar", "Economic Calendar"],
            ["/calculators", "Calculators"],
            ["/learn", "Learning Center"],
          ]} />
          <Column title="Company" links={[
            ["/about", "About"],
            ["/brokers", "Brokers"],
            ["/pricing", "Pricing"],
            ["/ai-assistant", "AI Assistant"],
          ]} />
          <Column title="Legal" links={[
            ["/legal/terms", "Terms"],
            ["/legal/privacy", "Privacy"],
            ["/legal/risk", "Risk Disclosure"],
            ["/contact", "Contact"],
          ]} />
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TheFortFX. All rights reserved. TheFortFX is not a broker and does not execute trades. Trading carries risk of loss.</p>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link to={href} className="text-sm text-muted-foreground hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

