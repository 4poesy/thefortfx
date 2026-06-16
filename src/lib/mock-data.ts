// Compatibility layer + derived views over the canonical mock data modules in ./mock-data/*.
// New pages should import directly from "@/lib/mock-data/pairs", "@/lib/mock-data/brokers", etc.
import { pairs, type Pair } from "./mock-data/pairs";
import { brokers as fullBrokers } from "./mock-data/brokers";
import { economicEvents as fullEvents } from "./mock-data/economic-events";
import { articles as fullArticles } from "./mock-data/articles";

export type Direction = "BUY" | "SELL" | "NEUTRAL";
export type RiskLevel = "Low" | "Medium" | "High";

export interface Signal {
  slug: string;
  symbol: string; // compatibility
  pair: string;
  direction: Direction;
  confidence: number;
  entry: number;
  stop: number;
  stopLoss: number; // compatibility
  target: number;
  takeProfit: number; // compatibility
  riskPips: number;
  rewardPips: number;
  rMultiple: number;
  rr: number; // compatibility
  setup: string;
  status: "active" | "expired" | "cancelled";
  opportunityScore: number;
  riskLevel: RiskLevel;
  risk: RiskLevel; // compatibility
  lastUpdated: string;
  updated: string; // compatibility
  expiresAt: string;
  sources: number;
  sentiment: { bullish: number; bearish: number };
  price: number;
  change: number;
  changePct: number;
}

export const signals: Signal[] = pairs.map((p, i) => {
  const dec = p.decimals ?? 4;
  const riskPips = Math.round(Math.abs(p.entry - p.stopLoss) * Math.pow(10, dec));
  const rewardPips = Math.round(Math.abs(p.takeProfit - p.entry) * Math.pow(10, dec));
  const rMultiple = riskPips > 0 ? parseFloat((rewardPips / riskPips).toFixed(1)) : 2.0;

  // Custom mock setup reasonings
  let setup = "";
  if (p.slug === "eurusd") {
    setup = "MA confluence + RSI above 50";
  } else if (p.slug === "gbpusd") {
    setup = "H4 Bearish Engulfing + Overbought RSI rejection";
  } else if (p.slug === "usdjpy") {
    setup = "Daily trendline bounce + MACD crossover";
  } else if (p.slug === "xauusd") {
    setup = "Gold breakout above $2,340 support-resistance flip";
  } else {
    setup = p.signal === "BUY"
      ? "Moving average crossover trend-continuation"
      : p.signal === "SELL"
        ? "Double top rejection + bearish RSI divergence"
        : "Range-bound consolidation near key pivot point";
  }

  // Custom mock statuses and expiresAt
  const status: "active" | "expired" | "cancelled" = i === 3 ? "expired" : i === 7 ? "cancelled" : "active";

  let expiresAt = "";
  if (status === "active") {
    expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(); // 6 hours from now
  } else if (status === "expired") {
    expiresAt = new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(); // 2 hours ago
  } else {
    expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(); // 12 hours from now
  }

  return {
    slug: p.slug,
    symbol: p.slug,
    pair: p.name,
    direction: p.signal,
    confidence: p.confidence,
    entry: p.entry,
    stop: p.stopLoss,
    stopLoss: p.stopLoss,
    target: p.takeProfit,
    takeProfit: p.takeProfit,
    riskPips,
    rewardPips,
    rMultiple,
    rr: rMultiple,
    setup,
    status,
    opportunityScore: p.opportunityScore,
    riskLevel: p.riskLevel,
    risk: p.riskLevel,
    lastUpdated: p.lastUpdated,
    updated: p.lastUpdated,
    expiresAt,
    sources: 8 + (i % 6),
    sentiment: { bullish: p.bullishPct, bearish: p.bearishPct },
    price: p.currentPrice,
    change: p.change24h,
    changePct: p.changePct,
  };
});

export const getSignal = (symbol: string) => signals.find((s) => s.symbol === symbol.toLowerCase());

export interface MarketSentiment {
  category: string;
  bullish: number;
  neutral: number;
  bearish: number;
  trend: "up" | "down" | "flat";
}

export const marketSentiment: MarketSentiment[] = [
  { category: "Forex", bullish: 62, neutral: 18, bearish: 20, trend: "up" },
  { category: "Commodities", bullish: 74, neutral: 12, bearish: 14, trend: "up" },
  { category: "Indices", bullish: 51, neutral: 22, bearish: 27, trend: "flat" },
  { category: "Crypto", bullish: 68, neutral: 14, bearish: 18, trend: "up" },
];

export interface EconomicEvent {
  time: string;
  currency: string;
  event: string;
  impact: "Low" | "Medium" | "High";
  forecast: string;
  previous: string;
  actual?: string;
  slug?: string;
  date?: string;
}

