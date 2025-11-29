/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2482375863")

  // update collection data
  unmarshal({
    "deleteRule": "businessId = @request.auth.id",
    "listRule": "businessId = @request.auth.id",
    "updateRule": "businessId = @request.auth.id",
    "viewRule": "businessId = @request.auth.id"
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2178609939",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "businessId",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2482375863")

  // update collection data
  unmarshal({
    "deleteRule": "restaurantId = @request.auth.id",
    "listRule": "restaurantId = @request.auth.id",
    "updateRule": "restaurantId = @request.auth.id",
    "viewRule": "restaurantId = @request.auth.id"
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2178609939",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "restaurantId",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
