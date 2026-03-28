import { NextResponse } from "next/server";

import type { HidePackAliasInput } from "../../../../../../packages/shared/src/contracts/pack";
import { hidePackAlias } from "../../../_data/packData";

export async function POST(request: Request) {
  const body = (await request.json()) as HidePackAliasInput;

  if (!body?.alias) {
    return NextResponse.json({ error: "alias is required." }, { status: 400 });
  }

  return NextResponse.json(hidePackAlias(body));
}
