import { NextResponse } from "next/server";

import { getMentorPayload } from "../../_data/portalData";

export async function GET() {
  return NextResponse.json(getMentorPayload());
}