export const economicEvents: EconomicEvent[] = fullEvents.map((e) => ({
  time: e.time.replace(" UTC", ""),
  currency: e.currency,
  event: e.title,
  impact: e.impact,
  forecast: e.forecast,
  previous: e.previous,
  actual: e.actual ?? undefined,
  slug: e.slug,
  date: e.date,
}));

export interface Broker {
  slug: string;
  name: string;
  rating: number;
  spread: string;
  platforms: string[];
  regulation: string[];
  minDeposit: string;
  leverage: string;
  pros: string[];
  cons: string[];
  summary: string;
}

export const brokers: Broker[] = fullBrokers.map((b) => ({
  slug: b.slug,
  name: b.name,
  rating: b.rating,
  spread: `${b.spread.eurusd.toFixed(1)} pips`,
  platforms: b.platforms,
  regulation: b.regulation,
  minDeposit: b.minDeposit === 0 ? "$0" : `$${b.minDeposit}`,
  leverage: b.maxLeverage,
  pros: b.pros,
  cons: b.cons,
  summary: b.description.split(". ")[0] + ".",
}));

export const getBroker = (slug: string) => brokers.find((b) => b.slug === slug.toLowerCase());

export interface OpportunityItem {
  rank: number;
  pair: string;
  symbol: string;
  score: number;
  trend: "Strong" | "Moderate" | "Weak";
  newsRisk: "Low" | "Medium" | "High";
  sentiment: "Bullish" | "Bearish" | "Neutral";
  direction: Direction;
  confidence: number;
}

export const opportunities: OpportunityItem[] = pairs
  .map((p) => ({
    rank: 0,
    pair: p.name,
    symbol: p.slug,
    score: p.opportunityScore,
    trend: (p.trend.startsWith("Strong") ? "Strong" : p.trend === "Neutral" ? "Weak" : "Moderate") as "Strong" | "Moderate" | "Weak",
    newsRisk: p.newsRisk,
    sentiment: (p.signal === "BUY" ? "Bullish" : p.signal === "SELL" ? "Bearish" : "Neutral") as "Bullish" | "Bearish" | "Neutral",
    direction: p.signal,
    confidence: p.confidence,
  }))
  .sort((a, b) => b.score - a.score)
  .map((o, i) => ({ ...o, rank: i + 1 }));

export interface LearnArticle {
  slug: string;
  title: string;
  category: "Forex Basics" | "Technical Analysis" | "Fundamental Analysis" | "Risk Management" | "Trading Psychology" | "Strategies";
  excerpt: string;
  readTime: string;
  updated: string;
  body: string;
}

export const articles: LearnArticle[] = fullArticles.map((a) => ({
  slug: a.slug,
  title: a.title,
  category: a.category,
  excerpt: a.excerpt,
  readTime: a.readTime,
  updated: a.publishedAt,
  body: (a.body ?? "").split("\n")[0],
}));

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug.toLowerCase());

export const forecastData = (symbol: string) => {
  const p = pairs.find((x) => x.slug === symbol.toLowerCase());
  const s = getSignal(symbol);
  if (!p || !s) return null;
  return {
    ...s,
    bullishScore: p.bullishPct,
    bearishScore: p.bearishPct,
    support: p.supportLevels,
    resistance: p.resistanceLevels,
    technicals: [
      { name: "RSI (14)", value: p.signal === "BUY" ? 62 : p.signal === "SELL" ? 38 : 50, signal: p.signal === "BUY" ? "Bullish" : p.signal === "SELL" ? "Bearish" : "Neutral" },
      { name: "MACD", value: p.signal === "BUY" ? 0.0012 : -0.0009, signal: p.signal === "BUY" ? "Bullish" : "Bearish" },
      { name: "MA (50)", value: +(p.currentPrice * 0.998).toFixed(4), signal: p.signal === "SELL" ? "Below" : "Above" },
      { name: "Stochastic", value: p.signal === "BUY" ? 72 : 28, signal: p.signal === "BUY" ? "Bullish" : "Bearish" },
    ],
    fundamentals: [
      "Recent central bank commentary aligns with current trend",
      "Risk sentiment in major equities supports the bias",
      "Yield differentials favor the directional outlook",
      `${p.trend} momentum confirmed across higher timeframes`,
    ],
    summary: `Our composite model rates ${p.name} as a ${p.signal === "BUY" ? "high-probability long" : p.signal === "SELL" ? "high-probability short" : "neutral"} setup with ${p.confidence}% confidence. ${p.description}`,
  };
};

export type { Pair };
export { pairs };
