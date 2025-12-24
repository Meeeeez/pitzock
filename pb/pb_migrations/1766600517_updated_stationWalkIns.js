/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414557668")

  // update collection data
  unmarshal({
    "createRule": "walkInId.businessId = @request.auth.id",
    "deleteRule": "walkInId.businessId = @request.auth.id",
    "listRule": "walkInId.businessId = @request.auth.id",
    "updateRule": "walkInId.businessId = @request.auth.id",
    "viewRule": "walkInId.businessId = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414557668")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
