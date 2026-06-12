import type { ReactNode } from "react";
import { Shell, PageHeader } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export function LegalLayout({
  eyebrow,
  title,
  description,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <Shell>
      <PageHeader eyebrow={eyebrow} title={title} description={description}>
        <Breadcrumb items={[{ name: "Legal", href: "/legal/terms" }, { name: eyebrow }]} />
      </PageHeader>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-6 text-xs uppercase tracking-wider text-muted-foreground">Last updated: {updated}</p>
        <Card className="border-border bg-surface/60 p-8">
          <div className="prose prose-invert max-w-none text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2:first-child]:mt-0 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
            {children}
          </div>
        </Card>
      </section>
    </Shell>
  );
}
