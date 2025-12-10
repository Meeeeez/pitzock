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

export type TReservationStatus = "BOOKED" | "CONFIRMED" | "CANCELLED" | "ARRIVED" | "NOSHOW"
