/// <reference path="..\..\pb_data\types.d.ts" />

function createMergeGroup(e) {
  try {
    const data = e.requestInfo().body
    const businessId = e.auth?.id;

    if (!businessId) return e.json(401, { message: "Unauthorized" });
    if (!data.areaId || !data.members || !data.capacity) return e.json(400, { message: "Missing required fields" });

    $app.runInTransaction((txApp) => {
      const groupColl = txApp.findCollectionByNameOrId("mergeGroups");
      const linkColl = txApp.findCollectionByNameOrId("mergeGroupStations");

      const mergeGroup = new Record(groupColl, {
        areaId: data.areaId,
        capacity: data.capacity
      });
      txApp.save(mergeGroup);

      for (let stationId of data.members) {
        const link = new Record(linkColl, {
          mergeGroupId: mergeGroup.getString("id"),
          stationId: stationId
        });
        txApp.save(link);
      }
    });

    return e.json(201);
  } catch (err) {
    $app.logger().error("An unexpected Error occured:", err.message);
    return e.json(500, { message: "Unexpected Error" });
  }
}

module.exports = createMergeGroup;