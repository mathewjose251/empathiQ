import { NextResponse } from "next/server";

import { getAdminPayload } from "../../_data/portalData";

export async function GET() {
  return NextResponse.json(getAdminPayload());
}
