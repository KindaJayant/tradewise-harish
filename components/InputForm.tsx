"use client";

import { PERIOD_OPTIONS } from "@/lib/markets";
import type { Period } from "@/types/analysis";

interface InputFormProps {
  date: string;
  period: Period;
  loading: boolean;
  onDateChange: (value: string) => void;
  onPeriodChange: (value: Period) => void;
  onSubmit: () => void;
  compact?: boolean;
}

export function InputForm({
  date,
  period,
  loading,
  onDateChange,
  onPeriodChange,
  onSubmit,
  compact = false
}: InputFormProps) {
  if (compact) {
    return (
      <form
        className="panel-surface rounded-[22px] px-4 py-4 md:px-5 md:py-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[1.05fr_1fr_auto]">
          <label className="min-w-0 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Start Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-11 w-full rounded-[16px] border border-[#d2c2a3] bg-[#fffaf0] px-3 text-[14px] text-navy outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/25"
            />
          </label>

          <label className="min-w-0 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Period
            </span>
            <select
              value={period}
              onChange={(event) => onPeriodChange(event.target.value as Period)}
              className="h-11 w-full rounded-[16px] border border-[#d2c2a3] bg-[#fffaf0] px-3 text-[14px] text-navy outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/25"
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`col-span-2 flex h-11 items-center justify-center rounded-[16px] border border-signal px-4 text-[12px] font-bold uppercase tracking-[0.14em] transition sm:col-span-1 sm:min-w-[102px] ${
              loading
                ? "cursor-not-allowed bg-[#d8c79f] text-navy/50"
                : "bg-navy text-[#f8df9a] shadow-[0_16px_34px_rgba(16,18,37,0.22)] hover:-translate-y-0.5 hover:border-[#f3cf78] hover:bg-[#181d3b]"
            } ${loading ? "" : "animate-idle-pulse"}`}
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Go"
            )}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      className="panel-surface rounded-[22px] px-4 py-4 md:px-5 md:py-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            Start Date
          </span>
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            className="h-11 w-full rounded-[16px] border border-[#d2c2a3] bg-[#fffaf0] px-4 text-[15px] text-navy outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/25 md:h-12 md:text-base"
          />
        </label>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            Period
          </span>
          <div className="grid grid-cols-2 gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const active = option.value === period;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPeriodChange(option.value)}
                  className={`h-11 rounded-[16px] border px-2 text-xs font-semibold transition sm:px-3 sm:text-sm md:h-12 ${
                    active
                      ? "border-signal bg-[#f3cf78] text-navy shadow-signal"
                      : "border-[#d2c2a3] bg-[#fffaf0] text-slate-700 hover:border-signal/70 hover:text-navy"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex h-11 w-full items-center justify-center gap-2 rounded-[16px] border border-signal px-5 text-sm font-bold uppercase tracking-[0.16em] transition md:h-12 ${
            loading
              ? "cursor-not-allowed bg-[#d8c79f] text-navy/50"
              : "bg-navy text-[#f8df9a] shadow-[0_16px_34px_rgba(16,18,37,0.22)] hover:-translate-y-0.5 hover:border-[#f3cf78] hover:bg-[#181d3b]"
          } ${loading ? "" : "animate-idle-pulse"}`}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>
    </form>
  );
}
