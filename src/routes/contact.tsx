import { createFileRoute } from "@tanstack/react-router";
import { heroImages } from "@/lib/hero-images";
import { Mail, MessageSquare, MapPin, Clock } from "lucide-react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { FaqSection } from "@/components/faq-section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact TheFortFX — Support & Sales | TheFortFX" },
      { name: "description", content: "Get in touch with the TheFortFX team. Reach support, sales, partnerships and media — typical response within one business day." },
      { property: "og:title", content: "Contact TheFortFX" },
      { property: "og:description", content: "Reach support, sales, partnerships and media. Typical response within one business day." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const channels = [
  { icon: Mail, title: "Email support", body: "support@thefortfx.com", note: "24h response, Mon–Fri" },
  { icon: MessageSquare, title: "Live chat", body: "In-app, signed-in users", note: "07:00–22:00 UTC" },
  { icon: MapPin, title: "HQ", body: "London, United Kingdom", note: "By appointment only" },
  { icon: Clock, title: "Office hours", body: "Mon–Fri 09:00–18:00 UTC", note: "Closed weekends" },
];

function ContactPage() {
  return (
    <Shell>
      <PageHeader eyebrow="Contact" title="We're here when you need us" description="Reach the TheFortFX team for support, sales questions, partnerships or press." image={heroImages.ai}>
        <Breadcrumb items={[{ name: "Contact" }]} />
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <Card key={c.title} className="border-border bg-surface/60 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary"><c.icon className="h-4 w-4" /></div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{c.title}</h3>
              <p className="mt-1 text-sm text-foreground">{c.body}</p>
              <p className="text-xs text-muted-foreground">{c.note}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Send us a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">Fill the form and the right team will get back to you within one business day.</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Support:</strong> account, billing, technical issues.</li>
              <li><strong className="text-foreground">Sales:</strong> Pro and Institutional plans, team seats.</li>
              <li><strong className="text-foreground">Partnerships:</strong> brokers, education, affiliates.</li>
              <li><strong className="text-foreground">Press:</strong> interviews, data, commentary.</li>
            </ul>
          </div>

          <Card className="border-border bg-surface/60 p-6">
            <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Jane Trader" className="mt-1.5 bg-background" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@email.com" className="mt-1.5 bg-background" />
                </div>
              </div>
              <div>
                <Label htmlFor="topic">Topic</Label>
                <select id="topic" className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>Support</option><option>Sales</option><option>Partnerships</option><option>Press</option>
                </select>
              </div>
              <div>
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" rows={6} placeholder="How can we help?" className="mt-1.5 bg-background" />
              </div>
              <Button type="submit" className="w-full sm:w-auto">Send message</Button>
            </form>
          </Card>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FaqSection
          faqs={[
            { q: "How quickly will I get a response?", a: "Most emails are answered within one business day. Live chat is typically under five minutes during office hours." },
            { q: "Do you offer phone support?", a: "Phone support is available to Institutional plan clients. All other plans use email and chat." },
            { q: "I have a press inquiry. Who do I contact?", a: "Use the form with topic 'Press' or email press@thefortfx.com — our communications lead will follow up directly." },
            { q: "Are you hiring?", a: "Yes — we hire engineers, quants and product designers. Check the Careers section on our About page for open roles." },
          ]}
        />
      </div>

    </Shell>
  );
}
