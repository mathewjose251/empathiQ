import { NextResponse } from "next/server";

import { getMentorPackView } from "../../../_lib/packStore";

export async function GET() {
  return NextResponse.json(await getMentorPackView());
}
