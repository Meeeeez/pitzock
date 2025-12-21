/// <reference path="..\..\pb_data\types.d.ts" />

/**
 * Returns all suitable areas based on if the guest brings pets
 * @param {boolean} bringsPets Indicates if the guest brings pets.
 * @param {string} businessId The ID of the business.
 * @returns {Array} Returns an array of areas or [] if no matching areas were found.
 */
function getSuitableAreas(bringsPets, businessId) {
  $app.logger().info("SUITABLE_AREAS_CHECK", "bringsPets:", bringsPets)
  let areaFilter = "businessId = {:bid} && isActive = true";
  if (bringsPets) areaFilter += " && allowsPets = true";
  const suitableAreas = $app.findRecordsByFilter("areas", areaFilter, "", 0, 0, { bid: businessId })
  $app.logger().info("SUITABLE_AREAS_RESULT", suitableAreas.map(a => a.getString("id")));
  return suitableAreas
}

/**
 * Returns the IDs of the stations which are busy at the time of the reservation
 * @param {DateTime} resStart Indicates if the guest brings pets.
 * @param {DateTime} resEnd The ID of the business.
 * @returns {Set} An Set of IDs of the busy stations or [] if none were found.
 */
function getBusyStationsIds(resStart, resEnd) {
  $app.logger().info("BUSY_STATIONS_CHECK", "resStart:", resStart, "resEnd:", resEnd)
  const ids = $app.findRecordsByFilter(
    "stationReservations",
    "reservationId.startsAt < {:resEnd} && reservationId.endsAt > {:resStart}",
    "", 0, 0, { resStart, resEnd }
  ).map(r => r.getString("stationId"));
  $app.logger().info("BUSY_STATIONS_RESULT", ids)
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
  $app.logger().info("SUITABLE_STATIONS_CHECK", "areaId:", areaId, "pax:", pax, "busyIds:", busyIds)
  let filter = "areaId = {:aId} && capacity >= {:pax} && isActive = true";
  const params = { aId: areaId, pax };
  if (busyIds.size > 0) {
    filter += " && id != {:busy}";
    params.busy = Array.from(busyIds)
  }
  if (busyIds.size > 0) {
    const exclusionString = Array.from(busyIds)
      .map(id => `id != "${id}"`)
      .join(" && ");
    filter += " && " + exclusionString;
  }
  const suitableStations = $app.findRecordsByFilter("stations", filter, "capacity", 0, 0, params);
  $app.logger().info("SUITABLE_STATIONS_RESULT", suitableStations.map(s => s.getString("id")));
  return suitableStations;
}

/**
 * Assigns a station to a reservation.
 * @param {string[]} stationIds The IDs of the stations.
 * @param {number} reservationId The ID of the reservation.
 * @returns {void}
 */
function assignToStation(stationIds, reservationId) {
  $app.logger().info("ASSIGN_STATION_START", "reservationId:", reservationId, "targetStations:", stationIds);
  for (const sId of stationIds) {
    let sr = $app.findCollectionByNameOrId("stationReservations")
    let record = new Record(sr)
    record.set("stationId", sId)
    record.set("reservationId", reservationId)
    $app.save(record);
  }
  $app.logger().info("ASSIGN_STATION_SUCCESS", "reservationId:", reservationId, "confirmedIds:", stationIds);
}

/**
* Returns all mergeGroups which fit the area, have a capacity >= pax and of which all members are free at the time of the reservation 
* @param {string} areaId The ID of the area.
* @param {number} pax The size of the reservation (how many guests are coming).
* @param {Set} busyIds IDs of the stations which are busy at the time of the reservation
* @returns {Array} Returns an array of merge groups or [] if no matching stations were found.
 */
function getSuitableMergeGroups(areaId, pax, busyIds) {
  $app.logger().info("MERGE_GROUPS_CHECK", "areaId:", areaId, "pax:", pax);
  // get all suitable merge groups
  const mergeGroups = $app.findRecordsByFilter("mergeGroups",
    "areaId = {:aId} && capacity >= {:pax}",
    "capacity", 0, 0,
    { aId: areaId, pax }
  );
  if (mergeGroups.length === 0) {
    $app.logger().info("MERGE_GROUPS_NONE_FOUND")
    return []
  }

  const availableGroups = []

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
    } else {
      $app.logger().info(
        "MERGE_GROUP_REJECTED",
        "id:", group.getString("id"),
        "reason", !isGroupActive ? "INACTIVE_STATIONS" : "STATIONS_BUSY"
      );
    }
  }

  $app.logger().info("MERGE_GROUPS_RESULT", availableGroups.map(g => g.memberIds.join(",")));
  return availableGroups;
}

module.exports = {
  assignToStation,
  getSuitableAreas,
  getBusyStationsIds,
  getSuitableStations,
  getSuitableMergeGroups
}

