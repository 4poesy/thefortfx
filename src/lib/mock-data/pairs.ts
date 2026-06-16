// 20 tracked instruments — canonical data source for signals, forecasts, pair hubs, opportunities.
export type PairCategory = "Forex" | "Commodities" | "Crypto" | "Indices";
export type SignalDirection = "BUY" | "SELL" | "NEUTRAL";
export type RiskLevel = "Low" | "Medium" | "High";
export type TrendLabel = "Strong Bullish" | "Bullish" | "Neutral" | "Bearish" | "Strong Bearish";

export interface Pair {
  slug: string;
  name: string;
  category: PairCategory;
  currentPrice: number;
  change24h: number;
  changePct: number;
  signal: SignalDirection;
  confidence: number;
  riskLevel: RiskLevel;
  bullishPct: number;
  bearishPct: number;
  opportunityScore: number;
  trend: TrendLabel;
  newsRisk: RiskLevel;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: string;
  lastUpdated: string;
  description: string;
  supportLevels: number[];
  resistanceLevels: number[];
  decimals: number;
}

type Row = [
  slug: string, name: string, category: PairCategory, price: number, changePct: number,
  signal: SignalDirection, confidence: number, risk: RiskLevel, bullishPct: number,
  oppScore: number, trend: TrendLabel, newsRisk: RiskLevel,
  entry: number, sl: number, tp: number, rr: string, dec: number, desc: string,
];

const rows: Row[] = [
  ["eurusd", "EUR/USD", "Forex", 1.0847, 0.21, "BUY", 89, "Low", 78, 92, "Bullish", "Medium", 1.082, 1.078, 1.092, "1:2.5", 4, "EUR/USD is the world's most traded currency pair, representing the euro against the US dollar. Its deep liquidity and tight spreads make it the benchmark instrument for both retail and institutional forex traders."],
  ["gbpusd", "GBP/USD", "Forex", 1.2718, -0.32, "SELL", 76, "Medium", 34, 84, "Bearish", "High", 1.2734, 1.279, 1.262, "1:2.0", 4, "GBP/USD, known as Cable, pairs the British pound with the US dollar. It is famous for sharp intraday moves around UK economic data and Bank of England policy decisions."],
  ["usdjpy", "USD/JPY", "Forex", 156.48, 0.27, "BUY", 82, "Medium", 71, 88, "Bullish", "High", 156.32, 155.8, 157.4, "1:2.1", 2, "USD/JPY tracks the US dollar against the Japanese yen and is the primary gauge of US–Japan yield differentials. Bank of Japan intervention risk keeps volatility elevated near multi-decade highs."],
  ["usdchf", "USD/CHF", "Forex", 0.9036, -0.15, "SELL", 79, "Low", 31, 81, "Bearish", "Low", 0.9042, 0.9078, 0.897, "1:2.0", 4, "USD/CHF pairs the US dollar with the Swiss franc, a classic safe-haven currency. SNB policy and global risk sentiment are the dominant drivers of this slow-but-steady major."],
  ["audusd", "AUD/USD", "Forex", 0.6605, -0.27, "SELL", 71, "Medium", 38, 77, "Bearish", "Medium", 0.6612, 0.6648, 0.654, "1:2.0", 4, "AUD/USD reflects the Australian dollar against the US dollar and is highly sensitive to commodity prices and Chinese economic data. It is a favorite proxy for global risk appetite."],
  ["nzdusd", "NZD/USD", "Forex", 0.6121, 0.07, "NEUTRAL", 54, "Medium", 51, 62, "Neutral", "Low", 0.6118, 0.608, 0.619, "1:1.9", 4, "NZD/USD, the Kiwi, pairs the New Zealand dollar with the US dollar. Dairy export prices and RBNZ rate policy give this pair a distinct personality among the commodity currencies."],
  ["usdcad", "USD/CAD", "Forex", 1.3691, 0.08, "BUY", 68, "Medium", 63, 73, "Bullish", "Medium", 1.3682, 1.364, 1.377, "1:2.1", 4, "USD/CAD tracks the US dollar against the Canadian dollar, with crude oil prices acting as a powerful inverse driver. BoC and Fed policy divergence sets the medium-term trend."],
  ["xauusd", "XAU/USD", "Commodities", 2348.7, 0.53, "BUY", 91, "Low", 82, 95, "Strong Bullish", "Medium", 2342.5, 2326.0, 2378.0, "1:2.2", 1, "XAU/USD is the spot gold price quoted in US dollars — the world's premier safe-haven asset. Central bank buying, real yields, and geopolitical risk drive its long-term trend."],
  ["xagusd", "XAG/USD", "Commodities", 29.84, 0.94, "BUY", 78, "Medium", 73, 83, "Bullish", "Medium", 29.6, 28.9, 31.2, "1:2.3", 2, "XAG/USD is spot silver against the US dollar, combining monetary safe-haven demand with industrial consumption from solar and electronics. It typically moves like gold with twice the volatility."],
  ["btcusd", "BTC/USD", "Crypto", 67580, 1.87, "BUY", 84, "High", 76, 90, "Strong Bullish", "Medium", 67250, 65800, 70400, "1:2.2", 0, "BTC/USD is the flagship cryptocurrency pair, quoting Bitcoin against the US dollar. Institutional ETF flows and halving-cycle dynamics dominate the current market structure."],
  ["ethusd", "ETH/USD", "Crypto", 3548, 1.78, "BUY", 80, "High", 72, 85, "Bullish", "Medium", 3520, 3420, 3720, "1:2.0", 0, "ETH/USD tracks Ether, the native asset of the Ethereum network, against the US dollar. Staking yields and on-chain activity make it the bellwether for the broader altcoin market."],
  ["gbpjpy", "GBP/JPY", "Forex", 199.02, 0.41, "BUY", 81, "High", 69, 86, "Bullish", "High", 198.6, 197.4, 201.3, "1:2.3", 2, "GBP/JPY, nicknamed the Dragon, is one of the most volatile major crosses. Wide daily ranges attract momentum traders, but the same volatility demands disciplined risk management."],
  ["eurjpy", "EUR/JPY", "Forex", 169.74, 0.33, "BUY", 74, "Medium", 66, 79, "Bullish", "Medium", 169.5, 168.4, 171.8, "1:2.1", 2, "EUR/JPY pairs the euro against the Japanese yen and serves as a clean expression of European risk sentiment versus Japanese monetary policy. Carry-trade flows are a persistent tailwind."],
  ["eurgbp", "EUR/GBP", "Forex", 0.8528, 0.11, "BUY", 73, "Low", 61, 71, "Bullish", "Low", 0.8521, 0.8492, 0.858, "1:2.0", 4, "EUR/GBP measures the euro against the British pound — the purest read on relative ECB and BoE policy. It is one of the calmest majors, favoring range and mean-reversion strategies."],
  ["gbpaud", "GBP/AUD", "Forex", 1.9254, -0.18, "SELL", 67, "Medium", 41, 69, "Bearish", "Medium", 1.928, 1.937, 1.908, "1:2.2", 4, "GBP/AUD crosses the British pound with the Australian dollar, blending UK rate expectations with commodity-cycle dynamics. Trends here run long once established."],
  ["audjpy", "AUD/JPY", "Forex", 103.36, 0.22, "BUY", 70, "Medium", 64, 74, "Bullish", "Medium", 103.1, 102.2, 105.0, "1:2.1", 2, "AUD/JPY is the market's classic risk barometer, pairing a high-beta commodity currency with the funding-currency yen. It rallies with equities and sells off hard in risk-off episodes."],
  ["usdmxn", "USD/MXN", "Forex", 18.42, -0.45, "SELL", 72, "High", 36, 75, "Bearish", "High", 18.48, 18.72, 17.95, "1:2.2", 3, "USD/MXN pairs the US dollar with the Mexican peso, the most liquid emerging-market currency. High Mexican rates make the peso a premier carry-trade target, with politics the main risk."],
  ["usdzar", "USD/ZAR", "Forex", 18.85, 0.62, "BUY", 64, "High", 59, 68, "Bullish", "High", 18.78, 18.45, 19.5, "1:2.2", 3, "USD/ZAR quotes the US dollar against the South African rand, a high-yield currency driven by precious metals exports and domestic energy supply. Expect outsized intraday ranges."],
  ["usdnok", "USD/NOK", "Forex", 10.62, 0.18, "BUY", 61, "Medium", 56, 64, "Neutral", "Low", 10.59, 10.46, 10.88, "1:2.2", 3, "USD/NOK pairs the US dollar with the Norwegian krone, whose value tracks Brent crude closely. Norges Bank's hawkish stance has kept the krone resilient against dollar strength."],
  ["usdsek", "USD/SEK", "Forex", 10.48, 0.09, "NEUTRAL", 57, "Medium", 49, 60, "Neutral", "Low", 10.46, 10.32, 10.74, "1:2.0", 3, "USD/SEK quotes the US dollar against the Swedish krona, a small open-economy currency sensitive to European growth and Riksbank policy. Liquidity thins outside European hours."],
];

