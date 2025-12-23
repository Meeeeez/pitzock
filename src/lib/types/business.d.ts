export type TBusiness = {
  name: string,
  avatar: string,
  type: "RESTAURANT",
  openingHours: TOpeningHours,
  isActive: boolean,
  defaultReservationDurationMinutes: number,
  timeSlotSizeMin: number,
  maxAdvanceBookingDays: number,
  maxPax: number,
  created: string,
  updated: string
}

export interface TTimeSlot {
  start: string // HH:mm format
  end: string // HH:mm format
}

export type TOpeningHours = [TTimeSlot[], TTimeSlot[], TTimeSlot[], TTimeSlot[], TTimeSlot[], TTimeSlot[], TTimeSlot[]]