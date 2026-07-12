export interface AnalysisRow {
  time_ist: string;
  astro_event: string;
  nifty_impact: string;
  bank_nifty_impact: string;
  mcx_silver_impact: string;
  sector_focus: string;
  stock_focus: string;
  strategy: string;
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
