/// <reference path="..\..\pb_data\types.d.ts" />

onRecordCreateRequest((e) => {
    const body = e.requestInfo().body

    const now = new Date()
    const startDateTime = new Date(body.startsAt)
    const endDateTime = new Date(body.endsAt)

    if (startDateTime < now) {
        throw new BadRequestError("Reservation date must be in the future")
    }

    if (endDateTime <= startDateTime) {
        throw new BadRequestError("Reservation end date must be after start date")
    }

    e.next()
}, "reservations")