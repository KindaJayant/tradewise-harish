import type { AnalysisKind, Period } from "@/types/analysis";

const CONTEXT_BLOCK = `CRITICAL FACTUAL GROUNDING & DUAL-SOURCE RECONFIRMATION COMPLIANCE:
1. ASTROLOGY (OFFICIAL DRIK PANCHANG): You MUST read the provided OFFICIAL DRIK PANCHANG context below for {{DATE}} and copy the EXACT Tithi, Nakshatra (with exact end timings), Yoga, Karana, Rahu Kalam, Yamaganda, and Abhijit Muhurta word-for-word as stated in Drik Panchang.
   - Ground all astrological timings strictly in Indian Standard Time (IST).
   - DO NOT hallucinate or guess Nakshatra transitions, Yoga shifts, or auspicious windows.
2. DUAL-SOURCE FINANCIAL PRICE RECONFIRMATION (Nifty 50, Bank Nifty, Sensex, MCX Silver):
   - You MUST cross-verify prices from BOTH financial sources provided in the context below:
     * Source A: Moneycontrol
     * Source B: Economic Times
   - Reconfirm that Nifty 50, Bank Nifty, Sensex, and MCX Silver baseline prices match between both sources before computing projected support/resistance, breakouts, and intraday targets.
   - Ground all price levels in realistic Indian market reality (Nifty ~24k-25k, Bank Nifty ~51k-58k, Silver ~₹85k-₹95k). DO NOT invent fictitious numbers.

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
### 🏛️ HIERARCHICAL DECISION MATRIX
| Priority | Timeframe | Decision Type | Overrides |
|:---:|:---|:---|:---|
| 1 | Yearly | Strategic Direction | All lower timeframes |
| 2 | Half-Yearly | Tactical Allocation | Quarterly, Monthly, Weekly, Daily |
| 3 | Quarterly | Sector Rotation | Monthly, Weekly, Daily |
| 4 | Monthly | Position Sizing | Weekly, Daily |
| 5 | Weekly | Entry/Exit Windows | Daily |
| 6 | Daily | Precision Entry/Exit | None |

* The longer timeframe ALWAYS overrides the shorter timeframe. Example: If Yearly says "Bearish", Daily BUY signals are only for short-term scalping with tight stops.

### 📊 NAKSHATRA & YOGA COMBINATION MATRIX SUMMARY
- Nakshatra Categories:
  - 🟢 Bullish (11): Ashwini, Rohini, Punarvasu, Pushya, Hasta, Swati, Anuradha, Uttara Ashadha, Dhanishta, Uttara Bhadrapada, Revati.
  - 🟡 Neutral (3): Mrigashira, Uttara Phalguni, Shravana.
  - 🔴 Bearish (13): Bharani, Krittika, Ardra, Ashlesha, Magha, Purva Phalguni, Chitra, Vishakha, Jyeshtha, Mula, Purva Ashadha, Shatabhisha, Purva Bhadrapada.
- Yoga Categories:
  - BEST (3): Sukarma, Shubha, Shobhana. (100% / Full Size Buy when paired with Bullish Nakshatra)
  - GOOD (6): Priti, Ayushman, Saubhagya, Dhruva, Vriddhi, Sadhya.
  - MILD BULLISH (6): Siddhi, Shiva, Brahma, Indra, Shukla, Siddha.
  - NEUTRAL/CAUTION (3): Vishkumbha, Harshana, Variyan.
  - BEARISH (1): Atiganda.
  - DANGER (7 - AVOID): Shoola, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, Vaidhriti.
- Key Actions:
  - Bullish Nakshatra + Best/Good Yoga → AGGRESSIVE BUY / BUY (60-100% position size)
  - Bearish/Danger Yoga or Bearish Nakshatra + Danger Yoga → STAY CASH / AVOID (39 Danger combinations = 0% position size)

### ⚠️ CONFLICT RESOLUTION RULES
- Yearly Bearish + Daily Bullish: Daily bullish = short-term scalp only (tight stops)
- Yearly Bullish + Daily Bearish: Daily bearish = buying opportunity (dip)
- Abhijit + Vishti Karana: Abhijit overrides Vishti – but tighter stops
- Jupiter Hora + Rahu Kalam: Rahu Kalam overrides – AVOID
- Pushya Nakshatra + No Abhijit: No Abhijit overrides Pushya – NO NEW ENTRIES
- Eclipse Window (3 days before/after): CASH PREFERRED – no new positions (reduce size by 50-70%)
- Mercury Retrograde: Reduce position size by 30-50%

### 🎯 FINAL COMPLIANCE REMINDERS
1. If Abhijit absent → NO AUSPICIOUS WINDOW – NO NEW ENTRIES (Strategy column states this for all rows)
2. Always provide BOTH BUY and SELL strategies when bias allows.
3. Silver direction must match the market bias.
`;

