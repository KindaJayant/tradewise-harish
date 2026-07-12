import type { AnalysisKind, Period } from "@/types/analysis";

const JSON_CONTRACT = `Return only a raw JSON array. Do not return markdown, prose, explanation, preamble, or code fences.
Every object must contain exactly these 8 string keys:
- time_ist
- astro_event
- nifty_impact
- bank_nifty_impact
- mcx_silver_impact
- sector_focus
- stock_focus
- strategy

Map the requested table columns into those keys in order. Keep the professor's requested details inside the matching JSON fields. Include footer rows as normal objects using time_ist values such as "Risk Management", "Footer Summary", "Week Key Risks", "Month-End Targets", "Half-Year Summary", or "Year-End Targets".`;

const CONTEXT_BLOCK = `Use this live web research context to ground market levels, sector cues, stocks, VIX, FII/DII, economic releases, and recent macro information whenever relevant:

{{WEB_CONTEXT}}`;

const DAILY_PROMPT = `Act as my Triple Confirmation trading professor. Generate a detailed intraday trading plan for {{DATE}} for Nifty, Bank Nifty, and MCX Silver.

Use the EXACT 8-column table below. If Abhijit Muhurat is absent, state "NO AUSPICIOUS WINDOW - NO NEW ENTRIES" in the Actionable Strategy column for all time slots.

| Time (IST) | Astrological Event (Nakshatra, Hora, Karana, Sandhi) | Nifty Impact & Levels (S/R, EMA, RSI) | Bank Nifty Impact & Levels | MCX Silver Impact & Levels (INR) | Sector Focus & Fundamental Cues (VIX, FII/DII) | Stock Focus (NSE, above 20 EMA, RSI>50) | Actionable Strategy (Entry/Exit, SL, Position Size %) |

Requirements per row:
1. Use these exact time slots: 9:15-10:30, 10:30-11:45, 11:45-12:24, 12:24-12:50, 12:50-13:30, 13:30-14:30, 14:30-15:30.
2. Astrological Event: Name the ruling Nakshatra with start/end, Hora planet, Karana with Vishti marked avoid, and any Nakshatra Sandhi within 2 hours of change.
3. Technical Levels: Include round support/resistance, 20/50/200 EMA, RSI 14, and breakout levels.
4. Silver: Provide precise INR entry, target 1, target 2, and stop loss.
5. Sector Cues: Include previous day India VIX, FII net INR, DII net INR, lead sectors, and avoid sectors.
6. Stocks: Use specific NSE symbols that are above 20 EMA and RSI > 50.
7. Actionable Strategy: For each slot use BUY/HOLD/SELL/AVOID. Include stop loss percentage and position size as percent of normal. Reduce 30-50% if Mercury debilitation or no Abhijit.
8. Add a Risk Management footer row with overall position size reduction, max risk per trade, and a debilitated planets reminder.
9. Add a Footer Summary row with single best entry window and absolute avoid window.
10. Use previous day's data where available: Nifty, India VIX, FII/DII. Assume today is {{DATE}}.

${CONTEXT_BLOCK}

${JSON_CONTRACT}`;

const WEEKLY_PROMPT = `Act as my Triple Confirmation trading professor. Generate a weekly trading plan for the week starting {{DATE}} using the EXACT 8-column table below. Each row must be one trading day, Monday to Friday, with a final footer row for the week's key risks.

| Date | Day | Astrological Highlights (Tithi, Nakshatra, Abhijit timing, Rahu Kaal, Yamaganda, Gulika, Nakshatra Sandhi, Karana, Hora) | Nifty Expected Range (S/R) & RSI | Bank Nifty Expected Range (S/R) | MCX Silver Range (INR S/R) | Favoured Sectors (with 2 stocks each, above 20 EMA) | Actionable Strategy (Daily bias, entry window, position size %) |

For each day include:
- Tithi, Nakshatra with start/end, Abhijit timing, Rahu Kaal, Yamaganda, Gulika, Nakshatra Sandhi if any, dominant Karana with Vishti marked avoid, and best Hora window.
- Round support/resistance for Nifty, Bank Nifty, and Silver. Mention 20/50/200 EMA trend and RSI 14.
- Favoured sectors based on Moon Nakshatra ruling planet, exaltations/debilitations, and Vimshottari Dasha for India chart: Venus MD + Moon AD from mid-June.
- List 2 specific NSE stocks per favoured sector above 20 EMA when available.
- Daily bias, recommended entry window, position size percent of normal, and stop loss guidance: 2-3% for stocks and 1% for indices.
- Footer row: Gann pressure dates within the week, overall position size base, key economic releases such as RBI, Fed, CPI, one-line best day/window, and worst day to hold overnight.

Use previous week's Friday closing data where available: Nifty, India VIX, and FII/DII net activity.

${CONTEXT_BLOCK}

${JSON_CONTRACT}`;

