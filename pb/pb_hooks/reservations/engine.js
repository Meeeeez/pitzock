/// <reference path="..\..\pb_data\types.d.ts" />

/**
 * Returns all suitable areas based on if the guest brings pets
 * @param {boolean} bringsPets Indicates if the guest brings pets.
 * @param {string} businessId The ID of the business.
 * @returns {Array} Returns an array of areas or [] if no matching areas were found.
 */
function getSuitableAreas(bringsPets, businessId) {
  const areaFilter = "businessId = {:bid} && isActive = true"
  if (bringsPets) {
    return $app.findRecordsByFilter("areas", areaFilter + " && allowsPets = true", "", 0, 0, { bid: businessId });
  } else {
    return $app.findRecordsByFilter("areas", areaFilter, "", 0, 0, { bid: businessId });
  }
}

/**
 * Returns the IDs of the stations which are busy at the time of the reservation
 * @param {DateTime} resStart Indicates if the guest brings pets.
 * @param {DateTime} resEnd The ID of the business.
 * @returns {Set} An Set of IDs of the busy stations or [] if none were found.
 */
function getBusyStationsIds(resStart, resEnd) {
  const ids = $app.findRecordsByFilter(
    "stationReservations",
    "reservationId.startsAt < {:resEnd} && reservationId.endsAt > {:resStart}",
    "", 0, 0, { resStart, resEnd }
  ).map(r => r.getString("stationId"));
  return new Set(ids);
}

/**
 * Returns all active stations of this area with a capacity larger than pax  which are free during the reservation duration.
 * @param {string} areaId The ID of the area.
 * @param {number} pax The size of the reservation (how many guests are coming).
 * @param {Set} busyIds IDs of the stations which are busy at the time of the reservation
 * @returns {Array} Returns an array of stations or [] if no matching stations were found.
 */
function getSuitableStations(areaId, pax, busyIds) {
  // Query stations directly excluding busy stations
  let filter = "areaId = {:aId} && capacity >= {:pax} && isActive = true";
  const params = { aId: areaId, pax }
  if (busyIds.size > 0) {
    filter += " && id != {:busy}";
    params.busy = Array.from(busyIds)
  }

  return $app.findRecordsByFilter("stations", filter, "capacity", 0, 0, params);
}

/**
 * Assigns a station to a reservation.
 * @param {string} stationId The ID of the station.
 * @param {number} reservationId The ID of the reservation.
 * @returns {void}
 */
function assignToStation(stationId, reservationId) {
  let sr = $app.findCollectionByNameOrId("stationReservations")
  let record = new Record(sr)
  record.set("stationId", stationId)
  record.set("reservationId", reservationId)
  $app.save(record);
}

/**
* Returns all mergeGroups which fit the area, have a capacity >= pax and of which all members are free at the time of the reservation 
* @param {string} areaId The ID of the area.
* @param {number} pax The size of the reservation (how many guests are coming).
* @param {Set} busyIds IDs of the stations which are busy at the time of the reservation
* @returns {Array} Returns an array of station merges or [] if no matching stations were found.
 */
function getSuitableMergeGroups(areaId, pax, busyIds) {
  // get all suitable merge groups
  const mergeGroups = $app.findRecordsByFilter("mergeGroups",
    "areaId = {:aId} && capacity >= {:pax}",
    "capacity", 0, 0,
    { aId: areaId, pax }
  );
  if (mergeGroups.length === 0) return [];

  const availableGroups = [];

  // check if each table in the group is free at the time
  for (const group of mergeGroups) {
    // get the stations belonging to this merge group (all and only active)
    const activeStationEntries = $app.findRecordsByFilter(
      "mergeGroupStations",
      "mergeGroupId = {:gId} && stationId.isActive = true",
      "", 0, 0,
      { gId: group.getString("id") }
    );
    const allStationEntries = $app.findRecordsByFilter(
      "mergeGroupStations",
      "mergeGroupId = {:gId}",
      "", 0, 0,
      { gId: group.getString("id") }
    );

    // a group is active only if the number of active stations is equal to the number of all stations in this group
    const isGroupActive = activeStationEntries.length === allStationEntries.length;
    // a group is available ONLY if EVERY station in it is not busy
    const isGroupFree = allStationEntries.every(entry => !busyIds.has(entry.getString("stationId")));

    if (isGroupFree && isGroupActive) {
      availableGroups.push({
        id: group.getString("id"),
        areaId: group.getString("areaId"),
        capactiy: group.getInt("capacity"),
        memberIds: allStationEntries.map(e => e.getString("stationId"))
      });
    }
  }

  return availableGroups;
}

module.exports = {
  assignToStation,
  getSuitableAreas,
  getBusyStationsIds,
  getSuitableStations,
  getSuitableMergeGroups
}

