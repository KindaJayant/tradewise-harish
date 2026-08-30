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

function getDrikPanchangUrl(date: string): string {
  // Format YYYY-MM-DD into DD/MM/YYYY for Drik Panchang URL
  const parts = date.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `https://www.drikpanchang.com/panchang/day-panchang.html?date=${encodeURIComponent(`${d}/${m}/${y}`)}`;
  }
  return `https://www.drikpanchang.com/panchang/day-panchang.html?date=${encodeURIComponent(date)}`;
}

async function executeDirectUrlFetch(apiKey: string, url: string): Promise<Response> {
  return fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      urls: [url],
      text: true
    })
  });
}

async function executeMarketSearch(apiKey: string, query: string): Promise<Response> {
  return fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      query,
      type: "auto",
      numResults: 6,
      contents: {
        text: {
          maxCharacters: 3000
        }
      }
    })
  });
}

export async function getExaWebContext(
  date: string,
  period: string,
  sector?: string
): Promise<string> {
  const primaryKey = process.env.EXA_API_KEY || "cc0362f2-2664-4103-9c5f-d92f213cccdd";
  const fallbackKey = process.env.EXA_FALLBACK_API_KEY || "0cedf544-1612-461b-b3fc-4d52565064ee";

  const drikUrl = getDrikPanchangUrl(date);
  const marketQuery = buildSearchQuery(date, period, sector);

  try {
    let panchangRes: Response;
    let marketRes: Response;

    try {
      [panchangRes, marketRes] = await Promise.all([
        executeDirectUrlFetch(primaryKey, drikUrl),
        executeMarketSearch(primaryKey, marketQuery)
      ]);

      if (!panchangRes.ok || !marketRes.ok) {
        console.warn(`Primary Exa key failed (panchang=${panchangRes.status}, market=${marketRes.status}). Trying fallback key...`);
        [panchangRes, marketRes] = await Promise.all([
          executeDirectUrlFetch(fallbackKey, drikUrl),
          executeMarketSearch(fallbackKey, marketQuery)
        ]);
      }
    } catch (err) {
      console.warn("Primary Exa query error, switching to fallback key...", err);
      [panchangRes, marketRes] = await Promise.all([
        executeDirectUrlFetch(fallbackKey, drikUrl),
        executeMarketSearch(fallbackKey, marketQuery)
      ]);
    }

    if (!panchangRes.ok || !marketRes.ok) {
      console.error(`Exa error on both keys: panchang=${panchangRes.status}, market=${marketRes.status}`);
      throw new Error(`Exa fetch failed (${panchangRes.status}/${marketRes.status}).`);
    }

    const panchangPayload = (await panchangRes.json()) as ExaSearchResponse;
    const marketPayload = (await marketRes.json()) as ExaSearchResponse;

    let contextParts: string[] = [];

    const panchangResults = panchangPayload.results ?? [];
    if (panchangResults.length > 0) {
      contextParts.push(`### OFFICIAL DRIK PANCHANG (India / IST) FOR ${date} (Source: ${drikUrl}):`);
      panchangResults.forEach((result) => {
        const text = result.text?.replace(/\s+/g, " ").trim() || "";
        contextParts.push(text.slice(0, 6000));
      });
    }

    const marketResults = (marketPayload.results ?? []).sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    );
    if (marketResults.length > 0) {
      contextParts.push(`\n### LIVE FINANCIAL DATA (Nifty, Bank Nifty, Sensex, MCX Silver, Stocks) FOR ${date}:`);
      marketResults.forEach((result, index) => {
        const title = result.title?.trim() || "Market Source";
        const text = result.text?.replace(/\s+/g, " ").trim().slice(0, 3000) || "";
        contextParts.push(`[Source ${index + 1}: ${title}]\n${text}`);
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
