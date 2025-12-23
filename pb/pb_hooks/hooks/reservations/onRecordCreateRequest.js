/// <reference path="..\..\..\pb_data\types.d.ts" />

onRecordCreateRequest((e) => {
  try {
    const utils = require(`${__hooks}/lib/utils.js`)
    const now = new Date()
    const endsAt = new Date(e.record.getString("endsAt"))
    const startsAt = new Date(e.record.getString("startsAt"))
    const business = utils.getBusinessById(e.auth.id)

    // 1. check if start is in the future
    if (startsAt <= now) throw new BadRequestError("Reservation start must be in the future")

    // 2. check if endsAt is after startsAt
    if (endsAt <= startsAt) throw new BadRequestError("Reservation end must be after reservation start")

    // 3. check if business is active
    if (!business.getBool("isActive")) throw new BadRequestError("Business is inactive")

    // 4. check if business is on holiday
    const businessId = business.getString("id")
    const overlapsWithHoliday = utils.isReservationOverlappingWithBusinessHoliday(businessId, e.record)
    if (overlapsWithHoliday) throw new BadRequestError("Business is on holiday")

    // 3. check if business is open (opening hours)
    const businessOpeningHours = JSON.parse(business.getString("openingHours"))
    const isWithinOpeningHours = utils.isReservationWithinOpeningHours(businessOpeningHours, e.record)
    if (!isWithinOpeningHours) throw new BadRequestError("Business is closed")

    e.next()
  } catch (err) {
    $app.logger().error("An unexpected Error occured:", err.message)
    throw err
  }
}, "reservations")