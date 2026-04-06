import { NextResponse } from "next/server";

import { getTeenPackFeed } from "../../../_lib/packStore";

export async function GET() {
  return NextResponse.json(await getTeenPackFeed());
}
