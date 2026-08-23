"use client";

import { useEffect, useState } from "react";

import { InputForm } from "@/components/InputForm";
import { ResultTable } from "@/components/ResultTable";
import { downloadCSV } from "@/lib/csv";
import { SECTORS, type Sector } from "@/lib/markets";
import type { AnalysisKind, AnalysisResponse, AnalysisRow, Period } from "@/types/analysis";

type ViewState = "idle" | "loading" | "error" | "success";
type MobileScreen = "inputs" | "results";
type WorkspaceTab = "analysis" | "selector";

const ANALYSIS_STAGES = [
  {
    title: "Setting analysis parameters",
    description: "Locking the date, market lens, and output structure for this run."
  },
  {
    title: "Scanning live web context",
    description: "Checking current market context before the model builds the readout."
  },
  {
    title: "Synthesizing astro-financial signals",
    description: "Combining planetary timing with market structure and sector behavior."
  },
  {
    title: "Finalizing trading readout",
    description: "Formatting the response into a clean result view."
  }
] as const;

function getTodayDate(): string {
  // Always format in Indian Standard Time (Asia/Kolkata)
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function LoadingSkeleton({ activeStage }: { activeStage: number }) {
  const progress = ((activeStage + 1) / ANALYSIS_STAGES.length) * 100;

  return (
    <div className="space-y-4">
      <div className="panel-surface overflow-hidden rounded-[22px] p-4 md:p-5">
        <div className="flex flex-col gap-4 md:hidden">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Analysis in progress
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-navy">
              {ANALYSIS_STAGES[activeStage].title}
            </h2>
            <p className="text-[14px] leading-6 text-slate-600">
              {ANALYSIS_STAGES[activeStage].description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-[#dfd0b2]">
              <div
                className="h-full rounded-full bg-signal transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-500">
              <span>
                Step {activeStage + 1} of {ANALYSIS_STAGES.length}
              </span>
              <span>{Math.round(progress)}% ready</span>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] px-3 py-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Current step
            </div>
            <div className="text-sm font-medium text-slate-800">
              {ANALYSIS_STAGES[activeStage].title}
            </div>
            <div className="mt-2 flex gap-1.5">
              {ANALYSIS_STAGES.map((stage, index) => {
                const completed = index < activeStage;
                const current = index === activeStage;

                return (
                  <span
                    key={stage.title}
                    className={`h-1.5 flex-1 rounded-full ${
                    current || completed ? "bg-signal" : "bg-[#dfd0b2]"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden flex-col gap-4 md:flex">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-center">
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Analysis in progress
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-navy md:text-2xl">
                {ANALYSIS_STAGES[activeStage].title}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                {ANALYSIS_STAGES[activeStage].description}
              </p>
            </div>
            <div className="rounded-[18px] border border-[#d2c2a3] bg-[#fffaf0] px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-slate-500">
                <span>Run status</span>
                <span>{Math.round(progress)}% ready</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#dfd0b2]">
                <div
                  className="h-full rounded-full bg-signal transition-[width] duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                Usually completes within 20-30 seconds
              </div>
            </div>
          </div>

          <div className="grid gap-2 pt-1 lg:grid-cols-4">
            {ANALYSIS_STAGES.map((stage, index) => {
              const completed = index < activeStage;
              const current = index === activeStage;

              return (
                <div
                  key={stage.title}
                  className={`rounded-[18px] border px-3 py-3 text-xs font-medium tracking-[0.01em] transition ${
                    current
                      ? "border-signal/50 bg-[#f5e8c8] text-signal-dark"
                      : completed
                        ? "border-[#d2c2a3] bg-[#fffaf0] text-slate-700"
                        : "border-[#d2c2a3] bg-white/70 text-slate-500"
                  }`}
                >
                  <span className="mr-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/90 px-1 text-[10px] font-semibold">
                    {completed ? "✓" : index + 1}
                  </span>
                  {stage.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="panel-surface overflow-hidden rounded-[22px] p-4">
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[18px] border border-slate-200 bg-white p-3">
              <div className="shimmer-bar h-3 w-24 rounded-full animate-shimmer" />
              <div className="mt-3 space-y-2">
                <div className="shimmer-bar h-3 w-full rounded-full animate-shimmer" />
                <div className="shimmer-bar h-3 w-5/6 rounded-full animate-shimmer" />
                <div className="shimmer-bar h-3 w-3/5 rounded-full animate-shimmer" />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden space-y-3 md:block">
          <div className="shimmer-bar h-4 w-40 rounded-full animate-shimmer" />
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[140px_1fr_1fr] gap-2 md:grid-cols-[160px_1.6fr_1fr_1fr]">
                <div className="shimmer-bar h-12 rounded-[18px] animate-shimmer border border-slate-200 bg-white" />
                <div className="shimmer-bar h-12 rounded-[18px] animate-shimmer border border-slate-200 bg-white md:h-12" />
                <div className="shimmer-bar h-12 rounded-[18px] animate-shimmer border border-slate-200 bg-white" />
                <div className="hidden shimmer-bar rounded-[18px] animate-shimmer border border-slate-200 bg-white md:block md:h-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceTabs({
  activeTab,
  onTabChange
}: {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}) {
  const tabs: Array<{ value: WorkspaceTab; label: string; meta: string }> = [
    { value: "analysis", label: "Market Analysis", meta: "Daily to yearly plans" },
    { value: "selector", label: "Stock Selector", meta: "Sector checklist" }
  ];

  return (
    <div className="tab-surface grid gap-2 rounded-[22px] p-2 md:grid-cols-2">
      {tabs.map((tab) => {
        const active = tab.value === activeTab;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`rounded-[17px] px-4 py-3 text-left transition ${
              active
                ? "bg-navy text-[#f8df9a] shadow-[0_16px_34px_rgba(16,18,37,0.2)]"
                : "bg-transparent text-slate-600 hover:bg-[#fffaf0] hover:text-navy"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm ${
                  active
                    ? "border-[#f8df9a]/60 bg-[#f8df9a]/10"
                    : "border-[#d2c2a3] bg-[#fffaf0]"
                }`}
              >
                {tab.value === "analysis" ? "A" : "S"}
              </span>
              <span>
                <span className="block text-sm font-bold uppercase tracking-[0.14em]">
                  {tab.label}
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    active ? "text-[#f8df9a]/70" : "text-slate-500"
                  }`}
                >
                  {tab.meta}
                </span>
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ResultActions({
  rows,
  lastRun,
  onReanalyze
}: {
  rows: AnalysisRow[];
  lastRun: { date: string; period: AnalysisKind } | null;
  onReanalyze: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row md:mt-2">
      <button
        type="button"
        onClick={() => {
          if (lastRun) {
            downloadCSV(rows, lastRun.date, lastRun.period);
          }
        }}
        className="h-11 rounded-[16px] border border-signal bg-[#fffaf0] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-signal-dark transition hover:bg-[#f3cf78] hover:text-navy"
      >
        Export CSV
      </button>
      <button
        type="button"
        onClick={onReanalyze}
        className="h-11 rounded-[16px] border border-[#d2c2a3] bg-[#fffaf0] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-800 transition hover:border-signal hover:text-signal-dark"
      >
        Re-analyze
      </button>
    </div>
  );
}

function SectorSelectionPanel({
  sector,
  loading,
  onSectorChange,
  onRun
}: {
  sector: Sector;
  loading: boolean;
  onSectorChange: (value: Sector) => void;
  onRun: () => void;
}) {
  return (
    <section className="panel-surface rounded-[22px] px-4 py-4 md:px-5 md:py-5">
      <div className="grid gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            Sector Lens
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-navy">
            Stock selector
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Run the separate Triple Confirmation checklist for one sector when you want top stock picks.
          </p>
        </div>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            Sector
          </span>
          <select
            value={sector}
            onChange={(event) => onSectorChange(event.target.value as Sector)}
            className="h-11 w-full rounded-[16px] border border-[#d2c2a3] bg-[#fffaf0] px-4 text-[15px] text-navy outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/25 md:h-12 md:text-base"
          >
            {SECTORS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={loading}
          onClick={onRun}
          className={`flex h-11 w-full items-center justify-center gap-2 rounded-[16px] border px-5 text-sm font-bold uppercase tracking-[0.14em] transition md:h-12 ${
            loading
              ? "cursor-not-allowed border-[#d2c2a3] bg-[#d8c79f] text-navy/50"
              : "border-navy bg-navy text-[#f8df9a] shadow-[0_16px_34px_rgba(16,18,37,0.22)] hover:-translate-y-0.5 hover:border-signal"
          }`}
        >
          Stock Selection
        </button>
      </div>
    </section>
  );
}

function MobileControlPanel({
  activeTab,
  date,
  period,
  sector,
  loading,
  onTabChange,
  onDateChange,
  onPeriodChange,
  onSectorChange,
  onAnalyze,
  onSelectSector
}: {
  activeTab: WorkspaceTab;
  date: string;
  period: Period;
  sector: Sector;
  loading: boolean;
  onTabChange: (tab: WorkspaceTab) => void;
  onDateChange: (value: string) => void;
  onPeriodChange: (value: Period) => void;
  onSectorChange: (value: Sector) => void;
  onAnalyze: () => void;
  onSelectSector: () => void;
}) {
  return (
    <section className="panel-surface rounded-[22px] px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Step 1 of 2
          </div>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-navy">
            Choose your workspace
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onTabChange(activeTab === "analysis" ? "selector" : "analysis")}
          className="rounded-full border border-[#d2c2a3] bg-[#fffaf0] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:border-signal hover:text-signal-dark"
        >
          {activeTab === "analysis" ? "Sector" : "Analysis"}
        </button>
      </div>

      <div className="mb-3">
        <WorkspaceTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {activeTab === "analysis" ? (
        <InputForm
          date={date}
          period={period}
          loading={loading}
          compact
          onDateChange={onDateChange}
          onPeriodChange={onPeriodChange}
          onSubmit={onAnalyze}
        />
      ) : (
        <div className="panel-surface rounded-[22px] px-4 py-4">
          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <label className="space-y-2 min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                Sector
              </span>
              <select
                value={sector}
                onChange={(event) => onSectorChange(event.target.value as Sector)}
                className="h-11 w-full rounded-[16px] border border-[#d2c2a3] bg-[#fffaf0] px-3 text-[14px] text-navy outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/25"
              >
                {SECTORS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              disabled={loading}
              onClick={onSelectSector}
              className={`flex h-11 min-w-[110px] items-center justify-center rounded-[16px] border border-signal px-4 text-[12px] font-bold uppercase tracking-[0.14em] transition ${
                loading
                  ? "cursor-not-allowed bg-[#d8c79f] text-navy/50"
                  : "bg-navy text-[#f8df9a] shadow-[0_16px_34px_rgba(16,18,37,0.22)] hover:-translate-y-0.5 hover:border-[#f3cf78] hover:bg-[#181d3b]"
              }`}
            >
              Selector
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function HomePage() {
  const todayDate = getTodayDate();
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setDate(getTodayDate());
  }, []);
  const [period, setPeriod] = useState<Period>("daily");
  const [sector, setSector] = useState<Sector>("Banking");
  const [rows, setRows] = useState<AnalysisRow[]>([]);
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [error, setError] = useState<string>("");
  const [lastRun, setLastRun] = useState<{ date: string; period: AnalysisKind } | null>(null);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>("inputs");
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("analysis");

  useEffect(() => {
    if (viewState !== "loading") {
      setActiveStage(0);
      return;
    }

    const timers = ANALYSIS_STAGES.map((_, index) =>
      window.setTimeout(() => {
        setActiveStage(index);
      }, index * 3500)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [viewState]);

  async function runAnalysis(nextPeriod: AnalysisKind = period): Promise<void> {
    const safeDate = date || todayDate;
    const requestBody =
      nextPeriod === "sector"
        ? { date: safeDate, period: nextPeriod, sector }
        : { date: safeDate, period: nextPeriod };

    setMobileScreen("results");
    setViewState("loading");
    setError("");
    setActiveStage(0);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const payload = (await response.json()) as AnalysisResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? "Request failed." : payload.error);
      }

      setRows(payload.rows);
      setLastRun({ date: safeDate, period: nextPeriod });
      setViewState("success");
    } catch (caughtError: unknown) {
      setRows([]);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while generating the analysis."
      );
      setViewState("error");
    }
  }

  function changeTab(tab: WorkspaceTab): void {
    setActiveTab(tab);
    setMobileScreen("inputs");
    setRows([]);
    setError("");
    setLastRun(null);
    setViewState("idle");
  }

  const currentRunKind = lastRun?.period ?? (activeTab === "selector" ? "sector" : period);

  const results = (
    <div className="space-y-4">
      {viewState === "idle" && (
        <section className="panel-surface rounded-[22px] px-4 py-14 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            {activeTab === "analysis"
              ? "Select a planning period and run analysis"
              : "Choose a sector and run stock selection"}
          </p>
        </section>
      )}

      {viewState === "loading" && <LoadingSkeleton activeStage={activeStage} />}

      {viewState === "error" && (
        <section className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
            Analysis Error
          </div>
          <p>{error}</p>
        </section>
      )}

      {viewState === "success" && (
        <section className="space-y-4">
          <ResultTable rows={rows} period={currentRunKind} />
          <ResultActions
            rows={rows}
            lastRun={lastRun}
            onReanalyze={() => {
              void runAnalysis(currentRunKind);
            }}
          />
        </section>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#101225] text-cream flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full text-center space-y-6 rounded-[28px] p-8 md:p-12 border border-[#f8df9a]/40 bg-gradient-to-b from-[#181d3b] to-[#101225] shadow-2xl">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#f8df9a]/10 border border-[#f8df9a]/30 text-[#f8df9a] text-5xl shadow-inner mx-auto">
          ⚠️
        </div>
        
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#f8df9a]/40 bg-[#f8df9a]/10 text-[#f8df9a] text-xs font-bold uppercase tracking-[0.22em]">
            System Maintenance Notice
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
            Under Maintenance
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            TradeWise is currently undergoing scheduled system updates and Panchang timing recalibration to enhance analysis accuracy.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-700/50 flex flex-col items-center justify-center gap-2 text-xs uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f8df9a] animate-pulse" />
            <span className="font-semibold text-slate-200">Expected Return: Shortly</span>
          </div>
          <span className="text-[10px] text-slate-500">Thank you for your patience</span>
        </div>
      </div>
    </main>
  );
}
