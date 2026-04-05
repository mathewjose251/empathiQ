"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTeen, getAvatarStage, AVATAR_EMOJI } from "../../_context/TeenContext";

type Stage = "story" | "choice" | "consequence" | "reflect" | "complete";
type PathChoice = "pathA" | "pathB";

interface Decision {
  label: string;
  description: string;
  consequence: string;
  thinkingTrap: string;
  xpReward: number;
}

interface MissionData {
  slug: string;
  title: string;
  chapterLabel: string;
  theme: string;
  narrative: string;
  sensoryPrompt: string;
  estimatedMinutes: number;
  pathA: Decision;
  pathB: Decision;
}

/* ============================================================
   ALL 15 MISSIONS
   ============================================================ */
const MISSIONS_DATA: Record<string, MissionData> = {

  /* ── 1. SCHOOL ─────────────────────────────────────── */
  "night-before-finals": {
    slug: "night-before-finals",
    title: "The Night Before Finals",
    chapterLabel: "Chapter 1 · School",
    theme: "School",
    narrative: `It's 11 PM and your exam is in 9 hours. You pull up your notes but everything's a blur. The notification pings again — another classmate posting about how "ready" they are. Your stomach tightens. You've studied maybe 2 hours total. Everyone else probably knows everything by now. Your brain feels foggy. Should you stay up cramming, or is it too late anyway? The anxiety is making it hard to think straight.`,
    sensoryPrompt: "Feel the weight in your chest. That anxious, foggy pressure. Your racing thoughts.",
    estimatedMinutes: 5,
    pathA: {
      label: "Power Through",
      description: "Make coffee. Cram until you can't keep your eyes open. You HAVE to learn this stuff.",
      consequence: `You study until 2 AM, exhausted. During the exam, you're foggy and second-guessing everything. You do okay but not great — and you feel wrecked for the rest of the day. The all-night cramming didn't help as much as you hoped.`,
      thinkingTrap: "All-or-Nothing Thinking",
      xpReward: 15,
    },
    pathB: {
      label: "Trust Your Prep",
      description: "Step back. Your brain needs sleep more than 3 more hours of panicked cramming. Set an alarm and go to bed.",
      consequence: `You sleep 7 hours and wake up clear-headed. In the exam, you recall more than you expected. Rested brains outperform exhausted ones. You do better than you feared AND don't feel destroyed after.`,
      thinkingTrap: "Catastrophizing",
      xpReward: 30,
    },
  },

  "grade-on-test": {
    slug: "grade-on-test",
    title: "That Grade on the Test",
    chapterLabel: "Chapter 2 · School",
    theme: "School",
    narrative: `The paper lands on your desk face-down. You flip it over. 58%. Your stomach drops. You studied for this — you genuinely tried. Around you, people are comparing scores. Your friend got 81%. Another got 74%. You feel a wave of embarrassment, then shame, then something darker. What's wrong with you? If you can't do better than this, maybe you're just not cut out for this subject. Maybe you're just not as smart as everyone else.`,
    sensoryPrompt: "Notice that tight knot of shame and comparison. Where do you feel it in your body?",
    estimatedMinutes: 6,
    pathA: {
      label: "Spiral and Hide",
      description: "You stuff the paper in your bag and say nothing. For the next week you avoid the teacher, don't ask questions in class, and tell yourself you're just bad at this.",
      consequence: `The avoidance makes it worse. You fall further behind. The next test is even harder because you didn't ask for help when you needed it. You feel more stuck — and more convinced that you're hopeless at this subject.`,
      thinkingTrap: "Labeling",
      xpReward: 15,
    },
    pathB: {
      label: "Analyse and Ask",
      description: "You look at which questions you got wrong and why. You go to the teacher after class and ask where you went wrong. One bad test is data, not a verdict.",
      consequence: `The teacher shows you exactly where your thinking went wrong. You realise it was a specific concept you'd skipped. Armed with that, you do 30 minutes of targeted revision. The next test goes noticeably better. One grade was never the whole story.`,
      thinkingTrap: "Overgeneralization",
      xpReward: 30,
    },
  },

  "presentation-fear": {
    slug: "presentation-fear",
    title: "Presentation Fear",
    chapterLabel: "Chapter 3 · School",
    theme: "School",
    narrative: `Tomorrow you have to present in front of the whole class. Your name is on the list. You've known for two weeks and somehow it still feels like a surprise ambush. You keep running through worst-case scenarios — voice cracking, going blank, people laughing. You can't eat dinner properly. You keep opening your slides, staring at them, then closing them. Every time you try to rehearse, you freeze. The closer it gets, the more convinced you are that it will be a disaster.`,
    sensoryPrompt: "That tight, restless feeling — the body getting ready to flee from something that hasn't happened yet.",
    estimatedMinutes: 7,
    pathA: {
      label: "Rehearse Until 2 AM",
      description: "You rehearse obsessively, again and again, trying to memorise every word perfectly so nothing can go wrong.",
      consequence: `You arrive exhausted and more anxious. Over-rehearsed scripts actually make you more likely to freeze — one wrong word and the whole thing falls apart in your head. You stumble more than if you'd slept. The performance anxiety got worse, not better.`,
      thinkingTrap: "Fortune Telling",
      xpReward: 15,
    },
    pathB: {
      label: "Prepare, Then Rest",
      description: "You do one solid run-through, make a few bullet point notes, and stop. You tell yourself: 'Nervous is normal. I know this topic. I can handle shaky hands.'",
      consequence: `You're nervous in the morning — that's okay, it's just energy. You get through it, maybe not perfectly, but competently. Afterward, three people say they liked it. You realise you can survive things you were convinced would destroy you.`,
      thinkingTrap: "Catastrophizing",
      xpReward: 30,
    },
  },

  "college-decision": {
    slug: "college-decision",
    title: "College Decision Stress",
    chapterLabel: "Chapter 4 · School",
    theme: "School",
    narrative: `It's application season and everyone has an opinion about your future except you. Your parents want engineering — it's stable, they say. Your friends are applying to the same colleges as each other. Your relative keeps asking about medicine. Meanwhile, you're genuinely interested in design, but you've never said it out loud because you're not sure it's "allowed." The pressure from every direction is creating this fog where you can't even hear your own thoughts. You're supposed to know what you want to do for the rest of your life right now. Today. At 17.`,
    sensoryPrompt: "That feeling of being pulled in four directions at once. Everyone else's voice louder than your own.",
    estimatedMinutes: 8,
    pathA: {
      label: "Just Follow the Plan",
      description: "You apply to the engineering colleges your parents want. It's easier than the conversation. You tell yourself you can figure the rest out later.",
      consequence: `You get in. But two months into the programme, you feel hollow. You're studying something you don't care about to avoid a conversation you should've had. 'Later' arrived, and the choice is still waiting — except now it's harder to change course.`,
      thinkingTrap: "Should Statements",
      xpReward: 15,
    },
    pathB: {
      label: "Have the Real Conversation",
      description: "You sit with your parents and honestly say: 'I want to explore design. Can we talk about what that actually looks like?' Not a fight — a conversation.",
      consequence: `It's uncomfortable. Your parents have concerns. But they also didn't know how serious you were — because you'd never said it out loud. Over a few conversations, you find a path that honours what you want and what they care about. It starts with one honest sentence.`,
      thinkingTrap: "Mind Reading",
      xpReward: 30,
    },
  },

  /* ── 2. PEER ────────────────────────────────────────── */
  "peer-achievement": {
    slug: "peer-achievement",
    title: "When a Friend Wins Big",
    chapterLabel: "Chapter 5 · Peer",
    theme: "Peer",
    narrative: `Your best friend texts: they got the scholarship. The one you both applied for together. The one you also wanted. They're thrilled — celebration emojis, tagging people in the announcement. You feel confused. Happy for them? Sure. But also something else. A pang of disappointment. Jealousy? You scroll through the comments, everyone congratulating them. It feels like they're moving forward and you're stuck.`,
    sensoryPrompt: "Feel that tightness when someone you care about gets something you wanted. The mix of happy-and-hurt.",
    estimatedMinutes: 4,
    pathA: {
      label: "Pull Away",
      description: "You don't respond right away. Your disappointment is too big. You need space — you ignore their messages for a few days.",
      consequence: `Your distance confuses them. They reach out asking if you're mad. Now there's awkwardness. What started as processing grief became a rift in the friendship. You end up feeling isolated AND guilty.`,
      thinkingTrap: "All-or-Nothing Thinking",
      xpReward: 15,
    },
    pathB: {
      label: "Celebrate and Process",
      description: "You reply genuinely: 'That's amazing, I'm proud of you.' Then you sit with your disappointment separately. You're allowed to feel both.",
      consequence: `They appreciate your honesty. They remind you they believe in you. Your friendship deepens. AND your disappointment has space to exist without poisoning the relationship.`,
      thinkingTrap: "Emotional Reasoning",
      xpReward: 30,
    },
  },

  "friend-text-unanswered": {
    slug: "friend-text-unanswered",
    title: "The Text That Was Left on Read",
    chapterLabel: "Chapter 6 · Peer",
    theme: "Peer",
    narrative: `You texted your best friend something you were excited to share. It's been 3 hours. They usually reply in minutes. You see they were active on Instagram 20 minutes ago. Your chest gets tight. Did you say something weird? Are they mad? Your mind spirals. Maybe they're losing interest. Maybe you're boring. Maybe they're realising you're not as cool as they thought. You check your message again. Still unread.`,
    sensoryPrompt: "Feel that spiral of worry. The what-ifs piling up. The fear of rejection.",
    estimatedMinutes: 4,
    pathA: {
      label: "Message Again",
      description: "You send another message. Then another. A meme. Maybe asking directly why they're ignoring you. You need reassurance NOW.",
      consequence: `Your triple texts feel clingy. When they finally reply — just busy with family stuff — they seem slightly put off by the pile-up. You feel embarrassed. The anxiety made you act in a way that actually created distance.`,
      thinkingTrap: "Mind Reading",
      xpReward: 15,
    },
    pathB: {
      label: "Trust the Friendship",
      description: "You recognise you're spiralling. Your friend has never actually bailed on you before. They're probably just busy. You put your phone away.",
      consequence: `They text back an hour later: 'OMG sorry, family dinner!' You have a normal conversation. No awkwardness. You realise your friendship is solid enough to survive a delayed text.`,
      thinkingTrap: "Catastrophizing",
      xpReward: 30,
    },
  },

  "crush-worry": {
    slug: "crush-worry",
    title: "Crush Worry",
    chapterLabel: "Chapter 7 · Peer",
    theme: "Peer",
    narrative: `You like someone. Like, actually like them. And you've been trying to figure out if they feel the same way. Every interaction becomes evidence in a case you're building in your head. They said hi — that's something, right? But then they didn't say hi today. They replied fast yesterday but were slow today. You're going back through old chats looking for clues. You can't sleep. You keep replaying their last message trying to decode it. The uncertainty is eating you alive.`,
    sensoryPrompt: "That restless, buzzing feeling of wanting to know something you can't know yet.",
    estimatedMinutes: 6,
    pathA: {
      label: "Overanalyse Everything",
      description: "You ask three friends to help you decode their messages. You screenshot every interaction. You craft a perfectly calibrated reply designed to get a specific response.",
      consequence: `The more you analyse, the more anxious you become. You start seeing meanings in things that have no meaning. Your friends give conflicting interpretations. Nothing actually moves forward — but your anxiety gets much bigger.`,
      thinkingTrap: "Jumping to Conclusions",
      xpReward: 15,
    },
    pathB: {
      label: "Let It Breathe",
      description: "You acknowledge: 'I don't know how they feel, and that's okay for now.' You focus on genuine connection — being yourself around them — without engineering a specific outcome.",
      consequence: `The anxiety quiets down when you stop treating it like a problem to solve. You show up more naturally, which is actually more attractive. You eventually find out how they feel — but in the meantime, you didn't lose yourself in the waiting.`,
      thinkingTrap: "Fortune Telling",
      xpReward: 30,
    },
  },

  "different-from-peers": {
    slug: "different-from-peers",
    title: "Different From Everyone",
    chapterLabel: "Chapter 8 · Peer",
    theme: "Peer",
    narrative: `You love something your friends don't care about — maybe it's writing, coding, old films, politics, classical music, chess. Whatever it is, it's real to you. But in the group, it's become invisible. When you bring it up, people change the subject. You've started self-editing — just talking about the stuff they care about, going along with things, laughing at things you don't find funny. You're starting to wonder: is there even a version of me that fits here?`,
    sensoryPrompt: "That feeling of shrinking yourself. Leaving the real version of you outside the room.",
    estimatedMinutes: 7,
    pathA: {
      label: "Fit In, Disappear",
      description: "You decide to just go along with things. Don't bring up your interests. Be the version of you that fits. Maybe that's just growing up.",
      consequence: `Six months later, you're there in body but absent in every conversation that matters. You feel more alone with people than without them. Fitting in perfectly doesn't feel like belonging — it feels like performing. And it's exhausting.`,
      thinkingTrap: "Emotional Reasoning",
      xpReward: 15,
    },
    pathB: {
      label: "Own It",
      description: "You bring it up anyway. Maybe it lands weirdly. But you also start looking for spaces — online, in a club, in class — where this part of you isn't strange.",
      consequence: `Not everyone gets it, and that's okay. But you find even one or two people who do. You realise fitting in with everyone isn't the goal — connecting deeply with some people is. The relief of being your actual self is worth the awkwardness.`,
      thinkingTrap: "Labeling",
      xpReward: 30,
    },
  },

  /* ── 3. FAMILY ──────────────────────────────────────── */
  "family-dinner-tension": {
    slug: "family-dinner-tension",
    title: "Family Dinner Tension",
    chapterLabel: "Chapter 9 · Family",
    theme: "Family",
    narrative: `Dinner again. It starts small — someone makes a comment, someone else takes it the wrong way. Then it escalates. Your parents are arguing about money, or about you, or about something from ten years ago that's still somehow not resolved. You're sitting in the middle of it, staring at your food, feeling your jaw clench. This happens every week. It's supposed to be just dinner. You don't know whether to say something, leave the table, or just go silent and disappear into your phone.`,
    sensoryPrompt: "That tightness in your jaw and shoulders. The feeling of being trapped in a room where the air is charged.",
    estimatedMinutes: 6,
    pathA: {
      label: "Blow Up or Shut Down",
      description: "You snap at someone, or you storm off to your room, or you go dead silent and cold. One of the three.",
      consequence: `Your reaction escalates things. The argument spills over to involve you. Or the silence becomes another thing to fight about. The dinner ends badly and the tension follows everyone into the next day. Nothing got resolved.`,
      thinkingTrap: "Magnification",
      xpReward: 15,
    },
    pathB: {
      label: "Quietly Disengage",
      description: "You finish eating without adding fuel. You don't need to fix it or referee it. You say 'I'm going to my room' calmly — not dramatically — and go.",
      consequence: `You remove yourself from a situation you can't control. Later, when things have cooled down, you talk to one parent about how these dinners affect you. That conversation goes better than you expected — because the timing was right.`,
      thinkingTrap: "Should Statements",
      xpReward: 30,
    },
  },

  "sibling-boundary-crossed": {
    slug: "sibling-boundary-crossed",
    title: "Sibling Drama",
    chapterLabel: "Chapter 10 · Family",
    theme: "Family",
    narrative: `Your sibling went through your stuff. Read your journal, your messages, your notebook — something that was private and yours. You find out because they mentioned something only they could know if they'd been snooping. You feel violated. It's not just anger — it's betrayal. This person lives in your house, shares your family, and they still crossed that line. They might not even think they did anything wrong. Which makes it worse.`,
    sensoryPrompt: "That hot, tight feeling of having your private world exposed by someone you should be able to trust.",
    estimatedMinutes: 6,
    pathA: {
      label: "Explode and Escalate",
      description: "You confront them loudly. It turns into a screaming match. You go to your parents, who take sides. The whole house gets involved.",
      consequence: `The fight burns hot but resolves nothing. Your sibling gets defensive rather than remorseful. Your parents are stressed. Two weeks later the boundary still hasn't been named, and there's now a layer of bad feeling on top of it.`,
      thinkingTrap: "All-or-Nothing Thinking",
      xpReward: 15,
    },
    pathB: {
      label: "Name the Boundary",
      description: "You wait until you're calmer. Then you say, clearly: 'You went through my private things. That's not okay. I need you to not do that again.' No screaming — just clarity.",
      consequence: `It's awkward. They push back a little. But you hold your ground calmly. Something shifts. Setting a clear boundary actually works better than a blow-up — because now they know exactly where the line is.`,
      thinkingTrap: "Overgeneralization",
      xpReward: 30,
    },
  },

  /* ── 4. SELF ────────────────────────────────────────── */
  "mirror-moment": {
    slug: "mirror-moment",
    title: "Mirror Moment",
    chapterLabel: "Chapter 11 · Self",
    theme: "Self",
    narrative: `You catch your reflection in the bathroom mirror and immediately start picking. Your hair looks weird. Your skin looks blotchy. You feel bloated in this shirt. You scroll through Instagram and everyone looks so effortless. The voice in your head gets louder: "You look rough today. Why even bother?" You feel that familiar heaviness. It's hard to ignore the voice telling you that you're just... not enough.`,
    sensoryPrompt: "Notice the harsh voice in your head. That critical tone you'd never use on a friend.",
    estimatedMinutes: 4,
    pathA: {
      label: "Judge Harder",
      description: "You lean into the criticism. Change your outfit. Redo your hair. Maybe if you look perfect, the voice will quiet down.",
      consequence: `You spiral deeper. Even when you 'fix' things, the voice finds something new to attack. You arrive at school feeling worse than when you started. The voice got louder, not quieter.`,
      thinkingTrap: "Personalization",
      xpReward: 15,
    },
    pathB: {
      label: "Name the Voice",
      description: "You pause. You recognise this — it's the inner critic, not the truth. You get ready how you normally do, and move on.",
      consequence: `By acknowledging the voice instead of fighting it, it loses power. You realise what you're wearing doesn't change your worth. You get to school feeling lighter. Not perfect — but real, and that's enough.`,
      thinkingTrap: "Negative Self-Talk",
      xpReward: 30,
    },
  },

  "mistake-at-work": {
    slug: "mistake-at-work",
    title: "Mistake at Work",
    chapterLabel: "Chapter 12 · Self",
    theme: "Self",
    narrative: `You have a part-time job — a café, a shop, anywhere. Today you messed up. You gave the wrong order to the wrong table. Or you miscounted change. Or you forgot to do something you were specifically told to do. Your manager looked at you in that way. Customers were annoyed. Colleagues had to cover for you. It wasn't catastrophic, but it felt catastrophic. Now you're home, replaying it on loop. Your brain won't let it go. Maybe you're just terrible at this. Maybe they'll let you go.`,
    sensoryPrompt: "That replay loop — the scene playing again and again. The cringe that won't stop.",
    estimatedMinutes: 6,
    pathA: {
      label: "Catastrophise and Quit",
      description: "You decide this is proof you're bad at working, bad at adulting, bad at everything. You consider texting in sick tomorrow — maybe just not going back.",
      consequence: `You avoid it until avoiding becomes impossible. When you do go back, nothing has actually changed — except that you've spent three days in shame when one apology the next day would have closed it. Avoidance made a small thing feel permanent.`,
      thinkingTrap: "Magnification",
      xpReward: 15,
    },
    pathB: {
      label: "Own It and Move On",
      description: "Next shift, you acknowledge it briefly: 'I got that wrong yesterday — won't happen again.' You do your job well that day. That's it.",
      consequence: `Your manager nods and moves on. Everyone makes mistakes — what people remember is how you handle them. You realise one mistake doesn't define your competence. You feel steadier, more professional, and more confident.`,
      thinkingTrap: "Overgeneralization",
      xpReward: 30,
    },
  },

  /* ── 5. DIGITAL ─────────────────────────────────────── */
  "social-media-comparison": {
    slug: "social-media-comparison",
    title: "The Scroll That Stings",
    chapterLabel: "Chapter 13 · Digital",
    theme: "Digital",
    narrative: `You're scrolling through social media on a lazy afternoon. Everyone looks like they're having the best time. Beach trips, parties, new clothes, glowing skin, perfect selfies. Meanwhile you're sitting on your couch in old sweats with your family yelling in the background. Your stomach twists. Why does everyone else look like that? Why is your life so ordinary? You keep scrolling, feeling worse with every swipe.`,
    sensoryPrompt: "That feeling of being left out. Of not being enough. Envy mixed with self-doubt.",
    estimatedMinutes: 4,
    pathA: {
      label: "Keep Scrolling",
      description: "You keep looking. Unfollow people who look 'too perfect.' Post a selfie yourself, then delete it. You're trapped in the scroll.",
      consequence: `Two hours later you feel worse. The comparison became a spiral. You feel more insecure than when you started. Social media made your day actively worse.`,
      thinkingTrap: "Compare and Despair",
      xpReward: 15,
    },
    pathB: {
      label: "Remember the Truth",
      description: "You pause and remember: you're seeing highlights and filters, not reality. You close the app and do something that makes YOU happy — not for a photo.",
      consequence: `You remember that real life is messy and boring sometimes, and that's normal. When you check social media later, it doesn't sting as much — because you know it's not the whole story.`,
      thinkingTrap: "Emotional Reasoning",
      xpReward: 30,
    },
  },

  "caffeine-before-bed": {
    slug: "caffeine-before-bed",
    title: "Wired Before Bed",
    chapterLabel: "Chapter 14 · Digital",
    theme: "Digital",
    narrative: `Coffee at 4pm seemed like a good idea at the time — you had studying to do. Now it's midnight. You're wide awake, your thoughts are racing, and you have school in 7 hours. The harder you try to sleep, the more awake you feel. You keep thinking about all the things you didn't finish today, everything you need to do tomorrow, that embarrassing thing you said in class two weeks ago. Your body is exhausted but your brain refuses to cooperate.`,
    sensoryPrompt: "That buzzy, wired-but-tired feeling. Your body begging for rest while your mind sprints.",
    estimatedMinutes: 6,
    pathA: {
      label: "Doom Scroll to Distract",
      description: "You pick up your phone. YouTube, Instagram, TikTok. If you can't sleep, at least you can watch something until you pass out.",
      consequence: `The blue light keeps your brain even more awake. You eventually fall asleep at 2 AM with your phone on your face. 7 hours becomes 5. You wake up groggy and more anxious than before. The scroll made it significantly worse.`,
      thinkingTrap: "Mental Filter",
      xpReward: 15,
    },
    pathB: {
      label: "Work With Your Body",
      description: "Phone face-down. You try box breathing — 4 counts in, hold 4, out 4, hold 4. You tell yourself: 'Even lying still rests my body.' You stop fighting the wakefulness.",
      consequence: `You don't fall asleep immediately. But the anxiety about not sleeping drops. Your body relaxes. You drift off around 12:30 — not perfect, but far better than 2 AM. Accepting what is, instead of fighting it, actually helps.`,
      thinkingTrap: "Catastrophizing",
      xpReward: 30,
    },
  },

  "phone-late-night": {
    slug: "phone-late-night",
    title: "Phone Doom Scroll",
    chapterLabel: "Chapter 15 · Digital",
    theme: "Digital",
    narrative: `It's 2 AM and you're still on your phone. You know you should stop. You've told yourself "5 more minutes" about nine times now. The algorithm knows exactly what to show you next — and you keep watching. It's not even that good. You're not even enjoying it anymore. You're just... unable to stop. There's a vague sense of something being wasted — your time, your sleep, your morning. But the next video starts automatically and your thumb doesn't move to close it.`,
    sensoryPrompt: "That hollow, slightly guilty feeling of watching time disappear while you watch.",
    estimatedMinutes: 5,
    pathA: {
      label: "Just 5 More Minutes",
      description: "You keep going. You'll definitely stop after this video. Then the next one. It's fine.",
      consequence: `You look up and it's 3:15 AM. You have 5 hours until you need to get up. You feel genuinely bad now — not just tired but almost sad. Tomorrow is going to be rough, and the content wasn't even worth it.`,
      thinkingTrap: "Minimization",
      xpReward: 15,
    },
    pathB: {
      label: "Put It Across the Room",
      description: "You physically put your phone on the other side of the room — not just face-down, across the room. Then you do 2 minutes of slow breathing.",
      consequence: `The first few minutes are uncomfortable. You reach for the phone out of habit and it's not there. Then something settles. You fall asleep within 20 minutes. You wake up having actually slept — and that makes everything the next day easier.`,
      thinkingTrap: "Minimization",
      xpReward: 30,
    },
  },
};

