import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbSchema } from "./JsonLd";

export interface Crumb {
  name: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <BreadcrumbSchema items={all.map((c) => ({ name: c.name, url: c.href ?? "" }))} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {all.map((c, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" />}
            {c.href ? (
              <Link to={c.href} className="transition-colors duration-150 hover:text-foreground">
                {i === 0 ? <span className="flex items-center gap-1"><Home className="h-3 w-3" />{c.name}</span> : c.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">{c.name}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
