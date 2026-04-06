import { NextResponse } from "next/server";

import type { TeenSurveyInput } from "@empathiq/shared/contracts/surveys";
import { submitTeenSurvey } from "../../../_lib/surveyStore";
import { getAuthContext } from "../../../_lib/teenAuth";

function hasMinimumSelections(input: TeenSurveyInput) {
  return (
    input.ageBand &&
    input.mainConcerns.length > 0 &&
    input.pressurePoints.length > 0 &&
    input.supportNeeds.length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TeenSurveyInput;

    if (!hasMinimumSelections(body)) {
      return NextResponse.json(
        {
          error:
            "ageBand, at least one concern, one pressure point, and one support need are required.",
        },
        { status: 400 },
      );
    }

    let teenId: string | undefined;
    const authHeader = request.headers.get("Authorization");

    if (authHeader) {
      try {
        teenId = getAuthContext(authHeader).teenId;
      } catch {
        teenId = undefined;
      }
    }

    const result = await submitTeenSurvey(body, teenId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[POST /api/surveys/teen]", error);
    return NextResponse.json(
      {
        error:
          "Unable to save the teen survey right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
