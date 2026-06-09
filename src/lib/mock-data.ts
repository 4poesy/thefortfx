// Centralized mock data for ForexPilot AI
export type Direction = "BUY" | "SELL" | "NEUTRAL";
export type RiskLevel = "Low" | "Medium" | "High";

export interface Signal {
  pair: string;
  symbol: string;
  direction: Direction;
  confidence: number;
  risk: RiskLevel;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  rr: number;
  sources: number;
  sentiment: { bullish: number; bearish: number };
  updated: string;
  price: number;
  change: number;
  changePct: number;
}

const base: Omit<Signal, "sources" | "sentiment" | "updated">[] = [
  { pair: "EUR/USD", symbol: "eurusd", direction: "BUY", confidence: 89, risk: "Low", entry: 1.0842, stopLoss: 1.0795, takeProfit: 1.0935, rr: 1.98, price: 1.0851, change: 0.0023, changePct: 0.21 },
  { pair: "GBP/USD", symbol: "gbpusd", direction: "SELL", confidence: 76, risk: "Medium", entry: 1.2734, stopLoss: 1.2790, takeProfit: 1.2620, rr: 2.04, price: 1.2718, change: -0.0041, changePct: -0.32 },
  { pair: "USD/JPY", symbol: "usdjpy", direction: "BUY", confidence: 82, risk: "Medium", entry: 156.32, stopLoss: 155.80, takeProfit: 157.40, rr: 2.08, price: 156.48, change: 0.42, changePct: 0.27 },
  { pair: "XAU/USD", symbol: "xauusd", direction: "BUY", confidence: 91, risk: "Low", entry: 2342.5, stopLoss: 2326.0, takeProfit: 2378.0, rr: 2.15, price: 2348.7, change: 12.3, changePct: 0.53 },
  { pair: "BTC/USD", symbol: "btcusd", direction: "BUY", confidence: 84, risk: "High", entry: 67250, stopLoss: 65800, takeProfit: 70400, rr: 2.17, price: 67580, change: 1240, changePct: 1.87 },
  { pair: "AUD/USD", symbol: "audusd", direction: "SELL", confidence: 71, risk: "Medium", entry: 0.6612, stopLoss: 0.6648, takeProfit: 0.6540, rr: 2.0, price: 0.6605, change: -0.0018, changePct: -0.27 },
  { pair: "USD/CAD", symbol: "usdcad", direction: "BUY", confidence: 68, risk: "Medium", entry: 1.3682, stopLoss: 1.3640, takeProfit: 1.3770, rr: 2.10, price: 1.3691, change: 0.0011, changePct: 0.08 },
  { pair: "NZD/USD", symbol: "nzdusd", direction: "NEUTRAL", confidence: 54, risk: "Medium", entry: 0.6118, stopLoss: 0.6080, takeProfit: 0.6190, rr: 1.89, price: 0.6121, change: 0.0004, changePct: 0.07 },
  { pair: "EUR/GBP", symbol: "eurgbp", direction: "BUY", confidence: 73, risk: "Low", entry: 0.8521, stopLoss: 0.8492, takeProfit: 0.8580, rr: 2.03, price: 0.8528, change: 0.0009, changePct: 0.11 },
  { pair: "USD/CHF", symbol: "usdchf", direction: "SELL", confidence: 79, risk: "Low", entry: 0.9042, stopLoss: 0.9078, takeProfit: 0.8970, rr: 2.0, price: 0.9036, change: -0.0014, changePct: -0.15 },
  { pair: "ETH/USD", symbol: "ethusd", direction: "BUY", confidence: 80, risk: "High", entry: 3520, stopLoss: 3420, takeProfit: 3720, rr: 2.0, price: 3548, change: 62, changePct: 1.78 },
  { pair: "WTI/USD", symbol: "wtiusd", direction: "SELL", confidence: 66, risk: "Medium", entry: 78.45, stopLoss: 79.20, takeProfit: 76.95, rr: 2.0, price: 78.21, change: -0.34, changePct: -0.43 },
];

export const signals: Signal[] = base.map((s, i) => ({
  ...s,
  sources: 8 + (i % 6),
  sentiment: { bullish: s.direction === "BUY" ? 60 + (s.confidence % 25) : 30 + (i * 3) % 20, bearish: 0 },
  updated: `${2 + (i % 8)} min ago`,
})).map((s) => ({ ...s, sentiment: { bullish: s.sentiment.bullish, bearish: 100 - s.sentiment.bullish } }));

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
}

