/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2518978005")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3008659311",
    "hidden": false,
    "id": "relation1678063900",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "stationId",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3008659311",
    "hidden": false,
    "id": "relation293564642",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "mergableWith",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2518978005")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3008659311",
    "hidden": false,
    "id": "relation1678063900",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "stationId",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3008659311",
    "hidden": false,
    "id": "relation293564642",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "mergableWith",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
