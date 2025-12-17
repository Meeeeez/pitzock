/// <reference path="..\..\pb_data\types.d.ts" />

onRecordCreateRequest((e) => {
  // check if a client with this email already exists for this business
  const email = e.record.getString("email")
  const businessId = e.record.getString("businessId")
  try {
    $app.findFirstRecordByFilter(
      "clients",
      "email = {:email} && businessId = {:bid}",
      { "email": email, "bid": businessId }
    )
    // the previous line will always throw if it does not find a row
    // if this is reached it means that there is already a client with this email on this business
    throw new BadRequestError("A client with this email already exists for this business!");
  } catch (e) {
    if (e instanceof BadRequestError) throw e;
  }

  e.next()
}, "clients")