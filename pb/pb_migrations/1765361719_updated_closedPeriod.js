/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1420420337")

  // update collection data
  unmarshal({
    "name": "closedPeriods"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1420420337")

  // update collection data
  unmarshal({
    "name": "closedPeriod"
  }, collection)

  return app.save(collection)
})
