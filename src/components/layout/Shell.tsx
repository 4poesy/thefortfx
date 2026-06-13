import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-surface/40">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-12 lg:px-8 lg:py-16">
        <div>
          {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-base text-muted-foreground">{description}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
        {image && (
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
              <img
                src={image}
                alt={imageAlt ?? title}
                width={1280}
                height={832}
                loading="lazy"
                className="aspect-[16/10] h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
