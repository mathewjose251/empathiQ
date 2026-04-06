import { NextResponse } from "next/server";

import type { ParentSurveyInput } from "@empathiq/shared/contracts/surveys";
import { submitParentSurvey } from "../../../_lib/surveyStore";

function hasMinimumSelections(input: ParentSurveyInput) {
  return (
    input.teenAgeBand &&
    input.householdContext &&
    input.mainConcerns.length > 0 &&
    input.pressurePoints.length > 0 &&
    input.supportNeeds.length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ParentSurveyInput;

    if (!hasMinimumSelections(body)) {
      return NextResponse.json(
        {
          error:
            "teenAgeBand, householdContext, at least one concern, one pressure point, and one support need are required.",
        },
        { status: 400 },
      );
    }

    const result = await submitParentSurvey(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[POST /api/surveys/parent]", error);
    return NextResponse.json(
      {
        error:
          "Unable to save the parent survey right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
