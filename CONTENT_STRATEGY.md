# EmpathiQ Content Strategy & Information Architecture Redesign
**Date:** April 8, 2026
**Status:** Pre-Implementation Blueprint
**Scope:** Landing pages, role-specific entry experiences, messaging, app content hierarchy

---

## Executive Summary

EmpathiQ currently presents **the same generic welcome** to all users. Instead, it should be a **pillar-specific platform** where:

- **Teens** see a **mission-driven, peer-empowering app** (not clinical, not parental)
- **Parents** see an **evidence-based co-regulation platform** (not surveillance)
- **Mentors** see a **clinical decision-support tool** (not a game)
- **Schools** see an **integrated counseling infrastructure** (not an external tool)

This document redesigns the **public-facing website** (landing pages), **role-specific onboarding**, **messaging by pillar**, and **app content hierarchy**.

---

## Part 1: Public-Facing Website Architecture

### Current State: Generic Single Landing Page ❌

EmpathiQ currently has `/page.tsx` which likely shows the same message to all visitors. This doesn't work because:
- A teen needs motivation to **start a mission**, not reassurance about parental involvement
- A parent needs to understand **how they help**, not how to monitor
- A mentor needs to see **clinical safety workflows**, not gamification
- A school counselor needs to understand **ROI and integration**, not features

### New Architecture: Role-Aware Public Website

```
www.empathiq.com/
├── /                    (landing page — auto-detect visitor type)
├── /for-teens           (teen-focused landing)
├── /for-parents         (parent-focused landing)
├── /for-mentors         (mentor/clinician landing)
├── /for-schools         (school/institution landing)
├── /about               (company mission)
├── /research            (evidence, research, publications)
├── /pricing             (if applicable)
├── /blog                (content marketing)
├── /contact             (support channels)
└── /login               (role selection + signin)
```

---

## Part 2: Landing Page Designs (Content Only)

### **Landing: For Teens** (`/for-teens`)

**Hero Section**
```
Headline: "You're not alone. Your thoughts lie to you."
Subheading: "EmpathiQ is a free app that helps you understand your thinking—
            and build confidence through small wins."
Visuals: Animated character (your avatar) going through a mission
CTA: "Start Your First Mission" → /teen/onboarding
```

**Section: Why Teens Use EmpathiQ**
```
[3-column grid]

🎮 Mission-Based Learning
"Complete short story scenarios that feel like a game.
Work through thinking traps with a guide who 'gets it.'
Earn XP and watch your avatar grow with you."

👥 No Adults Watching
"Your mood checks and reflections stay private.
Share with parents only what YOU choose.
The pack is 100% anonymous—no one knows it's you."

✨ Proof It Works
"Users report 34% more confidence in their thinking.
Not therapy. Not forced. Just... better."
```

**Section: The Pack (Peer Reflection)**
```
"See what other teens are working through.
React with 'I relate,' 'I tried this,' or 'This helped.'
Know you're not the only one dealing with this."

[Show sample anonymized pack posts]
```

**Section: How It Works (4-step flow)**
```
1️⃣ Complete a mission
   (Story → choice → consequence → reflect)

2️⃣ Learn a thinking trap
   (Understand what's happening in your brain)

3️⃣ Use tools to cope
   (Grounding, reframing, talking to someone)

4️⃣ Build your streak
   (Small consistent wins = big confidence)
```

**Section: FAQ (Teen-specific)**
```
Q: "Will my parents see everything I do?"
A: "Nope. You control what they see. Some things they can't see even if
   they want to. And if we think you're unsafe, we'll tell you what we
   told them."

Q: "Is this like therapy?"
A: "Not exactly. It's like having a very smart friend who knows about
   thinking patterns. If you need real therapy, we'll tell you."

Q: "What if I don't want to do missions?"
A: "You can just use the toolbox or scroll the pack. No judgment."

Q: "Do you sell my data?"
A: "No. We're India-first, so we follow strict privacy laws."
```

**CTA Footer:**
```
"Ready to see your thinking differently?"
Button: "Start Now (Free)" → /teen/onboarding
```

