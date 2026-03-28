import { NextResponse } from "next/server";

import { getAdminPackConsole } from "../../../_data/packData";

export async function GET() {
  return NextResponse.json(getAdminPackConsole());
}
