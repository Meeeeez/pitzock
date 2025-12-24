/// <reference path="..\pb_data\types.d.ts" />

// reservations
require(`${__hooks}/hooks/reservations/onRecordCreateRequest.js`);
require(`${__hooks}/hooks/reservations/onRecordCreate.js`);

// clients
require(`${__hooks}/hooks/clients/onRecordCreateRequest.js`);

// businesses
require(`${__hooks}/hooks/businesses/onRecordUpdateRequest.js`);

// api routes
const findSuitableStationsHandler = require(`${__hooks}/custom-api-routes/find-suitable-stations.js`);
routerAdd("GET", "/api/find-suitable-stations", findSuitableStationsHandler, $apis.requireAuth());

const findSuitableMergeGroupsHandler = require(`${__hooks}/custom-api-routes/find-suitable-merge-groups.js`);
routerAdd("GET", "/api/find-suitable-merge-groups", findSuitableMergeGroupsHandler, $apis.requireAuth());

const reassignStationReservationHandler = require(`${__hooks}/custom-api-routes/reassign-station-reservation.js`);
routerAdd("POST", "/api/reassign-station-reservation", reassignStationReservationHandler, $apis.requireAuth());

const createMergeGroup = require(`${__hooks}/custom-api-routes/create-merge-group.js`);
routerAdd("POST", "/api/create-merge-group", createMergeGroup, $apis.requireAuth());

const createWalkIn = require(`${__hooks}/custom-api-routes/create-walk-in.js`);
routerAdd("POST", "/api/create-walk-in", createWalkIn, $apis.requireAuth());

const reassignStationWalkInHandler = require(`${__hooks}/custom-api-routes/reassign-station-walk-in.js`);
routerAdd("POST", "/api/reassign-station-walk-in", reassignStationWalkInHandler, $apis.requireAuth());