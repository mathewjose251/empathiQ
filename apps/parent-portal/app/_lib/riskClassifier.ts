/**
 * AI-Powered Risk Classification System for Pack Reflections
 *
 * This system classifies teen peer reflections into three risk zones:
 * 🔴 RED ZONE: Immediate danger requiring admin escalation
 * 🟡 YELLOW ZONE: Concerning patterns requiring human review
 * 🟢 GREEN ZONE: Safe content that can be posted immediately
 *
 * Used with pre-moderation workflow: RED → ESCALATE to admin
 *                                     YELLOW → hold for human review
 *                                     GREEN → publish immediately
 */

export type RiskZone = "RED" | "YELLOW" | "GREEN";

export interface RiskClassificationResult {
  zone: RiskZone;
  confidence: number; // 0-1
  flagTypes: RiskFlagType[];
  reasoning: string;
  recommendation: "ESCALATE_IMMEDIATELY" | "HOLD_FOR_REVIEW" | "PUBLISH";
}

export type RiskFlagType =
  | "SUICIDE_INTENT"
  | "SELF_HARM_INTENT"
  | "ACTIVE_ABUSE"
  | "VIOLENCE_RISK"
  | "SUBSTANCE_ABUSE"
  | "EATING_DISORDER"
  | "SEVERE_DEPRESSION"
  | "IDENTITY_LEAK"
  | "BULLYING_CONTENT"
  | "HOPEFUL_THINKING"
  | "ACCURATE_THINKING"
  | "HEALTH_CONCERN";

/**
 * RED ZONE: Immediate danger requiring admin escalation within 5 minutes
 *
 * Examples:
 * - "I'm going to kill myself tonight"
 * - "I've been cutting myself for months and no one knows"
 * - "My dad hits me and my mom pretends it doesn't happen"
 * - "I want to hurt myself because I'm worthless"
 * - "I think about dying every day"
 */
