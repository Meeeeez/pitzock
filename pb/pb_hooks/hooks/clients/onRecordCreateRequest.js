/// <reference path="..\..\..\pb_data\types.d.ts" />

onRecordCreateRequest((e) => {
  const email = e.record.getString("email")
  const businessId = e.record.getString("businessId")

  // check if a client with this email already exists for this business
  const clientsWithEmailInBusiness = $app.findRecordsByFilter(
    "clients",
    "email = {:email} && businessId = {:bid}",
    "",
    0, 0,
    { email: email, bid: businessId }
  );

  if (clientsWithEmailInBusiness.length > 0) {
    throw new BadRequestError("A client with this email already exists for this business!");
  }

  e.next()
}, "clients")