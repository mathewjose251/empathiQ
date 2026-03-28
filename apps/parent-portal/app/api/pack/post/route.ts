import { NextResponse } from "next/server";

import type { CreatePackPostInput } from "../../../../../../packages/shared/src/contracts/pack";
import { createPackPost } from "../../../_data/packData";

export async function POST(request: Request) {
  const body = (await request.json()) as CreatePackPostInput;

  if (!body?.body?.trim()) {
    return NextResponse.json(
      { error: "Reflection body is required." },
      { status: 400 },
    );
  }

  return NextResponse.json(createPackPost(body));
}
