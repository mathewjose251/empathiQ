import { NextResponse } from "next/server";

import { getTeenPackFeed } from "../../../_data/packData";

export async function GET() {
  return NextResponse.json(getTeenPackFeed());
}
