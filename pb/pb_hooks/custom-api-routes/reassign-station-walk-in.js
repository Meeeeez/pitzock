/// <reference path="..\..\pb_data\types.d.ts" />

function reassignStationWalkInHandler(e) {
  try {
    const engine = require(`${__hooks}/lib/engine.js`);
    const data = e.requestInfo().body
    const businessId = e.auth.id;

    if (!businessId) return e.json(401, { message: "Unauthorized" });
    if (!data.walkInId) return e.json(400, { message: "Missing walkInId" });
    if (!data.stationId && !data.mergeGroupId) return e.json(400, { message: "Provide a target mergeGroupId or stationId" });
    if (data.stationId && data.mergeGroupId) return e.json(400, { message: "Provide either mergeGroupId or stationId" });

    const walkIn = $app.findRecordById("walkIns", data.walkInId);
    const end = walkIn.getDateTime("endsAt");
    const start = walkIn.getDateTime("startsAt");

    /**
     * SELF-CONFLICT AVOIDANCE:
     * We remove the current station assignments from the 'busyIds' list.
     * This tells the engine: "If Station X is busy ONLY because this reservation 
     * is already there, don't count it as a conflict."
     */
    const busyIds = engine.getBusyStationsIds(start, end);
    const currentStations = $app.findRecordsByFilter(
      "stationWalkIns",
      "walkInId = {:wId}",
      "", 0, 0,
      { wId: data.walkInId }
    );
    currentStations.forEach(r => busyIds.delete(r.getString("stationId")));

    // --- SINGLE STATION ---
    if (data.stationId) {
      if (busyIds.has(data.stationId)) {
        return e.json(400, { message: `Cannot assign station. ${data.stationId} is busy.` });
      }

      $app.runInTransaction((txApp) => {
        for (let rec of currentStations) txApp.delete(rec);
        const sr = txApp.findCollectionByNameOrId("stationWalkIns");
        txApp.save(new Record(sr, { walkInId: data.walkInId, stationId: data.stationId }));
      });

      return e.json(200);
    }

    // --- MERGE GROUP ---
    else if (data.mergeGroupId) {
      const groupMembers = $app.findRecordsByFilter(
        "mergeGroupStations",
        "mergeGroupId = {:mgId}",
        "",
        0, 0,
        { mgId: data.mergeGroupId }
      );
      const memberIds = groupMembers.map(m => m.getString("stationId"));

      // check if every station in this group is not busy
      const conflictingStations = memberIds.filter(id => busyIds.has(id));
      if (conflictingStations.length > 0) {
        const message = `Cannot assign merge group: Stations [${conflictingStations.join(",")}] are busy.`
        $app.logger().info(message);
        return e.json(409, { message });
      }

      $app.runInTransaction((txApp) => {
        for (let rec of currentStations) txApp.delete(rec);
        const sW = txApp.findCollectionByNameOrId("stationWalkIns");
        for (let sId of memberIds) {
          txApp.save(new Record(sW, { walkInId: data.walkInId, stationId: sId }));
        }
      });
      return e.json(200);
    }
  } catch (err) {
    $app.logger().error("An unexpected Error occured:", err.message);
    return e.json(500, { message: "Unexpected Error" });
  }
}

module.exports = reassignStationWalkInHandler;