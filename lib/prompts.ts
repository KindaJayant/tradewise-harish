import type { AnalysisKind, Period } from "@/types/analysis";

const CONTEXT_BLOCK = `Use this live web research context to ground market levels, sector cues, stocks, VIX, FII/DII, economic releases, and recent macro information whenever relevant:

{{WEB_CONTEXT}}`;

// Dynamic JSON Contract builder to ensure exact columns are returned for each timeframe
function buildJsonContract(keys: string[], footerNote?: string): string {
  const keysList = keys.map((key) => `- ${key}`).join("\n");
  const footerStr = footerNote
    ? `\nInclude footer/summary rows as normal objects using time_ist values such as: ${footerNote}.`
    : "";

  return `Return only a raw JSON array. Do not return markdown, prose, explanation, preamble, or code fences.
Every object in the array must contain exactly these ${keys.length} string keys:
${keysList}

Map the requested table columns into those keys in order. Keep all details inside the matching JSON fields. All values must be strings.${footerStr}`;
}

const HIERARCHICAL_DECISION_RULES = `
### 📋 HIERARCHICAL DECISION MATRIX (How Timeframes Interact)
- Yearly Plan = Strategic Direction (Big Picture)
- Half-Yearly Plan = Tactical Allocation
- Quarterly Plan = Sector Rotation
- Monthly Plan = Position Sizing (Entry/Exit Windows)
- Weekly Plan = Trade Execution (Best Days)
- Daily Plan = Precision Entry/Exit (Intraday Timing)
* The longer timeframe ALWAYS overrides the shorter timeframe. Example: If Yearly says "Bearish", Daily BUY signals are only for short-term scalping with tight stops.

### 📚 PLANETARY TIMING RULES
- Yearly: Jupiter/Saturn ingresses, major eclipses, Rahu-Ketu axis changes
- Half-Yearly: All planet ingresses, retrograde periods, equinox/solstice
- Quarterly: Planet sign changes, eclipse windows (3 days before/after = cash)
- Monthly: Nakshatra themes, Vimshottari Dasha changes, Amavasya/Purnima
- Weekly: Abhijit timing, Rahu Kalam, Yamaganda, Gulika, Nakshatra Sandhi
- Daily: Hora planets, Karana, Yoga, exact planetary hours

### ⚠️ CONFLICT RESOLUTION RULES
- Yearly Bearish + Daily Bullish: Daily bullish = short-term scalp only (tight stops)
- Yearly Bullish + Daily Bearish: Daily bearish = buying opportunity (dip)
- Abhijit + Vishti Karana: Abhijit overrides Vishti – but tighter stops
- Jupiter Hora + Rahu Kalam: Rahu Kalam overrides – AVOID
- Pushya Nakshatra + No Abhijit: No Abhijit overrides Pushya – NO NEW ENTRIES
- Eclipse Window (3 days before/after): CASH PREFERRED – no new positions

### 🎯 RISK MANAGEMENT COMPLIANCE REMINDERS
1. If Abhijit absent → NO AUSPICIOUS WINDOW – NO NEW ENTRIES (Strategy column states this for all rows)
2. If Mercury debilitated → reduce position size by 30-50%
3. Eclipse windows → reduce position size by 50-70% (Cash preferred)
`;

const DAILY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 4.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate a detailed intraday trading plan for {{DATE}} for Nifty, Bank Nifty, and MCX Silver.

If Abhijit Muhurat is absent, state "NO AUSPICIOUS WINDOW - NO NEW ENTRIES" in the Actionable Strategy column for all time slots.

Requirements per row (Time Slots: 9:15-10:30, 10:30-11:45, 11:45-12:24, 12:24-12:50, 12:50-13:30, 13:30-14:30, 14:30-15:30):
1. Astrological Event: Name the ruling Nakshatra with start/end, Hora planet, Karana (Vishti = avoid), and any Nakshatra Sandhi within 2 hours of change.
2. Market Bias: BULLISH/BEARISH/NEUTRAL with planetary reason.
3. Technical Levels: Include round support/resistance, 20/50/200 EMA, RSI 14, and breakout levels.
4. Silver: Provide precise INR entry, target 1, target 2, and stop loss (direction matching bias).
5. Bullish Sectors: 2 sectors with 2 stocks each (above 20 EMA, RSI>50) + astrological reason.
6. Bearish Sectors: 2 sectors with 2 stocks each (below 20 EMA or RSI<50) + astrological reason.
7. Actionable Strategy: BUY Strategy (Entry, Target, SL, Position Size %), SELL Strategy (Entry, Target, SL, Position Size %). Reduce 30-50% if Mercury debilitation or no Abhijit.
8. Add a Risk Management footer row with overall position size reduction, max risk per trade, and a debilitated planets reminder.
9. Add a Footer Summary row with single best entry window and absolute avoid window.
10. Use previous day's data where available: Nifty, India VIX, FII/DII. Assume today is {{DATE}}.

