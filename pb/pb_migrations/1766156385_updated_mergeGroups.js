/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2886613701")

  // update collection data
  unmarshal({
    "listRule": "areaId.businessId = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2886613701")

  // update collection data
  unmarshal({
    "listRule": null
  }, collection)

  return app.save(collection)
})
