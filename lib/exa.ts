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

export async function getExaWebContext(
  date: string,
  period: string,
  sector?: string
): Promise<string> {
  const apiKey = process.env.EXA_API_KEY;

  if (!apiKey) {
    throw new Error("EXA_API_KEY is not configured.");
  }

  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      query: buildSearchQuery(date, period, sector),
      type: "auto",
      numResults: 8,
      text: true
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Exa web search failed.");
  }

  const payload = (await response.json()) as ExaSearchResponse;
  const results = payload.results ?? [];

  if (results.length === 0) {
    return "No fresh web results were returned for this request.";
  }

  return results
    .map((result, index) => {
      const title = result.title?.trim() || "Untitled source";
      const url = result.url?.trim() || "Unknown URL";
      const published = result.publishedDate?.trim() || "Unknown date";
      const text = result.text?.replace(/\s+/g, " ").trim().slice(0, 900) || "No extract available.";

      return [
        `Source ${index + 1}: ${title}`,
        `URL: ${url}`,
        `Published: ${published}`,
        `Extract: ${text}`
      ].join("\n");
    })
    .join("\n\n");
}
