/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3008659311")

  // update collection data
  unmarshal({
    "createRule": "areaId.businessId = @request.auth.id",
    "deleteRule": "areaId.businessId = @request.auth.id",
    "listRule": "areaId.businessId = @request.auth.id",
    "name": "stations",
    "updateRule": "areaId.businessId = @request.auth.id",
    "viewRule": "areaId.businessId = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3008659311")

  // update collection data
  unmarshal({
    "createRule": "areaId.restaurantId = @request.auth.id",
    "deleteRule": "areaId.restaurantId = @request.auth.id",
    "listRule": "areaId.restaurantId = @request.auth.id",
    "name": "tables",
    "updateRule": "areaId.restaurantId = @request.auth.id",
    "viewRule": "areaId.restaurantId = @request.auth.id"
  }, collection)

  return app.save(collection)
})
