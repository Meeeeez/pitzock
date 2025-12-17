/// <reference path="..\..\pb_data\types.d.ts" />

/**
 * Finds the business which is associated with the provided businessId.
 * @param {string} businessId The ID of the business.
 * @returns {Record | null} The db record for this business or null if an error occured.
 */
function getBusinessById(businessId) {
  try {
    return $app.findRecordById("businesses", businessId)
  } catch { return null }
}

/**
 * Checks if the provided business is on holidays during the duration of the reservation.
 * @param {string} businessId The ID of the business.
 * @param {Record} reservation The reservation record.
 * @returns {boolean} Returns true if the business is on holidays during the duration of the reservation.
 */
function isReservationOverlappingWithBusinessHoliday(businessId, reservation) {
  const holidays = $app.findRecordsByFilter("holidays", "businessId = {:bid}", "", 0, 0, { bid: businessId });
  if (!holidays || holidays.length === 0) return false

  const reservationStart = new Date(reservation.getString("startsAt"))
  const reservationEnd = new Date(reservation.getString("endsAt"))

  // Check if reservation overlaps with any holiday
  return holidays.some((holiday) => {
    const holidayStart = new Date(holiday.getString("from"))
    const holidayEnd = new Date(holiday.getString("to"))
    return reservationStart <= holidayEnd && reservationEnd >= holidayStart;
  });
}

/**
 * Checks if a reservation is fully within business opening hours, supporting multi-day spans and overnight shifts.
 * * @param {Array} openingHours Array of 7 entries (0=Mon, 6=Sun), each with {start, end}.
 * @param {Record} reservation The reservation record with startsAt/endsAt.
 * @returns {boolean} True if the reservation is fully covered by open intervals.
 */
function isReservationWithinOpeningHours(openingHours, reservation) {
  let current = new Date(reservation.getString("startsAt"));
  const end = new Date(reservation.getString("endsAt"));

  // Loop through the reservation day by day
  while (current < end) {
    // 1. Define the end of the current chunk (either midnight or the actual end)
    const nextMidnight = new Date(current);
    nextMidnight.setHours(24, 0, 0, 0);
    const chunkEnd = (end < nextMidnight) ? end : nextMidnight;

    // 2. Get intervals for the current day (0=Mon, 6=Sun)
    const dayIndex = (current.getDay() + 6) % 7;
    const intervals = openingHours[dayIndex] || [];

    // closed on this day if no intervals exist
    if (!intervals || intervals.length === 0) return false;

    // 3. Helper: Converts "HH:MM" string to a Date object for the current day
    const getTimeOnDay = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      const d = new Date(current);
      d.setHours(h, m, 0, 0);
      return d;
    };

    // 4. Check if this chunk fits into any interval
    const isCovered = intervals.some(({ start, end }) =>
      current >= getTimeOnDay(start) && chunkEnd <= getTimeOnDay(end)
    );

    if (!isCovered) return false;

    // 5. Advance time to the start of the next day
    current = nextMidnight;
  }

  return true;
}

module.exports = {
  getBusinessById,
  isReservationOverlappingWithBusinessHoliday,
  isReservationWithinOpeningHours
}