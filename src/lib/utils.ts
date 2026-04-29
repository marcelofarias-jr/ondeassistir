import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  return dateStr.slice(0, 4);
}

export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function mediaTypeLabel(type: "movie" | "tv"): string {
  return type === "movie" ? "Filme" : "Série";
}
