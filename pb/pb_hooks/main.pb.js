/// <reference path="..\pb_data\types.d.ts" />

// reservations
require(`${__hooks}/reservations/onRecordCreateRequest.js`);
require(`${__hooks}/reservations/onRecordCreate.js`);

// clients
require(`${__hooks}/clients/onRecordCreateRequest.js`);

// businesses
require(`${__hooks}/businesses/onRecordUpdateRequest.js`);
