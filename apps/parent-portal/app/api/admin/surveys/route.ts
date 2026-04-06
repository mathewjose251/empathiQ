import { NextResponse } from "next/server";

import { getSurveyDashboardData } from "../../../_lib/surveyStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSurveyDashboardData());
}