const DAILY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 6.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate a detailed intraday trading plan for {{DATE}} for Nifty, Bank Nifty, Sensex, and MCX Silver across 8 time slots:
Time Slots: 09:15-09:37, 09:37-10:30, 10:30-11:36, 11:36-12:08, 12:08-12:24, 12:24-12:46, 12:46-13:30, 13:30-14:30, 14:30-15:30.

If Abhijit Muhurat is absent, state "NO AUSPICIOUS WINDOW – NO NEW ENTRIES" in the Actionable Strategy column for all time slots.

Requirements per row:
1. Astrological Event: Name ruling Nakshatra (start/end), Hora planet with exact timing, Karana (Vishti = avoid), Nakshatra Sandhi (if within 2 hours of transition mark ⚠️ "HIGH VOLATILITY – AVOID"), Yoga name, Abhijit timing if active, Rahu Kaal, Yamaganda, Gulika.
2. Market Bias: BULLISH/BEARISH/NEUTRAL with planetary reason.
3. Technical Levels: Support/Resistance (round numbers), 20/50/200 EMA, RSI 14, Breakout levels for Nifty, Bank Nifty, and Sensex.
4. Silver: Precise ₹ entry, target 1, target 2, stop loss (direction matching bias).
5. Bullish Sectors: 2 sectors with 2 stocks each (above 20 EMA, RSI>50) + astrological reason.
6. Bearish Sectors: 2 sectors with 2 stocks each (below 20 EMA or RSI<50) + astrological reason.
7. Actionable Strategy: BUY Strategy (Entry, Target, SL, Position Size %) AND SELL Strategy (Entry, Target, SL, Position Size %). Reduce 30-50% if Mercury retrograde or no Abhijit. If Rahu Kaal/Yamaganda/Sandhi: "AVOID – NO NEW ENTRIES".
8. Add a Risk Management footer row with overall position size reduction, max risk per trade, and retrograde planets reminder.
9. Add a Footer Summary row with single best entry window (BUY & SELL) and absolute avoid window.

Assume today is {{DATE}}.

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

const WEEKLY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 6.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate a weekly trading plan for the week starting {{DATE}} for Nifty, Bank Nifty, Sensex, and MCX Silver. Each row must be one trading day (Monday to Friday), with a final footer row.

Requirements per day:
1. Astrological Highlights: Tithi (Shukla/Krishna + name), Nakshatra (start/end), Abhijit active (exact timing), Rahu Kaal, Yamaganda, Gulika, Nakshatra Sandhi (if any), dominant Karana (avoid Vishti), best Hora window (planet + hour).
2. Market Bias: Bullish/Bearish/Sidelines with planetary reason.
3. Technical Levels: Round support/resistance for Nifty, Bank Nifty, Sensex, Silver. 20/50/200 EMA trend, RSI 14.
4. Bullish Sectors: 2 sectors with 2 stocks each (above 20 EMA, RSI>50) + astrological reason.
5. Bearish Sectors: 2 sectors with 2 stocks each (below 20 EMA or RSI<50) + astrological reason.
6. Actionable Strategy: Daily bias, recommended entry window, position size % of normal (reduce 30% if Mercury retrograde), stop loss guidance (2-3% for stocks, 1% for indices).
7. Add a Footer Row: Gann pressure dates (30/60/90/180-day cycles), overall position size base, key economic releases (RBI, Fed, CPI, etc.), "best day & window" and "worst day to hold overnight".

