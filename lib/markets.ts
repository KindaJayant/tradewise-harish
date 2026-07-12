import type { Period } from "@/types/analysis";

export const SECTORS = [
  "Banking",
  "IT",
  "Auto",
  "Pharma",
  "Energy",
  "FMCG",
  "Metal",
  "Realty",
  "Infrastructure",
  "Media"
] as const;

export type Sector = (typeof SECTORS)[number];

export const PERIOD_OPTIONS: Array<{ label: string; value: Period }> = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Half-Yearly", value: "half_yearly" },
  { label: "Yearly", value: "yearly" }
];
