/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2518978005");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "stationId.areaId.businessId = @request.auth.id && mergableWith.areaId.businessId = @request.auth.id",
    "deleteRule": "stationId.areaId.businessId = @request.auth.id && mergableWith.areaId.businessId = @request.auth.id",
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
      },
      {
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
    "id": "pbc_2518978005",
    "indexes": [],
    "listRule": "stationId.areaId.businessId = @request.auth.id && mergableWith.areaId.businessId = @request.auth.id",
    "name": "stationMerges",
    "system": false,
    "type": "base",
    "updateRule": "stationId.areaId.businessId = @request.auth.id && mergableWith.areaId.businessId = @request.auth.id",
    "viewRule": "stationId.areaId.businessId = @request.auth.id && mergableWith.areaId.businessId = @request.auth.id"
  });

  return app.save(collection);
})
