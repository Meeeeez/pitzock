/// <reference path="..\..\..\pb_data\types.d.ts" />

onRecordCreate((e) => {
  const utils = require(`${__hooks}/lib/utils.js`)
  const engine = require(`${__hooks}/lib/engine.js`)

  const business = utils.getBusinessByClientId(
    e.record.getString("clientId")
  )

  // return all active areas and consider if pets are allowed in this area
  const areas = engine.getSuitableAreas(
    e.record.getBool("bringsPets"),
    business.getString("id")
  )
  if (!areas || areas.length === 0) throw new BadRequestError("No suitable area")

  // get ids of the stations which are busy at the time of the reservation
  const busyIds = engine.getBusyStationsIds(
    e.record.getDateTime("startsAt"),
    e.record.getDateTime("endsAt")
  )

  // --- PASS 1: search for a single station ---
  let bestStation = null;
  for (let area of areas) {
    const stationsInArea = engine.getSuitableStations(
      area.getString("id"),
      e.record.getInt("pax"),
      busyIds
    )
    if (stationsInArea.length > 0) {
      const candidate = stationsInArea[0];
      if (!bestStation || candidate.getInt("capacity") < bestStation.getInt("capacity")) {
        bestStation = candidate;
      }
    }
  }

  if (bestStation) {
    e.next() // persist reservation
    engine.assignToStation(
      [bestStation.getString("id")],
      e.record.getString("id")
    )
    return;
  }

  // --- PASS 2: if no single station was found, search for a merge group ---
  let bestMerge = null;
  if (!bestStation) {
    for (let area of areas) {
      const mergesInArea = engine.getSuitableMergeGroups(
        area.getString("id"),
        e.record.getInt("pax"),
        busyIds
      )
      if (mergesInArea.length > 0) {
        const candidate = mergesInArea[0];
        if (!bestMerge || candidate.capacity < bestMerge.capacity) {
          bestMerge = candidate;
        }
      }
    }
  }

  if (bestMerge) {
    e.next() // persist reservation
    engine.assignToStation(
      bestMerge.memberIds,
      e.record.getString("id")
    )
    return;
  }

  throw new BadRequestError("No suitable station")
}, "reservations")