onRecordUpdateRequest((e) => {
    const body = e.requestInfo().body

    // businesses can only update the "status" field
    if (e.auth.collection().name === "businesses") {
        const allowedBusinessFields = ["status"]
        for (const field in body) {
            if (!allowedBusinessFields.includes(field)) {
                throw new BadRequestError(`Businesses cannot update "${field}"`)
            }
        }
        return e.next()
    }

    // clients can update "startsAt", "endsAt", "status", "pax", "notes", "bringsPets"
    const allowedClientFields = ["startsAt", "endsAt", "status", "pax", "notes", "bringsPets"]
    for (const field in body) {
        if (!allowedClientFields.includes(field)) {
            throw new BadRequestError(`Clients cannot update "${field}"`)
        }
    }
    e.next()
}, "reservations")