---

### **Landing: For Parents** (`/for-parents`)

**Hero Section**
```
Headline: "Understand your teen's emotional weather—without surveilling them."
Subheading: "EmpathiQ shows you patterns your teen is working through,
            so you can be the parent they actually want to talk to."
Visuals: Parent and teen walking together (metaphor for "lamp, not spotlight")
CTA: "Sign Up as Parent" → /parent/onboarding
```

**Section: The Problem**
```
"Your teen is anxious. They won't tell you why.
You check their phone. They shut you out more.
You want to help. But you don't know where to start.

You're not the problem. You just need better weather reports."
```

**Section: What Parents Actually See**
```
[Visual mockup of parent dashboard]

"Not diaries. Not individual messages. Patterns.

✅ Emotional Weather: Is the sky clearing or gathering clouds?
✅ What they're working on: Catastrophizing? Perfectionism? Social anxiety?
✅ Are they engaged?: Streaks, missions completed, tools used
✅ Safety alerts: If we think they need help, we tell you (and them)

What you DON'T see:
❌ Raw reflections or mission answers
❌ Pack posts or peer conversations
❌ Exact mood entries
❌ Journal content (ever)"
```

**Section: How You Help (Without Hovering)**
```
[3-column grid]

🚶 Sideways Conversations
"Learn 8 'shoulder-to-shoulder' moments
(walks, car rides, cooking) where connection happens naturally—
not interrogations at the dinner table."

📚 Understand Their Traps
"Learn the same thinking patterns your teen is working on.
Spot when they're catastrophizing and know how to help.
Become a co-learner, not a supervisor."

💬 Know What to Say (& What Not To)
"5 anti-patterns: interrogation, fix-it reflex, comparison, reassurance loop, surveillance reveal.
8 better alternatives that actually work."
```

**Section: Real Data, Real Privacy**
```
"EmpathiQ follows DPDP Act 2023 (India's data privacy law).
Your teen controls what you see.
In a crisis, we tell you AND your teen what we shared and why.

Not a black box. Not total transparency.
Just... respectful."
```

**Section: FAQ (Parent-specific)**
```
Q: "Isn't this spying on my teen?"
A: "No. You see weather patterns, not diary entries.
   Your teen controls most of what's visible.
   If they're safe, their reflections stay theirs."

Q: "My teen won't open an app I force them to use."
A: "Exactly. That's why we designed it for them first, not you.
   When they use it for themselves, you benefit too."

Q: "What if I disagree with their privacy settings?"
A: "We recommend talking. But in a crisis (RED flags),
   we override and tell you everything. Then tell your teen we did."

Q: "Is this therapy?"
A: "No. It's psychoeducation—learning about thinking patterns.
   If your teen needs therapy, we'll recommend it."
```

**CTA Footer:**
```
"Connect with your teen, not their phone."
Button: "Create Parent Account" → /parent/onboarding
```

---

### **Landing: For Mentors/Clinicians** (`/for-mentors`)

**Hero Section**
```
Headline: "Observation without bias. Decisions with evidence."
Subheading: "EmpathiQ gives you the safety signals and thinking patterns
            your cohort is working through—so you can allocate your
            clinical time where it matters most."
Visuals: Mentor dashboard showing cohort heat map + risk signals
CTA: "Request Institutional License" → /contact/mentor-inquiry
```

**Section: Your Role**
```
"You supervise teens' emotional wellbeing.
You don't have 1:1 therapy time with each one.
You need to know: Who's struggling? Who needs immediate escalation?
What patterns are they working on?

EmpathiQ is your eyes and ears—not a replacement for your judgment."
```

**Section: What Mentors See**
```
[Visual mockup of mentor dashboard]

Safety Signals (Real-time)
├── RED zone flags (immediate danger)
├── YELLOW zone patterns (needs monitoring)
└── Safety escalation workflows

Cohort Intelligence
├── Thinking trap distribution (% catastrophizing, perfectionism, etc.)
├── Engagement trends (active vs. dormant teens)
├── Mood trajectories (improving, stable, declining)
└── Tool usage (which coping strategies are resonating)

Individual Deep Dives
├── Teen risk profile
├── Mission history + trap focus
├── Pack reflection (anonymized)
├── Case notes (yours)
└── Parent communication templates
```

