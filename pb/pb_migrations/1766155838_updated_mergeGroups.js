/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2886613701")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "number3051925876",
    "max": null,
    "min": 1,
    "name": "capacity",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2886613701")

  // remove field
  collection.fields.removeById("number3051925876")

  return app.save(collection)
})
