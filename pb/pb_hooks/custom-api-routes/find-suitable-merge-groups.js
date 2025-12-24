/// <reference path="..\..\pb_data\types.d.ts" />

function findSuitableMergeGroupsHandler(e) {
  try {
    const engine = require(`${__hooks}/lib/engine.js`);
    const query = e.request.url.query();

    const pax = parseInt(query.get("pax"));
    const start = new DateTime(query.get("start"));
    const end = new DateTime(query.get("end"));
    const bringsPets = query.get("bringsPets") === "true";
    const businessId = query.get("businessId");
    const mergeGroupId = query.get("mergeGroupId");
    const stationId = query.get("stationId");

    if (!businessId) return e.json(401, { message: "Unauthorized" });
    if (!pax || !start || !end || !businessId) return e.json(400, { message: "Missing required parameters" });
    if (!mergeGroupId && !stationId) return e.json(400, { message: "Provide a target mergeGroupId or stationId" });
    if (mergeGroupId && stationId) return e.json(400, { message: "Provide either mergeGroupId or stationId" });

    // 1. Get areas - consider bringsPets
    const areas = engine.getSuitableAreas(bringsPets, businessId);
    if (!areas || areas.length === 0) return e.json(200, []);

    /**
     * 2. SELF-CONFLICT AVOIDANCE:
     * We remove the current station assignments from the 'busyIds' list.
     * This tells the engine: "If Station X is busy ONLY because this reservation 
     * is already there, don't count it as a conflict."
     */
    const busyIds = engine.getBusyStationsIds(start, end);
    if (stationId) {
      const currentStations = $app.findRecordsByFilter(
        "stations",
        "id = {:sId}",
        "", 0, 0,
        { sId: stationId }
      );
      currentStations.forEach(s => busyIds.delete(s.getString("id")));
    } else if (mergeGroupId) {
      const currentStations = $app.findRecordsByFilter(
        "mergeGroupStations",
        "mergeGroupId = {:gId}",
        "", 0, 0,
        { gId: mergeGroupId }
      );
      currentStations.forEach(mgs => busyIds.delete(mgs.getString("stationId")));
    }

    // 3. Collect all suitable merge groups from all suitable areas
    let allSuitableMerges = [];
    for (let area of areas) {
      const mergesInArea = engine.getSuitableMergeGroups(
        area.getString("id"),
        pax,
        busyIds
      );

      const mapped = mergesInArea.map((m) => {
        const stationFilter = m.memberIds.map(id => `id = "${id}"`).join(" || ");
        const groupMembers = $app.findRecordsByFilter("stations", stationFilter);
        return {
          id: m.id,
          capacity: m.capactiy,
          type: "merge",
          members: groupMembers
        }
      })

      allSuitableMerges = allSuitableMerges.concat(mapped);
    }
    // 4. Sort by capacity (ascending) so the most efficient fit is first
    allSuitableMerges.sort((a, b) => a.capacity - b.capacity);
    return e.json(200, allSuitableMerges);
  } catch (err) {
    $app.logger().error("An unexpected Error occured:", err.message);
    return e.json(500, { message: "Unexpected Error" });
  }
}

module.exports = findSuitableMergeGroupsHandler;