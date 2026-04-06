import { prisma } from "@empathiq/database";
import {
  getAllPhase1Missions,
  type ThinkingTrapCode,
} from "@empathiq/shared/missions/missionFactory";

const TRAP_METADATA: Record<
  ThinkingTrapCode,
  { label: string; description: string; severityWeight: number }
> = {
  ACCURATE_THINKING: {
    label: "Accurate Thinking",
    description:
      "A grounded interpretation that leaves room for facts, uncertainty, and flexible responses.",
    severityWeight: 0,
  },
  CATASTROPHIZING: {
    label: "Catastrophizing",
    description:
      "Expecting the worst possible outcome and reacting to it as if it is certain.",
    severityWeight: 3,
  },
  ALL_OR_NOTHING: {
    label: "All-or-Nothing Thinking",
    description:
      "Seeing a situation in extremes, without middle ground or nuance.",
    severityWeight: 2,
  },
  MIND_READING: {
    label: "Mind Reading",
    description:
      "Assuming you know what others think without enough evidence.",
    severityWeight: 2,
  },
  OVERGENERALIZATION: {
    label: "Overgeneralization",
    description:
      "Turning one painful event into a broad rule about your future or identity.",
    severityWeight: 2,
  },
  LABELING: {
    label: "Labeling",
    description:
      "Reducing yourself to a harsh identity statement based on one event or flaw.",
    severityWeight: 2,
  },
  EMOTIONAL_REASONING: {
    label: "Emotional Reasoning",
    description:
      "Treating a strong feeling as final proof, even when the evidence is incomplete.",
    severityWeight: 2,
  },
  SHOULD_STATEMENTS: {
    label: "Should Statements",
    description:
      "Rigid expectations that create shame or pressure when life does not match them.",
    severityWeight: 1,
  },
};

let syncPromise: Promise<void> | null = null;

async function syncMissionCatalogOnce() {
  const missions = getAllPhase1Missions();

  for (const [code, metadata] of Object.entries(TRAP_METADATA) as Array<
    [ThinkingTrapCode, (typeof TRAP_METADATA)[ThinkingTrapCode]]
  >) {
    await prisma.thinkingTrap.upsert({
      where: { code },
      update: metadata,
      create: {
        code,
        ...metadata,
      },
    });
  }

  for (const mission of missions) {
    const savedMission = await prisma.mission.upsert({
      where: { slug: mission.slug },
      update: {
        title: mission.title,
        narrativeIntro: mission.narrativeIntro,
        sensoryPrompt: mission.sensoryPrompt,
        estimatedMinutes: mission.estimatedMinutes,
        status: "PUBLISHED",
      },
      create: {
        slug: mission.slug,
        title: mission.title,
        narrativeIntro: mission.narrativeIntro,
        sensoryPrompt: mission.sensoryPrompt,
        estimatedMinutes: mission.estimatedMinutes,
        status: "PUBLISHED",
      },
    });

    for (const [index, decision] of mission.decisions.entries()) {
      const sortOrder = index + 1;
      const savedOption = await prisma.missionDecisionOption.upsert({
        where: {
          missionId_sortOrder: {
            missionId: savedMission.id,
            sortOrder,
          },
        },
        update: {
          label: decision.label,
          narrativeOutcome: decision.narrativeOutcome,
        },
        create: {
          missionId: savedMission.id,
          label: decision.label,
          narrativeOutcome: decision.narrativeOutcome,
          sortOrder,
        },
      });

      const trap = await prisma.thinkingTrap.findUniqueOrThrow({
        where: { code: decision.thinkingTrapId },
        select: { id: true },
      });

      await prisma.missionChoiceTrap.upsert({
        where: {
          decisionOptionId_thinkingTrapId: {
            decisionOptionId: savedOption.id,
            thinkingTrapId: trap.id,
          },
        },
        update: {},
        create: {
          decisionOptionId: savedOption.id,
          thinkingTrapId: trap.id,
        },
      });
    }
  }
}

export async function ensureMissionCatalogSynced() {
  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = syncMissionCatalogOnce().finally(() => {
    syncPromise = null;
  });

  return syncPromise;
}
