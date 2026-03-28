import { NextResponse } from "next/server";

import { getDoseWorkshopPayload } from "../../../../_data/workshopData";

export async function GET() {
  return NextResponse.json(getDoseWorkshopPayload());
}
