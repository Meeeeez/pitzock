import type { TClient } from "./client"

export type TReservation = {
  id: string
  clientId: string
  startsAt: string
  endsAt: string
  status: TReservationStatus
  bringsPets: boolean
  notes?: string
  pax: number
  updateToken: string
  created: string
  updated: string
}

export type TReservationWithClient = TReservation & {
  client: TClient;
};

export type TReservationStatus = "BOOKED" | "CONFIRMED" | "CANCELLED" | "ARRIVED" | "NOSHOW"

export type TReservationWithClientTimesInMinFromMidnight = Omit<TReservationWithClient, 'startsAt' | 'endsAt'> & {
  startMins: number;
  endMins: number;
};
