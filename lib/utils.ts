import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ProficiencyLevel } from "./types";

/**
 * Merges tailwind classes using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a human-readable format.
 * Example: "Jan 5, 2025"
 */
export function formatDate(date: string | Date | null) {
  if (!date) return "No date";
  return format(new Date(date), "MMM d, yyyy");
}

/**
 * Formats a proficiency level to uppercase.
 * Example: "a1" -> "A1"
 */
export function formatLevel(level: ProficiencyLevel | string) {
  return level.toUpperCase();
}

/**
 * Returns a human-readable label for a lesson kind.
 */
export function getLessonKindLabel(kind: string) {
  return kind.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
