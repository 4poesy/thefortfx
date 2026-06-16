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
    <section className="relative overflow-hidden border-b border-border/60 bg-surface">
      {image && (
        <img
          src={image}
          alt={imageAlt ?? ""}
          aria-hidden="true"
          width={1280}
          height={832}
          className="absolute inset-0 h-full w-full object-cover opacity-100"
        />
      )}
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24 bg-background/50 backdrop-blur-[2px] rounded-2xl my-8">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">{title}</h1>
        {description && <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-foreground font-medium">{description}</p>}
        {children && <div className="mt-6 flex justify-center">{children}</div>}
      </div>
    </section>
  );
}
