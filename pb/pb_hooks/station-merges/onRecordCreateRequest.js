/// <reference path="..\..\pb_data\types.d.ts" />

onRecordCreateRequest((e) => {
  const stationId = e.record.getString("stationId")
  const mergableWith = e.record.getString("mergableWith")

  // 1. the station should not be the same as the station that is being merged
  if (stationId === mergableWith) throw new BadRequestError("This station cannot be merged with itself!");

  // 2. check if both stations exist
  try {
    $app.findRecordById("stations", stationId)
    $app.findRecordById("stations", mergableWith)
  } catch {
    throw new BadRequestError("Some stations do not exist")
  }

  // 3. check if the station merge already exists
  try {
    $app.findFirstRecordByFilter(
      "stationMerges",
      "stationId = {:sId} && mergableWith = {:mwId}",
      { "sId": stationId, "mwId": mergableWith }
    )
    // if this line is reached it means that this station merge already exists
    throw new InternalServerError("Station merge already exists");
  } catch (e) {
    if (e instanceof InternalServerError) throw e;
    // ignore the now row not found error because it is expected behaviour 
  }

  e.next()
}, "stationMerges")