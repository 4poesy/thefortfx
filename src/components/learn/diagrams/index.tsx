// 15 SVG diagrams for the TheFortFX Learning Center.
// Tokens: bg #0B0F19 / surface #111827 / border #1F2937 / text #FFFFFF / mute #D1D5DB
// Accents: green #22C55E / red #EF4444 / blue #3B82F6 / amber #F59E0B / yellow #FACC15
// Each diagram is fully self-contained, responsive (viewBox + width=100%), and dark-theme ready.

import type { ReactNode } from "react";

const T = {
  bg: "#0B0F19",
  surface: "#111827",
  border: "#1F2937",
  grid: "#1F2937",
  text: "#FFFFFF",
  mute: "#D1D5DB",
  green: "#22C55E",
  red: "#EF4444",
  blue: "#3B82F6",
  amber: "#F59E0B",
  yellow: "#FACC15",
  gray: "#6B7280",
};

function Frame({ w, h, children, label }: { w: number; h: number; children: ReactNode; label: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-[#0B0F19]">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label={label} className="block">
        <rect width={w} height={h} fill={T.bg} />
        {children}
      </svg>
    </figure>
  );
}

// 1 ─ Candlestick anatomy
export function CandlestickDiagram() {
  const w = 700, h = 360;
  const candle = (x: number, openY: number, closeY: number, highY: number, lowY: number, color: string) => (
    <g>
      <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth={2} />
      <rect x={x - 14} y={Math.min(openY, closeY)} width={28} height={Math.max(2, Math.abs(closeY - openY))} fill={color} rx={2} />
    </g>
  );
  return (
    <Frame w={w} h={h} label="Candlestick anatomy: bullish, bearish, and doji examples">
      <text x={24} y={32} fill={T.text} fontSize={18} fontWeight={700}>Anatomy of a Candle</text>
      <text x={24} y={52} fill={T.mute} fontSize={12}>Body = Open ↔ Close · Wicks = High &amp; Low</text>
      {/* Annotated candle */}
      {candle(120, 150, 250, 100, 290, T.green)}
      <line x1={120} y1={100} x2={250} y2={100} stroke={T.gray} strokeDasharray="3 3" />
      <line x1={120} y1={150} x2={250} y2={150} stroke={T.gray} strokeDasharray="3 3" />
      <line x1={120} y1={250} x2={250} y2={250} stroke={T.gray} strokeDasharray="3 3" />
      <line x1={120} y1={290} x2={250} y2={290} stroke={T.gray} strokeDasharray="3 3" />
      <g fill={T.mute} fontSize={11}>
        <text x={258} y={104}>High</text>
        <text x={258} y={154}>Close</text>
        <text x={258} y={254}>Open</text>
        <text x={258} y={294}>Low</text>
      </g>
      <text x={148} y={125} fill={T.green} fontSize={11} fontWeight={600}>Upper wick</text>
      <text x={148} y={210} fill={T.green} fontSize={11} fontWeight={600}>Body</text>
      <text x={148} y={278} fill={T.green} fontSize={11} fontWeight={600}>Lower wick</text>

      {/* Bullish + bearish + doji row */}
      {candle(380, 230, 130, 100, 270, T.green)}
      <text x={358} y={310} fill={T.green} fontSize={12} fontWeight={700}>BULLISH</text>
      <text x={350} y={326} fill={T.mute} fontSize={10}>Close &gt; Open</text>

      {candle(480, 130, 230, 100, 270, T.red)}
      <text x={462} y={310} fill={T.red} fontSize={12} fontWeight={700}>BEARISH</text>
      <text x={454} y={326} fill={T.mute} fontSize={10}>Close &lt; Open</text>

      {/* Doji */}
      <g>
        <line x1={580} y1={120} x2={580} y2={280} stroke={T.mute} strokeWidth={2} />
        <rect x={566} y={196} width={28} height={6} fill={T.mute} />
      </g>
      <text x={562} y={310} fill={T.mute} fontSize={12} fontWeight={700}>DOJI</text>
      <text x={548} y={326} fill={T.mute} fontSize={10}>Open ≈ Close</text>
    </Frame>
  );
}

// 2 ─ Moving Average triple-stack
export function MovingAverageDiagram() {
  const w = 700, h = 360;
  const price = "M40,250 C100,200 140,300 200,260 C260,220 310,140 360,180 C420,220 470,120 530,150 C580,170 620,90 670,110";
  const yellow = "M40,260 C100,210 150,290 210,250 C270,210 320,150 380,190 C430,220 480,130 540,160 C580,180 620,100 670,120";
  const blue = "M40,250 C110,230 170,260 230,240 C290,220 340,180 400,200 C460,220 510,170 560,180 C610,190 640,140 670,150";
  const red = "M40,240 C120,235 180,245 240,235 C300,225 360,210 420,215 C480,220 540,200 600,200 C640,200 660,180 670,180";
  return (
    <Frame w={w} h={h} label="Triple Moving Average system showing buy, sell, and neutral zones">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Triple MA (5 / 10 / 15)</text>
      {/* grid */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={40} y1={60 + i * 50} x2={680} y2={60 + i * 50} stroke={T.grid} strokeWidth={1} />
      ))}
      <path d={price} stroke={T.gray} strokeWidth={1} fill="none" opacity={0.5} />
      <path d={red} stroke={T.red} strokeWidth={2} fill="none" />
      <path d={blue} stroke={T.blue} strokeWidth={2} fill="none" />
      <path d={yellow} stroke={T.yellow} strokeWidth={2.4} fill="none" />

      {/* Zone badges */}
      <g>
        <rect x={140} y={70} width={64} height={22} rx={11} fill={T.green} />
        <text x={172} y={86} textAnchor="middle" fill="#03130a" fontSize={11} fontWeight={700}>BUY</text>
      </g>
      <g>
        <rect x={340} y={70} width={70} height={22} rx={11} fill="#374151" />
        <text x={375} y={86} textAnchor="middle" fill={T.mute} fontSize={11} fontWeight={700}>NEUTRAL</text>
      </g>
      <g>
        <rect x={560} y={70} width={64} height={22} rx={11} fill={T.red} />
        <text x={592} y={86} textAnchor="middle" fill="#1a0606" fontSize={11} fontWeight={700}>SELL</text>
      </g>

      {/* Legend */}
      <g transform={`translate(40 ${h - 26})`} fontSize={11} fill={T.mute}>
        <circle cx={6} cy={-4} r={5} fill={T.yellow} /><text x={18} y={0}>Yellow · Period 5</text>
        <circle cx={156} cy={-4} r={5} fill={T.blue} /><text x={168} y={0}>Blue · Period 10</text>
        <circle cx={306} cy={-4} r={5} fill={T.red} /><text x={318} y={0}>Red · Period 15</text>
      </g>
    </Frame>
  );
}

