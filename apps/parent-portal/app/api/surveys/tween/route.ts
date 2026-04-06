import { NextResponse } from "next/server";

import type { TweenSurveyInput } from "@empathiq/shared/contracts/surveys";
import { submitTweenSurvey } from "../../../_lib/surveyStore";

function hasMinimumSelections(input: TweenSurveyInput) {
  return (
    input.ageBand &&
    input.mainConcerns.length > 0 &&
    input.pressurePoints.length > 0 &&
    input.supportNeeds.length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TweenSurveyInput;

    if (!hasMinimumSelections(body)) {
      return NextResponse.json(
        {
          error:
            "ageBand, at least one concern, one pressure point, and one support need are required.",
        },
        { status: 400 },
      );
    }

    const result = await submitTweenSurvey(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[POST /api/surveys/tween]", error);
    return NextResponse.json(
      {
        error:
          "Unable to save the tween survey right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
