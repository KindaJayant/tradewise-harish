"use client";

import type { AnalysisKind, AnalysisRow } from "@/types/analysis";

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function downloadCSV(rows: AnalysisRow[], date: string, period: AnalysisKind): void {
  if (rows.length === 0) {
    return;
  }

  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const body = rows.map((row) =>
    keys.map((key) => escapeCsvCell(row[key] ?? "")).join(",")
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