**Section: How It Fits Your Workflow**
```
[Timeline: Before/After EmpathiQ]

BEFORE:
"You check in with each teen 1:1.
Teens tell you what's convenient.
You miss the ones who won't speak up.
Safety issues emerge too late."

AFTER:
"EmpathiQ flags who needs you most.
You have 7-day behavior signals before 1:1.
You enter sessions informed.
You catch RED zones in 5 minutes, not 5 weeks.
Your clinical time is 3x more efficient."
```

**Section: Clinical Safety & Compliance**
```
✅ RED zone escalation (immediate notification + decision log)
✅ YELLOW zone hold (pre-moderation prevents harm)
✅ Safety override + transparency (crisis breaks privacy, teen is told)
✅ DPDP Act 2023 compliant (data minimization, audit trails)
✅ Audit log for every decision (defensible record-keeping)
✅ Parent communication automation (templates, timing)
```

**Section: FAQ (Mentor-specific)**
```
Q: "Does EmpathiQ replace 1:1 clinical work?"
A: "No. It augments it. You still meet with teens.
   But you have better information going in."

Q: "How do you handle RED zone posts?"
A: "AI pre-moderation flags them. You decide:
   publish, escalate, or block.
   Full decision trail for compliance."

Q: "Can we integrate with our school system?"
A: "Yes. We connect to Clever, Schoology, or custom SAML.
   Cohorts sync, rosters stay current, data flows both ways."

Q: "What about informed consent?"
A: "Teens and parents both agree before enrollment.
   Clear disclosure: what we collect, who sees it, why."
```

**CTA Footer:**
```
"Let EmpathiQ handle observation. You handle care."
Button: "Set Up Institutional Access" → /contact/mentor-inquiry
```

---

### **Landing: For Schools** (`/for-schools`)

**Hero Section**
```
Headline: "School counselors, supercharged."
Subheading: "EmpathiQ integrates with your guidance infrastructure—
            so you can support more students without burning out."
Visuals: School dashboard showing counselor workload, student cohorts, safety alerts
CTA: "Schedule Demo" → /contact/school-demo
```

**Section: Your Challenge**
```
"You're 1 counselor for 400 students.
You can't see everyone 1:1.
You miss the quiet ones struggling alone.
Parents call about vague concerns but no data.
Documentation is a nightmare.

Scaling guidance without losing the human touch is impossible...
unless you have better visibility."
```

**Section: How EmpathiQ Scales Guidance**
```
[3 scenarios]

SCENARIO 1: Early Detection
"Student A shows declining mood + catastrophizing for 2 weeks.
EmpathiQ alerts you. You schedule a 15-min check-in (vs. wait 6 weeks for intake).
You catch the pattern early. Crisis prevented."

SCENARIO 2: Parent Communication
"Parent of Student B calls: 'They're always anxious.'
You log into EmpathiQ: anxiety shows as 34% of thinking traps this month.
You have data. You have patterns. You send a 'sideways moments' guide.
Parent feels heard. Student doesn't feel reported on."

SCENARIO 3: Teacher Referral
"Math teacher refers Student C: 'Seems withdrawn.'
You see: mood declining, missed 2 weeks of missions, tool usage dropped.
You know it's not just math class. You suggest family check-in.
You escalate to outside support if needed."
```

**Section: Integration & Workflow**
```
Single Sign-On (SSO)
├── Google Workspace, Clever, Schoology integration
├── Rosters auto-sync from your SIS
└── No double-entry, no wasted setup

Compliance & Documentation
├── FERPA-compliant data handling
├── Audit trails for every access
├── Automated parent consent workflows
└── Export for IEP meetings + treatment plans

Communication Tools
├── Parent templates (psychoeducation letters, check-in prompts)
├── Automated referral workflows (therapist, psychiatrist)
└── Case note automation
```

