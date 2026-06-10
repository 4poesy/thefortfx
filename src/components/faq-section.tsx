import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { FaqSchema } from "@/components/seo/JsonLd";

export interface Faq {
  q: string;
  a: string;
}

export function FaqSection({ faqs, title = "Frequently Asked Questions" }: { faqs: Faq[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <Card className="border-border bg-surface p-6">
      <FaqSchema faqs={faqs} />
      <h2 className="text-lg font-semibold">{title}</h2>
      <Accordion type="single" collapsible className="mt-2">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