const MONTHLY_PROMPT = `Act as my Triple Confirmation trading professor. Generate a monthly trading plan for the month anchored to {{DATE}} using the EXACT 8-column table below. Each row must be one week, with a footer row for month-end targets.

| Week # | Dates | Major Astrological Events (Ingresses, Retrogrades, Exaltations/Debilitations, Eclipses, Nakshatra theme) | Nifty Weekly Range (S/R) | Bank Nifty Weekly Range | Silver Weekly Range (INR) | Sector Focus (2 sectors, 2 stocks each) | Actionable Strategy (Weekly bias, entry window, position size %) |

For each week include:
- Major astrological events: planet ingresses, retrograde starts/ends, exaltation/debilitation, eclipses, and 3 days before/after eclipse marked "cash preferred".
- Vimshottari Dasha theme for the month.
- Expected weekly support/resistance based on monthly pivot using round numbers.
- Sector focus based on planetary rulers of dominant Nakshatras and live sector performance when available.
- Two sectors with two specific NSE stocks each.
- Weekly bias, best entry day(s), position size percent of normal, and swing stop loss of 3-5%.
- Footer row: Gann 30/60/90-day cycle turning points, RBI/Fed/CPI/PPI events, month-end Nifty target range, and Silver target range.

Use previous month's closing data where available.

${CONTEXT_BLOCK}

${JSON_CONTRACT}`;

const HALF_YEARLY_PROMPT = `Act as my Triple Confirmation trading professor. Generate a half-yearly trading plan for the half-year anchored to {{DATE}} using the planning structure below. Each row must be one month, with a footer row for half-year summary.

| Month | Key Astrological Events (Ingresses, Retrogrades, Eclipses, Exaltations/Debilitations) | Nifty Expected Monthly Range | Bank Nifty Expected Range | Silver Expected Range (INR) | Primary Sector (2 stocks) | Secondary Sector (2 stocks) | Position Size Base (%) | Major Risk / Cash Window |

For each month include:
- Exact dates of Sun/Mercury/Venus/Mars/Jupiter/Saturn sign changes, retrograde periods, eclipses with cash recommendation 3 days before/after, and equinox/solstice if applicable.
- Round monthly support/resistance for Nifty, Bank Nifty, and Silver. Reference 20/50/200 EMA on monthly chart.
- Primary sector based on exalted planets and secondary sector as hedge, with two specific NSE stocks for each.
- Position size base as percent of normal capital.
- Specific weeks to avoid.
- Footer row: half-year Nifty target range, half-year Silver target range, Gann 180-day cycle turning points, and recommended portfolio hedge such as Gold or Dollar index.

Use previous half-year's closing data where available.

${CONTEXT_BLOCK}

${JSON_CONTRACT}`;

const YEARLY_PROMPT = `Act as my Triple Confirmation trading professor. Generate an annual trading plan for the year anchored to {{DATE}} using the planning structure below. Each row must be one quarter, with a footer row for year-end targets and rebalancing triggers.

| Quarter | Major Astrological Events (Ingresses, Retrogrades, Eclipses, Equinox/Solstice) | Nifty Expected Quarterly Range | Bank Nifty Expected Range | Silver Expected Range (INR) | Sector Allocation (Percentage) | Sample Stocks (2 per sector) | Position Size (%) | Key Hedge |

For each quarter include:
- Major astrological events: all planet ingresses, retrogrades, solar/lunar eclipses with cash windows, and equinox/solstice dates.
- Quarterly support/resistance based on previous quarter's close using round numbers.
- Sector allocation percentage breakdown.
- NSE sample stocks representing each allocated sector.
- Position size percent of normal capital adjusted for Mercury/Saturn retrogrades and eclipses.
- Key hedge such as Gold ETF, USD/INR, or VIX futures during expected corrections.
- Footer row: year-end Nifty target, year-end Silver target, Gann 360-day cycle turning points, major RBI/Fed meeting months, and rebalancing triggers.

Use previous year's closing data where available.

${CONTEXT_BLOCK}

${JSON_CONTRACT}`;

const SECTOR_PROMPT = `Act as my Triple Confirmation trading professor. Perform a sector analysis and stock selection for the {{SECTOR}} sector for {{DATE}}.

Part 1: Identify Top 2 Stocks. Use weighted scoring: Astrological 50%, Technical 50%. Provide the top 5 stocks with scores, price, 20 EMA, RSI, and volume.

Part 2: Triple Confirmation Checklist for each top 2 stock. Include: Pillar, Condition, Status (YES/NO), and Data / Justification.

Conditions include:
- Astrological: Is Abhijit Muhurat active today? If NO, verdict = FAIL immediately. No Rahu/Yamaganda/Gulika at planned entry. Sector ruling planet exalted/strong.
- Technical: Price above 20 EMA. RSI > 45, or oversold < 30 for bounce. Breakout from support with volume > 1.5x average.
- Risk Management: Position size reduced 30-50% if Mercury/Saturn retrograde. Stop loss at 2-3%. Sector not on avoid list.

Part 3: Final Verdict & Action Plan. Verdict must be PASS if all YES or FAIL if any NO. If FAIL, state the single reason. Then provide a pre-trade action table: Stock, Action (BUY/WAIT/AVOID), Entry range, Stop loss (%), Target 1, Target 2, Position size (% of normal).

Critical rule: If today has no Abhijit Muhurat, verdict = FAIL for any new entry regardless of technicals.

For JSON mapping:
- Use one row for the top 5 ranking summary.
- Use one row for each top 2 stock checklist.
- Use one final row for the verdict and action plan.
- Put the stock/section label in time_ist, astrology checklist in astro_event, technical score/levels in nifty_impact, risk checks in bank_nifty_impact, targets/SL in mcx_silver_impact, sector cues in sector_focus, stock details in stock_focus, and final action/verdict in strategy.

${CONTEXT_BLOCK}

${JSON_CONTRACT}`;

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
