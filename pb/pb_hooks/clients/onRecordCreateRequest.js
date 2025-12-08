/// <reference path="..\..\pb_data\types.d.ts" />

onRecordCreateRequest((e) => {
  const body = e.requestInfo().body

  // check if a client with this email already exists for this business
  try {
    const existingClient = new DynamicModel({ "id": "" })

    e.app.db()
      .select("id")
      .from("clients")
      .where($dbx.like("email", body.email))
      .andWhere($dbx.like("businessId", body.businessId))
      .one(existingClient);

    if (existingClient.id) {
      throw new BadRequestError("A client with this email already exists for this business!");
    }
  } catch (e) { }

  e.next()
}, "clients")