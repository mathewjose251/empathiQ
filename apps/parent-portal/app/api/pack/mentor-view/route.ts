import { NextResponse } from "next/server";

import { getMentorPackView } from "../../../_data/packData";

export async function GET() {
  return NextResponse.json(getMentorPackView());
}
