/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2518978005")

  // update collection data
  unmarshal({
    "name": "stationMerges"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2518978005")

  // update collection data
  unmarshal({
    "name": "mergableStations"
  }, collection)

  return app.save(collection)
})
