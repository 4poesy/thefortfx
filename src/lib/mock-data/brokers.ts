// 12 reviewed brokers — canonical data source for /brokers, /brokers/[slug], /compare/[a]-vs-[b].
export interface BrokerSpread {
  eurusd: number;
  gbpusd: number;
  xauusd: number;
}

export interface Broker {
  slug: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  regulation: string[];
  minDeposit: number;
  maxLeverage: string;
  spread: BrokerSpread;
  platforms: string[];
  founded: number;
  headquarters: string;
  pros: string[];
  cons: string[];
  overallScore: number;
  trustScore: number;
  feesScore: number;
  platformScore: number;
  affiliateUrl: string;
  description: string;
  isTopRated: boolean;
}

type Row = [
  slug: string, name: string, rating: number, reviews: number, reg: string[],
  minDep: number, lev: string, spreads: [number, number, number], platforms: string[],
  founded: number, hq: string, overall: number, trust: number, fees: number, plat: number,
  pros: string[], cons: string[], desc: string,
];

const rows: Row[] = [
  ["exness", "Exness", 4.7, 2847, ["FCA", "CySEC", "FSA"], 10, "1:2000", [0.3, 0.5, 2.5], ["MT4", "MT5", "Exness Terminal"], 2008, "Limassol, Cyprus", 94, 96, 88, 92,
    ["Instant automated withdrawals", "Ultra-tight spreads from 0.0 pips on Raw accounts", "Very low $10 minimum deposit"],
    ["Not available to US or UK retail clients", "Limited educational resources", "No proprietary desktop platform"],
    "Exness is one of the largest retail forex brokers in the world by trading volume, processing over $4 trillion monthly. It is best known for instant withdrawals, extremely tight spreads, and flexible leverage up to 1:2000. Regulation across FCA, CySEC, and FSA entities provides solid client fund protection."],
  ["pepperstone", "Pepperstone", 4.8, 3192, ["FCA", "ASIC", "CySEC", "DFSA"], 200, "1:500", [0.1, 0.4, 1.9], ["MT4", "MT5", "cTrader", "TradingView"], 2010, "Melbourne, Australia", 95, 97, 90, 96,
    ["Native TradingView and cTrader integration", "Razor account with institutional-grade execution", "Award-winning 24/7 customer support"],
    ["Higher $200 recommended minimum deposit", "Limited product range outside CFDs", "No US clients"],
    "Pepperstone is an Australian-founded broker trusted by over 400,000 traders worldwide. Its Razor account routes orders to deep institutional liquidity with average EUR/USD spreads of 0.1 pips plus commission. Full TradingView integration and top-tier regulation make it a favorite among serious technical traders."],
  ["ic-markets", "IC Markets", 4.6, 2654, ["ASIC", "CySEC", "FSA"], 200, "1:500", [0.0, 0.3, 1.8], ["MT4", "MT5", "cTrader"], 2007, "Sydney, Australia", 93, 94, 92, 90,
    ["True ECN execution with 0.0 pip raw spreads", "Deep liquidity ideal for scalpers and EAs", "Low round-turn commissions"],
    ["No proprietary platform", "Research content is thinner than rivals", "Inactivity fee after 6 months"],
    "IC Markets is the go-to ECN broker for high-frequency and algorithmic traders. Raw spreads start at literally 0.0 pips on EUR/USD with deep tier-1 bank liquidity and average execution under 40 milliseconds. Scalping, hedging, and expert advisors are all fully permitted."],
  ["xm", "XM", 4.4, 4011, ["CySEC", "ASIC", "IFSC"], 5, "1:1000", [0.8, 1.2, 3.0], ["MT4", "MT5", "XM App"], 2009, "Limassol, Cyprus", 87, 89, 82, 85,
    ["$5 minimum deposit — lowest entry barrier", "Extensive multilingual education and webinars", "No-requote execution policy"],
    ["Wider spreads on the Standard account", "High leverage only via offshore entity", "Inactivity fees apply"],
    "XM serves more than 10 million clients across 190 countries and is built around accessibility. With a $5 minimum deposit, daily webinars in 20+ languages, and a strict no-requotes policy, it is one of the most beginner-friendly regulated brokers available."],
  ["ig", "IG", 4.6, 3870, ["FCA", "ASIC", "BaFin", "CFTC"], 250, "1:30", [0.6, 0.9, 3.0], ["IG Platform", "MT4", "ProRealTime", "L2 Dealer"], 1974, "London, United Kingdom", 92, 98, 80, 91,
    ["17,000+ markets — the widest range in the industry", "Publicly listed on the LSE with 50 years of history", "Institutional-grade charting via ProRealTime"],
    ["Low leverage under FCA/ESMA rules", "No MT5 support", "Spreads wider than ECN rivals"],
    "IG is the world's oldest CFD provider, founded in 1974 and listed on the London Stock Exchange. It offers an unmatched 17,000+ instruments, premium charting, and the deepest regulatory pedigree in the industry, including rare US availability for forex through its CFTC-regulated entity."],
  ["oanda", "OANDA", 4.5, 2390, ["FCA", "CFTC", "NFA", "ASIC"], 0, "1:50", [0.6, 1.0, 3.5], ["OANDA Trade", "MT4", "TradingView"], 1996, "New York, United States", 90, 96, 78, 86,
    ["Fully US-regulated — open to American traders", "No minimum deposit at all", "Exceptional market research and APIs"],
    ["Lower maximum leverage", "Wider spreads on the standard pricing model", "Limited instrument range vs. CFD giants"],
    "OANDA is a pioneer of online forex trading, operating since 1996 with full CFTC and NFA regulation in the United States. There is no minimum deposit, and its research suite, historical currency data, and developer APIs are widely considered best in class."],
  ["fxpro", "FxPro", 4.3, 1985, ["FCA", "CySEC", "FSCA"], 100, "1:500", [0.3, 0.6, 2.8], ["MT4", "MT5", "cTrader", "FxPro Edge"], 2006, "London, United Kingdom", 86, 90, 81, 88,
    ["Four platforms including proprietary FxPro Edge", "No-dealing-desk execution model", "20-year track record with 130+ awards"],
    ["Inactivity fee after 6 months", "cTrader commissions above average", "No US clients"],
    "FxPro is a London-headquartered multi-asset broker executing over 7,000 orders per second with no dealing desk intervention. Traders can choose between four platforms, and the firm's two decades of operation and FCA oversight provide strong credibility."],
  ["tickmill", "Tickmill", 4.5, 1647, ["FCA", "CySEC", "FSA"], 100, "1:500", [0.1, 0.3, 2.0], ["MT4", "MT5", "Tickmill Trader"], 2014, "London, United Kingdom", 89, 91, 93, 84,
    ["Among the lowest commissions in the industry ($2/side)", "Raw spreads from 0.0 pips", "Fast, free deposits and withdrawals"],
    ["Smaller instrument selection", "Basic proprietary platform", "Limited research tools"],
    "Tickmill is a low-cost specialist favored by cost-conscious scalpers and algorithmic traders. Its Pro account charges just $2 per side per lot with raw spreads from 0.0 pips — one of the cheapest total trading costs of any FCA-regulated broker."],
  ["fxtm", "FXTM", 4.2, 1820, ["FCA", "CySEC", "FSC"], 10, "1:2000", [0.5, 0.9, 2.9], ["MT4", "MT5", "FXTM Trader"], 2011, "Limassol, Cyprus", 84, 87, 80, 82,
    ["Low $10 entry with cent-account options", "Strong emerging-market presence and local funding", "Comprehensive trading education"],
    ["Withdrawal fees on some methods", "Spreads above average on standard accounts", "High leverage offshore only"],
    "FXTM (ForexTime) is a globally recognized broker with a particular strength in emerging markets, offering localized payment methods and support across Africa and Asia. Cent and micro accounts make it practical to start with as little as $10."],
  ["hotforex", "HFM", 4.2, 2105, ["FCA", "CySEC", "DFSA", "FSCA"], 0, "1:2000", [0.6, 1.0, 3.2], ["MT4", "MT5", "HFM App"], 2010, "Port Louis, Mauritius", 83, 85, 79, 81,
    ["Zero minimum deposit on most accounts", "Wide account-type selection including cent accounts", "Free VPS for qualifying traders"],
    ["Brand recently renamed (HotForex → HFM)", "Average spreads on standard pricing", "Platform range limited to MetaTrader"],
    "HFM, formerly HotForex, serves over 3.5 million live accounts with one of the widest account-type ranges in the industry — from cent accounts to zero-spread pro accounts. Multiple top-tier licenses and free VPS hosting round out a versatile offering."],
  ["admirals", "Admirals", 4.3, 1543, ["FCA", "ASIC", "CySEC", "EFSA"], 100, "1:500", [0.5, 0.8, 2.5], ["MT4", "MT5", "Admirals Platform"], 2001, "Tallinn, Estonia", 85, 88, 80, 87,
    ["Premium MetaTrader Supreme Edition add-ons", "Strong European regulatory coverage", "Fractional share and ETF investing alongside CFDs"],
    ["Monthly inactivity fee of €10", "Average spreads on Trade accounts", "Customer support slower at peak times"],
    "Admirals (formerly Admiral Markets) is a 20+ year European broker that bundles the acclaimed MetaTrader Supreme Edition toolkit — 60+ extra indicators and tools — free with every account. Its hybrid CFD-plus-investing model suits traders who also build long-term portfolios."],
  ["cmc-markets", "CMC Markets", 4.5, 2218, ["FCA", "ASIC", "BaFin", "MAS"], 0, "1:30", [0.5, 0.9, 3.0], ["CMC Next Generation", "MT4"], 1989, "London, United Kingdom", 91, 97, 79, 93,
    ["Award-winning Next Generation platform", "LSE-listed with 35 years of operation", "12,000+ instruments including rare FX crosses"],
    ["Low leverage under European rules", "No MT5 or cTrader", "Platform learning curve for beginners"],
    "CMC Markets is a London Stock Exchange-listed broker founded in 1989, repeatedly awarded for its proprietary Next Generation platform with over 80 technical indicators and pattern-recognition tools. It lists 330+ forex pairs — more than almost any competitor."],
];

