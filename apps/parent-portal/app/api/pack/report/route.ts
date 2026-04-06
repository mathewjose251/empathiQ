import { NextResponse } from "next/server";

import type { ReportPackPostInput } from "@empathiq/shared/contracts/pack";
import { reportPackPost } from "../../../_lib/packStore";

export async function POST(request: Request) {
  const body = (await request.json()) as ReportPackPostInput;

  if (!body?.postId || !body?.reason) {
    return NextResponse.json(
      { error: "postId and reason are required." },
      { status: 400 },
    );
  }

  return NextResponse.json(await reportPackPost(body));
}
