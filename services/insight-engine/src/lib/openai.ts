import OpenAI from "openai";

import { config } from "../config.js";

export const openaiClient = config.openAiApiKey
  ? new OpenAI({ apiKey: config.openAiApiKey })
  : null;
