/// <reference path="..\..\pb_data\types.d.ts" />

onRecordUpdateRequest((e) => {
  const body = e.requestInfo().body

  const openingHours = JSON.parse(body.openingHours);
  const hhMmRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (openingHours.length !== 7) {
    throw new BadRequestError("Opening Hours must be an array with seven entries");
  }

  for (let i = 0; i < openingHours.length; i++) {
    const timeslotsOnWeekday = openingHours[i];
    timeslotsOnWeekday.forEach(slot => {
      if (slot.start === slot.end) throw new BadRequestError("Timeslot start and end cannot be the same: " + slot.start);
      if (slot.start > slot.end) throw new BadRequestError("Timeslot start cannot be later than timeslot end: " + slot.start + " > " + slot.end);
      if (!hhMmRegex.test(slot.start)) throw new BadRequestError("Invalid Format: " + slot.start);
      if (!hhMmRegex.test(slot.end)) throw new BadRequestError("Invalid Format: " + slot.end);
    });
  }

  e.next()
}, "businesses")