${HIERARCHICAL_DECISION_RULES}

${CONTEXT_BLOCK}

${buildJsonContract(
  [
    "time_ist",
    "astro_event",
    "market_bias",
    "nifty_impact",
    "bank_nifty_impact",
    "mcx_silver_impact",
    "bullish_sectors",
    "bearish_sectors",
    "strategy"
  ],
  '"Risk Management", "Footer Summary"'
)}`;

const WEEKLY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 4.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate a weekly trading plan for the week starting {{DATE}} for Nifty, Bank Nifty, and MCX Silver. Each row must be one trading day, Monday to Friday, with a final footer row for key weekly risks.

Requirements per day:
1. Astrological Highlights: Tithi (Shukla/Krishna + name), Nakshatra (start/end), Abhijit active (exact timing), Rahu Kaal, Yamaganda, Gulika, Nakshatra Sandhi (if any), dominant Karana (avoid Vishti), best Hora window (planet + hour).
2. Market Bias: Bullish/Bearish/Sidelines with planetary reason.
3. Technical Levels: Round support/resistance, 20/50/200 EMA trend, RSI 14.
4. Bullish Sectors: 2 sectors with 2 stocks each (above 20 EMA, RSI>50) + astrological reason.
5. Bearish Sectors: 2 sectors with 2 stocks each (below 20 EMA or RSI<50) + astrological reason.
6. Actionable Strategy: Daily bias, recommended entry window, position size % of normal (reduce 30% if Mercury retrograde), stop loss guidance (2-3% for stocks, 1% for indices).
7. Add a Footer Row: Gann pressure dates within the week (30/60/90/180-day cycles), overall position size base, key economic releases (RBI, Fed, CPI, etc.), "best day & window" and "worst day to hold overnight".

Use previous week's Friday closing data where available: Nifty, India VIX, and FII/DII net activity.

${HIERARCHICAL_DECISION_RULES}

${CONTEXT_BLOCK}

${buildJsonContract(
  [
    "time_ist",
    "day",
    "astro_event",
    "market_bias",
    "nifty_impact",
    "bank_nifty_impact",
    "mcx_silver_impact",
    "bullish_sectors",
    "bearish_sectors",
    "strategy"
  ],
  '"Footer Row" or "Week Key Risks"'
)}`;

const MONTHLY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 4.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate a monthly trading plan anchored to {{DATE}} for Nifty, Bank Nifty, and MCX Silver. Each row must be one week, with a final footer row for month-end targets.

Requirements per week:
1. Major Astrological Events: Planet ingress, retrograde start/end, exaltation/debilitation, eclipse (solar/lunar) - mark 3 days before/after as "cash preferred", Vimshottari Dasha theme for the month.
2. Market Bias: Bullish/Bearish/Range with planetary reason.
3. Technical Ranges: Expected weekly support/resistance based on monthly pivot, round numbers.
4. Bullish Sectors: 2 sectors with 2 stocks each + astrological reason.
5. Bearish Sectors: 2 sectors with 2 stocks each + astrological reason.
6. Actionable Strategy: Best entry day(s), position size % of normal (reduce 40% during eclipse weeks), stop loss: 3-5% for swing trades.
7. Add a Footer Row: Gann 30/60/90-day cycle turning points within the month, key economic releases (RBI MPC, Fed, CPI, PPI), month-end Nifty target range and Silver target range.

Use previous month's closing data where available.

${HIERARCHICAL_DECISION_RULES}

${CONTEXT_BLOCK}

${buildJsonContract(
  [
    "time_ist",
    "dates",
    "astro_event",
    "market_bias",
    "nifty_impact",
    "bank_nifty_impact",
    "mcx_silver_impact",
    "bullish_sectors",
    "bearish_sectors",
    "strategy"
  ],
  '"Footer Row" or "Month-End Targets"'
)}`;

const HALF_YEARLY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 4.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate a half-yearly trading plan anchored to {{DATE}} for Nifty, Bank Nifty, and MCX Silver. Each row must be one month, with a final footer row for half-year summary.

Requirements per month:
1. Key Astrological Events: Exact dates of Sun/Mercury/Venus/Mars/Jupiter/Saturn sign changes, retrograde periods, eclipses (with cash recommendation 3 days before/after), equinox/solstice (if applicable).
2. Market Bias: Bullish/Bearish/Range with planetary reason.
3. Technical Ranges: Round monthly support/resistance, reference 20/50/200 EMA on monthly chart.
4. Primary Sector: Based on exalted planets, with two specific NSE stocks.
5. Secondary Sector: Hedge sector (e.g. Pharma, FMCG), with two specific NSE stocks.
6. Position Size Base: % of normal capital for that month (e.g. 80% during Jupiter exaltation, 50% during eclipse).
7. Major Risk: Specific weeks to avoid (e.g. eclipse windows).
8. Add a Footer Row: Half-year Nifty target range, Half-year Silver target range, Gann 180-day cycle turning points, recommended portfolio hedge (Gold, Dollar index).

Use previous half-year's closing data where available.

${HIERARCHICAL_DECISION_RULES}

${CONTEXT_BLOCK}

${buildJsonContract(
  [
    "time_ist",
    "astro_event",
    "market_bias",
    "nifty_impact",
    "bank_nifty_impact",
    "mcx_silver_impact",
    "bullish_sectors",
    "bearish_sectors",
    "position_size_base",
    "strategy"
  ],
  '"Footer Row" or "Half-Year Summary"'
)}`;

