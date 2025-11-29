/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1473635903")

  // update collection data
  unmarshal({
    "updateRule": "updateToken = @request.headers.updateToken"
  }, collection)

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
    "hidden": false,
    "id": "text398436795",
    "max": 0,
    "min": 0,
    "name": "updateToken",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1473635903")

  // update collection data
  unmarshal({
    "updateRule": ""
  }, collection)

  // remove field
  collection.fields.removeById("text398436795")

  return app.save(collection)
})
