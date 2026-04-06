import { NextResponse } from "next/server";

import type { UpdatePackConsentInput } from "@empathiq/shared/contracts/pack";
import { updatePackConsent } from "../../../_lib/packStore";

export async function PATCH(request: Request) {
  const body = (await request.json()) as UpdatePackConsentInput;

  if (typeof body?.acknowledged !== "boolean") {
    return NextResponse.json(
      { error: "acknowledged must be a boolean." },
      { status: 400 },
    );
  }

  return NextResponse.json(await updatePackConsent(body));
}
