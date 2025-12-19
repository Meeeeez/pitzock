/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2886613701")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2482375863",
    "hidden": false,
    "id": "relation3757128152",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "areaId",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2886613701")

  // remove field
  collection.fields.removeById("relation3757128152")

  return app.save(collection)
})
