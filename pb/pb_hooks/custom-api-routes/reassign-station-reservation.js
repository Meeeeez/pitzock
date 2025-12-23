/// <reference path="..\..\pb_data\types.d.ts" />

function reassignStationReservationHandler(e) {
  const engine = require(`${__hooks}/lib/engine.js`);
  const data = e.requestInfo().body
  const businessId = e.auth.id;

  if (!businessId) return e.json(401, { message: "Unauthorized" });
  if (!data.reservationId) return e.json(400, { message: "Missing reservationId" });
  if (!data.stationId && !data.mergeGroupId) return e.json(400, { message: "Provide a target mergeGroupId or stationId" });
  if (data.stationId && data.mergeGroupId) return e.json(400, { message: "Provide either mergeGroupId or stationId" });

  const reservation = $app.findRecordById("reservations", data.reservationId);
  const pax = reservation.getInt("pax");
  const end = reservation.getString("endsAt");
  const start = reservation.getString("startsAt");
  const bringsPets = reservation.getBool("bringsPets");

  const busyIds = engine.getBusyStationsIds(start, end, data.reservationId);

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
      return e.json(400, { message: "This station is either occupied or has insufficient capacity." });
    }

    $app.runInTransaction((txApp) => {
      const existing = txApp.findRecordsByFilter("stationReservations", "reservationId = {:rId}", "", 0, 0, { rId: data.reservationId });
      for (let rec of existing) txApp.delete(rec);

      const sr = txApp.findCollectionByNameOrId("stationReservations");
      txApp.save(new Record(sr, { reservationId: data.reservationId, stationId: data.stationId }));
    });

    return e.json(200);
  }

  // --- MERGE GROUP BRANCH ---
  else if (data.mergeGroupId) {
    const mergeGroup = $app.findRecordById("mergeGroups", data.mergeGroupId);
    const areaId = mergeGroup.getString("areaId");

    const groupMembers = $app.findRecordsByFilter(
      "mergeGroupStations",
      "mergeGroupId = {:mgId}",
      "",
      0, 0,
      { mgId: data.mergeGroupId }
    );
    const memberIds = groupMembers.map(m => m.getString("stationId"));

    const suitableAreas = engine.getSuitableAreas(bringsPets, businessId);
    if (!suitableAreas.some(a => a.id === areaId)) {
      return e.json(400, { message: "Selected merge group is in an area which is not suitable for this reservation's requirements." });
    }

    const suitableMerges = engine.getSuitableMergeGroups(areaId, pax, busyIds);
    if (!suitableMerges.some(m => m.id === data.mergeGroupId)) {
      return e.json(400, { message: "This station group is no longer available or too small." });
    }

    $app.runInTransaction((txApp) => {
      const existing = txApp.findRecordsByFilter("stationReservations", "reservationId = {:rId}", "", 0, 0, { rId: data.reservationId });
      for (let rec of existing) txApp.delete(rec);

      const sr = txApp.findCollectionByNameOrId("stationReservations");

      for (let sId of memberIds) {
        txApp.save(new Record(sr, { reservationId: data.reservationId, stationId: sId }));
      }
    });
    return e.json(200);
  }
}

module.exports = reassignStationReservationHandler;