export const economicEvents: EconomicEvent[] = [
  { time: "08:30", currency: "USD", event: "Non-Farm Payrolls", impact: "High", forecast: "185K", previous: "175K" },
  { time: "10:00", currency: "EUR", event: "ECB Interest Rate Decision", impact: "High", forecast: "4.25%", previous: "4.25%" },
  { time: "12:30", currency: "GBP", event: "GDP m/m", impact: "Medium", forecast: "0.2%", previous: "0.1%" },
  { time: "14:00", currency: "USD", event: "Crude Oil Inventories", impact: "Medium", forecast: "-1.2M", previous: "0.8M" },
  { time: "15:30", currency: "JPY", event: "BoJ Press Conference", impact: "High", forecast: "—", previous: "—" },
  { time: "18:00", currency: "USD", event: "FOMC Meeting Minutes", impact: "High", forecast: "—", previous: "—" },
  { time: "21:45", currency: "NZD", event: "CPI q/q", impact: "Medium", forecast: "0.6%", previous: "0.5%" },
  { time: "23:30", currency: "AUD", event: "Employment Change", impact: "Medium", forecast: "20.5K", previous: "32.6K" },
];

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

export const brokers: Broker[] = [
  {
    slug: "exness", name: "Exness", rating: 4.8, spread: "0.0 pips", platforms: ["MT4", "MT5", "WebTerminal"],
    regulation: ["FCA", "CySEC", "FSA"], minDeposit: "$10", leverage: "1:2000",
    pros: ["Instant withdrawals", "Tight spreads", "Strong regulation"],
    cons: ["No US clients", "Limited educational content"],
    summary: "Exness is a globally regulated broker known for ultra-tight spreads and instant withdrawal infrastructure.",
  },
  {
    slug: "pepperstone", name: "Pepperstone", rating: 4.7, spread: "0.1 pips", platforms: ["MT4", "MT5", "cTrader", "TradingView"],
    regulation: ["FCA", "ASIC", "CySEC"], minDeposit: "$200", leverage: "1:500",
    pros: ["TradingView integration", "Razor account", "Award-winning support"],
    cons: ["Higher minimum deposit", "Limited crypto pairs"],
    summary: "Pepperstone delivers institutional execution with native TradingView and cTrader support.",
  },
  {
    slug: "ic-markets", name: "IC Markets", rating: 4.6, spread: "0.0 pips", platforms: ["MT4", "MT5", "cTrader"],
    regulation: ["ASIC", "CySEC", "FSA"], minDeposit: "$200", leverage: "1:500",
    pros: ["True ECN execution", "Deep liquidity", "Low commissions"],
    cons: ["No proprietary platform", "Inactivity fees"],
    summary: "IC Markets is favored by scalpers and algo traders for true ECN execution.",
  },
  {
    slug: "oanda", name: "OANDA", rating: 4.5, spread: "0.6 pips", platforms: ["MT4", "OANDA Trade", "TradingView"],
    regulation: ["FCA", "CFTC", "NFA"], minDeposit: "$0", leverage: "1:50",
    pros: ["US-friendly", "No minimum deposit", "Best-in-class research"],
    cons: ["Lower leverage", "Wider spreads on standard account"],
    summary: "OANDA combines strong US regulation with world-class trading research.",
  },
  {
    slug: "ig", name: "IG Markets", rating: 4.6, spread: "0.6 pips", platforms: ["IG Web", "MT4", "ProRealTime"],
    regulation: ["FCA", "ASIC", "BaFin"], minDeposit: "$250", leverage: "1:30",
    pros: ["17,000+ markets", "Publicly listed", "Premium charting"],
    cons: ["No MT5", "Spread costs vary"],
    summary: "IG is one of the world's largest CFD brokers with a deep instrument catalog.",
  },
  {
    slug: "fxpro", name: "FxPro", rating: 4.4, spread: "0.3 pips", platforms: ["MT4", "MT5", "cTrader", "FxPro Edge"],
    regulation: ["FCA", "CySEC", "FSCA"], minDeposit: "$100", leverage: "1:500",
    pros: ["Multi-platform", "NDD execution", "20+ years track record"],
    cons: ["Inactivity fee", "Higher commissions on cTrader"],
    summary: "FxPro is a multi-asset broker with strong execution across four trading platforms.",
  },
];

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

