"use client";

import type { AnalysisKind, AnalysisRow } from "@/types/analysis";

const CSV_COLUMNS: Array<{ key: keyof AnalysisRow; label: string }> = [
  { key: "time_ist", label: "time_ist" },
  { key: "astro_event", label: "astro_event" },
  { key: "nifty_impact", label: "nifty_impact" },
  { key: "bank_nifty_impact", label: "bank_nifty_impact" },
  { key: "mcx_silver_impact", label: "mcx_silver_impact" },
  { key: "sector_focus", label: "sector_focus" },
  { key: "stock_focus", label: "stock_focus" },
  { key: "strategy", label: "strategy" }
];

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function downloadCSV(rows: AnalysisRow[], date: string, period: AnalysisKind): void {
  const header = CSV_COLUMNS.map((column) => column.label).join(",");
  const body = rows.map((row) =>
    CSV_COLUMNS.map((column) => escapeCsvCell(row[column.key])).join(",")
  );

  const csv = [header, ...body].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `tradewise-analysis-${date}-${period}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
