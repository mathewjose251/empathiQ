/**
 * Database Seed Script
 *
 * Seeds Phase 1 missions and thinking trap categories.
 * Run with: pnpm prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import { getAllPhase1Missions } from "../../../packages/shared/src/missions/missionFactory";

const prisma = new PrismaClient();

async function seedThinkingTraps() {
  const traps = [
    {
      code: "ACCURATE_THINKING",
      label: "Accurate Thinking",
      description:
        "Seeing things clearly and factually, without distortion or catastrophe.",
      severityWeight: -1, // Negative = healthy choice
    },
    {
      code: "CATASTROPHIZING",
      label: "Catastrophizing",
      description:
        "Assuming the worst will happen and spinning small problems into disasters.",
      severityWeight: 3,
    },
    {
      code: "ALL_OR_NOTHING",
      label: "All-or-Nothing Thinking",
      description:
        "Seeing situations in black and white with no middle ground or nuance.",
      severityWeight: 2,
    },
    {
      code: "MIND_READING",
      label: "Mind Reading",
      description:
        "Assuming you know what others are thinking without evidence.",
      severityWeight: 2,
    },
    {
      code: "OVERGENERALIZATION",
      label: "Overgeneralization",
      description:
        "Taking one negative event and treating it as a lifelong pattern.",
      severityWeight: 2,
    },
    {
      code: "LABELING",
      label: "Labeling",
      description:
        "Defining yourself or others by one mistake or characteristic.",
      severityWeight: 2,
    },
    {
      code: "EMOTIONAL_REASONING",
      label: "Emotional Reasoning",
      description:
        "Believing your emotions are facts and predicting the future based on how you feel.",
      severityWeight: 2,
    },
    {
      code: "SHOULD_STATEMENTS",
      label: "Should Statements",
      description:
        "Holding rigid rules about how you or others should behave.",
      severityWeight: 2,
    },
  ];

  for (const trap of traps) {
    await prisma.thinkingTrap.upsert({
      where: { code: trap.code as any },
      update: {},
      create: trap,
    });
  }

  console.log("✓ Seeded thinking traps");
}

async function seedMissions() {
  const missions = getAllPhase1Missions();

  for (const mission of missions) {
    // Create or update the mission
    const createdMission = await prisma.mission.upsert({
      where: { slug: mission.slug },
      update: {
        title: mission.title,
        narrativeIntro: mission.narrativeIntro,
        sensoryPrompt: mission.sensoryPrompt,
        estimatedMinutes: mission.estimatedMinutes,
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

    // Create decision options for each mission
    for (let i = 0; i < mission.decisions.length; i++) {
      const decision = mission.decisions[i];

      const createdDecision = await prisma.missionDecisionOption.upsert({
        where: {
          missionId_sortOrder: {
            missionId: createdMission.id,
            sortOrder: i,
          },
        },
        update: {
          label: decision.label,
          narrativeOutcome: decision.narrativeOutcome,
        },
        create: {
          missionId: createdMission.id,
          label: decision.label,
          narrativeOutcome: decision.narrativeOutcome,
          sortOrder: i,
        },
      });

      // Link the thinking trap to this decision
      const trap = await prisma.thinkingTrap.findUnique({
        where: { code: decision.thinkingTrapId as any },
      });

      if (trap) {
        await prisma.missionChoiceTrap.upsert({
          where: {
            decisionOptionId_thinkingTrapId: {
              decisionOptionId: createdDecision.id,
              thinkingTrapId: trap.id,
            },
          },
          update: {},
          create: {
            decisionOptionId: createdDecision.id,
            thinkingTrapId: trap.id,
          },
        });
      }
    }
  }

  console.log(`✓ Seeded ${missions.length} missions`);
}

async function main() {
  try {
    console.log("🌱 Seeding database...");
    await seedThinkingTraps();
    await seedMissions();
    console.log("✅ Seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