/* ============================================================
   THINKING TRAP EXPLANATIONS (expanded — all 15 missions covered)
   ============================================================ */
const THINKING_TRAP_EXPLANATIONS: Record<string, string> = {
  "All-or-Nothing Thinking":
    "Seeing things in black-and-white, with no middle ground. If it isn't perfect, you see it as a total failure.",
  "Catastrophizing":
    "Assuming the worst possible outcome will definitely happen, and treating that fear like fact before anything has even occurred.",
  "Personalization":
    "Taking things personally that aren't really about you, or blaming yourself for things that are outside your control.",
  "Negative Self-Talk":
    "That harsh inner voice that picks you apart — treating its criticism like fact instead of just a feeling passing through.",
  "Mind Reading":
    "Assuming you know what someone else is thinking — usually assuming the worst — without any actual evidence.",
  "Emotional Reasoning":
    "Believing that because you feel something strongly, it must be true. 'I feel ugly, therefore I am ugly.' Feelings aren't always facts.",
  "Compare and Despair":
    "Measuring your own worth against other people's highlight reels — forgetting you're seeing their best moments, not their reality.",
  "Labeling":
    "Turning a specific mistake into a sweeping identity statement. 'I failed a test' becomes 'I am stupid.' One event, taken as the whole truth.",
  "Overgeneralization":
    "Taking one bad experience and drawing a broad conclusion that covers everything. 'This went wrong once, so it always will.'",
  "Fortune Telling":
    "Predicting that things will go badly — and treating that prediction like a certainty, before you have any evidence either way.",
  "Should Statements":
    "Rigid rules about how you or others should behave, that create pressure and guilt when reality doesn't match the rule.",
  "Jumping to Conclusions":
    "Reaching a negative conclusion without enough evidence — skipping the part where you actually check if it's true.",
  "Magnification":
    "Blowing up mistakes, problems, or imperfections so they feel far bigger and more significant than they really are.",
  "Mental Filter":
    "Focusing exclusively on one negative detail while ignoring everything else — like a single drop of ink that clouds an entire glass of water.",
  "Minimization":
    "Downplaying the importance of your choices or their consequences — telling yourself 'it's fine' when part of you already knows it isn't.",
};

