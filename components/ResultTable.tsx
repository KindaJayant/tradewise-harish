"use client";

import { useState } from "react";

import type { AnalysisKind, AnalysisRow } from "@/types/analysis";

interface ResultTableProps {
  rows: AnalysisRow[];
  period: AnalysisKind;
}

const columnLabels: Record<AnalysisKind, Record<string, string>> = {
  daily: {
    time_ist: "Time IST",
    astro_event: "Astrological Event",
    market_bias: "Market Bias",
    nifty_impact: "Nifty Impact & Levels",
    bank_nifty_impact: "Bank Nifty Impact",
    mcx_silver_impact: "MCX Silver Impact",
    bullish_sectors: "Bullish Sectors & Stocks",
    bearish_sectors: "Bearish Sectors & Stocks",
    strategy: "Actionable Strategy"
  },
  weekly: {
    time_ist: "Date",
    day: "Day",
    astro_event: "Astrological Highlights",
    market_bias: "Market Bias",
    nifty_impact: "Nifty Expected Range & RSI",
    bank_nifty_impact: "Bank Nifty Expected Range",
    mcx_silver_impact: "MCX Silver Range",
    bullish_sectors: "Bullish Sectors",
    bearish_sectors: "Bearish Sectors",
    strategy: "Actionable Strategy"
  },
  monthly: {
    time_ist: "Week",
    dates: "Dates",
    astro_event: "Major Astro Events",
    market_bias: "Market Bias",
    nifty_impact: "Nifty Weekly Range",
    bank_nifty_impact: "Bank Nifty Range",
    mcx_silver_impact: "Silver Weekly Range",
    bullish_sectors: "Bullish Sectors",
    bearish_sectors: "Bearish Sectors",
    strategy: "Weekly Strategy"
  },
  half_yearly: {
    time_ist: "Month",
    astro_event: "Key Astro Events",
    market_bias: "Market Bias",
    nifty_impact: "Nifty Expected Monthly Range",
    bank_nifty_impact: "Bank Nifty Expected Range",
    mcx_silver_impact: "Silver Expected Range",
    bullish_sectors: "Primary Sector",
    bearish_sectors: "Secondary Sector",
    position_size_base: "Position Size Base",
    strategy: "Major Risk / Cash Window"
  },
  yearly: {
    time_ist: "Quarter",
    astro_event: "Major Astro Events",
    market_bias: "Market Bias",
    nifty_impact: "Nifty Expected Quarterly Range",
    bank_nifty_impact: "Bank Nifty Expected Range",
    mcx_silver_impact: "Silver Expected Range",
    sector_allocation: "Sector Allocation",
    stock_focus: "Sample Stocks",
    position_size_base: "Position Size",
    strategy: "Key Hedge"
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

const columnWidths: Record<string, string> = {
  time_ist: "min-w-[130px]",
  day: "min-w-[100px]",
  dates: "min-w-[130px]",
  astro_event: "min-w-[240px]",
  market_bias: "min-w-[140px]",
  nifty_impact: "min-w-[200px]",
  bank_nifty_impact: "min-w-[200px]",
  mcx_silver_impact: "min-w-[200px]",
  bullish_sectors: "min-w-[220px]",
  bearish_sectors: "min-w-[220px]",
  sector_allocation: "min-w-[160px]",
  stock_focus: "min-w-[160px]",
  position_size_base: "min-w-[140px]",
  strategy: "min-w-[280px]",
  sector_focus: "min-w-[190px]"
};

const columnKeys: Record<AnalysisKind, string[]> = {
  daily: ["time_ist", "astro_event", "market_bias", "nifty_impact", "bank_nifty_impact", "mcx_silver_impact", "bullish_sectors", "bearish_sectors", "strategy"],
  weekly: ["time_ist", "day", "astro_event", "market_bias", "nifty_impact", "bank_nifty_impact", "mcx_silver_impact", "bullish_sectors", "bearish_sectors", "strategy"],
  monthly: ["time_ist", "dates", "astro_event", "market_bias", "nifty_impact", "bank_nifty_impact", "mcx_silver_impact", "bullish_sectors", "bearish_sectors", "strategy"],
  half_yearly: ["time_ist", "astro_event", "market_bias", "nifty_impact", "bank_nifty_impact", "mcx_silver_impact", "bullish_sectors", "bearish_sectors", "position_size_base", "strategy"],
  yearly: ["time_ist", "astro_event", "market_bias", "nifty_impact", "bank_nifty_impact", "mcx_silver_impact", "sector_allocation", "stock_focus", "position_size_base", "strategy"],
  sector: ["time_ist", "astro_event", "nifty_impact", "bank_nifty_impact", "mcx_silver_impact", "sector_focus", "stock_focus", "strategy"]
};

function getImpactTone(value: string): string {
  const normalized = value.toLowerCase();

  if (normalized.includes("bullish")) {
    return "text-signal-dark font-semibold";
  }

  if (normalized.includes("bearish")) {
    return "text-rose-700 font-semibold";
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
          const badge = getVerdictBadge(row.strategy ?? "");
          const cardTitle = (row.time_ist ?? "").replace(/^Stock\s+\d+\s*:\s*/i, "");

          return (
            <article
              key={`${row.time_ist ?? ""}-${row.strategy ?? ""}-${rowIndex}-sector`}
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

      <div className="rounded-2xl border border-[#d2c2a3] bg-[#f5e8c8] px-4 py-3 text-[11px] leading-5 text-slate-700 md:mt-8">
        <span className="font-bold uppercase tracking-[0.12em] text-slate-900">SEBI Statutory Disclaimer & Risk Disclosure:</span> Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. The contents of this portal are generated purely for educational and analytical purposes by automated models and do not constitute financial advice, buy/sell recommendations, or investment advisory.
      </div>
    </div>
  );
}

export function ResultTable({ rows, period }: ResultTableProps) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const labels = columnLabels[period];
  const currentKeys = columnKeys[period];
  const columns = currentKeys.map((key) => ({
    key,
    label: labels[key] || key,
    widthClass: columnWidths[key] || "min-w-[150px]"
  }));
  const mobileDetailColumns = columns.filter((column) => column.key !== "time_ist");
  const safeSelectedRowIndex = rows.length > 0 ? Math.min(selectedRowIndex, rows.length - 1) : 0;
  const selectedRow = rows[safeSelectedRowIndex];

  function getMobileValueTone(key: string, value: string): string {
    if (
      key === "nifty_impact" ||
      key === "bank_nifty_impact" ||
      key === "mcx_silver_impact" ||
      key === "market_bias"
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
                const rowBackground = rowIndex % 2 === 0 ? "bg-[#fffaf0]" : "bg-[#f4efe4]" ;

                return (
                  <tr key={`${row.time_ist ?? rowIndex}-${rowIndex}`} className="group">
                    {columns.map((column, columnIndex) => {
                      const value = row[column.key] ?? "";
                      const impactCell =
                        column.key === "nifty_impact" ||
                        column.key === "bank_nifty_impact" ||
                        column.key === "mcx_silver_impact" ||
                        column.key === "market_bias";
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
                const rowLabel = row.time_ist ?? `Entry ${rowIndex + 1}`;

                return (
                  <button
                    key={`${rowLabel}-${rowIndex}-period-filter`}
                    type="button"
                    onClick={() => setSelectedRowIndex(rowIndex)}
                    className={`shrink-0 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                      active
                        ? "border-signal bg-[#f3cf78] text-navy"
                        : "border-[#d2c2a3] bg-[#fffaf0] text-slate-600"
                      }`}
                  >
                    {rowLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {selectedRow && (
          <article
            key={`${selectedRow.time_ist ?? safeSelectedRowIndex}-${safeSelectedRowIndex}-mobile`}
            className="panel-surface rounded-[22px] p-4"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {labels.time_ist || "Time"}
                </div>
                <div className="mt-1 text-lg font-semibold leading-6 break-words text-navy">
                  {selectedRow.time_ist ?? `Entry ${safeSelectedRowIndex + 1}`}
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
                      selectedRow[column.key] ?? ""
                    )}`}
                  >
                    {selectedRow[column.key] ?? ""}
                  </p>
                </section>
              ))}
            </div>
          </article>
        )}
      </div>

      <div className="rounded-2xl border border-[#d2c2a3] bg-[#f5e8c8] px-4 py-3 text-[11px] leading-5 text-slate-700 md:mt-8">
        <span className="font-bold uppercase tracking-[0.12em] text-slate-900">SEBI Statutory Disclaimer & Risk Disclosure:</span> Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. The contents of this portal are generated purely for educational and analytical purposes by automated models and do not constitute financial advice, buy/sell recommendations, or investment advisory.
      </div>
    </div>
  );
}