const ago = ["2 minutes ago", "5 minutes ago", "9 minutes ago", "14 minutes ago", "21 minutes ago", "32 minutes ago"];
const rnd = (n: number, d: number) => +n.toFixed(d);

export const pairs: Pair[] = rows.map((r, i) => {
  const [slug, name, category, price, changePct, signal, confidence, riskLevel, bullishPct, opportunityScore, trend, newsRisk, entry, stopLoss, takeProfit, riskReward, dec, description] = r;
  return {
    slug, name, category,
    currentPrice: price,
    decimals: dec,
    change24h: rnd((price * changePct) / 100, Math.min(dec + 1, 5)),
    changePct, signal, confidence, riskLevel, bullishPct,
    bearishPct: 100 - bullishPct,
    opportunityScore, trend, newsRisk, entry, stopLoss, takeProfit, riskReward,
    lastUpdated: ago[i % ago.length],
    description,
    supportLevels: [rnd(price * 0.9957, dec), rnd(price * 0.9905, dec), rnd(price * 0.984, dec)],
    resistanceLevels: [rnd(price * 1.0049, dec), rnd(price * 1.0102, dec), rnd(price * 1.016, dec)],
  };
});

export const getPairBySlug = (slug: string) => pairs.find((p) => p.slug === slug.toLowerCase());

export const relatedPairsFor = (slug: string): Pair[] => {
  const p = getPairBySlug(slug);
  if (!p) return [];
  const base = p.name.replace("/", "");
  const cur1 = base.slice(0, 3);
  const cur2 = base.slice(3, 6);
  const scored = pairs
    .filter((x) => x.slug !== p.slug)
    .map((x) => {
      const xb = x.name.replace("/", "");
      let s = 0;
      if (xb.includes(cur1)) s += 2;
      if (xb.includes(cur2)) s += 2;
      if (x.category === p.category) s += 1;
      return { x, s };
    })
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, 4).map((e) => e.x);
};
