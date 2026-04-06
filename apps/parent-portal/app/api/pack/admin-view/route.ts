import { NextResponse } from "next/server";

import { getAdminPackConsole } from "../../../_lib/packStore";

export async function GET() {
  return NextResponse.json(await getAdminPackConsole());
}
