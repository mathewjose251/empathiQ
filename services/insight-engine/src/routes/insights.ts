import { Router } from "express";

import {
  generateWeeklyInsight,
  weeklyInsightRequestSchema,
} from "../services/insightEngine.js";

export const insightsRouter = Router();

insightsRouter.post("/weekly", async (request, response) => {
  const parseResult = weeklyInsightRequestSchema.safeParse(request.body);

  if (!parseResult.success) {
    response.status(400).json({
      error: "Invalid insight payload",
      details: parseResult.error.flatten(),
    });
    return;
  }

  const insight = await generateWeeklyInsight(parseResult.data);

  response.json(insight);
});
