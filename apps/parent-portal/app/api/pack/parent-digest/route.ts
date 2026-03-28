import { NextResponse } from "next/server";

import { getParentPackDigest } from "../../../_data/packData";

export async function GET() {
  return NextResponse.json(getParentPackDigest());
}
