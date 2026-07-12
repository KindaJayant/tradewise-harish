"use client";

import { useState } from "react";

import type { AnalysisKind, AnalysisRow } from "@/types/analysis";

interface ResultTableProps {
  rows: AnalysisRow[];
  period: AnalysisKind;
}

const columnLabels: Record<AnalysisKind, Record<keyof AnalysisRow, string>> = {
  daily: {
    time_ist: "Time IST",
    astro_event: "Astro Event",
    nifty_impact: "Nifty Impact",
    bank_nifty_impact: "Bank Nifty Impact",
    mcx_silver_impact: "MCX Silver Impact",
    sector_focus: "Sector Focus",
    stock_focus: "Stock Focus",
    strategy: "Strategy"
  },
  weekly: {
    time_ist: "Date",
    astro_event: "Day / Astro Highlights",
    nifty_impact: "Nifty Range",
    bank_nifty_impact: "Bank Nifty Range",
    mcx_silver_impact: "MCX Silver Range",
    sector_focus: "Favoured Sectors",
    stock_focus: "Stocks",
    strategy: "Daily Strategy"
  },
  monthly: {
    time_ist: "Week",
    astro_event: "Major Astro Events",
    nifty_impact: "Nifty Weekly Range",
    bank_nifty_impact: "Bank Nifty Range",
    mcx_silver_impact: "Silver Weekly Range",
    sector_focus: "Sector Focus",
    stock_focus: "Stocks",
    strategy: "Weekly Strategy"
  },
  half_yearly: {
    time_ist: "Month",
    astro_event: "Key Astro Events",
    nifty_impact: "Nifty Monthly Range",
    bank_nifty_impact: "Bank Nifty Range",
    mcx_silver_impact: "Silver Range",
    sector_focus: "Primary Sector",
    stock_focus: "Secondary Sector",
    strategy: "Position / Risk"
  },
  yearly: {
    time_ist: "Quarter",
    astro_event: "Major Astro Events",
    nifty_impact: "Nifty Quarterly Range",
    bank_nifty_impact: "Bank Nifty Range",
    mcx_silver_impact: "Silver Range",
    sector_focus: "Sector Allocation",
    stock_focus: "Sample Stocks",
    strategy: "Position / Hedge"
  },
  sector: {
    time_ist: "Section",
    astro_event: "Astro Checklist",
    nifty_impact: "Technical Score",
    bank_nifty_impact: "Risk Checks",
    mcx_silver_impact: "Targets / SL",
    sector_focus: "Sector Cues",
    stock_focus: "Stock Details",
    strategy: "Verdict / Action"
  }
};

const columnWidths: Record<keyof AnalysisRow, string> = {
  time_ist: "min-w-[160px]",
  astro_event: "min-w-[220px]",
  nifty_impact: "min-w-[200px]",
  bank_nifty_impact: "min-w-[210px]",
  mcx_silver_impact: "min-w-[210px]",
  sector_focus: "min-w-[190px]",
  stock_focus: "min-w-[180px]",
  strategy: "min-w-[300px]"
};

const columnKeys: Array<keyof AnalysisRow> = [
  "time_ist",
  "astro_event",
  "nifty_impact",
  "bank_nifty_impact",
  "mcx_silver_impact",
  "sector_focus",
  "stock_focus",
  "strategy"
];

function getImpactTone(value: string): string {
  const normalized = value.toLowerCase();

  if (normalized.includes("bullish")) {
    return "text-signal-dark";
  }

  if (normalized.includes("bearish")) {
    return "text-rose-700";
  }

  return "text-slate-700";
}

function getVerdictBadge(value: string): { label: string; className: string } {
  const normalized = value.toLowerCase();

  if (normalized.includes("pass") || normalized.includes("buy")) {
    return {
      label: normalized.includes("buy") ? "Buy setup" : "Pass",
      className: "border-signal bg-[#f3cf78] text-navy"
    };
  }

  if (normalized.includes("fail") || normalized.includes("avoid") || normalized.includes("no trade")) {
    return {
      label: "Avoid",
      className: "border-rose-200 bg-rose-50 text-rose-700"
    };
  }

  return {
    label: "Review",
    className: "border-[#d2c2a3] bg-[#f5e8c8] text-slate-700"
  };
}

