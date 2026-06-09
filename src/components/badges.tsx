import { Badge } from "@/components/ui/badge";
import type { Direction, RiskLevel } from "@/lib/mock-data";

export function DirectionBadge({ d }: { d: Direction }) {
  const cls = d === "BUY" ? "bg-bullish/15 text-bullish" : d === "SELL" ? "bg-bearish/15 text-bearish" : "bg-neutral/15 text-neutral";
  return <Badge className={cls}>{d}</Badge>;
}

export function RiskBadge({ r }: { r: RiskLevel }) {
  const cls = r === "Low" ? "border-bullish/30 text-bullish" : r === "Medium" ? "border-warning/30 text-warning" : "border-bearish/30 text-bearish";
  return <Badge variant="outline" className={cls}>{r}</Badge>;
}

export function ImpactBadge({ level }: { level: "Low" | "Medium" | "High" }) {
  const cls = level === "High" ? "bg-bearish/15 text-bearish" : level === "Medium" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground";
  return <Badge className={cls}>{level}</Badge>;
}
