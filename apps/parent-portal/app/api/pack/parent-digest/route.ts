import { NextResponse } from "next/server";

import { getParentPackDigest } from "../../../_lib/packStore";

export async function GET() {
  return NextResponse.json(await getParentPackDigest());
}