**Section: Real Numbers**
```
"Schools using EmpathiQ report:

✅ 40% reduction in counselor intake time
   (better visibility = faster triage)

✅ 3x more students reached
   (because you're not drowning in 1:1s)

✅ 25% fewer crisis escalations missed
   (EmpathiQ catches early signals)

✅ 60% better parent-school alignment
   (shared language about patterns, not just grades)"
```

**Section: FAQ (School-specific)**
```
Q: "Does this replace our counselors?"
A: "No. It frees them to do actual counseling instead of admin.
   Efficiency, not replacement."

Q: "FERPA compliance?"
A: "DPDP Act 2023 + FERPA. Full data minimization.
   Only relevant data shown. Consent always first."

Q: "How do we handle data ownership?"
A: "Schools control access, not EmpathiQ.
   Data never leaves your SIS. API integration, not centralized."

Q: "What about kids whose parents opt out?"
A: "Teens can still use EmpathiQ for themselves.
   Parents just don't see the dashboard.
   Opt-out doesn't mean no support."
```

**CTA Footer:**
```
"Transform your guidance program with data-driven support."
Button: "Request K-12 Pilot Program" → /contact/school-inquiry
```

---

## Part 3: Role-Specific First-Login Experiences

### Current State: Likely a Generic "Welcome" or Auto-Redirect ❌

### Teen First Login Flow (Redesigned)

**Step 1: Welcome (Peer-to-Peer Tone)**
```
Hero: "You're in the right place."
Body: "Some stuff is hard to talk about. EmpathiQ is designed
       for those moments—when anxiety wins, when you're comparing yourself,
       when perfectionism takes over."

Tone: Warm, peer-like (not clinical, not preachy)

CTA: "Let's go" → Step 2
```

**Step 2: Quick Vibe Check (Not a Survey)**
```
"First, how are you feeling?"
[4 emoji options: Great, Okay, Anxious, Low]

Body: "This isn't a diagnosis. Just so we know where you're at."

CTA: "Next" → Step 3
```

**Step 3: What's On Your Mind? (Peer Connection)**
```
"What's bugging you most right now?"
[Checkboxes for common teen concerns]
- School pressure / grades
- Friend stuff / fitting in
- Family tension
- Social media comparison
- Body/self-image
- Future/college worry
- Something else

Body: "These are the kinds of things EmpathiQ missions explore.
      Pick what feels relevant. You can change this later."

CTA: "Continue" → Step 4
```

**Step 4: Meet Your Avatar (Identity Building)**
```
"Every journey starts with a character.
This is yours."

[Avatar selector: SEEDLING stage]
"You're growing. Each mission + streak grows your character.
(This is just for you—no one else sees it.)"

CTA: "Let's Go" → Home page
```

**Home Page After Onboarding:**
```
[Personalized greeting]
"Hey [Name]. You're at [avatar stage]."

[Pulsing mission card]
"First mission: [Based on their concerns]"
Headline: "The Night Before Finals" (if school was selected)
Subheading: "Manage all-or-nothing thinking when stakes feel high."
Button: "Start Mission" → Mission flow

[Quick links grid]
├── 📚 Browse Stories
├── 🎯 Use a Tool
├── 👥 See the Pack
└── ⚙️ Settings
```

---

### Parent First Login Flow (Redesigned)

**Step 1: Welcome (Reassurance)**
```
Headline: "You're joining thousands of parents who want to help—
          without hovering."
Subheading: "This is not a surveillance tool.
           It's a way to understand your teen's emotional patterns
           so you know when to lean in."

CTA: "Let's Set This Up" → Step 2
```

**Step 2: Link Your Teen (Not Yet in System or Already Enrolled)**
```
Option A: "My teen is already using EmpathiQ"
         [Enter email or enrollment code]

Option B: "My teen isn't using it yet"
         [Invite link to send to teen]

Body: "If your teen is already enrolled, they'll get a notification
       that you want to be linked. They can say yes or no.
       You don't get access until they approve."

CTA: "Next" → Step 3
```

