/// <reference path="..\..\pb_data\types.d.ts" />

function findSuitableMergeGroupsHandler(e) {
  const engine = require(`${__hooks}/lib/engine.js`);
  const query = e.request.url.query();

  const pax = parseInt(query.get("pax"));
  const start = query.get("start");
  const end = query.get("end");
  const bringsPets = query.get("bringsPets") === "true";
  const businessId = query.get("businessId");

  if (e.auth.id !== businessId) return e.json(401, { message: "Unauthorized" });
  if (!pax || !start || !end || !businessId) return e.json(400, { message: "Missing required parameters" });

  // 1. Get areas - consider bringsPets
  const areas = engine.getSuitableAreas(bringsPets, businessId);
  if (!areas || areas.length === 0) return e.json(200, []);

  // 2. Get busy stations
  const busyIds = engine.getBusyStationsIds(start, end);

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
}

module.exports = findSuitableMergeGroupsHandler;