export const brokers: Broker[] = rows.map((r) => {
  const [slug, name, rating, reviewCount, regulation, minDeposit, maxLeverage, s, platforms, founded, headquarters, overallScore, trustScore, feesScore, platformScore, pros, cons, description] = r;
  return {
    slug, name,
    logo: `/logos/${slug}.png`,
    rating, reviewCount, regulation, minDeposit, maxLeverage,
    spread: { eurusd: s[0], gbpusd: s[1], xauusd: s[2] },
    platforms, founded, headquarters, pros, cons,
    overallScore, trustScore, feesScore, platformScore,
    affiliateUrl: `https://example.com/${slug}`,
    description,
    isTopRated: overallScore >= 92,
  };
});

export const getBrokerBySlug = (slug: string) => brokers.find((b) => b.slug === slug.toLowerCase());

// Top 15 most-searched comparison pairs (alphabetical slugs).
export const comparisonPairs: [string, string][] = [
  ["exness", "pepperstone"],
  ["ic-markets", "pepperstone"],
  ["exness", "ic-markets"],
  ["exness", "xm"],
  ["ic-markets", "xm"],
  ["ig", "oanda"],
  ["cmc-markets", "ig"],
  ["fxpro", "pepperstone"],
  ["pepperstone", "tickmill"],
  ["ic-markets", "tickmill"],
  ["fxtm", "xm"],
  ["fxtm", "hotforex"],
  ["admirals", "xm"],
  ["exness", "hotforex"],
  ["cmc-markets", "oanda"],
];

export const compareSlug = (a: string, b: string) => [a, b].sort().join("-vs-");

export const parseCompareSlug = (slug: string): { a: Broker; b: Broker; canonical: string } | null => {
  const parts = slug.toLowerCase().split("-vs-");
  if (parts.length !== 2) return null;
  const a = getBrokerBySlug(parts[0]);
  const b = getBrokerBySlug(parts[1]);
  if (!a || !b || a.slug === b.slug) return null;
  const [first, second] = [a.slug, b.slug].sort();
  return {
    a: getBrokerBySlug(first)!,
    b: getBrokerBySlug(second)!,
    canonical: `${first}-vs-${second}`,
  };
};
