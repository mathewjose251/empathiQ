import { NextResponse } from "next/server";
import type { TweenSurveyInput } from "@empathiq/shared/contracts/surveys";
import { submitTweenSurvey } from "../../../_lib/surveyStore";

export async function POST(req: Request) {
  const body = (await req.json()) as TweenSurveyInput;

  if (!body.ageBand || !body.mainConcerns?.length) {
    return NextResponse.json(
      { success: false, message: "Age band and at least one concern are required." },
      { status: 400 },
    );
  }

  const result = await submitTweenSurvey(body);
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
