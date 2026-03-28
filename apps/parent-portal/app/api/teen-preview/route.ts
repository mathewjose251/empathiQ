import { NextResponse } from "next/server";

import { getTeenPreviewPayload } from "../../_data/portalData";

export async function GET() {
  return NextResponse.json(getTeenPreviewPayload());
}
