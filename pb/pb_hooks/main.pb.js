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
routerAdd("GET", "/api/find-suitable-stations", findSuitableStationsHandler);

const findSuitableMergeGroupsHandler = require(`${__hooks}/custom-api-routes/find-suitable-merge-groups.js`);
routerAdd("GET", "/api/find-suitable-merge-groups", findSuitableMergeGroupsHandler);
