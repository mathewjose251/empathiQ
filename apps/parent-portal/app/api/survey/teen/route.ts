import { NextResponse } from "next/server";
import type { TeenSurveyInput } from "@empathiq/shared/contracts/surveys";
import { submitTeenSurvey } from "../../../_lib/surveyStore";

export async function POST(req: Request) {
  const body = (await req.json()) as TeenSurveyInput;

  if (!body.ageBand || !body.mainConcerns?.length) {
    return NextResponse.json(
      { success: false, message: "Age band and at least one concern are required." },
      { status: 400 },
    );
  }

  const result = await submitTeenSurvey(body);
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
