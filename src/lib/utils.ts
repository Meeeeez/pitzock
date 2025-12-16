import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { THoliday } from "./types/holiday";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDateInHoliday(date: Date, holidays?: THoliday[]): boolean {
  if (!holidays) throw new Error("Holidays cannot be undefined!");
  const time = date.getTime();

  return holidays.some(({ from, to }) => {
    const fromTime = new Date(from).getTime();
    const toTime = new Date(to).getTime();
    return time >= fromTime && time <= toTime;
  });
}