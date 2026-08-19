import "server-only";

interface ExaSearchResult {
  title?: string;
  url?: string;
  publishedDate?: string;
  text?: string;
}

interface ExaSearchResponse {
  results?: ExaSearchResult[];
}

function buildSearchQuery(date: string, period: string, sector?: string): string {
  const sharedSignals =
    "site:moneycontrol.com OR site:economictimes.indiatimes.com OR site:nseindia.com Nifty Bank Nifty Sensex live price support resistance FII DII VIX";

  if (period === "sector") {
    const sectorName = sector ?? "Indian stock market";

    return `site:moneycontrol.com OR site:economictimes.indiatimes.com NSE ${sectorName} sector top stocks 20 EMA RSI volume breakout ${date} ${sharedSignals}`;
  }

  return `site:moneycontrol.com OR site:economictimes.indiatimes.com Nifty 50 Bank Nifty Sensex MCX Silver ${period} trading levels ${date} ${sharedSignals}`;
}

function buildPanchangQuery(date: string): string {
  return `site:drikpanchang.com "Drik Panchang" India IST Hindu Panchang Tithi Nakshatra Karana Yoga Rahu Kalam Abhijit Muhurta ${date}`;
}

async function executeExaSearch(
  apiKey: string,
  marketQuery: string,
  panchangQuery: string
): Promise<[Response, Response]> {
  return Promise.all([
    fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        query: marketQuery,
        type: "auto",
        numResults: 6,
        text: true
      })
    }),
    fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        query: panchangQuery,
        type: "auto",
        numResults: 4,
        text: true
      })
    })
  ]);
}

export async function getExaWebContext(
  date: string,
  period: string,
  sector?: string
): Promise<string> {
  const primaryKey = process.env.EXA_API_KEY || "cc0362f2-2664-4103-9c5f-d92f213cccdd";
  const fallbackKey = process.env.EXA_FALLBACK_API_KEY || "0cedf544-1612-461b-b3fc-4d52565064ee";

  const marketQuery = buildSearchQuery(date, period, sector);
  const panchangQuery = buildPanchangQuery(date);

  try {
    let marketRes: Response;
    let panchangRes: Response;

    try {
      [marketRes, panchangRes] = await executeExaSearch(primaryKey, marketQuery, panchangQuery);

      if (!marketRes.ok || !panchangRes.ok) {
        console.warn(`Primary Exa key failed (market=${marketRes.status}, panchang=${panchangRes.status}). Trying fallback key...`);
        [marketRes, panchangRes] = await executeExaSearch(fallbackKey, marketQuery, panchangQuery);
      }
    } catch (err) {
      console.warn("Primary Exa query error, switching to fallback key...", err);
      [marketRes, panchangRes] = await executeExaSearch(fallbackKey, marketQuery, panchangQuery);
    }

    if (!marketRes.ok || !panchangRes.ok) {
      console.error(`Exa error on both keys: market=${marketRes.status}, panchang=${panchangRes.status}`);
      throw new Error(`Exa web search failed (${marketRes.status}/${panchangRes.status}).`);
    }

    const marketPayload = (await marketRes.json()) as ExaSearchResponse;
    const panchangPayload = (await panchangRes.json()) as ExaSearchResponse;

    const marketResults = (marketPayload.results ?? []).sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    );
    const panchangResults = (panchangPayload.results ?? []).sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    );

    let contextParts: string[] = [];

    if (panchangResults.length > 0) {
      contextParts.push("### Astrological Panchang Data for " + date + ":");
      panchangResults.forEach((result, index) => {
        const title = result.title?.trim() || "Panchang Source";
        const text = result.text?.replace(/\s+/g, " ").trim().slice(0, 2500) || "";
        contextParts.push(`[Panchang Source ${index + 1}: ${title}]\n${text}`);
      });
    }

    if (marketResults.length > 0) {
      contextParts.push("\n### Market Technicals, Levels & Macro Data for " + date + ":");
      marketResults.forEach((result, index) => {
        const title = result.title?.trim() || "Market Source";
        const text = result.text?.replace(/\s+/g, " ").trim().slice(0, 2500) || "";
        contextParts.push(`[Market Source ${index + 1}: ${title}]\n${text}`);
      });
    }

    if (contextParts.length === 0) {
      return "No fresh web results were returned for this request.";
    }

    return contextParts.join("\n\n");
  } catch (error) {
    console.error("Exa search error:", error);
    const detail = error instanceof Error ? error.message : String(error);
    // If Exa fails, return a graceful fallback string so the analysis does not crash
    return `Note: Web search context fetch encountered an issue (${detail}). Proceeding with standard historical Panchang & technical calculations for ${date}.`;
  }
}