const RED_ZONE_PATTERNS = [
  // Suicide intent
  {
    patterns: [
      /\b(kill|end|take) (myself|my life)\b/i,
      /\b(suicide|suicidal|want to die|don't want to live|rather be dead)\b/i,
      /\b(tonight|tomorrow|this week) .{0,30}(die|dead|gone|not here)\b/i,
      /\b(goodbye|final message|last time)\b/i,
    ],
    type: "SUICIDE_INTENT" as RiskFlagType,
    severity: 1,
  },
  // Self-harm intent
  {
    patterns: [
      /\b(cut|hurt|harm|slit|scratch|burn) (myself|my|skin)\b/i,
      /\b(self[- ]?harm|self[- ]?injury|cutting)\b/i,
      /\b(for months|every day|can't stop)\s+.{0,30}(cut|harm|hurt)\b/i,
    ],
    type: "SELF_HARM_INTENT" as RiskFlagType,
    severity: 1,
  },
  // Active abuse
  {
    patterns: [
      /\b(hits?|beats?|punches?|slaps?|kicks?) (me|my)\b/i,
      /\b(my (mom|dad|parent|step\w+)|he|she) (hits|beats|hurts)\b/i,
      /\b(abuse|abuse.*parent|parent.*abuse|unsafe at home)\b/i,
      /\b(domestic violence|violent home|hit me|beaten)\b/i,
    ],
    type: "ACTIVE_ABUSE" as RiskFlagType,
    severity: 1,
  },
  // Violence risk
  {
    patterns: [
      /\b(hurt|kill|harm) (someone|people|them|my classmates)\b/i,
      /\b(violent thoughts|want to hurt|thoughts of harming)\b/i,
      /\b(plan|planning).{0,40}(hurt|kill|harm)\b/i,
    ],
    type: "VIOLENCE_RISK" as RiskFlagType,
    severity: 1,
  },
];

/**
 * YELLOW ZONE: Concerning patterns requiring human review
 *
 * Examples:
 * - "I've been drinking to cope with stress"
 * - "I hate my body and I'm not eating"
 * - "I feel worthless all the time"
 * - "I want to disappear but I'm not going to hurt myself"
 * - "My friends bullied me for weeks"
 */
const YELLOW_ZONE_PATTERNS = [
  // Substance abuse
  {
    patterns: [
      /\b(weed|marijuana|alcohol|beer|vodka|drugs|cocaine|pills|xanax|vaping|high|drunk|smoking)\b/i,
      /\b(to cope|to feel better|to escape)\b.*\b(drink|smoke|use|drugs)\b/i,
      /\b(addicted|addiction|can't stop).{0,30}(drink|smoke|use|drugs)\b/i,
    ],
    type: "SUBSTANCE_ABUSE" as RiskFlagType,
    severity: 0.75,
  },
  // Eating disorder indicators
  {
    patterns: [
      /\b(not eating|restrictive|calorie|binge|purge|diet|lost weight)\b/i,
      /\b(hate my body|too fat|look ugly|disgusting)\b/i,
      /\b(starving myself|forcing myself|purging)\b/i,
      /\b(eating disorder|anorexia|bulimia)\b/i,
    ],
    type: "EATING_DISORDER" as RiskFlagType,
    severity: 0.75,
  },
  // Severe depression indicators
  {
    patterns: [
      /\b(worthless|useless|burden|nobody cares|alone|empty|hopeless)\b/i,
      /\b(everything is pointless|no reason to|why try|can't do anything)\b/i,
      /\b(all day in bed|can't get up|too tired to|gave up)\b/i,
      /\b(severe depression|deeply depressed|dark place)\b/i,
    ],
    type: "SEVERE_DEPRESSION" as RiskFlagType,
    severity: 0.7,
  },
  // Bullying/harassment
  {
    patterns: [
      /\b(bullied|bullying|harassed|humiliated|excluded|made fun of)\b/i,
      /\b(everyone hates me|no friends|left out|laughed at)\b/i,
      /\b(spread rumors|fake friends|betrayed)\b/i,
    ],
    type: "BULLYING_CONTENT" as RiskFlagType,
    severity: 0.65,
  },
  // Identity leak patterns
  {
    patterns: [
      /\b(school|@\w+|\.com|my name is|my number is)\b/i,
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // phone numbers
      /\b\d{5,}\b/, // postal codes, SSN
    ],
    type: "IDENTITY_LEAK" as RiskFlagType,
    severity: 0.6,
  },
];

/**
 * GREEN ZONE: Safe content that demonstrates healthy coping
 *
 * Examples:
 * - "I realized my thoughts weren't facts and it felt amazing"
 * - "Talking about it made things so much clearer"
 * - "I'm learning to cope in better ways"
 * - "My friends helped me realize it wasn't my fault"
 */
const GREEN_ZONE_INDICATORS = [
  // Healthy coping
  {
    patterns: [
      /\b(helped|helpful|better|improved|felt better|working through|coping)\b/i,
      /\b(talked about|sharing|opening up|told someone)\b/i,
      /\b(realized|noticed|understood|made sense)\b/i,
      /\b(breathing|walking|music|writing|drawing)\b.*\b(helps?|calmed|better)\b/i,
    ],
    type: "ACCURATE_THINKING" as RiskFlagType,
    severity: 0,
  },
  // Hope and growth
  {
    patterns: [
      /\b(hopeful|better days|can change|learning|growing|proud)\b/i,
      /\b(trying|attempting|working on|practicing)\b/i,
      /\b(supportive|kind|caring|friend|helped me)\b/i,
    ],
    type: "HOPEFUL_THINKING" as RiskFlagType,
    severity: 0,
  },
];

/**
 * Classify text into RED / YELLOW / GREEN zones
 *
 * @param text - The pack reflection text to classify
 * @returns RiskClassificationResult with zone, confidence, flags, and recommendation
 */
export function classifyRiskZone(text: string): RiskClassificationResult {
  const normalizedText = text.toLowerCase();
  const flaggedTypes = new Set<RiskFlagType>();
  let maxSeverity = 0;

  // Check RED zone patterns
  for (const patternGroup of RED_ZONE_PATTERNS) {
    for (const pattern of patternGroup.patterns) {
      if (pattern.test(normalizedText)) {
        flaggedTypes.add(patternGroup.type);
        maxSeverity = Math.max(maxSeverity, patternGroup.severity);
      }
    }
  }

  // If any RED flags found, return RED zone
  if (maxSeverity >= 1) {
    return {
      zone: "RED",
      confidence: 0.95,
      flagTypes: Array.from(flaggedTypes),
      reasoning: `Detected ${Array.from(flaggedTypes).join(", ")} - immediate safety concern`,
      recommendation: "ESCALATE_IMMEDIATELY",
    };
  }

  // Check YELLOW zone patterns
  for (const patternGroup of YELLOW_ZONE_PATTERNS) {
    for (const pattern of patternGroup.patterns) {
      if (pattern.test(normalizedText)) {
        flaggedTypes.add(patternGroup.type);
        maxSeverity = Math.max(maxSeverity, patternGroup.severity);
      }
    }
  }

  // If any YELLOW flags found, return YELLOW zone
  if (maxSeverity >= 0.6) {
    return {
      zone: "YELLOW",
      confidence: 0.85,
      flagTypes: Array.from(flaggedTypes),
      reasoning: `Detected ${Array.from(flaggedTypes).join(", ")} - requires human review`,
      recommendation: "HOLD_FOR_REVIEW",
    };
  }

  // Check for GREEN zone indicators (positive signals override caution)
  const greenScore = GREEN_ZONE_INDICATORS.reduce((score, group) => {
    return (
      score +
      group.patterns.filter((pattern) => pattern.test(normalizedText)).length
    );
  }, 0);

  // Default to GREEN (safe)
  return {
    zone: "GREEN",
    confidence: greenScore > 0 ? 0.95 : 0.7,
    flagTypes: greenScore > 0 ? ["ACCURATE_THINKING", "HOPEFUL_THINKING"] : [],
    reasoning:
      greenScore > 0
        ? "Post demonstrates healthy thinking patterns"
        : "Post does not contain safety concerns",
    recommendation: "PUBLISH",
  };
}

/**
 * Convert RiskZone to moderation status for existing pack system
 */
export function riskZoneToModerationStatus(
  zone: RiskZone,
): "CLEARED" | "QUEUED" | "ESCALATED" {
  switch (zone) {
    case "RED":
      return "ESCALATED";
    case "YELLOW":
      return "QUEUED";
    case "GREEN":
      return "CLEARED";
  }
}

/**
 * Get human-friendly message for each zone
 */
export function getRiskZoneMessage(zone: RiskZone): string {
  switch (zone) {
    case "RED":
      return "This post requires immediate admin review before posting. You will be notified of the outcome.";
    case "YELLOW":
      return "This post is being reviewed by our safety team. It will appear in your Pack once approved (usually within an hour).";
    case "GREEN":
      return "Posted anonymously to your Pack.";
  }
}
