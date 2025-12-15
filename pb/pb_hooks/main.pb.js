/// <reference path="..\pb_data\types.d.ts" />

// reservations
require(`${__hooks}/reservations/onRecordCreateRequest.js`);
require(`${__hooks}/reservations/onRecordAfterCreateSuccess.js`);

// clients
require(`${__hooks}/clients/onRecordCreateRequest.js`);

// station merges
require(`${__hooks}/station-merges/onRecordCreateRequest.js`);

// businesses
require(`${__hooks}/businesses/onRecordUpdateRequest.js`);
