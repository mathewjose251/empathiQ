#!/usr/bin/env node

/**
 * Standalone Seed Script
 * Works with plain Node.js and npm (no pnpm required)
 *
 * Usage: node seed-standalone.js
 */

const fs = require('fs');
const path = require('path');

// Import Prisma client
let PrismaClient;
try {
  const prismaPath = path.join(__dirname, 'node_modules', '@prisma', 'client', 'index.js');
  const module = require(prismaPath);
  PrismaClient = module.PrismaClient;
} catch (error) {
  console.error('❌ Cannot find @prisma/client. Run: npm install');
  process.exit(1);
}

// Mission definitions (from missionFactory.ts)
const MISSIONS = {
  'night-before-finals': {
    slug: 'night-before-finals',
    title: 'The Night Before Finals',
    theme: 'school',
    chapterLabel: 'Choice Fork 01',
    estimatedMinutes: 3,
    narrativeIntro: 'Your phone lights up with messages about tomorrow\'s exam. Your chest tightens, and your first thought is that one bad score could define everything.',
    sensoryPrompt: 'Pause. Feel your feet on the floor. Notice three sounds around you before choosing.',
    decisions: [
      { label: 'Take a breath and remind yourself one test does not define your future.', narrativeOutcome: 'You create a little space between the panic and the facts, which helps you plan your next hour.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Assume this test will ruin everything and spiral into worst-case thoughts.', narrativeOutcome: 'The pressure grows fast, making the problem feel bigger than the moment in front of you.', thinkingTrapId: 'CATASTROPHIZING' }
    ]
  },
  'family-dinner-tension': {
    slug: 'family-dinner-tension',
    title: 'Family Dinner Tension',
    theme: 'family',
    chapterLabel: 'Choice Fork 02',
    estimatedMinutes: 3,
    narrativeIntro: 'Your parent makes a comment about your grades during dinner. You feel heat rise in your chest, and suddenly one remark feels like they think you\'re a failure at everything.',
    sensoryPrompt: 'Notice the tightness in your body. Can you name one color in the room around you?',
    decisions: [
      { label: 'Ask a clarifying question instead of assuming their judgment is total.', narrativeOutcome: 'The conversation shifts. You learn they were worried, not critical. The dinner becomes a chance to connect.', thinkingTrapId: 'ALL_OR_NOTHING' },
      { label: 'Shut down and think they\'ll never believe in you anyway.', narrativeOutcome: 'Silence grows. You feel more alone, and the hurt becomes proof that your family doesn\'t get you.', thinkingTrapId: 'OVERGENERALIZATION' }
    ]
  },
  'social-media-comparison': {
    slug: 'social-media-comparison',
    title: 'Social Media Spiral',
    theme: 'peer',
    chapterLabel: 'Choice Fork 03',
    estimatedMinutes: 3,
    narrativeIntro: 'You scroll and see your peers at a party. They look happy, confident, effortless. You\'re home alone. A voice inside says you\'re the problem.',
    sensoryPrompt: 'Take one intentional breath. What\'s one small good thing that happened to you today, even if it\'s tiny?',
    decisions: [
      { label: 'Remember that posts are curated moments, not full lives, and text a friend.', narrativeOutcome: 'Your friend replies that they felt awkward at the party. You feel less alone.', thinkingTrapId: 'MIND_READING' },
      { label: 'Believe everyone else has it figured out and you never will.', narrativeOutcome: 'The spiral deepens. You feel separate from everyone, convinced no one struggles like you do.', thinkingTrapId: 'EMOTIONAL_REASONING' }
    ]
  },
  'phone-late-night': {
    slug: 'phone-late-night',
    title: 'Phone at Midnight',
    theme: 'digital',
    chapterLabel: 'Choice Fork 04',
    estimatedMinutes: 3,
    narrativeIntro: 'It\'s midnight. You should sleep for school tomorrow, but your phone keeps buzzing. FOMO whispers that you\'re missing something huge.',
    sensoryPrompt: 'Close your eyes and listen. What\'s the furthest sound you can hear? Stay with that for a moment.',
    decisions: [
      { label: 'Set the phone down, knowing nothing urgent will happen while you sleep.', narrativeOutcome: 'You sleep well. Morning comes easier. You\'re sharper in class.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Keep scrolling because not checking might mean a real crisis you miss.', narrativeOutcome: 'Sleep becomes fragmented. You wake exhausted and more anxious than before.', thinkingTrapId: 'CATASTROPHIZING' }
    ]
  },
  'mistake-at-work': {
    slug: 'mistake-at-work',
    title: 'The Mistake',
    theme: 'self',
    chapterLabel: 'Choice Fork 05',
    estimatedMinutes: 3,
    narrativeIntro: 'You made a mistake at work or school. Small. Fixable. But immediately you think: I\'m incompetent. I should just quit. Everyone saw. I\'m ruined.',
    sensoryPrompt: 'Notice something solid around you—a wall, a chair. Touch it if you can. What does it feel like?',
    decisions: [
      { label: 'Name the specific mistake, fix it, and remind yourself you\'re learning.', narrativeOutcome: 'The mistake becomes data. Your manager appreciates that you handled it maturely.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Internalize it as proof you\'re fundamentally broken.', narrativeOutcome: 'You spiral into shame. The mistake festers into self-doubt that lasts weeks.', thinkingTrapId: 'LABELING' }
    ]
  },
  'caffeine-before-bed': {
    slug: 'caffeine-before-bed',
    title: 'Caffeine at Night',
    theme: 'self',
    chapterLabel: 'Choice Fork 06',
    estimatedMinutes: 3,
    narrativeIntro: 'It\'s 8 PM and you reach for energy drink number two. You know you should sleep early, but you tell yourself it won\'t affect you. You\'re different.',
    sensoryPrompt: 'Notice your breathing. Slow it down. Count: in for 4, out for 4. Do that three times.',
    decisions: [
      { label: 'Skip the caffeine and stick to your sleep goal.', narrativeOutcome: 'You sleep well. Morning comes easier. You\'re sharper in class.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Believe this one drink won\'t matter and that rules don\'t apply to you.', narrativeOutcome: 'You\'re up until 2 AM. You\'re groggy and irritable all day. The cycle repeats.', thinkingTrapId: 'SHOULD_STATEMENTS' }
    ]
  },
  'mirror-moment': {
    slug: 'mirror-moment',
    title: 'What You See in the Mirror',
    theme: 'self',
    chapterLabel: 'Choice Fork 07',
    estimatedMinutes: 3,
    narrativeIntro: 'You catch your reflection and immediately criticize what you see. One perceived flaw becomes evidence that everything about your body is wrong.',
    sensoryPrompt: 'Look at your hands. They\'ve held things you love, created things, helped people. What have they done for you?',
    decisions: [
      { label: 'Notice one thing your body can do well and appreciate it.', narrativeOutcome: 'You spend the day less focused on how you look and more present in what you do.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Spiral into all-or-nothing criticism about your entire appearance.', narrativeOutcome: 'The rest of your day feels darker. You avoid photos and mirrors.', thinkingTrapId: 'ALL_OR_NOTHING' }
    ]
  },
  'crush-worry': {
    slug: 'crush-worry',
    title: 'Worried About What They Think',
    theme: 'peer',
    chapterLabel: 'Choice Fork 08',
    estimatedMinutes: 3,
    narrativeIntro: 'You see your crush texting someone else. Immediately, you assume they don\'t like you. You rewrite yesterday\'s conversation as proof they were bored.',
    sensoryPrompt: 'Name five people who genuinely care about you, regardless of romance. Say their names slowly.',
    decisions: [
      { label: 'Remember that one text doesn\'t define how they feel about you.', narrativeOutcome: 'You stay calm. Later, they text you. You\'re ready to engage without anxiety.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Assume the worst and catastrophize about a rejection that hasn\'t happened.', narrativeOutcome: 'You avoid them. They sense the distance. An actual rift forms from fear.', thinkingTrapId: 'CATASTROPHIZING' }
    ]
  },
  'grade-on-test': {
    slug: 'grade-on-test',
    title: 'Not Perfect',
    theme: 'school',
    chapterLabel: 'Choice Fork 09',
    estimatedMinutes: 3,
    narrativeIntro: 'You get a B on a test. It\'s a good grade. But your brain says: B means failure. You\'re not smart. You\'ll never get into college.',
    sensoryPrompt: 'Stand up if you can. Feel your feet on the ground. You are grounded. You are okay.',
    decisions: [
      { label: 'Celebrate the B, learn from the questions you missed, move forward.', narrativeOutcome: 'You adjust your study approach. The next test goes better. You\'re proud.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Let one grade convince you that all your efforts are worthless.', narrativeOutcome: 'You feel hopeless. Studying feels pointless. Your grades actually drop.', thinkingTrapId: 'OVERGENERALIZATION' }
    ]
  },
  'presentation-fear': {
    slug: 'presentation-fear',
    title: 'In Front of Everyone',
    theme: 'school',
    chapterLabel: 'Choice Fork 10',
    estimatedMinutes: 3,
    narrativeIntro: 'You have to present tomorrow. Your mind floods with worst-case scenarios: you\'ll forget everything, everyone will judge you, it will be humiliating.',
    sensoryPrompt: 'Place your hand on your heart. Feel it beating. That rhythm has carried you through every challenge so far.',
    decisions: [
      { label: 'Prepare as best you can, then remind yourself you\'ve done hard things before.', narrativeOutcome: 'The presentation goes fine. You\'re relieved. You realize you\'re more capable than anxiety told you.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Believe every outcome will be disaster and consider skipping.', narrativeOutcome: 'You either panic-present and regret it, or avoid and face consequences.', thinkingTrapId: 'CATASTROPHIZING' }
    ]
  },
  'friend-text-unanswered': {
    slug: 'friend-text-unanswered',
    title: 'Left on Read',
    theme: 'peer',
    chapterLabel: 'Choice Fork 11',
    estimatedMinutes: 3,
    narrativeIntro: 'You text your friend something personal. Hours pass with no reply. Your brain says: they don\'t care about you. The friendship is over.',
    sensoryPrompt: 'Breathe in for 4 counts. Hold for 4. Out for 4. Notice you\'re still here. Still worthy.',
    decisions: [
      { label: 'Remember they might be busy and give them space without spiraling.', narrativeOutcome: 'They reply hours later with a genuine response. The friendship continues.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Assume silence means rejection and shut down toward them.', narrativeOutcome: 'You become distant. When they finally respond, you\'re cold. Confusion grows.', thinkingTrapId: 'MIND_READING' }
    ]
  },
  'college-decision': {
    slug: 'college-decision',
    title: 'Path Pressure',
    theme: 'school',
    chapterLabel: 'Choice Fork 12',
    estimatedMinutes: 3,
    narrativeIntro: 'Everyone asks what you want to do after high school. You don\'t know. This uncertainty feels like failure. Like you\'re broken or lazy.',
    sensoryPrompt: 'You don\'t need to have all the answers today. Breathe. You have time.',
    decisions: [
      { label: 'Accept that uncertainty is normal and explore options without pressure.', narrativeOutcome: 'You talk to people, try things, discover interests. Clarity builds over time.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Believe you should have it all figured out and panic about the future.', narrativeOutcome: 'Anxiety paralyzes you. You make rushed decisions you regret later.', thinkingTrapId: 'SHOULD_STATEMENTS' }
    ]
  },
  'peer-achievement': {
    slug: 'peer-achievement',
    title: 'Their Success',
    theme: 'peer',
    chapterLabel: 'Choice Fork 13',
    estimatedMinutes: 3,
    narrativeIntro: 'A peer announces they got a scholarship or lead role. Immediately you feel less-than. Their win feels like your loss.',
    sensoryPrompt: 'Someone else\'s good news doesn\'t change your worth. Say that three times.',
    decisions: [
      { label: 'Congratulate them genuinely and recommit to your own path.', narrativeOutcome: 'You feel good about supporting them. You refocus on what matters to you.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Let their success convince you that you\'re failing compared to them.', narrativeOutcome: 'Resentment builds. You isolate. Progress on your own goals stalls.', thinkingTrapId: 'EMOTIONAL_REASONING' }
    ]
  },
  'sibling-boundary-crossed': {
    slug: 'sibling-boundary-crossed',
    title: 'That Wasn\'t Okay',
    theme: 'family',
    chapterLabel: 'Choice Fork 14',
    estimatedMinutes: 3,
    narrativeIntro: 'Your sibling goes into your room without asking. Rage floods in. Your first thought is to lash out and destroy something.',
    sensoryPrompt: 'Pause. Notice where anger lives in your body. Breathe into that space. You\'re in control.',
    decisions: [
      { label: 'Step away, cool down, then talk calmly about boundaries.', narrativeOutcome: 'They understand. The conversation leads to respect instead of resentment.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Explode in anger, yell, or destroy something in the moment.', narrativeOutcome: 'You feel worse afterward. Conflict escalates. Trust erodes.', thinkingTrapId: 'EMOTIONAL_REASONING' }
    ]
  },
  'different-from-peers': {
    slug: 'different-from-peers',
    title: 'Not Like Them',
    theme: 'peer',
    chapterLabel: 'Choice Fork 15',
    estimatedMinutes: 3,
    narrativeIntro: 'You realize you\'re different from your peers in ways that matter to you—interests, identity, values. Part of you feels broken.',
    sensoryPrompt: 'Differences make you interesting. Sameness makes the world boring. You matter.',
    decisions: [
      { label: 'Own your difference and seek people who appreciate the real you.', narrativeOutcome: 'You find your people. Belonging deepens when you stop pretending.', thinkingTrapId: 'ACCURATE_THINKING' },
      { label: 'Hide who you are and exhaust yourself trying to fit in.', narrativeOutcome: 'You feel lonely even in a crowd. Authenticity keeps being deferred.', thinkingTrapId: 'LABELING' }
    ]
  }
};

