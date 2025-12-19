/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_123276768")

  // update collection data
  unmarshal({
    "createRule": "mergeGroupId.areaId.businessId = @request.auth.id",
    "deleteRule": "mergeGroupId.areaId.businessId = @request.auth.id",
    "listRule": "mergeGroupId.areaId.businessId = @request.auth.id",
    "updateRule": "mergeGroupId.areaId.businessId = @request.auth.id",
    "viewRule": "mergeGroupId.areaId.businessId = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_123276768")

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
