// TheFortFX Learning Center — 24 proprietary articles.
// Body uses markdown-lite: lines starting "## " are H2, "### " are H3, otherwise paragraphs.
export type ArticleCategory =
  | "Forex Basics"
  | "Technical Analysis"
  | "Fundamental Analysis"
  | "Risk Management"
  | "Trading Psychology"
  | "Strategies";

export interface ArticleFAQ {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  relatedPairs: string[];
  relatedSlugs: string[];
  faqs: ArticleFAQ[];
  keyTakeaway: string;
  body: string;
  diagram?: string;
  /** Legacy field for compatibility with older summaries. */
  content?: string;
}

const A = (a: Article): Article => ({ ...a, content: a.body });

export const articles: Article[] = [
  A({
    slug: "what-is-forex-trading",
    title: "What Is Forex Trading? A Complete Beginner's Guide",
    category: "Forex Basics",
    excerpt:
      "Forex is the simultaneous buying and selling of currency pairs in the global market. Learn the fundamentals every trader must know before placing their first trade.",
    readTime: "6 min",
    publishedAt: "2025-06-01",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["currency-pairs-explained", "what-is-spread-in-forex"],
    keyTakeaway:
      "Forex is the simultaneous purchase of one currency and sale of another, quoted as a pair. The market is the largest and most liquid in the world — and every successful trader started by mastering these foundations.",
    faqs: [
      { q: "What does forex stand for?", a: "Forex stands for Foreign Exchange — the global market where currencies are bought and sold simultaneously as pairs." },
      { q: "Which currency is the strongest in forex?", a: "The EUR (Euro) is generally considered the strongest major currency, followed closely by GBP. However, strength is always relative to the paired currency." },
      { q: "What is a currency pair?", a: "A currency pair is two currencies quoted against each other, such as EURUSD. The first currency is the base; the second is the quote currency." },
      { q: "Can I trade forex with $100?", a: "Yes. With a $100 account, use a maximum lot size of 0.01 (micro lot) and limit yourself to one trade per day to manage risk effectively." },
    ],
    body: `Foreign exchange — forex, or FX — is the global marketplace where one currency is exchanged for another. Every international transaction, from a tourist buying coffee in Paris to a hedge fund hedging a billion-dollar bond portfolio, ultimately flows through this market. Daily volume now exceeds $7.5 trillion, making forex the deepest and most liquid market on earth.
## How forex actually works
You never trade a single currency in isolation. Every trade is a pair: when you buy EURUSD, you are simultaneously buying euros and selling US dollars. If the euro strengthens against the dollar, the pair rises and your long position gains. If the dollar strengthens, the pair falls.
## The market structure
Forex has no central exchange. Trades flow through an interbank network of banks, brokers, and liquidity providers operating 24 hours a day, five days a week. The market opens Monday in Sydney and closes Friday in New York. Three major sessions — Asia, London, and New York — overlap to keep liquidity continuous.
## Why traders trade forex
Three structural advantages: high liquidity (tight spreads on majors), high leverage (small capital controls a large position), and round-the-clock access. The flip side is volatility, news risk, and the discipline required to size trades correctly.
## Your first steps
Start with a demo account. Trade a single major pair like EURUSD for a month. Use micro lots only. Read the daily session opens. The skill that separates profitable traders from blown accounts is not market prediction — it is risk management and patience.`,
  }),

  A({
    slug: "currency-pairs-explained",
    title: "Forex Currency Pairs Explained: Major, Minor & Exotic",
    category: "Forex Basics",
    excerpt:
      "Understanding currency pairs is the foundation of forex trading. Learn the difference between major, minor, and exotic pairs and how to read them correctly.",
    readTime: "7 min",
    publishedAt: "2025-06-02",
    relatedPairs: ["eurusd", "gbpusd", "usdjpy"],
    relatedSlugs: ["what-is-spread-in-forex", "what-is-forex-trading"],
    keyTakeaway:
      "Currency pairs are grouped into majors (with USD), minors (cross-pairs without USD), and exotics (one major + one emerging-market currency). Majors offer the tightest spreads and deepest liquidity — beginners should start here.",
    faqs: [
      { q: "What is a base currency?", a: "The base currency is always the first currency in a pair. When you buy EURUSD, you are buying EUR and simultaneously selling USD." },
      { q: "Why is EUR the base in EURUSD and not GBP?", a: "Although GBP is individually stronger than EUR, the Euro is written as the base because it represents a larger economic bloc of multiple countries." },
      { q: "What are exotic pairs?", a: "Exotic pairs involve one major currency and one from an emerging market, such as USDNGN or USDMXN. They typically have higher spreads and lower liquidity." },
      { q: "What does XAU mean?", a: "XAU is the symbol for Gold in forex. XAG represents Silver. They are traded as pairs against the US dollar, e.g. XAUUSD." },
    ],
    body: `A currency pair quotes the price of one currency relative to another. EURUSD = 1.0850 means one euro buys 1.0850 US dollars. The first currency is the base; the second is the quote.
## Major pairs
The seven majors all pair the US dollar with another G10 currency: EURUSD, GBPUSD, USDJPY, USDCHF, AUDUSD, USDCAD, NZDUSD. They concentrate the world's liquidity and carry the tightest spreads — typically 0.1 to 1.0 pip at quality brokers.
## Minor pairs (crosses)
Crosses exclude the US dollar. Examples: EURGBP, EURJPY, GBPJPY, AUDJPY. They isolate two non-US economies and often trend more cleanly than majors during US session quiet hours. Spreads are wider — usually 1 to 3 pips.
## Exotic pairs
Exotics pair a major with an emerging-market currency: USDMXN, USDZAR, USDTRY, USDNGN. They offer extreme volatility and high carry yields but come with wide spreads (10–30+ pips), gap risk over weekends, and political shock risk. Reserve them for experienced traders.
## Metals as pairs
Gold and silver are quoted as XAUUSD and XAGUSD respectively. They behave more like commodities than currencies — driven by inflation, real yields, and risk sentiment — and are some of the cleanest trending instruments on the chart.`,
  }),

  A({
    slug: "what-is-spread-in-forex",
    title: "What Is Spread in Forex? How It Affects Every Trade You Make",
    category: "Forex Basics",
    excerpt:
      "Spread is the difference between the ask price and the bid price — and it is the cost you pay on every single trade. Learn how to minimise it.",
    readTime: "5 min",
    publishedAt: "2025-06-03",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["what-is-a-pip", "lot-size-and-pip-value"],
    keyTakeaway:
      "Spread is the gap between the bid (sell) and ask (buy) prices — your immediate, unavoidable trading cost. Trade liquid majors with tight spreads, and never run scalping strategies on exotic pairs.",
    faqs: [
      { q: "What is spread in forex?", a: "Spread is the difference between the bid price (what brokers pay you) and the ask price (what you pay the broker). It is effectively the broker's fee on each trade." },
      { q: "Which pairs have the lowest spread?", a: "Major pairs like EURUSD, GBPUSD, and USDJPY consistently have the lowest spreads because they are the most liquid and widely traded." },
      { q: "How does spread affect profitability?", a: "Every trade starts slightly in the negative because of spread. A trade on EURUSD with a 1.5 pip spread means price must move 1.5 pips in your favour before you break even." },
      { q: "Should beginners avoid high-spread pairs?", a: "Yes. Beginners should focus on major pairs (all include USD) to minimise spread costs while they develop their trading skills." },
    ],
    body: `When you open any chart on your broker's platform, two prices are quoted: the bid (where you can sell) and the ask (where you can buy). The difference between them is the spread, and it is the single most consistent cost in your trading.
## How spread is charged
Every trade you open is immediately at a small loss equal to the spread. If EURUSD shows bid 1.0848 and ask 1.0849, a freshly opened long is already down 1 pip. Price must move that distance in your favour just to reach break-even.
## What drives spread
Three factors: liquidity, volatility, and broker model. Majors with deep liquidity carry tighter spreads. Exotic pairs and news events widen spreads — sometimes 10×. ECN brokers pass raw market spreads through; market-maker brokers mark them up but absorb the risk.
## How to keep spread costs low
Trade majors during their main session (EURUSD during London/NY overlap). Avoid the few minutes around high-impact news, when spreads can blow out from 1 pip to 20. Use a broker with a transparent ECN or RAW model if your strategy depends on tight pricing.`,
  }),

  A({
    slug: "what-is-a-pip",
    title: "What Is a Pip in Forex? Pips, Pipettes & How to Calculate Them",
    category: "Forex Basics",
    excerpt:
      "A pip (Price Interest Point) is the smallest standard unit of price movement in forex. Understanding pips is essential for calculating profit, loss, and risk.",
    readTime: "7 min",
    publishedAt: "2025-06-04",
    relatedPairs: ["eurusd", "usdjpy"],
    relatedSlugs: ["lot-size-and-pip-value", "stop-loss-and-take-profit"],
    keyTakeaway:
      "A pip is the standard unit of price movement: 0.0001 on most pairs, 0.01 on JPY pairs. Pip value depends on lot size — and every stop loss, take profit, and risk calculation flows from this single measurement.",
    faqs: [
      { q: "What is a pip in forex?", a: "A pip stands for Price Interest Point. For most currency pairs, it is the fourth decimal place (0.0001). For JPY pairs, it is the second decimal place (0.01)." },
      { q: "What is a pippet?", a: "A pippet (or pipette) is the fifth decimal place on standard pairs, or the third on JPY pairs. It should always be ignored when calculating trade entries and exits." },
      { q: "How much is one pip worth?", a: "Pip value depends on your lot size. At 0.1 lot (mini lot) on EURUSD, one pip equals $1. At 1.0 lot (standard), one pip equals $10." },
      { q: "How do I calculate pips on JPY pairs?", a: "For JPY pairs like USDJPY, the pip is at the second decimal place. If USDJPY moves from 138.50 to 138.60, that is 10 pips. Ignore the third decimal (pippet)." },
    ],
    body: `A pip — short for Price Interest Point — is the smallest standardised unit of price movement in a currency pair. It normalises trade language: "EURUSD moved 80 pips today" communicates the same magnitude regardless of where the pair is trading.
## Where the pip lives
For most pairs, the pip is the fourth decimal place (0.0001). EURUSD moving from 1.0820 to 1.0840 is a 20-pip move. For JPY pairs, the pip is the second decimal place (0.01). USDJPY moving from 150.20 to 150.50 is a 30-pip move.
## What about pipettes
Modern brokers show one extra decimal — the pipette, or one-tenth of a pip. EURUSD at 1.08473 has 3 pipettes past 1.0847. Always ignore the pipette when you set stops; confusing the two can inflate your risk by 10× without you noticing.
## Pip value by lot size
Pip value scales linearly with lot size on USD-quoted pairs: 0.01 lot = $0.10/pip · 0.10 lot = $1/pip · 1.00 lot = $10/pip. For non-USD quotes you convert at the prevailing rate — or skip the math entirely with the pip calculator linked below.
## Why this matters
Pip distance × pip value = your dollar risk. Every position size, every stop loss, and every profit target is built on this calculation. Master pips and you can trade any pair with confidence; skip this step and you are guessing.`,
    diagram: "what-is-a-pip",
  }),

  A({
    slug: "lot-size-and-pip-value",
    title: "Forex Lot Size & Pip Value: The Complete Guide With Reference Table",
    category: "Risk Management",
    excerpt:
      "Your lot size determines exactly how much you gain or lose per pip. This guide explains micro, mini, and standard lots with a complete reference table for every account size.",
    readTime: "8 min",
    publishedAt: "2025-06-05",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["forex-money-management-rules", "stop-loss-and-take-profit"],
    keyTakeaway:
      "Match lot size to account balance: never trade your maximum. The TheFortFX rule is to start at 25–50% of your maximum safe lot size so a losing streak cannot blow your account.",
    faqs: [
      { q: "What is a standard lot in forex?", a: "A standard lot is 100,000 units of currency, represented as 1.0 on MT4/MT5. At this size, one pip equals approximately $10 on USD pairs." },
      { q: "What lot size should I use with a $500 account?", a: "With $500, your maximum lot size should be 0.05 (micro). This keeps your pip value at 50 cents, meaning a 30-pip stop loss only risks $15 — well within safe risk parameters." },
      { q: "What is the difference between micro and mini lots?", a: "A micro lot is 0.01 (1,000 units, $0.10/pip). A mini lot is 0.1 (10,000 units, $1/pip). Always start with micro lots when learning." },
      { q: "Is it safe to use 0.1 lot on a $1,000 account?", a: "It is the maximum safe size, not the recommended size. The TheFortFX rule: start at 0.01 or 0.02, never expose your full maximum lot size on a single trade." },
    ],
    body: `A lot is the standardised quantity of currency you transact. Three sizes dominate retail trading: standard (100,000 units, 1.0), mini (10,000 units, 0.1), and micro (1,000 units, 0.01). Lot size is the lever that turns a 20-pip win into either $0.20 or $200.
## The three lot sizes
Micro lot (0.01) = $0.10/pip. Mini lot (0.10) = $1/pip. Standard lot (1.00) = $10/pip. Modern brokers let you trade in increments of 0.01, so there is no excuse for rounding up risk.
## How to choose lot size from account balance
Work backwards from risk, not forwards from greed. Decide the dollar amount you are willing to lose (1–2% of your account), divide by your stop distance in pips, then divide by pip value per lot.
## TheFortFX maximum-lot reference
A $100 account caps at 0.01 lots. A $500 account caps at 0.05 lots. A $1,000 account caps at 0.10 lots. A $10,000 account caps at 1.0 lot. These are the maximums — you should typically trade at 25–50% of the cap, leaving room for losing streaks.
## Why over-sizing destroys accounts
Most blown accounts are not the result of bad analysis. They are the result of trading lot sizes far too large for the balance. A trader using 1.0 lot on a $1,000 account is one bad trade from a margin call. Smaller size is the cheapest insurance you can buy.`,
    diagram: "lot-size-and-pip-value",
  }),

  A({
    slug: "stop-loss-and-take-profit",
    title: "Stop Loss & Take Profit: How to Calculate Risk Reward Correctly",
    category: "Risk Management",
    excerpt:
      "Every trade must have a stop loss and take profit before you enter. Learn exactly how to calculate them for buy and sell scenarios with worked examples.",
    readTime: "9 min",
    publishedAt: "2025-06-06",
    relatedPairs: ["eurusd", "usdjpy"],
    relatedSlugs: ["lot-size-and-pip-value", "forex-money-management-rules"],
    keyTakeaway:
      "Every trade needs a stop loss and a take profit before you click confirm. Aim for at least 1:1.5 risk:reward, and move to break-even once you are +20 pips in profit.",
    faqs: [
      { q: "What is a stop loss?", a: "A stop loss is a pre-set price level where your trade automatically closes to limit your loss. It prevents a bad trade from destroying your account." },
      { q: "How do I calculate take profit for a buy trade?", a: "For a buy: Take Profit = CMP + number of pips. Stop Loss = CMP - number of pips. Example: Buy EURUSD at 1.1803, TP = 1.1853 (+50 pips), SL = 1.1773 (-30 pips)." },
      { q: "What is a good risk reward ratio?", a: "A minimum of 1:1.5 is recommended, meaning you target 1.5x more than you risk. A 1:2 ratio (risk 30 pips to gain 60) is considered solid for consistent profitability." },
      { q: "What is break even in forex?", a: "Break even means moving your stop loss to your exact entry price after the trade has moved at least 20 pips in your favour. This eliminates your downside risk entirely." },
    ],
    body: `A trade without a stop loss is gambling. A trade with no take profit is hope. Every position you open must have both levels defined before you click confirm — non-negotiable.
## BUY trade calculation
For a long: Take Profit = entry + (TP pips). Stop Loss = entry − (SL pips). Example: long EURUSD at 1.1803, target +50 pips → TP 1.1853, risk 30 pips → SL 1.1773. Risk:reward is 30:50 = 1:1.67.
## SELL trade calculation
For a short, the geometry flips. Take Profit = entry − (TP pips). Stop Loss = entry + (SL pips). Example: short EURUSD at 1.1803, target +50 pips → TP 1.1753, risk 30 pips → SL 1.1833. For sells, the stop sits above entry — a rising price hurts you.
## Risk:reward — the only ratio that matters
At 1:2 risk:reward, you can be wrong 60% of the time and still be profitable. At 1:1, you must win more than half your trades just to break even. Set a minimum of 1:1.5 and refuse trades that do not offer it.
## The break-even rule
Once a trade is +20 pips in profit, move your stop loss to entry. The trade now has zero downside risk and unlimited upside. This single discipline is what separates traders who survive losing streaks from those who do not.`,
    diagram: "stop-loss-and-take-profit",
  }),

  A({
    slug: "forex-money-management-rules",
    title: "Forex Money Management: 10 Rules That Protect Your Account",
    category: "Risk Management",
    excerpt:
      "Most traders lose not because they cannot read the market but because they mismanage their money. These 10 rules are the foundation of long-term profitability.",
    readTime: "8 min",
    publishedAt: "2025-06-07",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["lot-size-and-pip-value", "stop-loss-and-take-profit"],
    keyTakeaway:
      "Capital preservation comes before profit. Risk 1–3% per trade, cap open positions at 3, hit your daily target and stop, and give every trade time to breathe. Discipline beats prediction.",
    faqs: [
      { q: "What percentage of my account should I risk per trade?", a: "Never risk more than 2-3% of your trading account on any single trade. This ensures that even a losing streak of 10 trades only reduces your account by 20-30%." },
      { q: "How many trades should I have open at once?", a: "A maximum of 2-3 trades at any one time. More than three open positions simultaneously increases emotional pressure and risk beyond manageable levels." },
      { q: "Should I have a daily pip target?", a: "Yes. Having a daily, weekly, and monthly pip target keeps you disciplined and prevents overtrading. Once you hit your target, stop trading for the day." },
      { q: "Why should I leave a trade for 36 hours?", a: "Markets need time to develop. Closing trades prematurely out of impatience is one of the most common causes of unnecessary losses. Patience is a money management skill." },
    ],
    body: `Trading is a probability game. Money management is what turns positive expectancy into actual equity growth. These ten rules are the operating system of every consistent trader.
## The ten rules
### 1. Risk no more than 1–3% per trade
A 10-trade losing streak should bruise you, not bury you. Below 3% per trade, that streak costs 30% — recoverable. Above 5%, the math gets brutal fast.
### 2. Cap concurrent open positions
Three open trades is the realistic ceiling for clear thinking. More than that and you are managing emotions, not setups.
### 3. Set daily, weekly, and monthly targets
Define enough. Hit the daily target and close the laptop. The market is open all week — you only need to harvest a small slice of it.
### 4. Stop after two consecutive losses
Two losses signals either bad conditions or bad headspace. In either case, the answer is to step away, not to "win it back".
### 5. Trade only your A-setups
B and C setups make up most losses. Filter ruthlessly. A great trader passing on a trade is doing their job.
### 6. Give trades 36 hours to develop
Most premature closes happen because of impatience, not invalidation. Let the chart prove you wrong — do not panic out.
### 7. Move to break-even at +20 pips
Risk-free trades compound your edge. This single rule has saved more accounts than any indicator.
### 8. Avoid revenge trading
The trade you take immediately after a loss is the most expensive trade in retail. Walk away.
### 9. Withdraw profits regularly
Pay yourself. The market does not care about your unrealised gains, and an account you never withdraw from is psychologically infinite.
### 10. Journal every trade
You cannot improve what you do not measure. Record entry, exit, reasoning, and outcome. Review weekly.`,
  }),

  A({
    slug: "technical-analysis-indicators",
    title: "Technical Analysis in Forex: The 7 Key Indicators Explained",
    category: "Technical Analysis",
    excerpt:
      "Technical analysis uses indicators to predict future price movements from historical data. This guide explains the 7 core indicators every forex trader must understand.",
    readTime: "12 min",
    publishedAt: "2025-06-08",
    relatedPairs: ["eurusd", "gbpusd", "xauusd"],
    relatedSlugs: ["moving-average-strategy", "rsi-trading-guide"],
    keyTakeaway:
      "No single indicator is reliable in isolation. The seven core tools — candlesticks, MA, Parabolic SAR, Fractals, RSI, Stochastic, MACD — are powerful only when they agree. Confluence is the strategy.",
    faqs: [
      { q: "What is technical analysis?", a: "Technical analysis is the study of historical price charts and statistical indicators to forecast future price movements, without considering economic news or fundamentals." },
      { q: "Which indicator is most reliable?", a: "No single indicator is most reliable. The power comes from confluence — when multiple indicators agree on the same direction simultaneously." },
      { q: "Does technical analysis override fundamental analysis?", a: "No. Fundamental analysis overrides technical analysis. If your indicators say BUY but a high-impact news event says SELL, the fundamentals take precedence." },
      { q: "What are the 7 main technical indicators?", a: "Japanese Candlesticks, Moving Average, Parabolic SAR, Fractals, RSI (Relative Strength Index), Stochastic Oscillator, and MACD." },
    ],
    body: `Technical analysis is the study of price itself — its patterns, momentum, and structure — to forecast where it goes next. It rests on a simple premise: all known information is already reflected in price.
## The 7 core indicators
### 1. Japanese Candlesticks
Each candle compresses open, high, low, and close into a single visual. Patterns reveal who won the period — buyers or sellers.
### 2. Moving Average (MA)
A smoothed line of recent prices. Reveals trend direction and acts as dynamic support/resistance.
### 3. Parabolic SAR
Dots above or below price. Below = bullish, above = bearish. Doubles as a trailing stop.
### 4. Fractals
Arrow markers identifying swing highs and lows — discrete support and resistance points.
### 5. RSI (Relative Strength Index)
0–100 momentum oscillator. Below 30 = oversold, above 70 = overbought, 50 = trend bias.
### 6. Stochastic Oscillator
Two lines (%K and %D) measuring closing strength versus range. Crossovers generate signals.
### 7. MACD
Two EMAs plus a histogram. Crossovers and histogram colour shifts reveal momentum changes.
## Confluence — the only real edge
A single indicator firing means little. Three indicators agreeing — say MA bullish, RSI &gt; 50, and Stochastic crossing up — is the kind of setup professional traders wait for. Build your strategy around agreement, not isolation.
## Where TA fits
Technical analysis tells you when. Fundamental analysis tells you whether you should be trading at all. Always check the economic calendar first; if a red-folder event is imminent, even the cleanest technical setup should be skipped.`,
  }),

  A({
    slug: "japanese-candlesticks",
    title: "Japanese Candlesticks: How to Read Every Candle in Forex",
    category: "Technical Analysis",
    excerpt:
      "Candlestick charts are the language of the forex market. Learn how to read every candle, understand bullish and bearish patterns, and use them to time your entries.",
    readTime: "8 min",
    publishedAt: "2025-06-09",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["support-and-resistance", "moving-average-strategy"],
    keyTakeaway:
      "A candle's body shows who won the period; the wicks show who tried and failed. Read candles at context — at support, at resistance, after a trend — and they become precise entry triggers.",
    faqs: [
      { q: "What does a bullish candlestick look like?", a: "A bullish (black/green) candle means the closing price was higher than the opening price — buyers won that period. The body is filled or colored to indicate direction." },
      { q: "What does a bearish candlestick look like?", a: "A bearish (white/red) candle means the closing price was lower than the opening price — sellers dominated. The wicks show the high and low reached during the period." },
      { q: "What is the wick of a candle?", a: "The wick (or shadow) is the thin line above and below the candle body. The upper wick shows the highest price reached; the lower wick shows the lowest." },
      { q: "What is an inverted candle?", a: "An inverted candle (reversal candle) signals a potential change in market direction. A long upper wick on a bullish move signals sellers are pushing back — watch for a reversal." },
    ],
    body: `Each candlestick records four prices over its interval: open, high, low, and close. The body spans open to close; the wicks mark the extremes. That simple structure encodes the entire battle between buyers and sellers.
## Anatomy
A bullish candle (green) closes above its open — buyers won. A bearish candle (red) closes below its open — sellers won. The upper wick shows where buyers pushed and were rejected; the lower wick shows the same for sellers.
## High-edge patterns
Most named patterns are noise. The ones with statistical edge share one trait: rejection. A pin bar (long wick, small body) at support shows sellers tried and failed. An engulfing candle shows one side overwhelming the entire prior range. Inside bars show compression preceding expansion.
## Context is everything
A bullish pin bar mid-range is a coin flip. The same candle at weekly support, inside an uptrend pullback, with RSI divergence, is a trade. Candlesticks are the trigger — never the reason. Build the reason from level and trend first.
## Timeframe hierarchy
Daily candles outrank 1-hour. A daily hammer at support overrides bearish 15-minute candles printed inside it. Professionals read daily and 4-hour for bias, then drop to lower timeframes only to refine entry timing.`,
    diagram: "japanese-candlesticks",
  }),

  A({
    slug: "moving-average-strategy",
    title: "Moving Average Strategy: How to Use the Triple MA System",
    category: "Technical Analysis",
    excerpt:
      "The Moving Average indicator tells you the trend direction and shows support and resistance levels. The Triple MA system uses three periods to generate clear buy, sell, and neutral signals.",
    readTime: "9 min",
    publishedAt: "2025-06-10",
    relatedPairs: ["eurusd", "gbpusd", "usdjpy"],
    relatedSlugs: ["technical-analysis-indicators", "macd-trading-guide"],
    keyTakeaway:
      "The TheFortFX Triple MA system uses periods 5 (yellow), 10 (blue), and 15 (red). Yellow crossing both lines up = BUY. Crossing both down = SELL. Stuck between them = NEUTRAL.",
    faqs: [
      { q: "What is a Moving Average?", a: "A Moving Average smooths price data over a set number of periods to show the overall trend direction, eliminating short-term noise from the chart." },
      { q: "What are the three MA periods in the TheFortFX system?", a: "Period 5 (Yellow line — fastest), Period 10 (Blue line — medium), and Period 15 (Red line — slowest). The yellow line crossing the others generates signals." },
      { q: "How do I get a buy signal from Moving Average?", a: "A BUY signal occurs when the Yellow (Period 5) line crosses both the Blue (10) and Red (15) lines in an upward direction. All three must be crossed, not just one." },
      { q: "What does it mean when the yellow line is between the other two?", a: "When the Yellow line sits between the Blue and Red lines, the signal is NEUTRAL. No trade should be taken until the Yellow line breaks clearly above or below." },
    ],
    body: `A Moving Average plots the average closing price over a fixed number of periods. As price advances, the oldest period drops off and the newest enters — the average rolls forward, smoothing noise into trend.
## The Triple MA setup
TheFortFX framework uses three exponential moving averages on the same chart: period 5 (yellow, fastest), period 10 (blue, medium), period 15 (red, slowest). The yellow line reacts first; the red line resists change.
## Reading signals
BUY: yellow crosses both blue and red upward. All three lines stack bullish (yellow on top, blue middle, red bottom).
SELL: yellow crosses both blue and red downward. Lines stack bearish (red on top, blue middle, yellow bottom).
NEUTRAL: yellow sits between blue and red, or all three intertwine. No trade.
## Why three lines
A single MA crossover whipsaws constantly. Requiring the fast line to clear both slower lines filters out the noise — you get fewer signals, but those signals carry more weight.
## Where MA fails
In choppy, range-bound markets, all three averages flatten and tangle. The Triple MA is a trend-following system; switch it off in clear ranges and look for breakout setups instead.`,
    diagram: "moving-average-strategy",
  }),

  A({
    slug: "rsi-trading-guide",
    title: "RSI (Relative Strength Index): How to Use It for Forex Signals",
    category: "Technical Analysis",
    excerpt:
      "The RSI measures the momentum and speed of price movement on a scale of 0 to 100. Learn how to identify overbought, oversold, and trend-confirmation signals correctly.",
    readTime: "8 min",
    publishedAt: "2025-06-11",
    relatedPairs: ["eurusd", "xauusd"],
    relatedSlugs: ["stochastic-oscillator-guide", "technical-analysis-indicators"],
    keyTakeaway:
      "RSI is a 0–100 momentum scale. The 50 midline is the trend bias filter; 0–30 and 70–100 are reversal zones. Use RSI for confirmation, never in isolation.",
    faqs: [
      { q: "What does RSI measure?", a: "RSI measures the speed and magnitude of price movements on a scale from 0 to 100. It tells you whether a currency pair is overbought (likely to fall) or oversold (likely to rise)." },
      { q: "What RSI level signals a buy?", a: "For trend confirmation: RSI at 50 or above signals bullish momentum (BUY bias). For reversals: RSI entering 0-30 territory signals the market is oversold and a bounce may occur." },
      { q: "What RSI level signals a sell?", a: "For trend confirmation: RSI below 50 signals bearish momentum (SELL bias). For reversals: RSI entering 70-100 territory signals the market is overbought and a pullback may follow." },
      { q: "Can I trade using RSI alone?", a: "No single indicator should be used alone. RSI is most powerful when combined with Moving Average and price structure (support and resistance) for confirmation." },
    ],
    body: `The Relative Strength Index measures the speed and magnitude of recent price changes on a 0–100 scale. It compresses momentum into a single, easy-to-read line.
## Reading the three zones
0–30: oversold. Selling pressure is exhausted; reversals become probable.
30–70: trend territory. The 50 line acts as bias filter — above 50 favours longs, below favours shorts.
70–100: overbought. Buying pressure is exhausted; pullbacks become probable.
## The two trading methods
Trend confirmation: enter longs only when RSI is above 50 in an uptrend, shorts only below 50 in a downtrend. This single rule removes most counter-trend losses.
Reversal hunting: wait for RSI to enter 0–30 or 70–100, then enter on the exit candle in the direction of the reversal. Combine with support/resistance for higher hit rate.
## The common mistake
Strong trends keep RSI overbought (or oversold) for weeks. Selling every time RSI prints 70 in a raging uptrend is a fast way to lose money. Always check structure: an overbought reading at all-time highs is fuel, not warning.
## Best confluence partners
RSI &gt; 50 + Moving Average uptrend + price respecting support = high-probability long. RSI &lt; 50 + MA downtrend + rejection at resistance = high-probability short.`,
    diagram: "rsi-trading-guide",
  }),

  A({
    slug: "stochastic-oscillator-guide",
    title: "Stochastic Oscillator: Buy & Sell Signals in Forex Explained",
    category: "Technical Analysis",
    excerpt:
      "The Stochastic Oscillator compares a closing price to its price range over a period. Two lines — the %K (blue) and %D (red) — generate clear buy, sell, and neutral signals.",
    readTime: "7 min",
    publishedAt: "2025-06-12",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["rsi-trading-guide", "technical-analysis-indicators"],
    keyTakeaway:
      "Stochastic uses two lines: %K (blue) and %D (red). Blue crossing above red = BUY, especially below 20. Blue crossing below red = SELL, especially above 80. Touching without crossing = NEUTRAL.",
    faqs: [
      { q: "What is the Stochastic Oscillator?", a: "The Stochastic Oscillator is a momentum indicator that compares a closing price to a price range over a specific period, generating values between 0 and 100." },
      { q: "How do I read a buy signal on Stochastic?", a: "A BUY signal occurs when the Blue line (%K) crosses ABOVE the Red line (%D). The stronger the crossover (especially below the 20 level), the more reliable the signal." },
      { q: "How do I read a sell signal on Stochastic?", a: "A SELL signal occurs when the Blue line (%K) crosses BELOW the Red line (%D), especially when this happens above the 80 level (overbought zone)." },
      { q: "What does it mean when the two lines touch?", a: "When the Blue and Red lines are touching or very close together without a clear cross, the signal is NEUTRAL. Wait for a decisive separation before entering a trade." },
    ],
    body: `The Stochastic Oscillator measures where the current close sits relative to the high-low range over a period — a precise way to gauge momentum exhaustion.
## The two lines
%K (blue) — the faster, more reactive line.
%D (red) — the smoothed average of %K, slower and more reliable.
## Signal hierarchy
BUY: blue crosses above red. The crossover is most reliable below 20 (oversold zone).
SELL: blue crosses below red. Most reliable above 80 (overbought zone).
NEUTRAL: lines touching without separation. Wait for confirmation.
## Where Stochastic shines
Range-bound markets. Stochastic was designed for choppy conditions where price oscillates between support and resistance. In strong trends, expect Stochastic to stay pinned in overbought or oversold for long stretches — do not fade trends with it.
## Combining with RSI
Stochastic and RSI measure different things despite looking similar. When both fire the same direction simultaneously — say both crossing up from oversold — the signal carries genuine weight. Stack them with a level (support or resistance) for an A-grade setup.`,
    diagram: "stochastic-oscillator-guide",
  }),

  A({
    slug: "parabolic-sar-guide",
    title: "Parabolic SAR: How the Dots Tell You When to Buy and Sell",
    category: "Technical Analysis",
    excerpt:
      "The Parabolic SAR (Stop and Reverse) appears as a series of dots above or below price. Its position relative to candlesticks gives one of the clearest trend signals in forex.",
    readTime: "6 min",
    publishedAt: "2025-06-13",
    relatedPairs: ["eurusd", "usdjpy"],
    relatedSlugs: ["technical-analysis-indicators", "moving-average-strategy"],
    keyTakeaway:
      "Dots below the candles = BUY (uptrend). Dots above the candles = SELL (downtrend). The dot also marks a logical trailing stop loss.",
    faqs: [
      { q: "What does SAR stand for?", a: "SAR stands for Stop and Reverse. The indicator signals not only where to place your stop loss but also when the trend may reverse direction." },
      { q: "How do I get a buy signal from Parabolic SAR?", a: "A BUY signal occurs when the SAR dots appear BELOW the candlesticks. This indicates upward momentum — the market is bullish." },
      { q: "How do I get a sell signal from Parabolic SAR?", a: "A SELL signal occurs when the SAR dots appear ABOVE the candlesticks. This indicates downward momentum — the market is bearish." },
      { q: "Can Parabolic SAR be used as a stop loss?", a: "Yes. The SAR dot level is often used as a trailing stop loss placement. As the trend develops, the dots move closer to price, locking in profit." },
    ],
    body: `Parabolic SAR — Stop And Reverse — paints a dot per candle that flips sides when momentum changes. Its simplicity is the point: position of dot relative to price = direction of trade.
## The two rules
Dots below price = BUY. Dots above price = SELL. When the dot flips sides, the trend may be reversing.
## Using SAR as a trailing stop
The most powerful application is as a stop. In an uptrend, the dots climb beneath price; each new dot becomes the new stop level. The trade is closed automatically when price touches the dot, locking in trend profits without subjective exit decisions.
## When SAR fails
Range-bound markets. Parabolic SAR flips every few candles in chop, generating constant whipsaws. Always confirm with trend filter (Moving Average, ADX) before trusting an SAR signal.
## Best confluence
SAR below candles + price above 50 EMA + bullish RSI = clean uptrend. SAR above + price below EMA + bearish RSI = clean downtrend. Treat SAR as a confirmation tool and exit guide, not a standalone entry signal.`,
    diagram: "parabolic-sar-guide",
  }),

  A({
    slug: "fractals-indicator-guide",
    title: "Fractals Indicator: How to Use It to Identify Market Turning Points",
    category: "Technical Analysis",
    excerpt:
      "Fractals highlight potential reversal points on a chart by identifying swing highs and swing lows. They are one of the simplest yet most effective tools for confirming support and resistance.",
    readTime: "6 min",
    publishedAt: "2025-06-14",
    relatedPairs: ["eurusd", "xauusd"],
    relatedSlugs: ["support-and-resistance", "technical-analysis-indicators"],
    keyTakeaway:
      "A fractal arrow below a candle marks a swing low (BUY zone). Above a candle marks a swing high (SELL zone). Both at once = NEUTRAL. Use fractals to map structure objectively.",
    faqs: [
      { q: "What is the Fractals indicator?", a: "The Fractals indicator marks swing high and swing low points on a chart using arrows. An upward arrow marks a potential resistance (sell) point; a downward arrow marks potential support (buy)." },
      { q: "How do I use Fractals for a buy signal?", a: "A BUY signal is indicated when a Fractal arrow appears BELOW the candlestick, identifying a swing low and potential support zone." },
      { q: "How do I use Fractals for a sell signal?", a: "A SELL signal is indicated when a Fractal arrow appears ABOVE the candlestick, identifying a swing high and potential resistance zone." },
      { q: "What does it mean when two fractals appear on the same candle?", a: "When both an upward and downward Fractal appear on the same candle simultaneously, the signal is NEUTRAL. No trade should be taken — wait for clarity." },
    ],
    body: `Fractals are simple swing markers — a five-candle pattern where the middle candle's high or low exceeds the surrounding four. They print as arrows on the chart, instantly identifying structural pivots.
## What the arrows mean
Arrow below candle = swing low = support zone = BUY bias.
Arrow above candle = swing high = resistance zone = SELL bias.
Both arrows on the same candle = NEUTRAL — structure undefined.
## Building structure with fractals
String consecutive fractals together to map market structure: higher fractal highs and higher fractal lows = uptrend. Lower highs and lower lows = downtrend. A break of the most recent fractal in the trend's direction is continuation; a break against it is potential reversal.
## The two-candle lag
Fractals only confirm two candles after the swing — they are inherently lagging. That is acceptable for structure mapping, but never use a fresh fractal as a same-candle entry trigger.
## Best confluence
Fractal swing low + horizontal support zone + bullish RSI cross of 50 = high-probability long. Fractals are the geometry; oscillators are the timing.`,
    diagram: "fractals-indicator-guide",
  }),

  A({
    slug: "support-and-resistance",
    title: "Support & Resistance: The Backbone of Technical Analysis",
    category: "Technical Analysis",
    excerpt:
      "Support and resistance are the most important concepts in all of technical analysis. Every indicator, every entry, and every exit ultimately comes back to S&R zones.",
    readTime: "10 min",
    publishedAt: "2025-06-15",
    relatedPairs: ["eurusd", "gbpusd", "xauusd"],
    relatedSlugs: ["trendlines-guide", "fibonacci-retracement-guide"],
    keyTakeaway:
      "Support and resistance are zones, not lines. They work because of memory and unfilled orders. Trade the bounce, trade the breakout, and especially trade the retest of a broken level.",
    faqs: [
      { q: "What is support in forex?", a: "Support is a price level where buying pressure is strong enough to prevent the price from falling further. It acts as a floor. When price hits support, a bounce upward is likely." },
      { q: "What is resistance in forex?", a: "Resistance is a price level where selling pressure prevents price from rising further. It acts as a ceiling. When price hits resistance, a pullback is likely." },
      { q: "Can support become resistance?", a: "Yes — this is one of the most important rules in forex. When price breaks below a support level and that level is retested from below, it now acts as resistance (and vice versa)." },
      { q: "Is S&R a line or a zone?", a: "Always a zone, never a single line. Price rarely reverses at an exact pip level. Think of support and resistance as areas spanning several pips where price tends to react." },
    ],
    body: `Support and resistance are price zones where buying or selling interest has repeatedly halted or reversed the market. Every entry, exit, and stop placement ultimately references them.
## Why they work
Memory and unfilled orders. Traders who missed the last bounce place bids at the level; trapped traders exit there at break-even; algorithms target the same obvious zones. The level becomes a self-fulfilling magnet.
## Drawing zones, not lines
Always draw zones — the area between the wick extreme and the body close of the reaction candles. Hairline levels rarely hold to the exact pip. A 10–20 pip zone reflects how price actually behaves.
## Three trades at every level
Bounce — fade price at the zone with a stop just beyond, ideally with a rejection candle as trigger.
Breakout — trade a confirmed close through the zone on expanding momentum.
Retest — wait for the broken level to flip roles and enter on the first pullback. Statistically the strongest of the three.
## The flip rule
Broken support becomes resistance. Broken resistance becomes support. This single principle is responsible for some of the cleanest setups available — and many of the most painful losses for traders who refuse to accept it.`,
    diagram: "support-and-resistance",
  }),

  A({
    slug: "trendlines-guide",
    title: "Trendlines in Forex: How to Draw Them Correctly and Trade Them",
    category: "Technical Analysis",
    excerpt:
      "A trendline is a dynamic form of support and resistance that measures the speed and direction of price movement. Drawing them correctly is one of the most valuable skills in forex.",
    readTime: "8 min",
    publishedAt: "2025-06-16",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["support-and-resistance", "fibonacci-retracement-guide"],
    keyTakeaway:
      "Bullish trendlines connect higher lows. Bearish trendlines connect lower highs. The more touches without a break, the stronger the line. A clean break + retest is one of the highest-probability setups in forex.",
    faqs: [
      { q: "What is a trendline?", a: "A trendline is a straight line drawn along swing lows in an uptrend (or swing highs in a downtrend) to show the direction and speed of price movement." },
      { q: "What are the three types of market in forex?", a: "Bullish (uptrend), Bearish (downtrend), and Consolidating/Ranging (sideways). Trendlines are most effective in trending markets." },
      { q: "How do I draw a bullish trendline?", a: "Connect at least two consecutive higher swing lows with a straight line from left to right in an upward direction. The more touches without a break, the stronger the trendline." },
      { q: "What happens when price breaks a trendline?", a: "A trendline break signals a potential trend change. A bullish trendline broken to the downside with a confirmed close below it suggests the trend may be reversing to bearish." },
    ],
    body: `A trendline is dynamic support or resistance — a diagonal line measuring both the direction and the pace of a market move.
## The three market types
Bullish — higher highs and higher lows. Trendline drawn under the lows.
Bearish — lower highs and lower lows. Trendline drawn over the highs.
Ranging — sideways. Horizontal support and resistance instead of trendlines.
## Drawing rules
Use at least two consecutive swing points. The line must connect lows (uptrend) or highs (downtrend), and price should respect the line on every subsequent touch. Three or more clean touches confirms a high-conviction trendline.
## Trading the line
Bounce: enter on the next touch in the direction of the trend, stop just beyond the line.
Break: a confirmed candle close on the wrong side of the line signals possible trend change.
Retest: after a break, wait for price to return to the broken line — now flipped — and trade the rejection. This is the highest-probability play.
## When trendlines fail
Drawing them with too much wishful thinking. If you need three different versions of the line to keep price respecting it, the trend is over. Be willing to discard a line as readily as you draw one.`,
    diagram: "trendlines-guide",
  }),

  A({
    slug: "fibonacci-retracement-guide",
    title: "Fibonacci Retracement: How to Find Support & Resistance Levels",
    category: "Technical Analysis",
    excerpt:
      "Fibonacci retracement is a tool that uses horizontal lines to indicate where support and resistance are likely to occur. Learn how to draw it correctly and use it for precision entries.",
    readTime: "9 min",
    publishedAt: "2025-06-17",
    relatedPairs: ["eurusd", "xauusd", "gbpusd"],
    relatedSlugs: ["support-and-resistance", "trendlines-guide"],
    keyTakeaway:
      "The Fibonacci 61.8% (golden ratio) is the most respected retracement level in forex. Draw the tool from low to high in uptrends, high to low in downtrends, and wait for price reaction at 38.2%, 50%, or 61.8%.",
    faqs: [
      { q: "What is Fibonacci retracement?", a: "Fibonacci retracement uses horizontal lines at key percentage levels (23.6%, 38.2%, 50%, 61.8%, 78.6%) to identify where price may pull back before continuing the trend." },
      { q: "How do I draw Fibonacci correctly?", a: "Always identify the trend first. For an uptrend: draw from the swing low to the swing high (left to right, bottom to top). For a downtrend: draw from swing high to swing low." },
      { q: "Which Fibonacci level is most important?", a: "The 61.8% level (Golden Ratio) is considered the most significant. Price frequently reverses or finds strong support/resistance at this level." },
      { q: "Can Fibonacci be used for entry points?", a: "Yes. Traders enter long positions when price retraces to the 38.2% or 61.8% levels in an uptrend, placing stop losses just below the swing low for protection." },
    ],
    body: `Fibonacci retracement plots horizontal levels between a swing low and swing high at the percentages 23.6%, 38.2%, 50%, 61.8%, and 78.6%. Price tends to react at these zones with surprising consistency.
## Drawing the tool
Identify the trend first. In an uptrend, draw from the most recent significant swing low up to the swing high. In a downtrend, draw from high down to low. The 0% level sits at the end of the move; 100% at the start.
## The levels that matter
23.6% — shallow pullback, often skipped in strong trends.
38.2% — common pullback in healthy trends.
50% — psychological midpoint (not strictly Fibonacci, but always plotted).
61.8% — the Golden Ratio. The most respected level. Deep pullbacks often terminate here.
78.6% — last-chance level. A break below typically invalidates the original trend.
## How to trade Fib levels
Wait for price to reach a key level (most commonly 50% or 61.8%). Confirm with a reversal candle, a fractal, or RSI hook. Enter in the original trend's direction with a stop beyond the next deeper level.
## Confluence multipliers
A 61.8% retracement landing on a prior support zone with bullish RSI divergence is an A-grade setup. Fibonacci alone is a probability; Fibonacci stacked with structure is a strategy.`,
    diagram: "fibonacci-retracement-guide",
  }),

  A({
    slug: "macd-trading-guide",
    title: "MACD Trading Strategy: Moving Average Convergence Divergence",
    category: "Technical Analysis",
    excerpt:
      "MACD is one of the most widely used momentum indicators in forex. It uses two exponential moving averages and a histogram to generate trend-following signals.",
    readTime: "9 min",
    publishedAt: "2025-06-18",
    relatedPairs: ["eurusd", "gbpusd", "usdjpy"],
    relatedSlugs: ["moving-average-strategy", "technical-analysis-indicators"],
    keyTakeaway:
      "MACD line crossing above signal line = BUY; crossing below = SELL. The histogram shows momentum strength: green and growing = bullish acceleration; red and growing = bearish.",
    faqs: [
      { q: "What does MACD stand for?", a: "MACD stands for Moving Average Convergence Divergence. It measures the relationship between two exponential moving averages (12-day and 26-day EMA)." },
      { q: "How do I read a MACD buy signal?", a: "A BUY signal occurs when the MACD main line (black) crosses ABOVE the signal line (red, 9-day). The histogram turns green, indicating increasing bullish momentum." },
      { q: "How do I read a MACD sell signal?", a: "A SELL signal occurs when the MACD line crosses BELOW the signal line. The histogram turns red, indicating increasing bearish momentum." },
      { q: "What is the MACD histogram?", a: "The histogram visualises the distance between the MACD line and the signal line. Green bars = bullish momentum building. Red bars = bearish momentum building. Shrinking bars = momentum weakening." },
    ],
    body: `MACD combines three elements: a MACD line (12-EMA minus 26-EMA), a signal line (9-EMA of the MACD line), and a histogram (the gap between the two). Together they map momentum changes with rare clarity.
## Reading the cross
BUY: MACD line crosses above signal line. Histogram turns green and starts growing.
SELL: MACD line crosses below signal line. Histogram turns red.
The further from the zero line, the stronger the trend; crosses near zero are early signals, crosses far from zero are continuations.
## The histogram as momentum gauge
Histogram bars growing in size = momentum accelerating. Bars shrinking = momentum weakening, often before price actually reverses. Shrinking green bars in an uptrend are an early warning to tighten stops.
## Divergence — the hidden power
Price prints a new high but MACD prints a lower high = bearish divergence. Price prints a new low but MACD prints a higher low = bullish divergence. Treat divergence as a warning, not an entry signal — confirm with structure and a reversal candle.
## Best confluence
MACD bullish cross + price above 50 EMA + bullish candlestick at support = A-grade long. MACD without context is noise; MACD with structure is a strategy.`,
    diagram: "macd-trading-guide",
  }),

  A({
    slug: "ichimoku-cloud-guide",
    title: "Ichimoku Cloud: A Complete Guide to All 5 Lines and the Cloud",
    category: "Technical Analysis",
    excerpt:
      'The Ichimoku Cloud ("a glance at the chart in balance") is one of the most comprehensive indicators in forex. It shows trend, momentum, support, resistance, and direction in a single view.',
    readTime: "12 min",
    publishedAt: "2025-06-19",
    relatedPairs: ["eurusd", "gbpusd", "usdjpy"],
    relatedSlugs: ["technical-analysis-indicators", "support-and-resistance"],
    keyTakeaway:
      "Ichimoku's Kumo cloud is the master bias: above it = longs only, below it = shorts only, inside it = no trade. Tenkan crossing Kijun adds the timing trigger.",
    faqs: [
      { q: "What are the 5 lines of Ichimoku?", a: "Tenkan-sen (fast MA), Kijun-sen (slow MA), Senkou Span A (cloud boundary), Senkou Span B (cloud boundary), and Chikou Span (lagging line placed 26 candles behind price)." },
      { q: "What does the Ichimoku cloud tell you?", a: "The cloud (Kumo) is the most important element. If price is above the cloud, only long (BUY) trades are allowed. If below, only short (SELL) trades. If inside, no trades." },
      { q: "How do I get an Ichimoku buy signal?", a: "Three conditions for a strong BUY: (1) Price is above the cloud, (2) Chikou Span is above the cloud, and (3) Tenkan-sen crosses above Kijun-sen." },
      { q: "What is the Chikou Span?", a: "The Chikou Span is the closing price plotted 26 candles back. It is optional but adds confirmation. For longs, it must be above the cloud. For shorts, below." },
    ],
    body: `Ichimoku Kinko Hyo — "a glance at the chart in balance" — packs trend, momentum, and support/resistance into one overlay. Despite its complexity, it can be reduced to a handful of clear rules.
## The 5 lines
Tenkan-sen — fast MA (9 periods).
Kijun-sen — slow MA (26 periods).
Senkou Span A — leading cloud boundary, average of Tenkan + Kijun, plotted 26 candles ahead.
Senkou Span B — leading cloud boundary, mid-point of last 52 highs and lows, plotted 26 ahead.
Chikou Span — current close, plotted 26 candles back.
## The Kumo cloud — master bias filter
The space between Span A and Span B forms the Kumo. Price above the cloud = bullish regime, long-only. Below = bearish regime, short-only. Inside the cloud = no-trade zone. This single rule out-performs most full strategies in trending markets.
## The buy/sell trigger
Once the cloud bias is set, wait for Tenkan to cross Kijun in the same direction. Above-cloud + Tenkan-over-Kijun crossover = high-conviction long. Below-cloud + Tenkan-under-Kijun = high-conviction short.
## The Chikou check
The lagging line should be in clear space — above the cloud for longs, below for shorts. If the Chikou is buried inside price action 26 candles ago, skip the trade. It is the difference between a B-grade and an A-grade Ichimoku setup.`,
    diagram: "ichimoku-cloud-guide",
  }),

  A({
    slug: "fundamental-analysis-forex",
    title: "Fundamental Analysis in Forex: How News Moves the Market",
    category: "Fundamental Analysis",
    excerpt:
      "Fundamental analysis studies economic news and events to predict currency movements. It overrides technical analysis — learn the key events every trader must watch.",
    readTime: "9 min",
    publishedAt: "2025-06-20",
    relatedPairs: ["eurusd", "usdjpy", "gbpusd"],
    relatedSlugs: ["what-is-nfp", "the-fort-method"],
    keyTakeaway:
      "Fundamentals overrule technicals. Always check the economic calendar before placing any trade. Interest rates, inflation, employment, and central-bank commentary are the four forces moving currencies.",
    faqs: [
      { q: "What is fundamental analysis in forex?", a: "Fundamental analysis is the use of economic data, news events, and geopolitical developments to predict how currency values will move in the market." },
      { q: "Does fundamental analysis override technical analysis?", a: "Yes. Fundamental analysis overrides technical analysis. Even if all your indicators say BUY, a high-impact negative news event for that currency will move the market against your technical signal." },
      { q: "Where can I find forex news?", a: "Key sources: ForexFactory.com (economic calendar), Bloomberg.com, Investing.com, FXStreet.com, MarketWatch.com, and TradingView.com." },
      { q: "What is the most important news event in forex?", a: "NFP (Non-Farm Payrolls) is widely considered the most market-moving event. Released every first Friday of the month, it measures US employment and causes high volatility across all USD pairs." },
    ],
    body: `Fundamental analysis studies the economic forces that move currency values: interest rates, inflation, growth, employment, and geopolitical risk. Where technicals describe what price is doing, fundamentals explain why.
## The four primary drivers
Interest rates — capital chases yield. Higher rates relative to peers strengthen a currency.
Inflation — eroding purchasing power forces central-bank response.
Growth — GDP and PMIs reveal which economies are expanding.
Risk sentiment — in risk-off episodes, capital floods to USD, JPY, CHF regardless of fundamentals.
## Why fundamentals overrule technicals
A textbook bullish setup means nothing if NFP prints in 30 minutes. High-impact news can move pairs 100+ pips against the cleanest chart pattern. Always check the calendar first; let fundamentals veto trades, not create them.
## Where to track news
ForexFactory's economic calendar is the standard. Filter to high-impact (red folder) events for your traded currencies. Bloomberg, Investing.com, and Reuters cover the geopolitical context that makes those data points move.
## The five reports that matter most
Central bank rate decisions · CPI inflation · NFP (US employment) · PMI surveys · GDP. Mark them in your trading calendar and reduce or flatten positions around them.`,
  }),

  A({
    slug: "what-is-nfp",
    title: "What Is NFP in Forex? Non-Farm Payrolls Explained",
    category: "Fundamental Analysis",
    excerpt:
      "Non-Farm Payrolls (NFP) is the single most volatile news event in forex. Released every first Friday of the month, it moves every USD pair — sometimes hundreds of pips in minutes.",
    readTime: "7 min",
    publishedAt: "2025-06-21",
    relatedPairs: ["eurusd", "gbpusd", "usdjpy"],
    relatedSlugs: ["fundamental-analysis-forex", "the-fort-method"],
    keyTakeaway:
      "NFP is released on the first Friday of every month at 13:30 UTC. It moves every USD pair. Beginners should stay flat 30 minutes before and after; experienced traders use very tight risk.",
    faqs: [
      { q: "What is NFP?", a: "NFP stands for Non-Farm Payrolls. It measures the total number of paid workers in the US economy excluding farm workers, government employees, and non-profit organisation employees." },
      { q: "When is NFP released?", a: "NFP is released at 13:30 UTC on the first Friday of every month by the US Bureau of Labor Statistics. Mark this date in your trading calendar every month." },
      { q: "How does NFP affect forex?", a: "A higher-than-expected NFP reading strengthens the USD (EURUSD falls, USDJPY rises). A lower-than-expected reading weakens USD. The market is always highly volatile around NFP." },
      { q: "Should I trade during NFP?", a: "Beginners should avoid trading 30 minutes before and after NFP. Experienced traders may trade the news but must use very tight risk management due to extreme volatility and spread widening." },
    ],
    body: `Non-Farm Payrolls measures US employment change excluding farms, government, and non-profits. Released by the Bureau of Labor Statistics on the first Friday of every month at 13:30 UTC, it is the single most market-moving release in forex.
## Why NFP moves the market
Employment drives Federal Reserve policy. A hot NFP raises the odds of higher rates, strengthening USD; a cold NFP raises the odds of cuts, weakening it. Every USD pair reprices simultaneously when the number drops.
## The mechanics of the move
The first move is algorithmic and frequently wrong. Spreads can blow from 1 pip to 20+ for the first 30 seconds. Stops are routinely hunted. The "real" direction often emerges 15–30 minutes later, after revisions and internals (wage growth, participation rate) are absorbed.
## The TheFortFX NFP rule
Beginner: stay flat 30 minutes before and 30 minutes after. The risk of an outsized spread spike taking out a tight stop is not worth any signal.
Intermediate: trade only the confirmed direction after the first 30 minutes, with reduced size and wider stops.
Advanced: trade the news using straddle pending orders, but never on more than 25% of normal position size.
## Beyond NFP
NFP gets the headlines, but CPI, FOMC, and major central-bank press conferences move markets just as hard. Apply the same flat-or-tight discipline to every high-impact red-folder release.`,
  }),

  A({
    slug: "pending-orders-guide",
    title: "Pending Orders in Forex: Buy Stop, Buy Limit, Sell Stop & Sell Limit",
    category: "Forex Basics",
    excerpt:
      "Pending orders let you enter trades automatically when price reaches a specific level — without sitting at your screen. Learn the four order types and exactly when to use each one.",
    readTime: "8 min",
    publishedAt: "2025-06-22",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["stop-loss-and-take-profit", "types-of-traders"],
    keyTakeaway:
      "Buy Stop = breakout buy above price. Sell Stop = breakdown sell below price. Buy Limit = buy at support below price. Sell Limit = sell at resistance above price.",
    faqs: [
      { q: "What is a Buy Stop order?", a: "A Buy Stop is placed ABOVE the current market price. It executes when price rises to that level — used when you expect a breakout above resistance." },
      { q: "What is a Buy Limit order?", a: "A Buy Limit is placed BELOW the current market price. It executes when price falls to that level — used when you expect price to dip to a support level before continuing upward." },
      { q: "What is a Sell Stop order?", a: "A Sell Stop is placed BELOW the current market price. It executes when price falls to that level — used when you expect a breakdown below support." },
      { q: "What is a Sell Limit order?", a: "A Sell Limit is placed ABOVE the current market price. It executes when price rises to that level — used when you expect price to hit a resistance level before reversing downward." },
    ],
    body: `Pending orders let you automate trade entry at a specific price level. The four types differ by direction (buy or sell) and by intent (breakout or reversal).
## The four orders
Buy Stop — placed ABOVE current price. Fires when price rises to it. Used to catch a breakout above resistance.
Sell Limit — placed ABOVE current price. Fires when price rises to it. Used to fade a rally at resistance.
Buy Limit — placed BELOW current price. Fires when price falls to it. Used to buy a dip into support.
Sell Stop — placed BELOW current price. Fires when price falls to it. Used to catch a breakdown below support.
## Memorising them
Stop orders catch momentum (buy higher / sell lower). Limit orders catch reversals (buy lower / sell higher). The word "Stop" implies follow-through; "Limit" implies the level holding.
## When to use each
Buy Stop — pending breakout above a confirmed resistance zone.
Sell Stop — pending breakdown below a confirmed support zone.
Buy Limit — buy-the-dip into untested support during a healthy uptrend.
Sell Limit — sell-the-rally into untested resistance during a healthy downtrend.
## Why use pending orders at all
You stop missing setups while you sleep, eat, or work. You also remove the impulse element — the trade either triggers at your plan price or it doesn't, with no room for emotional adjustment.`,
    diagram: "pending-orders-guide",
  }),

  A({
    slug: "types-of-traders",
    title: "Types of Forex Traders: Which Trading Style Suits You?",
    category: "Trading Psychology",
    excerpt:
      "Your trading style determines your timeframe, strategy, and risk approach. Understanding the four trader types helps you choose the method that matches your personality and lifestyle.",
    readTime: "6 min",
    publishedAt: "2025-06-23",
    relatedPairs: ["eurusd", "gbpusd"],
    relatedSlugs: ["forex-money-management-rules", "the-fort-method"],
    keyTakeaway:
      "There is no single best trading style. Position, swing, intraday, and scalping each suit different personalities and schedules. Pick the one that matches your life — not the one that sounds glamorous.",
    faqs: [
      { q: "What is a position trader?", a: "Position traders hold trades for weeks, months, or even the entire year. They focus on macro trends and fundamental analysis, ignoring short-term price noise." },
      { q: "What is an intraday trader?", a: "Intraday traders (day traders) open and close all trades within the same trading day. They never hold positions overnight." },
      { q: "What is a scalper in forex?", a: "Scalpers take very small profits (sometimes $2-5 per trade) very quickly, often closing within minutes of opening. They rely on high frequency and tight spreads." },
      { q: "What is a swing trader?", a: "Swing traders hold positions for 3 days to 3 weeks, capturing medium-term price swings. This style suits people who cannot monitor charts all day." },
    ],
    body: `There are four primary trading styles in forex, separated by holding period. None is better than the others — the right one is the one your personality and schedule can actually sustain.
## Position trader
Holds trades for weeks to months. Focuses on macro fundamentals and weekly chart structure. Requires deep patience, low screen time, and the willingness to ride significant drawdowns. Best for traders with day jobs and long horizons.
## Swing trader
Holds 3 days to 3 weeks. Uses daily and 4-hour charts. The most popular style for retail because it balances opportunity with manageable screen time. Best for traders with 1–2 hours per day.
## Intraday trader
Opens and closes every position within a single day. Uses 1-hour and 15-minute charts. Requires dedicated session time during London or New York. Demands discipline to walk away once daily target is hit.
## Scalper
Holds positions seconds to minutes, targeting 5–10 pips per trade and trading dozens of times per session. Requires lightning-tight spreads, fast execution, and intense focus. The highest-pressure style — and the most expensive to run.
## How to choose
Match style to schedule and temperament. If you cannot watch charts during London hours, you cannot scalp. If you cannot stomach a -200 pip drawdown for two weeks, you cannot position-trade. Pick what fits your life, then commit.`,
  }),

  A({
    slug: "the-fort-method",
    title: "The Fort Method: A 7-Step Multi-Indicator Confluence Strategy",
    category: "Strategies",
    excerpt:
      "The Fort Method is TheFortFX's proprietary trading framework combining fundamental analysis, multi-indicator confluence, and disciplined risk management into a repeatable 7-step system.",
    readTime: "11 min",
    publishedAt: "2025-06-24",
    relatedPairs: ["eurusd", "gbpusd", "xauusd"],
    relatedSlugs: ["technical-analysis-indicators", "forex-money-management-rules"],
    keyTakeaway:
      "The Fort Method is a 7-step framework: fundamentals → trend → indicators → trade with SL/TP → break-even at +20 → close in profit → winning mentality. It is built for repeatability and survival.",
    faqs: [
      { q: "What is The Fort Method?", a: "The Fort Method is a structured 7-step trading approach that starts with fundamental analysis, confirms with multiple technical indicators, and enforces strict risk and money management rules." },
      { q: "Why check fundamentals first?", a: "Fundamental analysis overrides technical analysis. Checking the news environment first prevents you from entering a technically perfect trade just before a high-impact event destroys it." },
      { q: "What does indicator confluence mean?", a: "Confluence means multiple independent indicators all pointing in the same direction simultaneously. The more indicators that agree, the higher the probability of a successful trade." },
      { q: "What is the winning mentality rule?", a: 'The final step of The Fort Method is mindset: telling yourself "I am here to win" and approaching every trading session with discipline, patience, and emotional control.' },
    ],
    body: `The Fort Method is TheFortFX's proprietary trading framework — a 7-step process designed for traders who want a repeatable system rather than a collection of random setups. It combines fundamentals, technical confluence, and money-management discipline into a single workflow.
## The 7 steps
### Step 1 — Check fundamental analysis
Open ForexFactory, Investing.com, or Bloomberg. Identify all red-folder events for the next 24 hours on the currencies you trade. If a major event is imminent, stand aside. Fundamentals overrule technicals — always.
### Step 2 — Confirm trend and candlestick structure
Drop to the daily and 4-hour chart. Identify the trend (higher highs/lows = bullish; lower highs/lows = bearish; sideways = no trade). Mark the most recent reversal candle.
### Step 3 — Check technical indicators
Apply the confluence stack: Moving Average direction, RSI bias (above or below 50), Stochastic crossover, MACD histogram colour. You need at least three of four agreeing in the same direction.
### Step 4 — Place trade with SL and TP
Set both before entering. Stop loss at logical structure (beyond the last swing). Take profit at the next resistance/support, minimum 1:1.5 risk:reward.
### Step 5 — Monitor; move to break-even at +20 pips
Once the trade is +20 pips in profit, move your stop loss to entry. The trade is now risk-free. This single discipline saves more accounts than any indicator.
### Step 6 — Close the trade in profit
Take the win when the market gives it. Greed is the enemy. If your target hits, close. If structure breaks against you, close. Don't be greedy.
### Step 7 — Winning mentality
The final and hardest step. Approach every session with the mindset "I am here to win." Discipline, patience, and emotional control are not soft skills — they are the highest-leverage edge in trading.
## Why it works
The Fort Method is not the secret to predicting markets — no method is. It is the discipline that lets you survive losing streaks and compound winning ones. Repeat the process. Trust the process. The results follow.`,
    diagram: "the-fort-method",
  }),
];

export const getArticleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug.toLowerCase());

export const articlesForPair = (pairSlug: string) =>
  articles.filter((a) => a.relatedPairs.includes(pairSlug.toLowerCase()));
