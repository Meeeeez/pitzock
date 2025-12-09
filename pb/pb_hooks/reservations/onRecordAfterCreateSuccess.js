/// <reference path="..\..\pb_data\types.d.ts" />

onRecordAfterCreateSuccess((e) => {
  const createdReservation = e.record;
  e.next()
}, "reservations")

function assignStationsForReservation() {
  // check if business.isActive
  // check if business is open (TODO: opening hours)
  // check if guest brings pets
  //    YES -> only look in areas that allow pets
  //    NO  -> look in all areas
  // get all active stations
  // loop over all tables that are free at this time
  // sort tables by capacity.
  // find the smallest table available that fits the reservation
  // if none were found:
  // begin to merge tables to accomodate this reservation
  // again find the smallest merge that accomodates this reservation
}