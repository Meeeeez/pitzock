import type { TTimeSlot } from "@/lib/types/business";

export const SLOT_MINUTES = 15;

/** "HH:mm" → minutes since midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** minutes → "HH:mm" */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Expand opening-hour intervals into discrete slots */
export function expandOpeningHours(
  slots: TTimeSlot[],
  stepMinutes = SLOT_MINUTES
): number[] {
  return slots.flatMap(({ start, end }) => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);

    const result: number[] = [];
    for (let t = startMin; t < endMin; t += stepMinutes) {
      result.push(t);
    }
    return result;
  });
}
