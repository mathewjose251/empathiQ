import { NextResponse } from "next/server";

import { getOverviewPayload } from "../../_data/portalData";

export async function GET() {
  return NextResponse.json(getOverviewPayload());
}