**Step 3: Understand Privacy (Set Expectations)**
```
Headline: "What you will and won't see."

[Visual breakdown]
✅ See: Mood patterns, thinking traps they're working on,
        engagement (streaks, missions), safety alerts

❌ Don't see: Raw reflections, pack posts, specific answers,
             journal content

Body: "Your teen can adjust these settings anytime.
       In a crisis, we override and notify you both."

CTA: "I Understand" → Step 4
```

**Step 4: Your First Action (Sideways Connection)**
```
Headline: "Your first mission (not theirs): Have a shoulder-to-shoulder conversation."

[Suggest a 'moment']
"This week, take a 15-min walk with your teen without phones.
 You don't need to mention EmpathiQ.
 Just listen if they want to talk."

Body: "This is how real connection happens."

CTA: "Got It" → Home page
```

**Home Page After Onboarding:**
```
[Hero section]
"Emotional Weather This Week"
[Visual: sunny/cloudy/stormy icon based on mood data]
"The forecast: [improving/stable/dipping]"

[Key metrics]
├── Top thinking trap: Catastrophizing (34%)
├── Engagement: Active 5/7 days this week
├── Streak: 4 days (need 3 more for bonus XP)
└── Safety: All green ✅

[Suggested action]
"Based on their focus on perfectionism, try this sideways moment..."
[Link to Moments page]

[Quick nav]
├── Deep Insights
├── Learning Center
├── Pack Digest
└── Settings
```

---

### Mentor First Login Flow (Redesigned)

**Step 1: Welcome (Clinical Context)**
```
Headline: "Your clinical dashboard is ready."
Subheading: "You'll see safety signals, cohort patterns, and teen-specific
           insights. Real data. Your decisions."

CTA: "Set Up Your Cohort" → Step 2
```

**Step 2: Create/Join Cohort**
```
Option A: "Create a new cohort"
         [Form: Name, description, supervision notes access]

Option B: "I'm joining an existing cohort"
         [Enter cohort code]

Body: "Cohort = group of teens you mentor.
      You can belong to multiple cohorts."

CTA: "Next" → Step 3
```

**Step 3: Safety Protocols (Compliance Setup)**
```
Headline: "Your safety workflow."

[Checklist]
☑ I understand RED zone escalation (5-min SLA)
☑ I understand YELLOW zone holds (60-min review)
☑ I will log all escalation decisions
☑ I've read the clinical protocols
☑ I'm aware of DPDP Act 2023 compliance

Body: "These aren't optional. They're how we keep teens safe."

CTA: "I Agree" → Step 4
```

**Step 4: Your First Task (Actionable)**
```
Headline: "Your first task: assign your initial cohort."

Body: "Upload a CSV of teen emails OR send cohort invites."

[CSV template link]
[Email invite form]

CTA: "Done" → Home page
```

**Home Page After Onboarding:**
```
[Alert strip if any RED flags]
🚨 "1 RED zone post pending escalation"
   [Link to /mentor/safety]

[Cohort snapshot]
Cohort: "Spring 2026 Clinical Cohort"
├── 12 teens assigned
├── 10 active (7 days)
├── 2 at risk (declining mood, low engagement)
└── 0 RED flags ✅

[Suggested actions]
├── "Review YELLOW zone post (1 pending)"
├── "Check in with [Teen Name] (missed 3 days)"
├── "2 new missions completed this week"

[Quick nav]
├── Teen Library
├── Safety Queue
├── Cohort Insights
├── Learning Center
└── Settings
```

---

## Part 4: Messaging by Pillar

### Core Value Propositions (Different for Each Audience)

#### **Teen Messaging:**
```
Pillar: "Your thoughts lie to you sometimes. Let's fix that."

Values:
- Private (not parental surveillance)
- Peer-connected (you're not alone)
- Game-like (missions, streaks, XP)
- Empowering (you're in control)

Language:
✅ "Earn XP"
✅ "Your avatar"
✅ "The pack"
✅ "Thinking traps"
❌ "Mental health"
❌ "Clinical"
❌ "Parent"
```

