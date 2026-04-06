import { NextResponse } from "next/server";

import type { CreatePackPostInput } from "@empathiq/shared/contracts/pack";
import { createPackPost } from "../../../_lib/packStore";

export async function POST(request: Request) {
  const body = (await request.json()) as CreatePackPostInput;

  if (!body?.body?.trim()) {
    return NextResponse.json(
      { error: "Reflection body is required." },
      { status: 400 },
    );
  }

  return NextResponse.json(await createPackPost(body));
}