// 3 ─ Parabolic SAR
export function ParabolicSARDiagram() {
  const w = 700, h = 320;
  return (
    <Frame w={w} h={h} label="Parabolic SAR buy and sell scenarios">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Parabolic SAR — dot position signals direction</text>
      <line x1={w / 2} y1={50} x2={w / 2} y2={h - 30} stroke={T.border} strokeDasharray="4 4" />
      <text x={w / 2} y={h - 14} textAnchor="middle" fill={T.gray} fontSize={11}>Price Reversal</text>

      {/* LEFT: SELL */}
      <text x={86} y={60} fill={T.red} fontSize={13} fontWeight={700}>SAR ABOVE = SELL</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={50 + i * 50} y={140 + i * 14} width={20} height={36 - i * 4} fill={T.red} rx={2} />
          <circle cx={60 + i * 50} cy={110 + i * 10} r={4} fill={T.red} />
        </g>
      ))}
      <text x={130} y={260} fill={T.red} fontSize={22}>↓</text>

      {/* RIGHT: BUY */}
      <text x={420} y={60} fill={T.green} fontSize={13} fontWeight={700}>SAR BELOW = BUY</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={400 + i * 50} y={210 - i * 18} width={20} height={26 + i * 6} fill={T.green} rx={2} />
          <circle cx={410 + i * 50} cy={260 - i * 14} r={4} fill={T.green} />
        </g>
      ))}
      <text x={500} y={88} fill={T.green} fontSize={22}>↑</text>
    </Frame>
  );
}