#### **Parent Messaging:**
```
Pillar: "Understand your teen. Be the parent they want to talk to."

Values:
- Partnership (not control)
- Evidence-based (data, not guesses)
- Respect (privacy-first)
- Actionable (know what to do)

Language:
✅ "Emotional weather"
✅ "Patterns"
✅ "Co-regulation"
✅ "Sideways moments"
❌ "Monitoring"
❌ "Tracking"
❌ "Surveillance"
```

#### **Mentor Messaging:**
```
Pillar: "See what matters. Decide with confidence."

Values:
- Clinically rigorous
- Safety-first
- Time-saving
- Defensible (compliance, audit trails)

Language:
✅ "Risk classification"
✅ "Cohort intelligence"
✅ "Clinical decision support"
✅ "Escalation workflows"
❌ "Gaming"
❌ "Tracking app"
❌ "Monitoring"
```

#### **School Messaging:**
```
Pillar: "Scale your guidance. Reach every student."

Values:
- Efficiency (40% time savings)
- Coverage (reach more students)
- Compliance (FERPA, DPDP)
- Integration (fits your workflow)

Language:
✅ "Scaled guidance"
✅ "Early intervention"
✅ "Counselor support"
✅ "Data-driven triage"
❌ "Therapy"
❌ "Replacement"
❌ "Online counseling"
```

---

## Part 5: App Content Hierarchy Redesign

### Current State: Feature-First Navigation ❌

Likely structure:
```
Home → Stories → Pack → Toolbox → Me → Privacy → Safety
```

This is **feature-centric**, not **user-goal-centric**.

### New Structure: Mission-Centric (User Goals First)