/* ============================================================
   HELPERS
   ============================================================ */
function splitNarrative(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const third = Math.ceil(sentences.length / 3);
  return [
    sentences.slice(0, third).join(" ").trim(),
    sentences.slice(third, third * 2).join(" ").trim(),
    sentences.slice(third * 2).join(" ").trim(),
  ].filter(Boolean);
}

const STAGE_ORDER: Stage[] = ["story", "choice", "consequence", "reflect"];

/* ============================================================
   COMPONENT
   ============================================================ */
export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const teen = useTeen();

  const slug = params.slug as string;
  const mission = MISSIONS_DATA[slug];

  const [stage, setStage] = useState<Stage>("story");
  const [chosenPath, setChosenPath] = useState<PathChoice | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [revealedChunks, setRevealedChunks] = useState(1);
  const [choiceShake, setChoiceShake] = useState(false);
  const [trapVisible, setTrapVisible] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const narrativeChunks = mission ? splitNarrative(mission.narrative) : [];

  // Shake choice cards 2.5s after the choice stage appears
  useEffect(() => {
    if (stage === "choice") {
      setChoiceShake(false);
      frameRef.current = setTimeout(() => setChoiceShake(true), 2500);
      return () => { if (frameRef.current) clearTimeout(frameRef.current); };
    }
  }, [stage]);

  // Pop-reveal thinking trap 600ms after consequence appears
  useEffect(() => {
    if (stage === "consequence") {
      setTrapVisible(false);
      frameRef.current = setTimeout(() => setTrapVisible(true), 600);
      return () => { if (frameRef.current) clearTimeout(frameRef.current); };
    }
  }, [stage]);

  const handleRevealMore = useCallback(() => {
    if (revealedChunks < narrativeChunks.length) {
      setRevealedChunks((n) => n + 1);
    } else {
      setStage("choice");
    }
  }, [revealedChunks, narrativeChunks.length]);

  const handleChoosePath = (path: PathChoice) => {
    setChosenPath(path);
    setStage("consequence");
  };

  const handleComplete = (withReflection: boolean) => {
    if (!chosenPath || !mission) return;
    const xp = chosenPath === "pathA" ? mission.pathA.xpReward : mission.pathB.xpReward;
    const total = xp + (withReflection ? 15 : 0);
    setEarnedXP(total);
    teen.completeStory(chosenPath === "pathA");
    teen.addXP(total, "story");
    if (withReflection) teen.incrementStreak();
    setShowComplete(true);
  };

  if (!mission) {
    return (
      <div className="teen-page teen-text-center" style={{ paddingTop: 64 }}>
        <p style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</p>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>Story not found</p>
        <p className="teen-text-muted teen-text-small" style={{ marginBottom: 24 }}>
          This mission hasn&apos;t launched yet — check back soon!
        </p>
        <button className="teen-btn teen-btn-accent" onClick={() => router.push("/teen/stories")}>
          Browse All Stories
        </button>
      </div>
    );
  }

  const decision = chosenPath ? (chosenPath === "pathA" ? mission.pathA : mission.pathB) : mission.pathA;
  const avatarEmoji = AVATAR_EMOJI[getAvatarStage(teen.totalXP)];
  const stageIndex = STAGE_ORDER.indexOf(stage === "complete" ? "reflect" : stage);

  return (
    <>
      {/* ── COMPLETION OVERLAY ── */}
      {showComplete && (
        <div className="mission-complete-overlay">
          <div className="mission-complete-avatar">{avatarEmoji}</div>
          <div className="mission-complete-xp">+{earnedXP} XP</div>
          <div className="mission-complete-label">
            {chosenPath === "pathB" ? "Healthy choice 🌿" : "You learned something real 💡"}
          </div>
          <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 6 }}>Mission Complete</p>
          <p className="teen-text-muted teen-text-small" style={{ marginBottom: 32, lineHeight: 1.6 }}>
            Your reflection has been added to the pack.
          </p>
          <button
            className="teen-btn teen-btn-accent"
            onClick={() => router.push("/teen/pack")}
            style={{ marginBottom: 10 }}
          >
            See Your Pack 🏕️
          </button>
          <button className="teen-btn teen-btn-outline" onClick={() => router.push("/teen")}>
            Back to Home
          </button>
        </div>
      )}

      <div className="teen-page page-enter">

        {/* ── PROGRESS HEADER ── */}
        <div className="mission-stage-header">
          <button className="mission-back-btn" onClick={() => router.back()}>← Back</button>
          <div className="story-dots">
            {STAGE_ORDER.map((s, i) => (
              <div
                key={s}
                className={`story-dot${i === stageIndex ? " active" : i < stageIndex ? " done" : ""}`}
              />
            ))}
          </div>
          <div style={{ width: 60, textAlign: "right", fontSize: "0.7rem", color: "var(--teen-muted)" }}>
            ⏱ {mission.estimatedMinutes}m
          </div>
        </div>

        {/* ── STORY STAGE ── */}
        {stage === "story" && (
          <div className="teen-fade-in">
            <div style={{ marginBottom: 16 }}>
              <p className="teen-text-muted teen-text-small">{mission.theme}</p>
              <p className="story-theme">{mission.chapterLabel}</p>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.3px" }}>
                {mission.title}
              </h1>
            </div>

            <div className="teen-card teen-card-glow-cyan">
              {narrativeChunks.slice(0, revealedChunks).map((chunk, i) => (
                <p
                  key={i}
                  className="text-chunk"
                  style={{
                    lineHeight: 1.8,
                    fontSize: "0.95rem",
                    color: "var(--teen-text)",
                    marginBottom: i < revealedChunks - 1 ? 12 : 0,
                  }}
                >
                  {chunk}
                </p>
              ))}
            </div>

            {revealedChunks >= narrativeChunks.length && (
              <div className="sensory-box teen-fade-in">
                <p style={{ fontWeight: 500, marginBottom: 6 }}>💫 Pause for a moment:</p>
                <p>{mission.sensoryPrompt}</p>
              </div>
            )}

            {revealedChunks < narrativeChunks.length ? (
              <>
                <button className="teen-btn teen-btn-accent teen-mt-16" onClick={handleRevealMore}>
                  Keep Reading →
                </button>
                <div className="tap-hint"><span>tap to continue</span><span>↓</span></div>
              </>
            ) : (
              <button className="teen-btn teen-btn-accent teen-mt-16" onClick={() => setStage("choice")}>
                I&apos;m Ready to Choose
              </button>
            )}
          </div>
        )}

        {/* ── CHOICE STAGE ── */}
        {stage === "choice" && (
          <div className="teen-fade-in">
            <div style={{ marginBottom: 16 }}>
              <p className="teen-text-muted teen-text-small">What would you do?</p>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: 8 }}>Choose Your Path</h2>
            </div>

            {(["pathA", "pathB"] as PathChoice[]).map((path) => {
              const d = path === "pathA" ? mission.pathA : mission.pathB;
              const isA = path === "pathA";
              return (
                <button
                  key={path}
                  className={`choice-card ${isA ? "choice-card-green" : "choice-card-rose"}${choiceShake ? " choice-card-attention" : ""}`}
                  onClick={() => handleChoosePath(path)}
                  onAnimationEnd={() => setChoiceShake(false)}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>{isA ? "🌿" : "🌳"}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 6 }}>{d.label}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--teen-muted)", marginBottom: 10, lineHeight: 1.5 }}>
                    {d.description}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: isA ? "var(--teen-green)" : "var(--teen-rose)", fontWeight: 600 }}>
                    +{d.xpReward} XP
                  </div>
                </button>
              );
            })}

            <div
              className="teen-text-center teen-text-small"
              style={{ color: "var(--teen-muted)", marginTop: 16, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}
            >
              ❤️ Both paths teach you something. No wrong choice.
            </div>
          </div>
        )}

        {/* ── CONSEQUENCE STAGE ── */}
        {stage === "consequence" && chosenPath && (
          <div className="teen-fade-in">
            <div style={{ marginBottom: 16 }}>
              <p className="teen-text-muted teen-text-small">{decision.label}</p>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: 8 }}>Here&apos;s What Happens</h2>
            </div>

            <div className="teen-card teen-card-glow-cyan">
              <p style={{ lineHeight: 1.8, fontSize: "0.95rem" }}>{decision.consequence}</p>
            </div>

            {trapVisible && (
              <div className="teen-card teen-card-glow-purple trap-reveal" style={{ marginTop: 16 }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--teen-purple)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  🚨 Thinking Trap Spotted
                </div>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 8, color: "var(--teen-text)" }}>
                  {decision.thinkingTrap}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--teen-muted)", lineHeight: 1.6 }}>
                  {THINKING_TRAP_EXPLANATIONS[decision.thinkingTrap] ||
                    "This is a thinking pattern worth noticing. Once you can see it, you can start to catch it in real life."}
                </p>
              </div>
            )}

            <button
              className="teen-btn teen-btn-purple teen-mt-16"
              onClick={() => setStage("reflect")}
              style={{ opacity: trapVisible ? 1 : 0.35, transition: "opacity 0.4s" }}
            >
              Continue to Reflection
            </button>
          </div>
        )}

        {/* ── REFLECT STAGE ── */}
        {stage === "reflect" && chosenPath && (
          <div className="teen-fade-in">
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>What Did You Learn?</h2>
              <p className="teen-text-muted teen-text-small" style={{ marginTop: 6 }}>
                Anonymous in the pack — only you know this is yours
              </p>
            </div>

            <div className="teen-card" style={{ background: "rgba(139,92,246,0.05)", borderColor: "var(--teen-purple)", marginBottom: 16 }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>{decision.thinkingTrap}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--teen-muted)" }}>
                {THINKING_TRAP_EXPLANATIONS[decision.thinkingTrap]?.slice(0, 80)}...
              </p>
            </div>

            <textarea
              className="teen-textarea"
              placeholder="How does this thinking trap show up in your life? What would you do differently?"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <span className="xp-badge">
                {avatarEmoji} +{chosenPath === "pathA" ? mission.pathA.xpReward : mission.pathB.xpReward} XP
              </span>
              {reflectionText.length >= 8 && (
                <span className="xp-badge" style={{ background: "rgba(139,92,246,0.15)", borderColor: "var(--teen-purple)", color: "var(--teen-purple)" }}>
                  ✍️ +15 XP bonus
                </span>
              )}
            </div>

            <button
              className="teen-btn teen-btn-purple"
              onClick={() => handleComplete(reflectionText.length >= 8)}
              disabled={reflectionText.length < 8}
              style={{ marginTop: 12, opacity: reflectionText.length < 8 ? 0.45 : 1 }}
            >
              Share with My Pack 🏕️
            </button>

            {reflectionText.length < 8 && (
              <p className="teen-text-center teen-text-small teen-text-muted" style={{ marginTop: 8 }}>
                Write at least a sentence to share
              </p>
            )}

            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={() => handleComplete(false)}
                style={{ background: "none", border: "none", color: "var(--teen-muted)", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}
              >
                Skip reflection (earn less XP)
              </button>
            </div>

            {teen.currentStreak > 0 && (
              <div className="teen-text-center" style={{ marginTop: 16 }}>
                <span className="streak-badge">
                  <span className="streak-fire">🔥</span> {teen.currentStreak} day streak
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