// 4 ─ Fractals
export function FractalsDiagram() {
  const w = 700, h = 320;
  const candles = [
    { up: false }, { up: true }, { up: false }, { up: false }, { up: true }, { up: false }, { up: true },
  ];
  return (
    <Frame w={w} h={h} label="Fractals indicator showing buy, sell, and neutral arrows">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Fractals — swing high/low arrows</text>
      {candles.map((c, i) => {
        const x = 80 + i * 80;
        const top = 130 + (i % 3) * 6;
        const bot = 230 - (i % 2) * 8;
        return (
          <g key={i}>
            <line x1={x} y1={top - 14} x2={x} y2={bot + 14} stroke={T.mute} strokeWidth={1.5} />
            <rect x={x - 10} y={c.up ? top : top + 30} width={20} height={40} fill={c.up ? T.green : T.red} rx={2} />
          </g>
        );
      })}
      {/* Sell arrow above candle 2 */}
      <text x={150} y={108} fill={T.red} fontSize={20} textAnchor="middle">▼</text>
      <text x={150} y={94} fill={T.red} fontSize={10} textAnchor="middle">SELL · swing high</text>
      {/* Buy arrow below candle 5 */}
      <text x={400} y={284} fill={T.green} fontSize={20} textAnchor="middle">▲</text>
      <text x={400} y={304} fill={T.green} fontSize={10} textAnchor="middle">BUY · swing low</text>
      {/* Neutral: both arrows on candle 4 */}
      <text x={320} y={108} fill={T.red} fontSize={16} textAnchor="middle">▼</text>
      <text x={320} y={284} fill={T.green} fontSize={16} textAnchor="middle">▲</text>
      <text x={320} y={94} fill={T.mute} fontSize={10} textAnchor="middle">NEUTRAL — wait</text>
    </Frame>
  );
}

