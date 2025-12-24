import type { TTimeSlot } from "@/lib/types/business";
import type { TReservation } from "./types/reservation";
import type { TWalkIn } from "./types/walk-in";

/** "HH:mm" → minutes since midnight */
export function timeToMinutes(time?: string): number {
  const [h, m] = time?.split(":").map(Number) ?? [];
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
  timeSlotMins: number
): number[] {
  return slots.flatMap(({ start, end }) => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);

    const result: number[] = [];
    for (let t = startMin; t < endMin; t += timeSlotMins) {
      result.push(t);
    }
    return result;
  });
}

/**
 * flattens all slots into a simple array of "minutes from midnight"
 * e.g. "09:00" becomes 540
 * @param {TTimeSlot[]} openingHours the opening hours at that date
 * @returns an array of numbers, each representing the minutes passed since midnight in timeSlotMins steps
 */
export function flattenOpeningHours(openingHours: TTimeSlot[], timeSlotMins: number): number[] {
  const allTickMinutes: number[] = [];
  openingHours.forEach((slot) => {
    const [endH, endM] = slot.end?.split(":").map(Number) ?? [];
    const [startH, startM] = slot.start?.split(":").map(Number) ?? [];

    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current < end) {
      allTickMinutes.push(current);
      current += timeSlotMins;
    }
  });
  return allTickMinutes;
}

/**
 * normalizes all reservations to store their start and end time in number of minutes from midnight 
 * @param {TReservation[]} reservations all reservations at this date for a certain station
 * @returns 
 */
export function flattenBooking(booking: TReservation[] | TWalkIn[]) {
  return booking?.map((res: TReservation | TWalkIn) => {
    const d = new Date(res.startsAt);
    const e = new Date(res.endsAt);
    return {
      id: res.id,
      startMins: d.getHours() * 60 + d.getMinutes(),
      endMins: e.getHours() * 60 + e.getMinutes(),
    };
  });
}
