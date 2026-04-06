import { NextResponse } from "next/server";
import type { ParentSurveyInput } from "@empathiq/shared/contracts/surveys";
import { submitParentSurvey } from "../../../_lib/surveyStore";

export async function POST(req: Request) {
  const body = (await req.json()) as ParentSurveyInput;

  if (!body.teenAgeBand || !body.householdContext || !body.mainConcerns?.length) {
    return NextResponse.json(
      {
        success: false,
        message: "Teen age band, household context, and at least one concern are required.",
      },
      { status: 400 },
    );
  }

  const result = await submitParentSurvey(body);
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