const THINKING_TRAPS = [
  { code: 'ACCURATE_THINKING', label: 'Accurate Thinking', description: 'Seeing things clearly and factually, without distortion or catastrophe.', severityWeight: -1 },
  { code: 'CATASTROPHIZING', label: 'Catastrophizing', description: 'Assuming the worst will happen and spinning small problems into disasters.', severityWeight: 3 },
  { code: 'ALL_OR_NOTHING', label: 'All-or-Nothing Thinking', description: 'Seeing situations in black and white with no middle ground or nuance.', severityWeight: 2 },
  { code: 'MIND_READING', label: 'Mind Reading', description: 'Assuming you know what others are thinking without evidence.', severityWeight: 2 },
  { code: 'OVERGENERALIZATION', label: 'Overgeneralization', description: 'Taking one negative event and treating it as a lifelong pattern.', severityWeight: 2 },
  { code: 'LABELING', label: 'Labeling', description: 'Defining yourself or others by one mistake or characteristic.', severityWeight: 2 },
  { code: 'EMOTIONAL_REASONING', label: 'Emotional Reasoning', description: 'Believing your emotions are facts and predicting the future based on how you feel.', severityWeight: 2 },
  { code: 'SHOULD_STATEMENTS', label: 'Should Statements', description: 'Holding rigid rules about how you or others should behave.', severityWeight: 2 }
];

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('🌱 Seeding database...\n');

    // Seed thinking traps
    console.log('  Seeding thinking traps...');
    for (const trap of THINKING_TRAPS) {
      await prisma.thinkingTrap.upsert({
        where: { code: trap.code },
        update: {},
        create: trap
      });
    }
    console.log('  ✓ Seeded 8 thinking traps\n');

    // Seed missions
    console.log('  Seeding 15 missions...');
    let missionCount = 0;

    for (const [key, mission] of Object.entries(MISSIONS)) {
      // Create mission
      const createdMission = await prisma.mission.upsert({
        where: { slug: mission.slug },
        update: {
          title: mission.title,
          narrativeIntro: mission.narrativeIntro,
          sensoryPrompt: mission.sensoryPrompt,
          estimatedMinutes: mission.estimatedMinutes
        },
        create: {
          slug: mission.slug,
          title: mission.title,
          narrativeIntro: mission.narrativeIntro,
          sensoryPrompt: mission.sensoryPrompt,
          estimatedMinutes: mission.estimatedMinutes,
          status: 'PUBLISHED'
        }
      });

      // Create decision options
      for (let i = 0; i < mission.decisions.length; i++) {
        const decision = mission.decisions[i];

        const createdDecision = await prisma.missionDecisionOption.upsert({
          where: {
            missionId_sortOrder: {
              missionId: createdMission.id,
              sortOrder: i
            }
          },
          update: {
            label: decision.label,
            narrativeOutcome: decision.narrativeOutcome
          },
          create: {
            missionId: createdMission.id,
            label: decision.label,
            narrativeOutcome: decision.narrativeOutcome,
            sortOrder: i
          }
        });

        // Link thinking trap
        const trap = await prisma.thinkingTrap.findUnique({
          where: { code: decision.thinkingTrapId }
        });

        if (trap) {
          await prisma.missionChoiceTrap.upsert({
            where: {
              decisionOptionId_thinkingTrapId: {
                decisionOptionId: createdDecision.id,
                thinkingTrapId: trap.id
              }
            },
            update: {},
            create: {
              decisionOptionId: createdDecision.id,
              thinkingTrapId: trap.id
            }
          });
        }
      }

      missionCount++;
    }
    console.log(`  ✓ Seeded ${missionCount} missions\n`);

    console.log('✅ Seed complete!\n');
    console.log('📊 Summary:');
    console.log('   • 8 thinking trap categories');
    console.log('   • 15 published missions');
    console.log('   • 30 decision options (2 per mission)');
    console.log('\n✨ Ready to test! Run:');
    console.log('   npm run dev:web');
    console.log('   npm run dev:mobile\n');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