// 5 ─ RSI
export function RSIDiagram() {
  const w = 700, h = 380;
  const price = "M30,80 C80,60 130,110 200,90 C260,75 320,40 380,60 C450,85 520,40 600,70 C640,82 660,60 680,55";
  const rsi = "M30,260 C90,300 150,330 220,310 C280,295 330,200 400,230 C460,255 520,330 600,290 C640,275 660,310 680,295";
  const yScale = (v: number) => 360 - (v / 100) * 160;
  return (
    <Frame w={w} h={h} label="RSI indicator with overbought and oversold zones">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>RSI — momentum strength (0–100)</text>
      {/* price */}
      <path d={price} stroke={T.text} strokeWidth={1.5} fill="none" opacity={0.85} />
      <line x1={30} y1={150} x2={680} y2={150} stroke={T.border} />
      {/* RSI panel background zones */}
      <rect x={30} y={yScale(70)} width={650} height={yScale(100) - yScale(70)} fill="#7f1d1d" opacity={0.18} />
      <rect x={30} y={yScale(30)} width={650} height={yScale(0) - yScale(30)} fill="#14532d" opacity={0.22} />
      {[30, 50, 70].map((v) => (
        <g key={v}>
          <line x1={30} y1={yScale(v)} x2={680} y2={yScale(v)} stroke={T.gray} strokeDasharray="3 3" />
          <text x={684} y={yScale(v) + 4} fill={T.mute} fontSize={10}>{v}</text>
        </g>
      ))}
      <path d={rsi} stroke={T.blue} strokeWidth={2.2} fill="none" />
      <text x={36} y={yScale(85)} fill={T.red} fontSize={11} fontWeight={700}>OVERBOUGHT 70+</text>
      <text x={36} y={yScale(15)} fill={T.green} fontSize={11} fontWeight={700}>OVERSOLD 0–30</text>
      {/* Midline crosses */}
      <g><rect x={150} y={yScale(50) - 22} width={64} height={20} rx={10} fill={T.green} /><text x={182} y={yScale(50) - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#03130a">BUY BIAS</text></g>
      <g><rect x={470} y={yScale(50) - 22} width={66} height={20} rx={10} fill={T.red} /><text x={503} y={yScale(50) - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1a0606">SELL BIAS</text></g>
    </Frame>
  );
}

// 6 ─ Stochastic Oscillator
export function StochasticDiagram() {
  const w = 700, h = 320;
  const yScale = (v: number) => 280 - (v / 100) * 240;
  const k = "M30,260 C80,200 130,90 190,80 C240,72 290,160 350,180 C410,200 460,260 530,220 C580,190 630,90 680,100";
  const d = "M30,250 C90,220 150,140 210,140 C260,140 310,200 370,210 C430,220 480,250 540,230 C590,215 640,140 680,150";
  return (
    <Frame w={w} h={h} label="Stochastic Oscillator with K and D line crossovers">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Stochastic — %K (blue) crosses %D (red)</text>
      <rect x={30} y={yScale(100)} width={650} height={yScale(80) - yScale(100)} fill="#7f1d1d" opacity={0.18} />
      <rect x={30} y={yScale(20)} width={650} height={yScale(0) - yScale(20)} fill="#14532d" opacity={0.22} />
      {[20, 50, 80].map((v) => (
        <line key={v} x1={30} y1={yScale(v)} x2={680} y2={yScale(v)} stroke={T.gray} strokeDasharray="3 3" />
      ))}
      <path d={d} stroke={T.red} strokeWidth={2} fill="none" />
      <path d={k} stroke={T.blue} strokeWidth={2.2} fill="none" />
      <text x={36} y={yScale(90)} fill={T.red} fontSize={11} fontWeight={700}>OVERBOUGHT 80+</text>
      <text x={36} y={yScale(15)} fill={T.green} fontSize={11} fontWeight={700}>OVERSOLD 20-</text>
      {/* badges */}
      <g><rect x={160} y={68} width={56} height={20} rx={10} fill={T.green} /><text x={188} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill="#03130a">BUY</text></g>
      <g><rect x={336} y={188} width={64} height={20} rx={10} fill="#374151" /><text x={368} y={202} textAnchor="middle" fontSize={10} fontWeight={700} fill={T.mute}>NEUTRAL</text></g>
      <g><rect x={520} y={228} width={56} height={20} rx={10} fill={T.red} /><text x={548} y={242} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1a0606">SELL</text></g>
    </Frame>
  );
}

// 7 ─ Support & Resistance
export function SupportResistanceDiagram() {
  const w = 700, h = 380;
  const price = "M30,300 L100,200 L160,260 L230,150 L300,210 L370,90 L440,160 L520,80 L600,140 L670,60";
  return (
    <Frame w={w} h={h} label="Support and resistance zones with break-and-retest example">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Support &amp; Resistance — always zones, never lines</text>
      {/* Resistance bands */}
      <rect x={30} y={70} width={650} height={26} fill={T.red} opacity={0.18} />
      <rect x={30} y={140} width={650} height={26} fill={T.amber} opacity={0.18} />
      <text x={40} y={88} fill={T.red} fontSize={11} fontWeight={700}>RESISTANCE · Sellers take over</text>
      {/* Support bands */}
      <rect x={30} y={210} width={650} height={26} fill={T.green} opacity={0.18} />
      <rect x={30} y={290} width={650} height={26} fill={T.green} opacity={0.18} />
      <text x={40} y={228} fill={T.green} fontSize={11} fontWeight={700}>SUPPORT · Buyers take over</text>

      <path d={price} stroke={T.text} strokeWidth={2} fill="none" />
      {/* Break callout */}
      <circle cx={520} cy={80} r={6} fill={T.amber} />
      <text x={534} y={70} fill={T.amber} fontSize={11} fontWeight={700}>Resistance breaks → flips to support</text>
      <text x={36} y={h - 14} fill={T.mute} fontSize={11}>Higher highs + higher lows = bullish market</text>
    </Frame>
  );
}

// 8 ─ Trendline (3 panels)
export function TrendlineDiagram() {
  const w = 720, h = 380;
  return (
    <Frame w={w} h={h} label="Bullish, ranging and bearish trendline structures">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Trendlines — direction at a glance</text>
      {/* Bullish */}
      <g transform="translate(20 60)">
        <text x={0} y={0} fill={T.green} fontSize={12} fontWeight={700}>BULLISH</text>
        <path d="M0,240 L40,200 L80,220 L130,150 L170,180 L220,90" stroke={T.text} strokeWidth={1.8} fill="none" />
        <line x1={0} y1={240} x2={220} y2={90} stroke={T.green} strokeWidth={2.2} strokeDasharray="4 3" />
        <text x={0} y={290} fill={T.mute} fontSize={10}>Connect higher lows · UPTREND ↑</text>
      </g>
      {/* Range */}
      <g transform="translate(260 60)">
        <text x={0} y={0} fill={T.gray} fontSize={12} fontWeight={700}>RANGING</text>
        <path d="M0,160 L30,110 L60,180 L100,110 L140,180 L180,110 L220,180" stroke={T.text} strokeWidth={1.8} fill="none" />
        <line x1={0} y1={110} x2={220} y2={110} stroke={T.gray} strokeDasharray="4 3" />
        <line x1={0} y1={180} x2={220} y2={180} stroke={T.gray} strokeDasharray="4 3" />
        <text x={0} y={290} fill={T.mute} fontSize={10}>Sideways · NEUTRAL</text>
      </g>
      {/* Bearish */}
      <g transform="translate(500 60)">
        <text x={0} y={0} fill={T.red} fontSize={12} fontWeight={700}>BEARISH</text>
        <path d="M0,90 L40,160 L80,130 L130,200 L170,180 L220,250" stroke={T.text} strokeWidth={1.8} fill="none" />
        <line x1={0} y1={90} x2={220} y2={250} stroke={T.red} strokeWidth={2.2} strokeDasharray="4 3" />
        <text x={0} y={290} fill={T.mute} fontSize={10}>Connect lower highs · DOWNTREND ↓</text>
      </g>
    </Frame>
  );
}

// 9 ─ Fibonacci
export function FibonacciDiagram() {
  const w = 700, h = 400;
  const levels = [
    { p: 0, label: "0% — Swing High" },
    { p: 23.6, label: "23.6%" },
    { p: 38.2, label: "38.2% — Watch zone", color: T.green },
    { p: 50, label: "50%" },
    { p: 61.8, label: "61.8% ⭐ Golden Ratio", color: T.amber, bold: true },
    { p: 78.6, label: "78.6%" },
    { p: 100, label: "100% — Swing Low" },
  ];
  const yAt = (pct: number) => 70 + (pct / 100) * 260;
  return (
    <Frame w={w} h={h} label="Fibonacci retracement levels with golden ratio highlighted">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Fibonacci Retracement — draw with the trend</text>
      {levels.map((l, i) => (
        <g key={i}>
          <line x1={50} y1={yAt(l.p)} x2={620} y2={yAt(l.p)} stroke={l.color ?? T.gray} strokeWidth={l.bold ? 2 : 1} strokeDasharray={l.bold ? "0" : "4 3"} opacity={0.85} />
          <text x={628} y={yAt(l.p) + 4} fill={l.color ?? T.mute} fontSize={11} fontWeight={l.bold ? 700 : 400}>{l.label}</text>
        </g>
      ))}
      {/* Price swing arrow */}
      <path d={`M70,${yAt(100)} L260,${yAt(0)} L400,${yAt(61.8)} L560,${yAt(20)}`} stroke={T.text} strokeWidth={1.8} fill="none" />
      <text x={414} y={yAt(61.8) - 8} fill={T.amber} fontSize={11} fontWeight={700}>Bounce at 61.8% → BUY</text>
      <text x={50} y={56} fill={T.mute} fontSize={11}>Draw LEFT → RIGHT, low → high (uptrend)</text>
    </Frame>
  );
}

// 10 ─ MACD
export function MACDDiagram() {
  const w = 700, h = 400;
  const price = "M30,80 C90,40 150,140 220,100 C290,60 350,40 410,80 C470,120 540,40 620,70 C650,82 670,60 690,55";
  const macd = "M30,290 C90,300 150,260 220,250 C290,240 350,220 410,230 C470,240 540,290 620,300 C650,305 670,295 690,290";
  const sig = "M30,295 C90,290 150,275 220,260 C290,245 350,235 410,240 C470,250 540,275 620,290 C650,294 670,292 690,291";
  return (
    <Frame w={w} h={h} label="MACD with crossover buy and sell signals">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>MACD — crossover momentum</text>
      <path d={price} stroke={T.text} strokeWidth={1.6} fill="none" />
      <line x1={30} y1={160} x2={690} y2={160} stroke={T.border} />
      <line x1={30} y1={280} x2={690} y2={280} stroke={T.gray} strokeDasharray="3 3" />
      {/* Histogram bars */}
      {Array.from({ length: 28 }).map((_, i) => {
        const x = 40 + i * 23;
        const positive = i > 6 && i < 18;
        const hVal = (Math.sin(i * 0.6) * 18) + (positive ? 12 : -8);
        const y = hVal > 0 ? 280 - hVal : 280;
        return <rect key={i} x={x} y={y} width={16} height={Math.abs(hVal)} fill={hVal > 0 ? T.green : T.red} opacity={0.85} />;
      })}
      <path d={macd} stroke={T.text} strokeWidth={2} fill="none" />
      <path d={sig} stroke={T.red} strokeWidth={2} fill="none" />
      {/* Crossover badges */}
      <g><rect x={170} y={188} width={56} height={20} rx={10} fill={T.green} /><text x={198} y={202} textAnchor="middle" fontSize={10} fontWeight={700} fill="#03130a">BUY</text></g>
      <g><rect x={530} y={188} width={56} height={20} rx={10} fill={T.red} /><text x={558} y={202} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1a0606">SELL</text></g>
      <g fontSize={10} fill={T.mute} transform={`translate(30 ${h - 14})`}>
        <rect x={0} y={-9} width={10} height={10} fill={T.text} /><text x={16} y={0}>MACD (12-26)</text>
        <rect x={140} y={-9} width={10} height={10} fill={T.red} /><text x={156} y={0}>Signal (9)</text>
        <rect x={250} y={-9} width={10} height={10} fill={T.green} /><text x={266} y={0}>Histogram = distance</text>
      </g>
    </Frame>
  );
}

// 11 ─ Ichimoku
export function IchimokuDiagram() {
  const w = 800, h = 420;
  const cloudTop = "M20,200 L120,180 L220,160 L320,150 L420,170 L520,200 L620,230 L720,240 L780,250";
  const cloudBot = "M20,260 L120,240 L220,230 L320,220 L420,240 L520,260 L620,280 L720,290 L780,300";
  const cloudPath = `${cloudTop} L780,300 L720,290 L620,280 L520,260 L420,240 L320,220 L220,230 L120,240 L20,260 Z`;
  const price = "M20,140 L120,120 L220,100 L320,135 L420,210 L520,300 L620,330 L720,355 L780,360";
  const tenkan = "M20,170 L120,150 L220,140 L320,165 L420,225 L520,280 L620,310 L720,330 L780,335";
  const kijun = "M20,200 L120,195 L220,190 L320,200 L420,230 L520,265 L620,290 L720,310 L780,315";
  return (
    <Frame w={w} h={h} label="Ichimoku Cloud with above-cloud, inside-cloud and below-cloud zones">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Ichimoku — Kumo cloud decides the bias</text>
      <path d={cloudPath} fill={T.green} opacity={0.18} />
      <path d={cloudTop} stroke={T.green} strokeWidth={1.5} fill="none" />
      <path d={cloudBot} stroke={T.red} strokeWidth={1.5} fill="none" />
      <path d={kijun} stroke={T.amber} strokeWidth={2} fill="none" />
      <path d={tenkan} stroke={T.blue} strokeWidth={2} fill="none" />
      <path d={price} stroke={T.text} strokeWidth={2} fill="none" />
      {/* Zones */}
      <g><rect x={60} y={50} width={150} height={22} rx={11} fill={T.green} /><text x={135} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#03130a">ABOVE CLOUD — BUY only</text></g>
      <g><rect x={360} y={50} width={160} height={22} rx={11} fill={T.amber} /><text x={440} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1f1300">INSIDE CLOUD — NO TRADE</text></g>
      <g><rect x={620} y={50} width={150} height={22} rx={11} fill={T.red} /><text x={695} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1a0606">BELOW CLOUD — SELL only</text></g>
      <g fontSize={10} fill={T.mute} transform={`translate(24 ${h - 14})`}>
        <rect x={0} y={-9} width={10} height={4} fill={T.blue} /><text x={16} y={0}>Tenkan (fast)</text>
        <rect x={110} y={-9} width={10} height={4} fill={T.amber} /><text x={126} y={0}>Kijun (slow)</text>
        <rect x={220} y={-9} width={10} height={10} fill={T.green} opacity={0.4} /><text x={236} y={0}>Kumo Cloud</text>
      </g>
    </Frame>
  );
}

// 12 ─ Lot size table (rendered as styled HTML inside SVG via foreignObject would be heavier — use rects/text)
export function LotSizeTableDiagram() {
  const rows = [
    ["$100", "0.01", "Micro", "$0.10", "±10 cents", true],
    ["$200", "0.02", "Micro", "$0.20", "±20 cents", false],
    ["$400", "0.04", "Micro", "$0.40", "±40 cents", false],
    ["$500", "0.05", "Micro", "$0.50", "±50 cents", false],
    ["$1,000", "0.10", "Mini", "$1.00", "±$1.00", true],
    ["$2,000", "0.20", "Mini", "$2.00", "±$2.00", false],
    ["$5,000", "0.50", "Mini", "$5.00", "±$5.00", false],
    ["$10,000", "1.00", "Standard", "$10.00", "±$10.00", false],
    ["$20,000", "2.00", "Standard", "$20.00", "±$20.00", false],
    ["$50,000", "5.00", "Standard", "$50.00", "±$50.00", false],
  ] as const;
  const w = 720, rowH = 32, h = 80 + rows.length * rowH + 36;
  const cols = [60, 200, 320, 440, 560];
  const headers = ["Balance", "Max Lot", "Type", "Pip Value", "Risk / pip"];
  return (
    <Frame w={w} h={h} label="Account balance to max lot size reference table">
      <text x={24} y={32} fill={T.text} fontSize={16} fontWeight={700}>Account size → maximum safe lot size</text>
      <rect x={24} y={52} width={w - 48} height={28} fill={T.green} opacity={0.85} rx={4} />
      {headers.map((hd, i) => (
        <text key={i} x={cols[i]} y={72} fill="#03130a" fontSize={12} fontWeight={700}>{hd}</text>
      ))}
      {rows.map((r, i) => {
        const y = 80 + i * rowH;
        const highlight = r[5];
        return (
          <g key={i}>
            <rect x={24} y={y} width={w - 48} height={rowH} fill={highlight ? T.amber : i % 2 === 0 ? T.surface : T.bg} opacity={highlight ? 0.18 : 1} />
            {r.slice(0, 5).map((cell, j) => (
              <text key={j} x={cols[j]} y={y + 21} fill={highlight ? T.amber : T.text} fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize={12} fontWeight={highlight ? 700 : 400}>{cell as string}</text>
            ))}
          </g>
        );
      })}
      <text x={24} y={h - 14} fill={T.mute} fontSize={11}>Rule: never trade your max — start at 25–50% of it.</text>
    </Frame>
  );
}

// 13 ─ Stop Loss & Take Profit (BUY vs SELL panels)
export function StopLossTakeProfitDiagram() {
  const w = 720, h = 400;
  const panel = (x: number, isBuy: boolean) => {
    const tpY = isBuy ? 90 : 280;
    const slY = isBuy ? 280 : 90;
    const tpColor = T.green;
    const slColor = T.red;
    return (
      <g transform={`translate(${x} 0)`}>
        <text x={20} y={50} fill={isBuy ? T.green : T.red} fontSize={14} fontWeight={700}>{isBuy ? "BUY TRADE" : "SELL TRADE"}</text>
        <line x1={20} y1={tpY} x2={320} y2={tpY} stroke={tpColor} strokeWidth={2.4} />
        <text x={26} y={tpY - 6} fill={tpColor} fontSize={11} fontWeight={700}>Take Profit {isBuy ? "+50" : "-50"} pips</text>
        <line x1={20} y1={185} x2={320} y2={185} stroke={T.blue} strokeWidth={2.4} strokeDasharray="4 3" />
        <text x={26} y={179} fill={T.blue} fontSize={11} fontWeight={700}>Entry (CMP)</text>
        <line x1={20} y1={slY} x2={320} y2={slY} stroke={slColor} strokeWidth={2.4} />
        <text x={26} y={slY + 18} fill={slColor} fontSize={11} fontWeight={700}>Stop Loss {isBuy ? "-30" : "+30"} pips</text>
        <g fontSize={11} fill={T.mute} transform="translate(20 340)">
          <text x={0} y={0}>Entry: 1.1803</text>
          <text x={0} y={16}>TP: {isBuy ? "1.1853 (+50p)" : "1.1753 (-50p)"}</text>
          <text x={0} y={32}>SL: {isBuy ? "1.1773 (-30p)" : "1.1833 (+30p)"} · R:R 1:1.67</text>
        </g>
      </g>
    );
  };
  return (
    <Frame w={w} h={h} label="Stop loss and take profit placement for buy and sell trades">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Stop Loss &amp; Take Profit placement</text>
      <line x1={360} y1={50} x2={360} y2={h - 20} stroke={T.border} strokeDasharray="3 3" />
      {panel(0, true)}
      {panel(360, false)}
    </Frame>
  );
}

// 14 ─ Fort Method 7-step flowchart
export function FortMethodDiagram() {
  const steps = [
    { n: 1, t: "Check Fundamental Analysis", s: "Investing.com · Bloomberg · MyFXBook" },
    { n: 2, t: "Confirm Trend + Candlestick", s: "Identify market direction first" },
    { n: 3, t: "Check Technical Indicators", s: "MA + RSI + Stochastic + MACD confluence" },
    { n: 4, t: "Place Trade with SL &amp; TP", s: "Always set both before entering" },
    { n: 5, t: "Monitor — Break Even at +20 pips", s: "Move SL to entry when in profit", warn: true },
    { n: 6, t: "Close Trade When Profitable", s: "Don't be greedy", warn: true },
    { n: 7, t: "Winning Mentality", s: '"I am here to win"' },
  ];
  const w = 560, stepH = 86, h = 60 + steps.length * stepH;
  return (
    <Frame w={w} h={h} label="The Fort Method 7-step trading flowchart">
      <text x={24} y={36} fill={T.text} fontSize={16} fontWeight={700}>The Fort Method · 7-step framework</text>
      {steps.map((s, i) => {
        const y = 60 + i * stepH;
        return (
          <g key={s.n}>
            <rect x={70} y={y} width={420} height={64} rx={10} fill={T.surface} stroke={s.warn ? T.amber : T.green} strokeWidth={1.5} />
            <circle cx={50} cy={y + 32} r={18} fill={T.green} />
            <text x={50} y={y + 38} textAnchor="middle" fontSize={14} fontWeight={700} fill="#03130a">{s.n}</text>
            <text x={86} y={y + 28} fill={T.text} fontSize={13} fontWeight={700}>{s.t}</text>
            <text x={86} y={y + 48} fill={s.warn ? T.amber : T.mute} fontSize={11}>{s.s}</text>
            {i < steps.length - 1 && <text x={50} y={y + 80} textAnchor="middle" fontSize={16} fill={T.green}>↓</text>}
          </g>
        );
      })}
    </Frame>
  );
}

// 15 ─ Pending Orders
export function PendingOrdersDiagram() {
  const w = 720, h = 380;
  return (
    <Frame w={w} h={h} label="Pending order types: buy stop, sell limit, buy limit, sell stop">
      <text x={24} y={28} fill={T.text} fontSize={16} fontWeight={700}>Pending Orders — where to place them</text>
      <line x1={40} y1={190} x2={680} y2={190} stroke={T.blue} strokeWidth={2.4} strokeDasharray="4 3" />
      <text x={48} y={184} fill={T.blue} fontSize={11} fontWeight={700}>CMP · Current Market Price</text>

      <text x={620} y={184} fill={T.mute} fontSize={10} textAnchor="end">— price level —</text>
      <text x={680} y={60} fill={T.mute} fontSize={10} textAnchor="end">ABOVE</text>
      <text x={680} y={350} fill={T.mute} fontSize={10} textAnchor="end">BELOW</text>

      {/* Above CMP */}
      <g>
        <rect x={70} y={60} width={260} height={56} rx={8} fill={T.green} opacity={0.18} stroke={T.green} />
        <text x={84} y={82} fill={T.green} fontSize={13} fontWeight={700}>↑ Buy Stop</text>
        <text x={84} y={102} fill={T.mute} fontSize={11}>Triggers if price RISES (breakout)</text>
      </g>
      <g>
        <rect x={370} y={60} width={280} height={56} rx={8} fill={T.red} opacity={0.18} stroke={T.red} />
        <text x={384} y={82} fill={T.red} fontSize={13} fontWeight={700}>↑ Sell Limit</text>
        <text x={384} y={102} fill={T.mute} fontSize={11}>Triggers at resistance (fade rally)</text>
      </g>
      {/* Below CMP */}
      <g>
        <rect x={70} y={250} width={260} height={56} rx={8} fill={T.green} opacity={0.18} stroke={T.green} />
        <text x={84} y={272} fill={T.green} fontSize={13} fontWeight={700}>↓ Buy Limit</text>
        <text x={84} y={292} fill={T.mute} fontSize={11}>Triggers at support (buy the dip)</text>
      </g>
      <g>
        <rect x={370} y={250} width={280} height={56} rx={8} fill={T.red} opacity={0.18} stroke={T.red} />
        <text x={384} y={272} fill={T.red} fontSize={13} fontWeight={700}>↓ Sell Stop</text>
        <text x={384} y={292} fill={T.mute} fontSize={11}>Triggers if price FALLS (breakdown)</text>
      </g>
    </Frame>
  );
}

// Registry: slug → diagram component
export const diagramRegistry: Record<string, () => JSX.Element> = {
  "what-is-a-pip": LotSizeTableDiagram,
  "lot-size-and-pip-value": LotSizeTableDiagram,
  "stop-loss-and-take-profit": StopLossTakeProfitDiagram,
  "japanese-candlesticks": CandlestickDiagram,
  "moving-average-strategy": MovingAverageDiagram,
  "rsi-trading-guide": RSIDiagram,
  "stochastic-oscillator-guide": StochasticDiagram,
  "parabolic-sar-guide": ParabolicSARDiagram,
  "fractals-indicator-guide": FractalsDiagram,
  "support-and-resistance": SupportResistanceDiagram,
  "trendlines-guide": TrendlineDiagram,
  "fibonacci-retracement-guide": FibonacciDiagram,
  "macd-trading-guide": MACDDiagram,
  "ichimoku-cloud-guide": IchimokuDiagram,
  "pending-orders-guide": PendingOrdersDiagram,
  "the-fort-method": FortMethodDiagram,
};