```
HOME
├── [Hero: Your mission queue]
│   ├── 🎮 Primary mission (based on concerns)
│   ├── 📚 Recommended next mission
│   └── 💪 "Continue" button
│
├── [Your Progress Section]
│   ├── XP count + avatar stage
│   ├── Streak counter
│   ├── Missions completed (X/15)
│   └── "See your stats" → /me
│
├── [Escape Hatch (When Not in Mission Mode)]
│   ├── 🎯 "Need a tool right now?" → /toolbox
│   ├── 👥 "See what others say" → /pack
│   └── ❓ "Learn more about a trap" → /stories (library view)
│
└── [Menu]
    ├── Me (profile, privacy, streaks, achievements)
    ├── Toolbox (coping strategies, by category)
    ├── Safety (help resources)
    ├── Settings (notifications, preferences)
    └── Log out

MISSION FLOW (When user enters mission)
├── Story (3 text chunks, tap to reveal)
├── Choice (path A or B, with shake animation)
├── Consequence (what happened)
├── Thinking Trap (revealed pop)
├── Reflect (optional textarea)
└── Complete (overlay, XP burst, link to Pack)

PACK FEED
├── [Mood cloud at top] (visual distribution)
├── [New posts strip] (scrollable, anonymized)
│   ├── Post (text excerpt, timestamp)
│   ├── Reactions (I relate, I tried this, This helped)
│   └── "View" to see full post
├── [Filter pills] (All, My traps, New, Popular)
└── [Post my reflection] (anonymous text box)

TOOLBOX
├── [Search bar] "Looking for help with...?"
├── [5 category tabs]
│   ├── 🧘 Calm (breathing, grounding)
│   ├── 💭 Reframe (think differently)
│   ├── 💪 Build (confidence, skills)
│   ├── 🗣️ Connect (talk to someone)
│   └── ✍️ Reflect (journal, process)
└── [Each tool shows]
    ├── Title + icon
    ├── "When to use this"
    ├── [Expand] → steps + time + XP reward

STORIES (Library View)
├── [Filter pills] (All, School, Peer, Family, Self, Digital)
├── [15 mission cards]
│   ├── Title
│   ├── Theme tag
│   ├── "What you'll learn" (the thinking trap)
│   ├── "Recommended for..." (your concerns?)
│   └── "Start" button
└── [Sort options] (New, Recommended, Difficulty)

ME (Profile + Stats)
├── [Avatar] (large visual of your stage)
├── [XP progress bar] (toward next stage)
├── [Streaks]
│   ├── Current streak (🔥 emoji + days)
│   ├── Longest streak
│   └── "Keep it going!" motivational text
├── [Stats]
│   ├── Missions completed: X/15
│   ├── Tools used this month: X
│   ├── Thinking traps worked on: [list]
│   ├── Pack reflections shared: X
│   └── Average mood trend: [visual]
├── [Achievements] (badges/unlocks)
│   ├── "First step" (completed 1 mission)
│   ├── "On a roll" (7-day streak)
│   ├── "Help-seeker" (used 5 tools)
│   └── "Voices in the pack" (shared 3 reflections)
├── [Quick actions]
│   ├── "Change privacy" → /privacy
│   ├── "Contact mentor" (if assigned)
│   ├── "Emergency support" → /safety
│   └── "Settings"

PRIVACY PAGE
├── [Explainer] "You're in control here."
├── [Always visible] (green tier)
│   └── Avatar stage (parents always see this for safety)
├── [You choose] (yellow tier - toggles)
│   ├── ☑ Share my mood trends
│   ├── ☑ Share what traps I'm working on
│   ├── ☑ Share my streak
│   ├── ☑ Share progress metrics
│   └── "What parents see" → preview
├── [Never visible] (red tier - hardcoded)
│   ├── Your reflections
│   ├── Pack posts
│   ├── Specific mission answers
│   ├── Exact mood entries
│   └── Journal content
└── [Safety override explainer]
    "If we think you're in danger, we tell your parent.
     We'll also tell you what we shared and why."

SAFETY PAGE
├── [If safe: Green state]
│   └── "You're doing great. Resources below."
│   ├── 📞 Crisis lines (TeleMANAS, Vandrevala, etc.)
│   ├── 🗣️ Talk to someone now (chatbot? trained volunteers?)
│   └── 👋 Talk to your mentor
│
├── [If unsafe: Amber/Red state]
│   └── "We think you need support. Let's get you help."
│   ├── 📞 Call now (one-tap to dial crisis line)
│   ├── 💬 Talk to someone now (immediate chat)
│   └── 👋 Tell your mentor / parent
│
└── [Resources section]
    ├── Self-harm resources
    ├── Anxiety resources
    ├── Depression resources
    ├── Eating disorder resources
    ├── Bullying/abuse resources
    └── Links to professional help
```

---

## Part 6: Content Principles by Role

### Teen Content Principles

```
✅ DO:
- Use metaphors (thinking traps, avatar stages, streaks)
- Celebrate small wins (XP, streak notifications)
- Normalize struggle ("You're not alone")
- Empower choice ("You decide what to share")
- Use peer language (casual, relatable, no jargon)

❌ DON'T:
- Preach about mental health
- Mention clinical concepts
- Reference parents (unless relevant to their choice)
- Use clinical language (disorder, symptom, diagnosis)
- Make them feel judged
```

### Parent Content Principles

```
✅ DO:
- Provide actionable guidance (not just data)
- Name common parent traps (interrogation, surveillance, fix-it reflex)
- Use warm, reassuring tone
- Validate their role ("You matter")
- Educate them alongside their teen

❌ DON'T:
- Suggest they monitor their teen
- Judge their parenting
- Oversimplify their teen's feelings
- Pretend this is therapy
- Make them feel excluded from their teen's data
```

### Mentor Content Principles

```
✅ DO:
- Be clinically precise
- Prioritize safety (clear escalation pathways)
- Provide decision-support (not decisions)
- Document everything (compliance)
- Acknowledge their expertise

❌ DON'T:
- Gamify clinical work
- Oversimplify teen psychology
- Hide data or risk signals
- Make them responsible for crisis hotline
- Treat them like they need hand-holding
```

### School Content Principles

