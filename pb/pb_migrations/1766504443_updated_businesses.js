/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number3845796728",
    "max": null,
    "min": 1,
    "name": "timeSlotSizeMin",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number448634048",
    "max": null,
    "min": 1,
    "name": "maxAdvanceBookingDays",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "number1106634481",
    "max": null,
    "min": 1,
    "name": "maxPax",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("number3845796728")

  // remove field
  collection.fields.removeById("number448634048")

  // remove field
  collection.fields.removeById("number1106634481")

  return app.save(collection)
})
