/// <reference path="..\..\pb_data\types.d.ts" />

function reassignStationReservationHandler(e) {
  try {
    const engine = require(`${__hooks}/lib/engine.js`);
    const data = e.requestInfo().body
    const businessId = e.auth?.id;

    if (!businessId) return e.json(401, { message: "Unauthorized" });
    if (!data.reservationId) return e.json(400, { message: "Missing reservationId" });
    if (!data.stationId && !data.mergeGroupId) return e.json(400, { message: "Provide a target mergeGroupId or stationId" });
    if (data.stationId && data.mergeGroupId) return e.json(400, { message: "Provide either mergeGroupId or stationId" });

    const reservation = $app.findRecordById("reservations", data.reservationId);
    const pax = reservation.getInt("pax");
    const end = reservation.getDateTime("endsAt");
    const start = reservation.getDateTime("startsAt");
    const bringsPets = reservation.getBool("bringsPets");

    /**
     * SELF-CONFLICT AVOIDANCE:
     * We remove the current station assignments from the 'busyIds' list.
     * This tells the engine: "If Station X is busy ONLY because this reservation 
     * is already there, don't count it as a conflict."
     */
    const busyIds = engine.getBusyStationsIds(start, end);
    const currentStations = $app.findRecordsByFilter(
      "stationReservations",
      "reservationId = {:rId}",
      "", 0, 0,
      { rId: data.reservationId }
    );
    currentStations.forEach(r => busyIds.delete(r.getString("stationId")));

    // --- SINGLE STATION ---
    if (data.stationId) {
      const station = $app.findRecordById("stations", data.stationId);
      const areaId = station.getString("areaId");

      const suitableAreas = engine.getSuitableAreas(bringsPets, businessId);
      if (!suitableAreas.some(a => a.id === areaId)) {
        return e.json(400, { message: "Selected station is in an area which is not suitable for this reservation's requirements." });
      }

      const suitableStations = engine.getSuitableStations(areaId, pax, busyIds);
      if (!suitableStations.some(s => s.id === data.stationId)) {
        return e.json(400, { message: "Station is occupied or has insufficient capacity." });
      }

      $app.runInTransaction((txApp) => {
        for (let rec of currentStations) txApp.delete(rec);
        const sr = txApp.findCollectionByNameOrId("stationReservations");
        txApp.save(new Record(sr, { reservationId: data.reservationId, stationId: data.stationId }));
      });

      return e.json(200);
    }

    // --- MERGE GROUP BRANCH ---
    else if (data.mergeGroupId) {
      const mergeGroup = $app.findRecordById("mergeGroups", data.mergeGroupId);
      const areaId = mergeGroup.getString("areaId");

      const suitableAreas = engine.getSuitableAreas(bringsPets, businessId);
      if (!suitableAreas.some(a => a.id === areaId)) {
        return e.json(400, { message: "Selected merge group is in an area which is not suitable for this reservation's requirements." });
      }

      const suitableMerges = engine.getSuitableMergeGroups(areaId, pax, busyIds);
      if (!suitableMerges.some(m => m.id === data.mergeGroupId)) {
        return e.json(400, { message: "This group is occupied or has insufficient capacity." });
      }

      const groupMembers = $app.findRecordsByFilter(
        "mergeGroupStations",
        "mergeGroupId = {:mgId}",
        "", 0, 0,
        { mgId: data.mergeGroupId }
      );

      $app.runInTransaction((txApp) => {
        for (let rec of currentStations) txApp.delete(rec);
        const sr = txApp.findCollectionByNameOrId("stationReservations");
        for (let m of groupMembers) {
          txApp.save(new Record(sr, {
            reservationId: data.reservationId,
            stationId: m.getString("stationId")
          }));
        }
      });
      return e.json(200);
    }
  } catch (err) {
    $app.logger().error("Reassign Reservation failed:", err.message);
    return e.json(500, { message: err.message || "Unexpected Error" });
  }
}

module.exports = reassignStationReservationHandler;