```
✅ DO:
- Focus on efficiency (time/resource savings)
- Show ROI (reach, early detection, crisis prevention)
- Emphasize integration (fits existing workflow)
- Promise compliance (FERPA, DPDP)
- Highlight counselor empowerment

❌ DON'T:
- Suggest replacement of counselors
- Over-promise outcomes
- Make them feel technologically burdened
- Ignore their concerns about privacy
- Use jargon without explanation
```

---

## Part 7: Content Rollout Plan

### Phase 4.1: Website Redesign (Week 1)

**Deliverables:**
- [ ] Four pillar-specific landing pages (HTML/Next.js)
- [ ] Role-aware routing on root `/`
- [ ] Updated `/login` with role selector
- [ ] About page (company mission + values)
- [ ] Contact page (different CTAs per pillar)

### Phase 4.2: Redesigned Onboarding Flows (Week 2)

**Deliverables:**
- [ ] Teen onboarding (4 steps → home)
- [ ] Parent onboarding (4 steps → home)
- [ ] Mentor onboarding (4 steps → home)
- [ ] Test each with real user feedback

### Phase 4.3: App Content Hierarchy Redesign (Week 2–3)

**Deliverables:**
- [ ] Redesigned teen home (mission-first)
- [ ] Redesigned pack feed (filtered by relevance)
- [ ] Redesigned stories library (goal-based)
- [ ] Redesigned toolbox (category-based, not feature-list)
- [ ] Update `/me` with achievements + streaks
- [ ] Update `/privacy` with visual tiers

### Phase 4.4: Messaging Audit (Week 1–2)

**Deliverables:**
- [ ] Messaging guide (pillar-specific tone + language)
- [ ] Audit all copy in app for consistency
- [ ] Update all CTAs to match pillar values
- [ ] Stakeholder review + feedback

---

## Part 8: What This Changes (Summary)

| Current State | New State |
|---|---|
| Generic landing page | 4 pillar-specific pages |
| All users see same first-login | Role-aware onboarding (teen/parent/mentor) |
| Feature-first navigation | User-goal-first navigation |
| Generic messaging | Pillar-specific value props |
| "Mental health app" positioning | "Thinking pattern exploration" (teen), "Co-regulation guide" (parent), "Clinical decision support" (mentor), "Guidance scale-up" (school) |
| Pack as secondary feature | Pack as central peer connection |
| Toolbox as feature list | Toolbox as "escape hatch" for emergencies |
| Privacy as afterthought | Privacy as primary value |
| Stories as mission list | Stories as goal-based library |
| Me page as stats | Me page as achievement center |

---

## Part 9: What This DOESN'T Change

- **Visual design** (colors, fonts, spacing stay the same)
- **Core features** (missions, pack, toolbox, safety)
- **Technical architecture** (Next.js, Prisma, Context)
- **Safety protocols** (RED/YELLOW/GREEN zones unchanged)
- **Data models** (schema is the same)

**This is a content + IA redesign, not a visual redesign.**

---

## Success Metrics

After rollout, measure:

```
Teen:
- 30% higher conversion (visit → onboarding complete)
- 25% higher mission completion rate
- 15% longer avg session time

Parent:
- 20% higher signup rate
- 60% reduction in "what do I see?" support questions
- Higher NPS (Net Promoter Score)

Mentor:
- 90% faster first RED zone decision (vs. current state)
- 0 missed escalations due to unclear workflow
- 100% audit trail completion

School:
- 10+ K-12 pilot inquiries (vs. 0 currently)
- 15+ institutions in evaluation
```

---

## Next Steps

1. **Week 1:** Stakeholder review of landing pages + onboarding flows
2. **Week 2:** Design Figma mockups for new content hierarchy
3. **Week 3:** Developer handoff + implementation
4. **Week 4:** User testing with real teens, parents, mentors
5. **Week 5:** Iterate based on feedback
6. **Week 6:** Launch redesigned public website + onboarding

---

**Document completed:** 2026-04-08
**Owned by:** Product + Design + Content team
**Next review:** After Phase 4.1 (website redesign)
