/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2886613701")

  // update collection data
  unmarshal({
    "createRule": "areaId.businessId = @request.auth.id",
    "deleteRule": "areaId.businessId = @request.auth.id",
    "updateRule": "areaId.businessId = @request.auth.id",
    "viewRule": "areaId.businessId = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2886613701")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
