// 30 upcoming economic events — canonical source for /economic-calendar and /economic-calendar/[slug].
export type Impact = "High" | "Medium" | "Low";

export interface EconomicEvent {
  id: string;
  slug: string;
  title: string;
  currency: string;
  impact: Impact;
  date: string;
  time: string;
  forecast: string;
  previous: string;
  actual: string | null;
  affectedPairs: string[];
  description: string;
}

type Row = [
  slug: string, title: string, currency: string, impact: Impact, date: string, time: string,
  forecast: string, previous: string, actual: string | null, affected: string[], desc: string,
];

const rows: Row[] = [
  ["usd-nfp-2026-06", "Non-Farm Payrolls", "USD", "High", "Jun 12, 2026", "13:30 UTC", "185K", "175K", null, ["eurusd", "gbpusd", "usdjpy", "xauusd"], "Measures the monthly change in US employment excluding the farming sector. It is the single most market-moving data release in forex, routinely producing 50-100 pip swings in dollar pairs within minutes."],
  ["usd-fomc-rate-2026-06", "FOMC Interest Rate Decision", "USD", "High", "Jun 17, 2026", "19:00 UTC", "4.50%", "4.50%", null, ["eurusd", "usdjpy", "xauusd", "btcusd"], "The Federal Reserve's policy rate decision sets the cost of borrowing in the world's largest economy. Even when rates are unchanged, the statement language and dot plot can reprice every dollar pair."],
  ["usd-cpi-2026-06", "CPI y/y", "USD", "High", "Jun 11, 2026", "13:30 UTC", "2.8%", "3.0%", null, ["eurusd", "usdjpy", "xauusd"], "US consumer price inflation is the Fed's headline gauge of price stability. A hotter-than-expected print typically lifts the dollar and Treasury yields while pressuring gold and equities."],
  ["eur-ecb-rate-2026-06", "ECB Interest Rate Decision", "EUR", "High", "Jun 18, 2026", "12:15 UTC", "3.65%", "3.65%", null, ["eurusd", "eurgbp", "eurjpy"], "The European Central Bank's main refinancing rate decision drives euro valuations across the board. President Lagarde's press conference 45 minutes later often moves EUR/USD more than the decision itself."],
  ["gbp-boe-rate-2026-06", "BoE Interest Rate Decision", "GBP", "High", "Jun 18, 2026", "11:00 UTC", "4.75%", "4.75%", null, ["gbpusd", "eurgbp", "gbpjpy"], "The Bank of England's Monetary Policy Committee vote split is scrutinized as closely as the rate itself. Dissents toward cuts or hikes regularly trigger sharp repricing in sterling."],
  ["jpy-boj-rate-2026-06", "BoJ Policy Rate", "JPY", "High", "Jun 16, 2026", "03:00 UTC", "0.25%", "0.25%", null, ["usdjpy", "gbpjpy", "eurjpy", "audjpy"], "The Bank of Japan's policy decision is the key event for yen pairs. After decades of ultra-loose policy, every meeting carries the risk of a hawkish surprise — and historic volatility in USD/JPY."],
  ["usd-core-pce-2026-06", "Core PCE Price Index m/m", "USD", "High", "Jun 26, 2026", "12:30 UTC", "0.2%", "0.3%", null, ["eurusd", "usdjpy", "xauusd"], "Core PCE is the Federal Reserve's preferred inflation measure, stripping out food and energy. It directly shapes rate-cut expectations and is one of the most reliable dollar movers each month."],
  ["gbp-cpi-2026-06", "CPI y/y", "GBP", "High", "Jun 17, 2026", "06:00 UTC", "2.4%", "2.6%", null, ["gbpusd", "eurgbp", "gbpjpy"], "UK consumer price inflation determines how quickly the Bank of England can ease policy. Services inflation within the report is watched even more closely than the headline figure."],
  ["eur-cpi-flash-2026-06", "CPI Flash Estimate y/y", "EUR", "High", "Jun 30, 2026", "09:00 UTC", "2.2%", "2.3%", null, ["eurusd", "eurjpy", "eurgbp"], "The eurozone flash inflation estimate arrives two weeks before the final reading and sets ECB expectations. Core inflation persistence remains the deciding factor for the easing path."],
  ["usd-fomc-minutes-2026-06", "FOMC Meeting Minutes", "USD", "High", "Jul 1, 2026", "18:00 UTC", "—", "—", null, ["eurusd", "usdjpy", "xauusd"], "Detailed minutes from the most recent Federal Reserve meeting reveal the internal debate behind the decision. Hawkish or dovish surprises in the language frequently move the dollar an hour after release."],
  ["aud-rba-rate-2026-07", "RBA Interest Rate Decision", "AUD", "High", "Jul 7, 2026", "04:30 UTC", "3.85%", "3.85%", null, ["audusd", "audjpy", "gbpaud"], "The Reserve Bank of Australia's cash rate decision anchors Aussie dollar pricing. The accompanying statement's guidance on inflation persistence is the key tradeable signal."],
  ["cad-boc-rate-2026-07", "BoC Interest Rate Decision", "CAD", "High", "Jul 8, 2026", "13:45 UTC", "2.75%", "2.75%", null, ["usdcad"], "The Bank of Canada was among the first major central banks to cut rates this cycle. Each decision recalibrates the policy divergence with the Fed that drives USD/CAD."],
  ["nzd-rbnz-rate-2026-07", "RBNZ Official Cash Rate", "NZD", "High", "Jul 8, 2026", "02:00 UTC", "3.25%", "3.25%", null, ["nzdusd"], "The Reserve Bank of New Zealand publishes a full rate track alongside its decision, giving markets unusually explicit forward guidance. Kiwi pairs reprice sharply when the track shifts."],
  ["chf-snb-rate-2026-06", "SNB Policy Rate", "CHF", "High", "Jun 18, 2026", "07:30 UTC", "0.25%", "0.25%", null, ["usdchf"], "The Swiss National Bank meets only quarterly, concentrating policy surprises into four events a year. Franc intervention commentary is as important as the rate itself."],
  ["usd-jobless-claims-2026-06a", "Initial Jobless Claims", "USD", "Medium", "Jun 11, 2026", "12:30 UTC", "224K", "229K", null, ["eurusd", "usdjpy"], "Weekly first-time unemployment filings provide the highest-frequency read on US labor-market health. Sustained moves above 250K historically signal labor softening and dollar weakness."],
  ["usd-retail-sales-2026-06", "Retail Sales m/m", "USD", "Medium", "Jun 16, 2026", "12:30 UTC", "0.3%", "0.1%", null, ["eurusd", "usdjpy"], "US retail sales capture roughly a third of consumer spending — the engine of the American economy. The control-group reading feeds directly into GDP estimates."],
  ["usd-ism-mfg-2026-07", "ISM Manufacturing PMI", "USD", "Medium", "Jul 1, 2026", "14:00 UTC", "49.2", "48.7", null, ["eurusd", "usdcad"], "The ISM manufacturing survey is the longest-running leading indicator of US industrial activity. Readings below 50 indicate contraction; the prices-paid component is an inflation early-warning."],
  ["usd-crude-inventories-2026-06", "Crude Oil Inventories", "USD", "Medium", "Jun 10, 2026", "14:30 UTC", "-1.2M", "0.8M", null, ["usdcad", "usdnok"], "Weekly EIA crude stockpile data drives oil prices and, by extension, petro-currencies like the Canadian dollar and Norwegian krone. Large surprise draws are bullish for oil."],
  ["gbp-gdp-2026-06", "GDP m/m", "GBP", "Medium", "Jun 12, 2026", "06:00 UTC", "0.2%", "0.1%", null, ["gbpusd", "eurgbp"], "The UK publishes monthly GDP — rare among major economies — giving traders a near-real-time growth pulse. Back-to-back negative months reignite recession pricing in sterling."],
  ["eur-zew-2026-06", "German ZEW Economic Sentiment", "EUR", "Medium", "Jun 16, 2026", "09:00 UTC", "42.5", "39.8", null, ["eurusd", "eurjpy"], "The ZEW survey polls financial-market experts on the six-month outlook for Europe's largest economy. It leads the harder Ifo survey and often sets the euro's tone for the week."],
  ["eur-ifo-2026-06", "German Ifo Business Climate", "EUR", "Medium", "Jun 24, 2026", "08:00 UTC", "89.6", "88.9", null, ["eurusd", "eurgbp"], "The Ifo institute surveys 9,000 German firms on current conditions and expectations. It is regarded as the single best leading indicator of German — and therefore eurozone — growth."],
  ["aud-employment-2026-06", "Employment Change", "AUD", "Medium", "Jun 18, 2026", "01:30 UTC", "20.5K", "32.6K", null, ["audusd", "audjpy", "gbpaud"], "Australian monthly job creation alongside the unemployment rate shapes RBA expectations. Full-time versus part-time composition often matters more than the headline number."],
  ["nzd-cpi-2026-07", "CPI q/q", "NZD", "Medium", "Jul 16, 2026", "22:45 UTC", "0.6%", "0.5%", null, ["nzdusd"], "New Zealand reports inflation only quarterly, concentrating three months of pricing information into one release. Kiwi volatility around this print is consistently elevated."],
  ["cad-cpi-2026-06", "CPI m/m", "CAD", "Medium", "Jun 23, 2026", "12:30 UTC", "0.3%", "0.5%", null, ["usdcad"], "Canadian consumer prices, including the Bank of Canada's preferred trimmed and median core measures, determine the pace of further BoC easing and the USD/CAD rate differential."],
  ["jpy-tankan-2026-07", "Tankan Large Manufacturers Index", "JPY", "Medium", "Jul 1, 2026", "23:50 UTC", "14", "12", null, ["usdjpy", "eurjpy"], "The Bank of Japan's own quarterly survey of large manufacturers feeds directly into its policy deliberations. Improving readings strengthen the case for further BoJ normalization."],
  ["usd-consumer-confidence-2026-06", "CB Consumer Confidence", "USD", "Low", "Jun 30, 2026", "14:00 UTC", "101.5", "98.7", null, ["eurusd"], "The Conference Board's monthly survey tracks household optimism about jobs and income. It correlates with future consumer spending but rarely moves markets on its own."],
  ["eur-german-ppi-2026-06", "German PPI m/m", "EUR", "Low", "Jun 19, 2026", "06:00 UTC", "0.1%", "-0.2%", null, ["eurusd"], "German producer prices lead consumer inflation by several months as input costs pass through supply chains. Markets treat it as a directional check on the eurozone inflation pipeline."],
  ["gbp-retail-sales-2026-06", "Retail Sales m/m", "GBP", "Low", "Jun 19, 2026", "06:00 UTC", "0.4%", "-0.3%", null, ["gbpusd"], "UK retail sales volumes track high-street spending strength. The series is volatile and heavily revised, so traders fade initial spikes unless confirmed by trend."],
  ["chf-cpi-2026-07", "CPI m/m", "CHF", "Low", "Jul 3, 2026", "06:30 UTC", "0.1%", "0.0%", null, ["usdchf"], "Swiss inflation is the lowest in the developed world, but each print still shapes SNB intervention expectations. Sustained deflation prints raise odds of renewed franc-selling."],
  ["jpy-household-spending-2026-07", "Household Spending y/y", "JPY", "Low", "Jul 7, 2026", "23:30 UTC", "0.8%", "0.1%", null, ["usdjpy"], "Japanese household spending measures whether wage gains are translating into consumption — the missing link in the BoJ's virtuous-cycle thesis. Strong readings support yen firmness."],
];

export const economicEvents: EconomicEvent[] = rows.map((r, i) => {
  const [slug, title, currency, impact, date, time, forecast, previous, actual, affectedPairs, description] = r;
  return { id: `ev-${i + 1}`, slug, title, currency, impact, date, time, forecast, previous, actual, affectedPairs, description };
});

export const getEventBySlug = (slug: string) => economicEvents.find((e) => e.slug === slug.toLowerCase());

export const eventsForPair = (pairSlug: string) =>
  economicEvents.filter((e) => e.affectedPairs.includes(pairSlug.toLowerCase()));