function SectorResultCards({ rows }: { rows: AnalysisRow[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {rows.map((row, rowIndex) => {
          const badge = getVerdictBadge(row.strategy);
          const cardTitle = row.time_ist.replace(/^Stock\s+\d+\s*:\s*/i, "");

          return (
            <article
              key={`${row.time_ist}-${row.strategy}-${rowIndex}-sector`}
              className="panel-surface rounded-[22px] p-4 md:p-5"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Sector output
                  </div>
                  <h3 className="mt-1 text-xl font-bold leading-7 tracking-tight text-navy">
                    {cardTitle}
                  </h3>
                </div>
                <span
                  className={`w-fit rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <section className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] p-4">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Astro checklist
                  </div>
                  <p className="text-sm leading-7 text-slate-800">{row.astro_event}</p>
                </section>

                <section className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] p-4">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Technical score
                  </div>
                  <p className="text-sm leading-7 text-slate-800">{row.nifty_impact}</p>
                </section>

                <section className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] p-4">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Risk checks
                  </div>
                  <p className="text-sm leading-7 text-slate-800">{row.bank_nifty_impact}</p>
                </section>

                <section className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] p-4">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Targets / stop loss
                  </div>
                  <p className="text-sm leading-7 text-slate-800">{row.mcx_silver_impact}</p>
                </section>

                <section className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] p-4">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Sector cues
                  </div>
                  <p className="text-sm leading-7 text-slate-800">{row.sector_focus}</p>
                </section>

                <section className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] p-4">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Stock details
                  </div>
                  <p className="text-sm leading-7 text-slate-800">{row.stock_focus}</p>
                </section>
              </div>

              <section className="mt-3 rounded-[18px] border border-signal/40 bg-[#f5e8c8] p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Verdict / action
                </div>
                <p className="text-sm font-medium leading-7 text-navy">{row.strategy}</p>
              </section>
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#d2c2a3] bg-[#f5e8c8] px-4 py-3 text-right text-[11px] uppercase tracking-[0.16em] text-slate-500">
        Data generated by AI. Not financial advice.
      </div>
    </div>
  );
}

export function ResultTable({ rows, period }: ResultTableProps) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const labels = columnLabels[period];
  const columns = columnKeys.map((key) => ({
    key,
    label: labels[key],
    widthClass: columnWidths[key]
  }));
  const mobileDetailColumns = columns.filter(
    (column): column is { key: Exclude<keyof AnalysisRow, "time_ist">; label: string; widthClass: string } =>
      column.key !== "time_ist"
  );
  const safeSelectedRowIndex = rows.length > 0 ? Math.min(selectedRowIndex, rows.length - 1) : 0;
  const selectedRow = rows[safeSelectedRowIndex];

  function getMobileValueTone(key: Exclude<keyof AnalysisRow, "time_ist">, value: string): string {
    if (
      key === "nifty_impact" ||
      key === "bank_nifty_impact" ||
      key === "mcx_silver_impact"
    ) {
      return getImpactTone(value);
    }

    return "text-slate-800";
  }

  if (period === "sector") {
    return <SectorResultCards rows={rows} />;
  }

  return (
    <div className="space-y-4">
      <div className="panel-surface hidden overflow-hidden rounded-[22px] p-3 md:block">
        <div className="max-h-[72vh] overflow-auto rounded-[18px]">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`${column.widthClass} sticky top-0 border-b border-[#d2c2a3] bg-[#181d3b] px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f8df9a] ${
                      index === 0 ? "left-0 z-30 rounded-l-2xl bg-[#181d3b]" : "z-20"
                    } ${index === columns.length - 1 ? "rounded-r-2xl" : ""}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full border border-[#f8df9a] bg-signal/90" />
                      {column.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-sans text-[13px] leading-7 text-slate-800">
              {rows.map((row, rowIndex) => {
                const rowBackground = rowIndex % 2 === 0 ? "bg-[#fffaf0]" : "bg-[#f4efe4]";

                return (
                  <tr key={`${row.time_ist}-${row.astro_event}-${rowIndex}`} className="group">
                    {columns.map((column, columnIndex) => {
                      const value = row[column.key];
                      const impactCell =
                        column.key === "nifty_impact" ||
                        column.key === "bank_nifty_impact" ||
                        column.key === "mcx_silver_impact";
                      const isFirst = columnIndex === 0;
                      const isLast = columnIndex === columns.length - 1;

                      return (
                        <td
                          key={column.key}
                          className={`${column.widthClass} border-b border-[#e0d4bc] px-5 py-5 align-top transition ${
                            isFirst ? `sticky left-0 z-10 ${rowBackground}` : rowBackground
                          } ${isFirst ? "rounded-l-2xl" : ""} ${isLast ? "rounded-r-2xl" : ""} ${
                            impactCell ? getImpactTone(value) : "text-slate-800"
                          } group-hover:bg-[#efe3c8]`}
                        >
                          <div
                            className={`${
                              column.key === "time_ist"
                                ? "font-sans text-[15px] font-semibold text-slate-900"
                                : ""
                            }`}
                          >
                            {value}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        <div className="panel-surface rounded-[22px] p-3">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Time period
          </div>
          <div className="-mx-1 overflow-x-auto no-scrollbar">
            <div className="flex min-w-max flex-nowrap gap-2 px-1">
              {rows.map((row, rowIndex) => {
                const active = rowIndex === safeSelectedRowIndex;

                return (
                  <button
                    key={`${row.time_ist}-${rowIndex}-period-filter`}
                    type="button"
                    onClick={() => setSelectedRowIndex(rowIndex)}
                    className={`shrink-0 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                      active
                        ? "border-signal bg-[#f3cf78] text-navy"
                        : "border-[#d2c2a3] bg-[#fffaf0] text-slate-600"
                      }`}
                  >
                    {row.time_ist}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {selectedRow && (
          <article
            key={`${selectedRow.time_ist}-${safeSelectedRowIndex}-mobile`}
            className="panel-surface rounded-[22px] p-4"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {labels.time_ist}
                </div>
                <div className="mt-1 text-lg font-semibold leading-6 break-words text-navy">
                  {selectedRow.time_ist}
                </div>
              </div>
              <div className="shrink-0 rounded-full border border-[#d2c2a3] bg-[#f5e8c8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                Entry {safeSelectedRowIndex + 1}
              </div>
            </div>

            <div className="grid gap-3">
              {mobileDetailColumns.map((column) => (
                <section
                  key={column.key}
                  className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] p-4"
                >
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {column.label}
                  </div>
                  <p
                    className={`text-[15px] leading-7 ${getMobileValueTone(
                      column.key,
                      selectedRow[column.key]
                    )}`}
                  >
                    {selectedRow[column.key]}
                  </p>
                </section>
              ))}
            </div>
          </article>
        )}
      </div>

      <div className="rounded-2xl border border-[#d2c2a3] bg-[#f5e8c8] px-4 py-3 text-right text-[11px] uppercase tracking-[0.16em] text-slate-500 md:mt-8">
        Data generated by AI. Not financial advice.
      </div>
    </div>
  );
}
