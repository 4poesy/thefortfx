// 20 learning-center articles — canonical source for /learn and /learn/[slug].
// `content` uses "## " line prefixes for H2 headings; the article route renders them semantically.
export type ArticleCategory =
  | "Forex Basics"
  | "Technical Analysis"
  | "Fundamental Analysis"
  | "Risk Management"
  | "Trading Psychology"
  | "Strategies";

export interface Article {
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  content: string;
  readTime: string;
  publishedAt: string;
  relatedPairs: string[];
  relatedSlugs: string[];
}

const A = (
  slug: string, title: string, category: ArticleCategory, excerpt: string,
  readTime: string, publishedAt: string, relatedPairs: string[], relatedSlugs: string[], content: string,
): Article => ({ slug, title, category, excerpt, content, readTime, publishedAt, relatedPairs, relatedSlugs });

export const articles: Article[] = [
  A("what-is-a-pip-in-forex", "What Is a Pip in Forex Trading?", "Forex Basics",
    "Pips are the universal unit of price movement in forex. Learn how to read them, calculate their value, and use them to size every trade.",
    "5 min", "Jun 2, 2026", ["eurusd", "gbpusd"], ["what-is-a-lot-in-forex", "position-sizing-the-1-percent-rule", "how-to-read-currency-pairs"],
    `A pip — short for "percentage in point" — is the smallest standardized price move in a currency pair. For most pairs like EUR/USD, one pip equals 0.0001, the fourth decimal place. For yen pairs like USD/JPY, one pip is 0.01, the second decimal place. When EUR/USD rises from 1.0820 to 1.0847, it has moved 27 pips.
## Why pips matter
Pips normalize price movement across instruments with wildly different quotes. Saying "EUR/USD moved 80 pips" communicates the same magnitude of opportunity or risk regardless of where the pair is trading. Brokers quote spreads in pips, stop losses are set in pips, and most risk models are built on pip distances.
## Calculating pip value
Pip value depends on lot size and the quote currency. For one standard lot (100,000 units) of a USD-quoted pair, one pip is worth approximately $10. A mini lot (10,000 units) is worth $1 per pip, and a micro lot (1,000 units) is $0.10. For non-USD quote currencies, convert at the current exchange rate — or skip the arithmetic entirely with our free pip calculator.
## Pips vs. pipettes
Most modern brokers quote an extra decimal — the pipette, or tenth of a pip. EUR/USD at 1.08473 shows 3 pipettes past the 1.0847 level. Always confirm which convention your platform uses before placing tight stops, because confusing pips with pipettes inflates or shrinks your risk tenfold.`),

  A("what-is-a-lot-in-forex", "Lot Sizes Explained: Standard, Mini, and Micro Lots", "Forex Basics",
    "Lot size determines how much each pip is worth — and how much you can lose. Master the three lot types before you place your next trade.",
    "6 min", "May 30, 2026", ["eurusd", "usdjpy"], ["what-is-a-pip-in-forex", "position-sizing-the-1-percent-rule"],
    `A lot is the standardized quantity of currency you buy or sell in a forex transaction. A standard lot is 100,000 units of the base currency, a mini lot is 10,000 units, and a micro lot is 1,000 units. The lot size you choose directly scales both your profit potential and your risk.
## How lot size connects to risk
With one standard lot of EUR/USD, every pip of movement is worth roughly $10. A 50-pip stop loss therefore risks about $500. The same trade with a micro lot risks just $5. Most blown accounts are not the result of bad analysis — they are the result of trading lot sizes far too large for the account balance.
## Choosing the right size
Professional sizing works backward from risk: decide the dollar amount you are willing to lose (commonly 1% of the account), divide it by the stop distance in pips, then divide by the pip value per lot. A $5,000 account risking 1% ($50) with a 25-pip stop should trade $50 ÷ 25 ÷ $10 = 0.20 lots.
## Fractional lots
Modern platforms let you trade in increments of 0.01 lots, so there is no excuse for rounding up risk. Use our position size calculator to get the exact figure for any pair and account currency in seconds.`),

  A("how-to-read-currency-pairs", "How to Read Currency Pairs: Base, Quote, and Spreads", "Forex Basics",
    "EUR/USD 1.0847 — what does that number actually mean? Decode base and quote currencies, bid/ask pricing, and the true cost of the spread.",
    "7 min", "May 26, 2026", ["eurusd", "gbpjpy"], ["what-is-a-pip-in-forex", "what-moves-the-forex-market"],
    `Every forex quote has two parts: the base currency (first) and the quote currency (second). EUR/USD at 1.0847 means one euro buys 1.0847 US dollars. Buying the pair means buying euros and selling dollars; selling the pair means the opposite.
## Bid, ask, and the spread
Brokers show two prices: the bid (where you can sell) and the ask (where you can buy). The difference is the spread — your immediate cost of entry. Major pairs like EUR/USD carry spreads of 0.1–1.0 pips at quality brokers, while exotic pairs like USD/ZAR can be 20 pips or more. A trade starts at a loss equal to the spread, which is why high-frequency strategies live or die on broker pricing.
## Majors, crosses, and exotics
Majors pair the US dollar with another G10 currency and carry the deepest liquidity. Crosses like EUR/GBP or GBP/JPY exclude the dollar and often trend more cleanly because they isolate two economies. Exotics pair a major with an emerging-market currency — higher volatility, wider spreads, and more political risk.
## Reading direction like a professional
Always ask: which economy is this quote really about today? USD/JPY rising could mean dollar strength or yen weakness — and the trade implications differ. Cross-checking correlated pairs (EUR/USD versus GBP/USD, for example) reveals whether a move is dollar-driven or idiosyncratic.`),

  A("what-moves-the-forex-market", "What Moves the Forex Market? The Five Core Drivers", "Forex Basics",
    "Interest rates, growth, inflation, risk sentiment, and flows — the five forces behind every major currency move, explained in plain language.",
    "8 min", "May 22, 2026", ["eurusd", "usdjpy", "audjpy"], ["how-central-banks-move-markets", "trading-the-economic-calendar"],
    `Currencies move because capital moves. Money flows toward economies offering better risk-adjusted returns, and five forces govern those flows.
## 1. Interest rate differentials
The single biggest driver. Capital chases yield, so a central bank raising rates while others hold typically strengthens its currency. Watch the expected path of rates, not just the current level — markets price the future.
## 2. Economic growth
Strong growth attracts investment and eventually forces rates higher. GDP, PMIs, and employment data are the scoreboard. Surprises against consensus expectations move markets; in-line prints usually do not.
## 3. Inflation
Inflation erodes a currency's purchasing power but also forces central banks to act. Moderately rising inflation with a responsive central bank is often currency-positive; runaway inflation is decisively negative.
## 4. Risk sentiment
In risk-off episodes, capital floods into the US dollar, Japanese yen, and Swiss franc regardless of fundamentals, while commodity currencies like AUD and NZD sell off. AUD/JPY is the cleanest single-pair barometer of global risk appetite.
## 5. Flows and positioning
Month-end rebalancing, corporate hedging, and crowded speculative positioning create moves with no news catalyst at all. When everyone is already long, there is no one left to buy — which is why extreme positioning often precedes reversals.`),

  A("reading-candlestick-charts", "Reading Candlestick Charts Like a Pro", "Technical Analysis",
    "Candlesticks compress market psychology into four prices. Learn the anatomy, the highest-probability patterns, and the context that makes them work.",
    "10 min", "May 28, 2026", ["eurusd", "xauusd"], ["support-and-resistance-zones", "moving-averages-explained"],
    `Each candlestick records four data points over its interval: open, high, low, and close. The body spans open to close; the wicks mark the extremes. Green (bullish) candles close above their open, red (bearish) candles below. That simple structure encodes the battle between buyers and sellers.
## The patterns that matter
Most named patterns are noise. The handful with genuine statistical edge share one trait: they show rejection. A pin bar (long wick, small body) at a support level shows sellers pushed price down and failed. An engulfing candle shows one side overwhelming the entire prior period's range. Inside bars show compression that precedes expansion.
## Context is everything
A bullish pin bar in the middle of a range is a coin flip. The same candle at a weekly support level, after a pullback within an uptrend, with RSI divergence, is a trade. Candlesticks are the trigger — never the reason. Build the reason from structure, trend, and level first.
## Timeframe hierarchy
Higher-timeframe candles outrank lower ones. A daily hammer at support overrides fifteen minutes of bearish candles inside it. Professionals read the daily and 4-hour charts for bias, then drop to lower timeframes only to refine entry and tighten risk.`),

  A("support-and-resistance-zones", "Support & Resistance: Trading the Levels That Matter", "Technical Analysis",
    "Price doesn't reverse at lines — it reverses at zones. How to draw levels that institutions actually defend, and how to trade the retest.",
    "12 min", "May 20, 2026", ["gbpusd", "eurusd"], ["reading-candlestick-charts", "breakout-trading-strategy"],
    `Support and resistance are price zones where buying or selling interest has repeatedly halted or reversed the market. They work because of memory and unfilled orders: traders who missed the last bounce place bids there; trapped traders exit at breakeven there; algorithms reference the same obvious levels.
## Drawing levels correctly
Use zones, not hairline levels. Mark the area between the wick extreme and the body close of the rejection candles. The more times a zone has produced a reaction — and the more violent those reactions — the more significant it is. Weekly and daily zones outrank intraday ones, and round numbers (1.1000, 150.00) act as psychological magnets.
## The three trades at a level
First: the bounce — fade price at the zone with a stop beyond it, ideally with a rejection candle as trigger. Second: the breakout — trade the close through the zone on expanding momentum. Third, and statistically strongest: the retest — wait for the broken level to flip roles and enter on the first pullback to it.
## When levels fail
A clean break of a major zone is information, not betrayal. Failed support becomes resistance, and the trapped longs exiting on the retest are precisely what fuels the continuation. Trade the level that holds; trade the retest of the level that breaks.`),

  A("moving-averages-explained", "Moving Averages: The 50, 100, and 200 EMA Playbook", "Technical Analysis",
    "Moving averages define trend, dynamic support, and momentum in one indicator. Here's how professionals actually use the 50/100/200 EMAs.",
    "9 min", "May 16, 2026", ["usdjpy", "eurusd"], ["rsi-divergence-trading", "trend-following-vs-mean-reversion"],
    `A moving average smooths price into a single line, filtering noise and exposing trend. The exponential moving average (EMA) weights recent prices more heavily than the simple moving average (SMA), making it more responsive — the standard choice for most forex traders.
## The three EMAs that matter
The 200 EMA is the institutional dividing line: price above it is a bull market, below it a bear market, and many funds are mandated around it. The 50 EMA tracks the intermediate trend and acts as dynamic support in healthy trends. The 100 EMA sits between, often catching deeper pullbacks that the 50 misses.
## Practical applications
Trend filter: only take longs above the 200 EMA, shorts below — this single rule removes most counter-trend losses. Dynamic entries: in strong trends, the first touch of the 50 EMA after a breakout is a high-probability continuation entry. Regime detection: a flat, intertwined EMA stack signals a range, where trend strategies should be switched off.
## The golden cross myth
Crossover signals (50 crossing the 200) make headlines but lag badly — the move is often half over by the time they print. Use EMA location and slope for context, structure and candlesticks for timing. The averages tell you what kind of market you are in; they should rarely be your entry trigger.`),

  A("rsi-divergence-trading", "RSI Divergence: Spotting Reversals Before They Happen", "Technical Analysis",
    "When price makes a new extreme but RSI doesn't, momentum is dying. How to trade regular and hidden divergence with proper confirmation.",
    "8 min", "May 12, 2026", ["xauusd", "btcusd"], ["moving-averages-explained", "reading-candlestick-charts"],
    `The Relative Strength Index measures the speed of price changes on a 0–100 scale. The textbook reading — overbought above 70, oversold below 30 — is also the most misused: in strong trends, RSI can stay overbought for weeks while price doubles. The professional application is divergence.
## Regular divergence
When price prints a higher high but RSI prints a lower high, the move is being driven by less momentum than the previous push — buyers are exhausting. Bearish divergence at resistance, or bullish divergence at support (lower price low, higher RSI low), flags conditions for reversal. Note the wording: conditions, not signal.
## Hidden divergence
The continuation cousin. In an uptrend, price makes a higher low while RSI makes a lower low — momentum reset deeply but price held structure. Hidden divergence confirms trend strength and marks some of the best pullback entries available.
## Confirmation rules
Divergence alone fails constantly, because momentum can rebuild. Require three things: divergence at a meaningful level (not mid-range), a reversal candle or structure break as trigger, and a stop beyond the extreme. Treat divergence as the warning light, the level as the location, and price action as the green light.`),

  A("how-central-banks-move-markets", "How Central Banks Move the Forex Market", "Fundamental Analysis",
    "The Fed, ECB, BoE, and BoJ set the gravitational field every currency moves in. Understand rate decisions, guidance, and QE to trade the macro tide.",
    "9 min", "May 14, 2026", ["eurusd", "usdjpy"], ["trading-the-economic-calendar", "what-moves-the-forex-market"],
    `Central banks are the most powerful actors in foreign exchange. By setting interest rates and controlling money supply, they determine the fundamental yield of holding each currency — and markets reprice that yield continuously.
## The policy toolkit
Rate decisions are the headline tool: higher rates attract capital, strengthening the currency. Quantitative easing expands money supply and typically weakens it. Forward guidance — the language about future policy — frequently moves markets more than the action itself, because traders price the path, not the present.
## Reading a central bank decision
Markets care about surprises relative to expectations. A hike that was 100% priced in can produce a "sell the fact" decline. The tradeable information lives in the statement changes, the vote split, updated projections, and the press conference. A "hawkish cut" (easing now, signaling caution ahead) can strengthen a currency.
## Policy divergence trades
The cleanest macro trends come from divergence: one central bank hiking while another cuts. The 2021–2023 Fed cycle against the lagging BoJ drove USD/JPY from 103 to above 150 — a once-a-decade divergence trend. Track relative expectations through interest-rate futures, and remember intervention risk grows as moves extend.`),

  A("trading-the-economic-calendar", "Trading the Economic Calendar: NFP, CPI, and Rate Days", "Fundamental Analysis",
    "High-impact data releases create the fastest moves in forex. How to prepare for them, trade them — or wisely stand aside.",
    "8 min", "May 8, 2026", ["eurusd", "gbpusd"], ["how-central-banks-move-markets", "managing-drawdowns"],
    `A handful of scheduled releases produce most of the forex market's sharpest moves: US Non-Farm Payrolls, CPI inflation prints, and central bank rate decisions. Each compresses enormous information into a single timestamp — and spreads, slippage, and whipsaws spike around it.
## Before the release
Know the consensus forecast and the "whisper" range. The market reaction is driven by the deviation from expectations, not the absolute number. Mark the release times in your timezone, flatten or reduce positions in affected pairs, and never hold a tight-stopped trade through a high-impact print — the spread alone can take you out.
## The reaction, not the number
The first move is often algorithmic and wrong. NFP regularly produces a spike in one direction followed by a full reversal within thirty minutes as revisions and internals (wage growth, participation) get digested. Experienced traders let the first 15–30 minutes burn off, then trade the confirmed direction with structure.
## The stand-aside edge
Choosing not to trade an event is a position. Most consistent traders earn their results between events, in clean technical conditions, and treat red-folder releases as risk to be managed rather than opportunity to be chased. Check the calendar every morning; let it veto your trades, not create them.`),

  A("yield-differentials-and-carry", "Yield Differentials and the Carry Trade", "Fundamental Analysis",
    "Borrow cheap, lend dear: the carry trade has driven decade-long currency trends. How interest differentials create flows — and when carry unwinds turn violent.",
    "7 min", "May 4, 2026", ["usdjpy", "usdmxn"], ["how-central-banks-move-markets", "what-moves-the-forex-market"],
    `The carry trade is the practice of borrowing a low-yield currency to buy a high-yield one, pocketing the interest differential. When the gap is wide — like Mexican peso rates near 11% against Japanese rates near zero — the daily swap payments alone can return double digits annually, before any price appreciation.
## Why carry shapes trends
Carry flows are persistent. Pension funds, hedge funds, and retail traders all accumulate the same positions for months, producing the slow, grinding uptrends typical of high-yielders like USD/MXN or, historically, AUD/JPY. The funding currencies (JPY, CHF) stay structurally weak while the regime lasts.
## The unwind problem
Carry profits accrue slowly and evaporate instantly. When risk-off hits, everyone exits the same crowded trade at once: high-yielders crash and funding currencies spike in hours. The yen strengthening 5% in a week is almost always a carry unwind. The asymmetry — "picking up pennies in front of a steamroller" — demands wide stops, small size, and respect for volatility regimes.
## Trading it practically
Check your broker's swap rates: being long the high-yielder earns you the differential nightly, and positive carry cushions patient positions. Align carry direction with technical trend, and de-risk when volatility indices climb — carry only works while the world is calm.`),

  A("position-sizing-the-1-percent-rule", "Position Sizing: The 1% Rule and Beyond", "Risk Management",
    "No edge survives bad sizing. The 1% rule, the math behind it, and how to compute exact lot sizes for every trade in seconds.",
    "7 min", "May 10, 2026", ["eurusd"], ["risk-reward-ratios-explained", "managing-drawdowns", "what-is-a-lot-in-forex"],
    `The 1% rule states that no single trade should risk more than 1% of your account. It is the most important rule in trading — not because any one trade matters, but because survival across hundreds of trades is what lets an edge compound.
## The math of ruin
Losing streaks are statistically inevitable. A strategy with a 50% win rate will produce ten consecutive losses roughly once every thousand sequences. At 1% risk, that streak costs about 9.6% of the account — uncomfortable but survivable. At 5% risk, the same streak costs 40%, and at 10% it is functionally game over, because a 65% drawdown requires a 186% gain just to recover.
## Calculating size correctly
Three inputs: account balance, risk percentage, and stop distance in pips. Risk dollars = balance × 1%. Lot size = risk dollars ÷ (stop pips × pip value per lot). A $10,000 account risking $100 with a 40-pip stop on EUR/USD trades $100 ÷ (40 × $10) = 0.25 lots. The stop distance comes from the chart — the sizing adapts to it, never the reverse.
## Beyond the flat 1%
Experienced traders scale risk with conviction and conditions: 0.5% for B-setups, 1% for A-setups, reduced risk during drawdowns and around major events. What never changes is that the size is calculated before entry — not felt.`),

  A("risk-reward-ratios-explained", "Why Risk/Reward Ratios Matter More Than Win Rate", "Risk Management",
    "A 40% win rate at 1:3 beats a 70% win rate at 1:0.5. The expectancy math every trader must internalize before chasing accuracy.",
    "6 min", "Apr 22, 2026", ["gbpusd"], ["position-sizing-the-1-percent-rule", "building-a-trading-plan"],
    `Beginners obsess over win rate. Professionals obsess over expectancy — the average amount earned per trade over a large sample — and risk/reward is its dominant variable.
## The expectancy formula
Expectancy = (win rate × average win) − (loss rate × average loss). A trader winning 40% of the time with 1:3 risk/reward earns (0.40 × 3R) − (0.60 × 1R) = +0.6R per trade. A trader winning 70% at 1:0.5 earns (0.70 × 0.5R) − (0.30 × 1R) = +0.05R — twelve times less, despite nearly double the accuracy. High win rates feel good; positive expectancy pays.
## Breakeven win rates
Every R:R has a breakeven accuracy: 1:1 needs 50%, 1:2 needs 33.3%, 1:3 needs just 25%. This is liberating — at 1:3 you can be wrong three times out of four and still profit. It also exposes the trap of cutting winners early: turning planned 1:3 trades into realized 1:1 trades silently pushes your required win rate from 25% toward 50%.
## Applying it
Reject setups where the realistic target is closer than 1.5–2× the stop distance. Measure targets against structure (the next level), not hope. And track your realized R:R, not your planned one — the gap between the two is usually where an account's edge leaks away.`),

  A("managing-drawdowns", "Managing Drawdowns: Surviving the Inevitable Losing Streak", "Risk Management",
    "Every trader draws down. The difference between professionals and casualties is what they do at -5%, -10%, and -20%.",
    "8 min", "Apr 18, 2026", ["xauusd"], ["position-sizing-the-1-percent-rule", "the-psychology-of-losing-trades"],
    `A drawdown is the decline from your account's peak to its lowest subsequent point. It is not a sign of failure — it is the operating cost of running any strategy. What is optional is whether a normal drawdown becomes a terminal one.
## The recovery asymmetry
Losses compound against you geometrically. A 10% drawdown needs 11% to recover, 25% needs 33%, and 50% needs 100%. This asymmetry is the entire argument for small per-trade risk: keeping individual losses near 1% keeps even bad streaks inside the zone where normal trading can recover them.
## Drawdown protocols
Decide the rules before you need them. A common professional framework: at 5% down, halve position size. At 10%, stop trading for a defined period and audit the last twenty trades — is the market regime hostile, or is execution slipping? At a 15–20% hard limit, stop entirely and rebuild in a demo or at minimum size. The protocol's job is to remove decision-making from the worst possible moment.
## The psychological trap
The urge to "win it back" with bigger size is the single most destructive impulse in trading — it converts a routine drawdown into account failure. Revenge trading is how 10% losses become 40% losses. Slow recovery through normal process is the only reliable recovery there is.`),

  A("the-psychology-of-losing-trades", "The Psychology of Losing Trades", "Trading Psychology",
    "Losses are tuition or they are damage — the difference is how you process them. Reframing losing trades as the cost of doing business.",
    "7 min", "Apr 14, 2026", ["eurusd"], ["mastering-trading-discipline", "managing-drawdowns"],
    `Every profitable trader loses constantly. A 55% win rate — excellent by professional standards — still means losing nearly every other trade, forever. The skill that separates durable traders from blown accounts is not avoiding losses; it is processing them without psychological damage.
## Good losses and bad losses
A good loss followed your plan: valid setup, correct size, stop honored. It is the known, budgeted cost of accessing your edge — a casino doesn't mourn paying out one hand of blackjack. A bad loss broke process: oversized, chased, stop widened mid-trade. Track the two separately; only bad losses deserve review of you, while good losses deserve review of nothing.
## The cognitive traps
Loss aversion makes losses hurt roughly twice as much as equivalent wins feel good, which drives stop-pulling and premature profit-taking. Recency bias makes three losses feel like a broken strategy when the sample proves nothing. The antidote is thinking in distributions: any single trade is noise; only the next hundred trades mean anything.
## Practical recovery routine
After any loss: log it, grade the process A–F, and take a deliberate pause before the next entry. After three consecutive losses: halve size until a process-grade win resets the count. The goal is to make losses boring — procedural events with paperwork, not emotional events with consequences.`),

  A("mastering-trading-discipline", "Mastering Trading Discipline: Systems Beat Willpower", "Trading Psychology",
    "Discipline isn't a personality trait — it's an environment you design. Checklists, routines, and friction that make the right action the easy one.",
    "9 min", "Apr 10, 2026", ["gbpjpy"], ["the-psychology-of-losing-trades", "building-a-trading-plan"],
    `Most traders know exactly what they should do: trade the plan, honor stops, size correctly, skip marginal setups. The failure is rarely knowledge — it is execution under emotional load. Willpower depletes precisely when markets get interesting, so professionals engineer systems that don't require it.
## Checklists over judgment
A pre-trade checklist converts discretion into verification: trend aligned? Level marked in advance? R:R above 2? Size calculated? News checked? Five yeses or no trade. The checklist's power is that it runs the same on your best day and your worst — judgment doesn't.
## Adding friction to errors
Make destructive actions mechanically harder. Set daily loss limits in the platform so it locks you out rather than asking you to stop yourself. Pre-set order templates with calculated size so oversizing requires deliberate extra steps. Remove the phone app if revenge trading happens there. Behavior follows the path of least resistance — design the path.
## Routines as anchors
A fixed daily structure — same prep sequence, same session windows, same end-of-day review — keeps trading procedural instead of impulsive. The review matters most: grade every trade on process, not outcome. Over months, the graded journal becomes the most honest mirror a trader owns, and the habit of facing it daily is itself the discipline.`),

  A("overtrading-and-fomo", "Overtrading and FOMO: The Silent Account Killers", "Trading Psychology",
    "More trades almost never means more profit. Why fear of missing out drives the worst entries — and the boredom tolerance that fixes it.",
    "6 min", "Apr 6, 2026", ["btcusd"], ["mastering-trading-discipline", "the-psychology-of-losing-trades"],
    `Overtrading is taking positions outside your edge — extra trades driven by boredom, frustration, or the fear of missing a move. Each one carries full costs (spread, risk, attention) with none of the statistical advantage your tested setups provide.
## The FOMO mechanism
Fear of missing out triggers hardest after watching a move happen without you. The brain treats the missed profit as a loss and demands chase-entries to repair it — which is how traders consistently buy tops and sell bottoms. The brutal arithmetic: a missed trade costs exactly nothing, while a chased trade costs real money. There is always another setup; there is not always another account.
## Diagnosing it
Symptoms include rising trade frequency during losing periods, entries you cannot tie to a written setup, positions in pairs you do not normally trade, and trades opened within minutes of a big missed move. Your journal exposes all of it — if frequency is up while win rate is down, you are overtrading.
## The fix
Define a maximum number of trades per day and a fixed list of pairs. Require every entry to map to a named setup from your plan. Institute a mandatory cooling period after any missed move. Elite trading is mostly waiting — the market pays for selectivity, not activity.`),

  A("breakout-trading-strategy", "The London Breakout Strategy, Step by Step", "Strategies",
    "The London open injects the day's biggest volume burst. A complete session-breakout playbook for GBP/USD and EUR/USD with entries, stops, and targets.",
    "8 min", "Apr 28, 2026", ["gbpusd", "eurusd"], ["support-and-resistance-zones", "trend-following-vs-mean-reversion"],
    `The London session handles roughly 35% of global FX volume, and its open at 07:00 GMT routinely sets the direction for the European day. The London breakout strategy captures the expansion move that follows the quiet Asian range.
## The setup
Mark the high and low of the Asian session range (00:00–07:00 GMT) on GBP/USD or EUR/USD. The tighter the range — ideally under 40 pips — the more energy the breakout carries. Skip days where Asia already trended widely or where high-impact UK/EU data lands within the first hour.
## Entry and stop rules
Enter on a 15-minute candle close beyond the range boundary, not on the first tick through it — wick-fakeouts are the strategy's main failure mode. Place the stop at the midpoint of the Asian range, or beyond the opposite boundary for a more conservative version. One entry per direction per day; if both sides stop out, the day is a range day and you are done.
## Targets and management
First target: 1× the Asian range height, where half the position comes off and the stop moves to breakeven. Runner target: the prior day's high/low or the next daily level. Expect roughly 45–55% of breakouts to follow through cleanly — the asymmetric R:R, not the hit rate, is where the strategy's edge lives.`),

  A("trend-following-vs-mean-reversion", "Trend Following vs. Mean Reversion: Picking Your Side", "Strategies",
    "Two opposite philosophies both make money — in different conditions. How to identify the current regime and match your strategy to it.",
    "9 min", "Apr 2, 2026", ["usdjpy", "eurgbp"], ["moving-averages-explained", "breakout-trading-strategy"],
    `Trend following buys strength and sells weakness, betting moves continue. Mean reversion sells strength and buys weakness, betting moves exhaust. Both are profitable across decades; both bleed money when applied in the wrong regime. The real skill is regime recognition.
## How trend strategies work
Trend systems lose small and often — choppy markets stop them out repeatedly — then recover everything in a few outsized winners when a real trend runs. Win rates near 35–45% with average winners 2–4× average losers are typical. They demand psychological tolerance for long losing sequences and the discipline to never cut the rare big winner early.
## How mean reversion works
Reversion systems win small and often, fading extremes back toward an average — typical win rates of 60–75% with modest winners. Their risk is inverted: the rare failure, when an "extreme" keeps extending into a genuine trend, can erase many wins. Hard stops are non-negotiable, because averaging into a runaway move is how reversion traders blow up.
## Reading the regime
EMA structure is the quickest filter: stacked and sloping averages favor trend tactics; flat, braided averages favor fading range extremes. Pair personality matters too — EUR/GBP spends most of its life ranging, while USD/JPY produces some of the cleanest macro trends in the market. Match the tool to the conditions, and be willing to stand aside while the regime is ambiguous.`),

  A("swing-trading-forex", "Swing Trading Forex: A Framework for Part-Time Traders", "Strategies",
    "Hold trades for days, not minutes. The complete swing framework — higher-timeframe bias, pullback entries, and trade management for people with day jobs.",
    "10 min", "Mar 28, 2026", ["eurusd", "xauusd", "audusd"], ["support-and-resistance-zones", "position-sizing-the-1-percent-rule"],
    `Swing trading targets moves lasting two to ten days, built from daily and 4-hour charts. It needs perhaps thirty minutes of analysis per day, making it the most realistic style for traders with full-time jobs — and the style least damaged by spreads, noise, and screen-watching impulses.
## The top-down routine
Weekly chart: identify the macro trend and the major levels. Daily chart: define the directional bias — only longs above structure in uptrends, only shorts below in downtrends. 4-hour chart: wait for a pullback into a marked zone (prior level, 50 EMA, or 38–62% retracement) and a rejection signal to trigger entry. The entire decision happens at most once a day, after the daily close.
## Managing trades you can't watch
Every order is bracketed at entry: stop beyond the swing point, first target at the nearest opposing level, runner toward the weekly objective. Set alerts, not vigils. Move the stop only at meaningful structure — trailing too tight is the most common way swing traders convert winners into scratches.
## Realistic expectations
Two to five quality setups per week across a watchlist of six to ten pairs is normal. A disciplined swing book risking 1% per trade with realized R:R near 1:2 and a 45% win rate compounds roughly 2–4% monthly — unspectacular weekly, transformative annually. The edge is patience, which is exactly what most market participants cannot supply.`),
];

export const getArticleBySlug = (slug: string) => articles.find((a) => a.slug === slug.toLowerCase());

export const articlesForPair = (pairSlug: string) =>
  articles.filter((a) => a.relatedPairs.includes(pairSlug.toLowerCase()));
