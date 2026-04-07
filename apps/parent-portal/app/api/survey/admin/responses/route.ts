import { NextResponse } from "next/server";
import { getSurveyResponsePage } from "../../../../_lib/surveyStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
  const pageSize = Math.min(50, Math.max(10, parseInt(searchParams.get("pageSize") ?? "25", 10)));
  const audience = searchParams.get("audience") ?? undefined;

  const result = await getSurveyResponsePage(page, pageSize, audience);
  return NextResponse.json(result);
}
