/// <reference path="..\..\pb_data\types.d.ts" />

onRecordCreateRequest((e) => {
  const body = e.requestInfo().body

  // the station should not be the same as the station that is being merged
  if (body.stationId === body.mergableWith) {
    throw new BadRequestError("This station cannot be merged with itself!");
  }

  // check if both stations exist
  const stations = arrayOf(new DynamicModel({
    "id": "",
  }))
  try {
    e.app.db()
      .select("id")
      .from("stations")
      .all(stations);
  } catch (e) { }
  if (
    !stations.some(s => s.id === body.stationId) ||
    !stations.some(s => s.id === body.mergableWith)
  ) {
    throw new BadRequestError("One of the two stations does not exist!");
  }

  // check if the station merge already exists
  const existingStationMerge = new DynamicModel({ "id": "" })
  try {
    e.app.db()
      .select("id")
      .from("stationMerges")
      .where($dbx.like("stationId", body.stationId))
      .andWhere($dbx.like("mergableWith", body.mergableWith))
      .one(existingStationMerge);
  } catch (e) { }
  if (existingStationMerge.id) {
    throw new BadRequestError("This station merge already exists!");
  }

  e.next()
}, "stationMerges")