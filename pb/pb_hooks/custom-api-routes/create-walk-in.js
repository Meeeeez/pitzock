/// <reference path="..\..\pb_data\types.d.ts" />

function createWalkIn(e) {
  const engine = require(`${__hooks}/lib/engine.js`);

  try {
    const data = e.requestInfo().body;
    const businessId = e.auth?.id;

    if (!businessId) return e.json(401, { message: "Unauthorized" });
    if (!data.startsAt || !data.endsAt || !data.stationAssignment) {
      return e.json(400, { message: "Missing required fields" });
    }

    const startsAt = new DateTime(data.startsAt);
    const endsAt = new DateTime(data.endsAt);

    const busyIds = engine.getBusyStationsIds(startsAt, endsAt);
    const walkInColl = $app.findCollectionByNameOrId("walkIns");
    const stationWalkInsColl = $app.findCollectionByNameOrId("stationWalkIns");

    $app.runInTransaction((txApp) => {
      const walkIn = new Record(walkInColl, {
        startsAt,
        endsAt,
        businessId: businessId
      });
      txApp.save(walkIn);

      // if merge group
      if (data.stationAssignment.includes("gId:")) {
        const groupMembers = txApp.findRecordsByFilter(
          "mergeGroupStations",
          "mergeGroupId = {:mgId} && mergeGroupId.areaId.businessId = {:bId}",
          "", 0, 0,
          { mgId: data.stationAssignment.split(":")[1], bId: businessId }
        );

        // force rollback
        if (groupMembers.length === 0) {
          throw new Error("No valid stations found for this merge group");
        }

        // check if every station in this group is not busy
        const groupStationIds = groupMembers.map(member => member.getString("stationId"));
        const conflictingStations = groupStationIds.filter(id => busyIds.includes(id));

        // force rollback
        if (conflictingStations.length > 0) {
          throw new Error(`Cannot assign merge group: Stations [${conflictingStations.join(",")}] are busy.`);
        }

        for (let member of groupMembers) {
          const stationWalkIn = new Record(stationWalkInsColl, {
            stationId: member.getString("stationId"),
            walkInId: walkIn.getString("id")
          });
          txApp.save(stationWalkIn);
        }
      } else {
        // Single station logic
        if (busyIds.includes(data.stationAssignment)) {
          throw new Error(`Cannot assign station. ${data.stationAssignment} is busy.`);
        }

        const stationWalkIn = new Record(stationWalkInsColl, {
          stationId: data.stationAssignment,
          walkInId: walkIn.getString("id")
        });
        txApp.save(stationWalkIn);
      }
    });

    return e.json(201);
  } catch (err) {
    $app.logger().error("Walk-in creation failed:", err.message);
    return e.json(500, { message: err.message || "Unexpected Error" });
  }
}

module.exports = createWalkIn;