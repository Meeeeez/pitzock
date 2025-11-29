/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "reservationId.clientId.businessId = @request.auth.id",
    "deleteRule": "reservationId.clientId.businessId = @request.auth.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3008659311",
        "hidden": false,
        "id": "relation4053386217",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "tableId",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": true,
        "collectionId": "pbc_1473635903",
        "hidden": false,
        "id": "relation3799077151",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "reservationId",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_88664308",
    "indexes": [],
    "listRule": "reservationId.clientId.businessId = @request.auth.id",
    "name": "stationReservations",
    "system": false,
    "type": "base",
    "updateRule": "reservationId.clientId.businessId = @request.auth.id",
    "viewRule": "reservationId.clientId.businessId = @request.auth.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_88664308");

  return app.delete(collection);
})