export const opportunities: OpportunityItem[] = signals
  .map((s, i) => ({
    rank: 0,
    pair: s.pair,
    symbol: s.symbol,
    score: Math.min(99, s.confidence + 3 - (i % 5)),
    trend: (s.confidence > 80 ? "Strong" : s.confidence > 65 ? "Moderate" : "Weak") as "Strong" | "Moderate" | "Weak",
    newsRisk: (s.risk === "Low" ? "Low" : s.risk === "Medium" ? "Medium" : "High") as "Low" | "Medium" | "High",
    sentiment: (s.direction === "BUY" ? "Bullish" : s.direction === "SELL" ? "Bearish" : "Neutral") as "Bullish" | "Bearish" | "Neutral",
    direction: s.direction,
    confidence: s.confidence,
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

export const articles: LearnArticle[] = [
  { slug: "what-is-forex", title: "What Is Forex Trading? A Beginner's Guide", category: "Forex Basics", excerpt: "Understand how currency markets work, who participates, and how prices move.", readTime: "8 min", updated: "Jun 2, 2026", body: "Forex, short for foreign exchange, is the global marketplace for trading national currencies. With over $7 trillion in daily volume it is the largest, most liquid financial market in the world..." },
  { slug: "reading-candlestick-charts", title: "Reading Candlestick Charts Like a Pro", category: "Technical Analysis", excerpt: "Master Japanese candlesticks — the building block of every technical setup.", readTime: "10 min", updated: "May 28, 2026", body: "Candlestick charts compress price action into four data points: open, high, low, and close. Learning to read them gives you instant context on market psychology..." },
  { slug: "support-resistance", title: "Support & Resistance: The Most Important Concept", category: "Technical Analysis", excerpt: "How to identify zones where price reverses — and how to trade them.", readTime: "12 min", updated: "May 20, 2026", body: "Support and resistance levels are price zones where buying or selling pressure has historically been strong enough to halt or reverse a trend..." },
  { slug: "central-banks-explained", title: "How Central Banks Move the Forex Market", category: "Fundamental Analysis", excerpt: "Interest rates, QE, and forward guidance — the macro drivers of FX.", readTime: "9 min", updated: "May 14, 2026", body: "Central banks such as the Fed, ECB, BoE, and BoJ are the most influential players in the forex market. Their policy decisions reshape currency valuations..." },
  { slug: "position-sizing", title: "Position Sizing: The 1% Rule and Beyond", category: "Risk Management", excerpt: "The single most important skill that separates pros from gamblers.", readTime: "7 min", updated: "May 10, 2026", body: "No edge survives poor position sizing. The 1% rule says never risk more than 1% of your account on a single trade — here's how to implement it..." },
  { slug: "trading-psychology", title: "Mastering Trading Psychology", category: "Trading Psychology", excerpt: "Why most traders fail — and how to develop a professional mindset.", readTime: "11 min", updated: "May 5, 2026", body: "Trading is 80% psychology, 20% strategy. Even the best system fails if the operator cannot manage fear, greed, and overconfidence..." },
  { slug: "breakout-strategy", title: "The London Breakout Strategy", category: "Strategies", excerpt: "A simple, proven session-based strategy for the EUR/USD and GBP/USD.", readTime: "8 min", updated: "Apr 28, 2026", body: "The London session brings the highest forex volume of the day. The London breakout strategy capitalizes on directional moves at the open..." },
  { slug: "risk-reward", title: "Why Risk/Reward Ratios Matter More Than Win Rate", category: "Risk Management", excerpt: "A 40% win rate at 1:3 RR beats a 70% win rate at 1:1.", readTime: "6 min", updated: "Apr 22, 2026", body: "Most beginners obsess over win rate. Professionals obsess over expectancy — and risk/reward is the dominant variable..." },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug.toLowerCase());

export const forecastData = (symbol: string) => {
  const s = getSignal(symbol);
  if (!s) return null;
  return {
    ...s,
    bullishScore: s.direction === "BUY" ? s.confidence : 100 - s.confidence,
    bearishScore: s.direction === "SELL" ? s.confidence : 100 - s.confidence,
    support: [s.price * 0.995, s.price * 0.988, s.price * 0.978].map((n) => +n.toFixed(4)),
    resistance: [s.price * 1.005, s.price * 1.013, s.price * 1.022].map((n) => +n.toFixed(4)),
    technicals: [
      { name: "RSI (14)", value: s.direction === "BUY" ? 62 : 38, signal: s.direction === "BUY" ? "Bullish" : "Bearish" },
      { name: "MACD", value: s.direction === "BUY" ? 0.0012 : -0.0009, signal: s.direction === "BUY" ? "Bullish" : "Bearish" },
      { name: "MA (50)", value: s.price * 0.998, signal: s.direction === "BUY" ? "Above" : "Below" },
      { name: "Stochastic", value: s.direction === "BUY" ? 72 : 28, signal: s.direction === "BUY" ? "Bullish" : "Bearish" },
    ],
    fundamentals: [
      "Recent central bank commentary aligns with current trend",
      "Risk sentiment in major equities supports the bias",
      "Yield differentials favor the directional outlook",
    ],
    summary: `Our composite model rates ${s.pair} as a ${s.direction === "BUY" ? "high-probability long" : s.direction === "SELL" ? "high-probability short" : "neutral"} setup with ${s.confidence}% confidence based on ${s.sources} aggregated sources.`,
  };
};