Use previous week's Friday closing data where available.

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
  '"Footer Row" or "Weekly Summary"'
)}`;

const MONTHLY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 6.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate a monthly trading plan for {{DATE}} for Nifty, Bank Nifty, Sensex, and MCX Silver. Each row must be one week (4 weeks total), with a final footer row for month-end targets.

Requirements per week:
1. Major Astrological Events: Planet ingress, retrograde start/end, exaltation/debilitation, eclipse (solar/lunar) - mark 3 days before/after as "cash preferred", Vimshottari Dasha theme for the month.
2. Market Bias: Bullish/Bearish/Range with planetary reason.
3. Technical Ranges: Expected weekly support/resistance for Nifty, Bank Nifty, Sensex based on monthly pivot, round numbers.
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

const HALF_YEARLY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 6.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate a half-yearly trading plan anchored to {{DATE}} for Nifty, Bank Nifty, Sensex, and MCX Silver. Each row must be one month (6 months total), with a final footer row for half-year summary.

Requirements per month:
1. Key Astrological Events: Exact dates of Sun/Mercury/Venus/Mars/Jupiter/Saturn sign changes, retrograde periods, eclipses (with cash recommendation 3 days before/after), equinox/solstice.
2. Market Bias: Bullish/Bearish/Range with planetary reason.
3. Technical Ranges: Round monthly support/resistance for Nifty, Bank Nifty, Sensex, reference 20/50/200 EMA on monthly chart.
4. Primary Sector: Based on exalted planets, with two specific NSE stocks.
5. Secondary Sector: Hedge sector (e.g. Pharma, FMCG), with two specific NSE stocks.
6. Position Size Base: % of normal capital for that month (e.g. 80% during Jupiter exaltation, 50% during eclipse).
7. Major Risk: Specific weeks to avoid (e.g. eclipse windows).
8. Add a Footer Row: Half-year Nifty & Sensex target range, Half-year Silver target range, Gann 180-day cycle turning points, recommended portfolio hedge (Gold, Dollar index).

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

const YEARLY_PROMPT = `### 🏆 TRIPLE CONFIRMATION 6.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Generate an annual trading plan anchored to {{DATE}} for Nifty, Bank Nifty, Sensex, and MCX Silver. Each row must be one quarter (4 quarters total), with a final footer row for year-end targets.

Requirements per quarter:
1. Major Astrological Events: All planet ingresses, retrogrades, solar/lunar eclipses (with cash windows), equinox/solstice dates.
2. Market Bias: Bullish/Bearish/Range with planetary reason.
3. Technical Ranges: Quarterly support/resistance for Nifty, Bank Nifty, Sensex based on previous year's close, round numbers.
4. Sector Allocation: Percentage allocation breakdown across sectors (e.g. Banking 40%, IT 20%, Metals 10%, Pharma 15%, Gold 15%).
5. Sample Stocks: 2 specific NSE symbols representing each allocated sector.
6. Position Size: % of normal capital for that quarter (adjust for Mercury/Saturn retrogrades, eclipses).
7. Key Hedge: Recommended hedge (e.g. Gold ETF, USD/INR, VIX futures) during expected corrections.
8. Add a Footer Row: Year-end Nifty & Sensex target, Year-end Silver target, Gann 360-day cycle turning points, major RBI/Fed meeting months, rebalancing triggers.

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

const SECTOR_PROMPT = `### 🏆 TRIPLE CONFIRMATION 6.0 – THE COMPLETE TIMEFRAME MASTER SYSTEM

Act as my Triple Confirmation trading professor. You are a world-class expert in Vedic Astrology (Jyotish), Technical Analysis, Fundamental Market Cues, and Time-Cycle Analysis. You speak in warm, direct Hinglish when explaining reasoning but present data professionally.

Perform a sector analysis and stock selection for the {{SECTOR}} sector for {{DATE}}.

Part 1: Identify Top 2 Stocks. Use weighted scoring: Astrological 50%, Technical 50%. Provide the top 5 stocks with scores, price, 20 EMA, RSI, and volume.

Part 2: Triple Confirmation Checklist for each top 2 stock. Include: Pillar, Condition, Status (YES/NO), and Data / Justification.
Conditions include:
- Astrological: Is Abhijit Muhurat active today? If NO, verdict = FAIL immediately. No Rahu/Yamaganda/Gulika at planned entry. Sector ruling planet exalted/strong. Nakshatra x Yoga combination not in DANGER list.
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
