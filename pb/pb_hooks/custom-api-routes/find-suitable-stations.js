/// <reference path="..\..\pb_data\types.d.ts" />

function findSuitableStationsHandler(e) {
  try {
    const engine = require(`${__hooks}/lib/engine.js`)
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

    // 3. Collect all suitable stations from all suitable areas
    let allSuitableStations = [];
    for (let area of areas) {
      const stationsInArea = engine.getSuitableStations(
        area.getString("id"),
        pax,
        busyIds
      );

      const mapped = stationsInArea.map(s => ({
        capacity: s.getInt("capacity"),
        type: "single",
        members: [s]
      }));

      allSuitableStations = allSuitableStations.concat(mapped);
    }
    // 4. Sort by capacity (ascending) so "best fit" is at the top
    allSuitableStations.sort((a, b) => a.capacity - b.capacity);
    return e.json(200, allSuitableStations);
  } catch (e) {
    $app.logger().error("An unexpected Error occured:", e.message);
    return e.json(500, { message: "Unexpected Error" });
  }
}

module.exports = findSuitableStationsHandler;