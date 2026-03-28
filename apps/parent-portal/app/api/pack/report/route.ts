import { NextResponse } from "next/server";

import type { ReportPackPostInput } from "../../../../../../packages/shared/src/contracts/pack";
import { reportPackPost } from "../../../_data/packData";

export async function POST(request: Request) {
  const body = (await request.json()) as ReportPackPostInput;

  if (!body?.postId || !body?.reason) {
    return NextResponse.json(
      { error: "postId and reason are required." },
      { status: 400 },
    );
  }

  return NextResponse.json(reportPackPost(body));
}
