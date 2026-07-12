export interface AnalysisRow {
  // Common across timeframes
  time_ist?: string;
  astro_event?: string;
  market_bias?: string;
  nifty_impact?: string;
  bank_nifty_impact?: string;
  mcx_silver_impact?: string;
  strategy?: string;

  // Specific to certain timeframes
  day?: string;
  dates?: string;
  bullish_sectors?: string;
  bearish_sectors?: string;
  sector_allocation?: string;
  stock_focus?: string;
  position_size_base?: string;

  // Flexible indexing signature
  [key: string]: string | undefined;
}

export type Period = "daily" | "weekly" | "monthly" | "half_yearly" | "yearly";
export type AnalysisKind = Period | "sector";

export interface AnalysisSuccessResponse {
  success: true;
  rows: AnalysisRow[];
}

export interface AnalysisErrorResponse {
  success: false;
  error: string;
}

export type AnalysisResponse = AnalysisSuccessResponse | AnalysisErrorResponse;
