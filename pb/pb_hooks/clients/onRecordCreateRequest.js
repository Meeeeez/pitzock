/// <reference path="..\..\pb_data\types.d.ts" />

onRecordCreateRequest((e) => {
  const body = e.requestInfo().body

  // check if a client with this email already exists for this business
  const existingClient = new DynamicModel({ "id": "" })
  try {
    e.app.db()
      .select("id")
      .from("clients")
      .where($dbx.like("email", body.email))
      .andWhere($dbx.like("businessId", body.businessId))
      .one(existingClient);
  } catch (e) { }

  if (existingClient.id) {
    throw new BadRequestError("A client with this email already exists for this business!");
  }

  e.next()
}, "clients")