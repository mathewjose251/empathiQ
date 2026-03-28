import express from "express";

import { config } from "./config.js";
import { insightsRouter } from "./routes/insights.js";

const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "insight-engine" });
});

app.use("/insights", insightsRouter);

app.listen(config.port, () => {
  console.log(`Insight Engine listening on port ${config.port}`);
});
