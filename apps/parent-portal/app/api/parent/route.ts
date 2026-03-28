import { NextResponse } from "next/server";

import { getParentPayload } from "../../_data/portalData";

export async function GET() {
  return NextResponse.json(getParentPayload());
}