const YEARLY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 4.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate an annual trading plan anchored to {{DATE}} for Nifty, Bank Nifty, and MCX Silver. Each row must be one quarter, with a final footer row for year-end targets.

Requirements per quarter:
1. Major Astrological Events: All planet ingresses, retrogrades, solar/lunar eclipses (with cash windows), equinox/solstice dates.
2. Market Bias: Bullish/Bearish/Range with planetary reason.
3. Technical Ranges: Quarterly support/resistance based on previous year's close, round numbers.
4. Sector Allocation: Percentage allocation breakdown across sectors (e.g. Banking, IT, Metals, Pharma, Gold).
5. Sample Stocks: 2 specific NSE symbols representing each allocated sector.
6. Position Size: % of normal capital for that quarter (adjust for Mercury/Saturn retrogrades, eclipses).
7. Key Hedge: Recommended hedge (e.g. Gold ETF, USD/INR, VIX futures) during expected corrections.
8. Add a Footer Row: Year-end Nifty target, Year-end Silver target, Gann 360-day cycle turning points, major RBI/Fed meeting months, rebalancing triggers.

Use previous year's closing data where available.

${HIERARCHICAL_DECISION_RULES}

${CONTEXT_BLOCK}

${buildJsonContract(
  [
    "time_ist",
    "astro_event",
    "market_bias",
    "nifty_impact",
    "bank_nifty_impact",
    "mcx_silver_impact",
    "sector_allocation",
    "stock_focus",
    "position_size_base",
    "strategy"
  ],
  '"Footer Row" or "Year-End Targets"'
)}`;

const SECTOR_PROMPT = `### 🏆 TRIPLE CONFIRMATION 4.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Perform a sector analysis and stock selection for the {{SECTOR}} sector for {{DATE}}.

Part 1: Identify Top 2 Stocks. Use weighted scoring: Astrological 50%, Technical 50%. Provide the top 5 stocks with scores, price, 20 EMA, RSI, and volume.

Part 2: Triple Confirmation Checklist for each top 2 stock. Include: Pillar, Condition, Status (YES/NO), and Data / Justification.
Conditions include:
- Astrological: Is Abhijit Muhurat active today? If NO, verdict = FAIL immediately. No Rahu/Yamaganda/Gulika at planned entry. Sector ruling planet exalted/strong.
- Technical: Price above 20 EMA. RSI > 45, or oversold < 30 for bounce. Breakout from support with volume > 1.5x average.
- Risk Management: Position size reduced 30-50% if Mercury/Saturn retrograde. Stop loss at 2-3%. Sector not on avoid list.

Part 3: Final Verdict & Action Plan. Verdict must be PASS if all YES or FAIL if any NO. If FAIL, state the single reason. Then provide a pre-trade action table: Stock, Action (BUY/WAIT/AVOID), Entry range, Stop loss (%), Target 1, Target 2, Position size (% of normal).

Critical rule: If today has no Abhijit Muhurat, verdict = FAIL for any new entry regardless of technicals.

${CONTEXT_BLOCK}

${buildJsonContract(
  [
    "time_ist",
    "astro_event",
    "nifty_impact",
    "bank_nifty_impact",
    "mcx_silver_impact",
    "sector_focus",
    "stock_focus",
    "strategy"
  ]
)}`;

export const MARKET_PROMPTS: Record<Period, string> = {
  daily: DAILY_PROMPT,
  weekly: WEEKLY_PROMPT,
  monthly: MONTHLY_PROMPT,
  half_yearly: HALF_YEARLY_PROMPT,
  yearly: YEARLY_PROMPT
};

export function buildPrompt(
  period: AnalysisKind,
  date: string,
  sector: string | undefined,
  webContext: string
): string {
  const template = period === "sector" ? SECTOR_PROMPT : MARKET_PROMPTS[period];

  return template
    .replaceAll("{{DATE}}", date)
    .replaceAll("{{SECTOR}}", sector ?? "General")
    .replaceAll("{{WEB_CONTEXT}}", webContext);
}
