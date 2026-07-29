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
    "India VIX FII DII flows RBI Fed CPI rupee crude yields NSE support resistance";

  if (period === "sector") {
    const sectorName = sector ?? "Indian stock market";

    return [
      `NSE ${sectorName} sector top stocks 20 EMA RSI volume breakout ${date}`,
      `${sectorName} sector outlook India stock market ${date}`,
      sharedSignals
    ].join(", ");
  }

  return [
    `Nifty Bank Nifty MCX Silver ${period} trading plan support resistance ${date}`,
    `Indian stock market sector rotation lead sectors avoid sectors FII DII VIX ${date}`,
    `India economic calendar RBI Fed CPI Gann cycle market dates ${date}`,
    sharedSignals
  ].join(", ");
}

function buildPanchangQuery(date: string): string {
  return `Vedic Hindu Panchang Nakshatra Tithi Karana Hora Rahu Kaal Abhijit Muhurat for ${date}`;
}

export async function getExaWebContext(
  date: string,
  period: string,
  sector?: string
): Promise<string> {
  const apiKey = process.env.EXA_API_KEY;

  if (!apiKey) {
    throw new Error("EXA_API_KEY is not configured.");
  }

  const marketQuery = buildSearchQuery(date, period, sector);
  const panchangQuery = buildPanchangQuery(date);

  try {
    const [marketRes, panchangRes] = await Promise.all([
      fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          query: marketQuery,
          type: "neural",
          numResults: 6,
          text: true
        }),
        cache: "force-cache"
      }),
      fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          query: panchangQuery,
          type: "neural",
          numResults: 4,
          text: true
        }),
        cache: "force-cache"
      })
    ]);

    if (!marketRes.ok || !panchangRes.ok) {
      throw new Error("Exa web search failed.");
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
        const text = result.text?.replace(/\s+/g, " ").trim().slice(0, 900) || "";
        contextParts.push(`[Panchang Source ${index + 1}: ${title}]\n${text}`);
      });
    }

    if (marketResults.length > 0) {
      contextParts.push("\n### Market Technicals, Levels & Macro Data for " + date + ":");
      marketResults.forEach((result, index) => {
        const title = result.title?.trim() || "Market Source";
        const text = result.text?.replace(/\s+/g, " ").trim().slice(0, 800) || "";
        contextParts.push(`[Market Source ${index + 1}: ${title}]\n${text}`);
      });
    }

    if (contextParts.length === 0) {
      return "No fresh web results were returned for this request.";
    }

    return contextParts.join("\n\n");
  } catch (error) {
    console.error("Exa search error:", error);
    throw new Error("Exa web search failed.");
  }
}
