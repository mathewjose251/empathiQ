import { NextResponse } from "next/server";

import type { UpdateModerationDecisionInput } from "@empathiq/shared/contracts/pack";
import {
  getModerationQueue,
  updateModerationDecision,
} from "../../../_lib/packStore";

export async function GET() {
  return NextResponse.json(await getModerationQueue());
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as UpdateModerationDecisionInput;

  if (!body?.postId || !body?.decision) {
    return NextResponse.json(
      { error: "postId and decision are required." },
      { status: 400 },
    );
  }

  return NextResponse.json(await updateModerationDecision(body));
}
