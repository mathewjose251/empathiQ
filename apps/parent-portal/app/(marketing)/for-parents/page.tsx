import Link from "next/link";
import { MarketingNav, MarketingFooter } from "../_components/MarketingNav";

export const metadata = {
  title: "EmpathiQ for Parents — Support without surveillance",
  description:
    "EmpathiQ gives parents a calm, aggregated view of their teen's emotional patterns — never raw content, never surveillance. Support your child without breaking trust.",
};

export default function ForParentsPage() {
  return (
    <div className="lp-page">
      <MarketingNav activePillar="parents" />

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-eyebrow">For Parents</div>
        <h1 className="lp-hero-title">
          Support without surveillance.
        </h1>
        <p className="lp-hero-lede">
          You sense something is off, but every time you ask, you get
          &quot;fine.&quot; EmpathiQ gives you the emotional weather — not the
          diary. You see patterns, not pages. Enough to help. Never enough to
          intrude.
        </p>
        <div className="lp-hero-actions">
          <Link href="/survey/parent" className="lp-btn-primary lp-btn-primary-amber">
            Take the parent survey →
          </Link>
          <Link href="/parent" className="lp-btn-secondary">
            See the dashboard
          </Link>
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">The problem we&apos;re solving</div>
        <h2 className="lp-section-title">
          The gap between &quot;how was school&quot; and what&apos;s actually
          happening.
        </h2>
        <p className="lp-section-body">
          Teenagers don&apos;t stop having feelings — they stop sharing them with
          parents. Not because they don&apos;t trust you, but because the moment
          they do, the conversation often becomes advice, worry, or problem-solving
          before they&apos;ve finished the sentence.
        </p>
        <div className="lp-card-grid">
          <div className="lp-card lp-card-amber">
            <span className="lp-card-icon">📉</span>
            <h3 className="lp-card-title">The sharing cliff at 13</h3>
            <p className="lp-card-body">
              Most teens report a dramatic drop in emotional sharing with parents
              around ages 12–14. It&apos;s not a relationship failure — it&apos;s
              developmental. They&apos;re building an internal world. EmpathiQ
              gives you a window into the weather outside that world.
            </p>
          </div>
          <div className="lp-card lp-card-amber">
            <span className="lp-card-icon">🔍</span>
            <h3 className="lp-card-title">Monitoring makes it worse</h3>
            <p className="lp-card-body">
              Phone monitoring apps, reading texts, checking browser history —
              when teens discover this (and they do), it breaks trust faster than
              almost any other single action. EmpathiQ is built to give you
              information without the breach.
            </p>
          </div>
          <div className="lp-card lp-card-amber">
            <span className="lp-card-icon">🤝</span>
            <h3 className="lp-card-title">Co-regulation, not control</h3>
            <p className="lp-card-body">
              Research on adolescent wellbeing consistently shows that teens with
              emotionally attuned parents — not controlling ones — have better
              outcomes. EmpathiQ helps you attune without over-managing.
            </p>
          </div>
        </div>
      </section>

      {/* ── What you see ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">What you actually see</div>
        <h2 className="lp-section-title">The weather, not the diary.</h2>
        <p className="lp-section-body">
          Everything in your parent dashboard is aggregated and translated. You
          see patterns, trends, and signals — not specific answers, not exact
          words, not mission choices.
        </p>
        <div className="lp-visibility-list">
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">👁️</span>
            <div className="lp-vis-text">
              <strong>Emotional weather</strong>
              <span>
                &quot;Skies are clearing&quot; / &quot;Some clouds
                gathering&quot; — a 7-day mood trajectory, not individual entries.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">👁️</span>
            <div className="lp-vis-text">
              <strong>Thinking trap spotlight</strong>
              <span>
                The category of thinking pattern that appears most in their
                activity this week — e.g. &quot;Catastrophising.&quot; Never the
                specific thought.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">👁️</span>
            <div className="lp-vis-text">
              <strong>Engagement pulse</strong>
              <span>
                Active days, streak, tools used. Whether they&apos;re showing up,
                not what they&apos;re doing.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">🔒</span>
            <div className="lp-vis-text">
              <strong>Never visible: specific choices, pack posts, journal</strong>
              <span>
                What your teen wrote, which paths they chose, what they posted
                anonymously — these are private by design. Not private because we
                forgot to build it. Private because the product requires it.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sideways moments ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">How to actually help</div>
        <h2 className="lp-section-title">Sideways moments work better than face-to-face.</h2>
        <p className="lp-section-body">
          Teens respond to emotional conversations better when there&apos;s no
          eye contact pressure — during a walk, a drive, doing dishes. EmpathiQ
          gives you a &quot;suggested moment&quot; each week: a short, specific
          activity based on what pattern is showing up, with no requirement to
          mention the app.
        </p>

        <div className="lp-quote-block lp-quote-amber">
          <p className="lp-quote-text">
            &ldquo;During a short walk, compare the worst case, best case, and
            most likely outcome of one thing they&apos;re stressed about. No
            fixing needed — just widening the frame.&rdquo;
          </p>
          <span className="lp-quote-attr">Example suggested moment — Catastrophising week</span>
        </div>

        <div className="lp-card-grid">
          <div className="lp-card lp-card-amber">
            <span className="lp-card-icon">🚶</span>
            <h3 className="lp-card-title">Walk and wonder</h3>
            <p className="lp-card-body">
              Walking conversations consistently produce more honest disclosures
              than sit-down talks. The movement reduces threat-signaling.
            </p>
          </div>
          <div className="lp-card lp-card-amber">
            <span className="lp-card-icon">🍳</span>
            <h3 className="lp-card-title">Side-by-side tasks</h3>
            <p className="lp-card-body">
              Cooking, cleaning, driving — tasks where you&apos;re both doing
              something create natural openings that feel less interrogative.
            </p>
          </div>
          <div className="lp-card lp-card-amber">
            <span className="lp-card-icon">💬</span>
            <h3 className="lp-card-title">Third-person openers</h3>
            <p className="lp-card-body">
              &ldquo;I read that a lot of teens feel like this when...&rdquo;
              creates safety to respond. It&apos;s not about them yet. Unless they
              want it to be.
            </p>
          </div>
        </div>
      </section>

      {/* ── Language guide ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Language that lands</div>
        <h2 className="lp-section-title">What to say. What not to say.</h2>
        <p className="lp-section-body">
          When catastrophising is active, the conversation style that helps is
          specific — and different from your instinct.
        </p>
        <div className="lp-lang-grid">
          <div className="lp-lang-col lp-lang-col-yes">
            <h4>Say this</h4>
            <ul className="lp-lang-list">
              <li>&ldquo;That sounds really hard.&rdquo;</li>
              <li>&ldquo;What&apos;s the thing you&apos;re most worried about specifically?&rdquo;</li>
              <li>&ldquo;What would have to be true for that to happen?&rdquo;</li>
              <li>&ldquo;I&apos;ve had weeks that felt like that too.&rdquo;</li>
              <li>&ldquo;You don&apos;t have to figure it out now.&rdquo;</li>
            </ul>
          </div>
          <div className="lp-lang-col lp-lang-col-no">
            <h4>Avoid this</h4>
            <ul className="lp-lang-list">
              <li>&ldquo;You&apos;re overreacting.&rdquo;</li>
              <li>&ldquo;Just don&apos;t think about it.&rdquo;</li>
              <li>&ldquo;When I was your age...&rdquo;</li>
              <li>&ldquo;It&apos;s not that big a deal.&rdquo;</li>
              <li>&ldquo;Here&apos;s what you should do...&rdquo;</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Questions</div>
        <h2 className="lp-section-title">Parent FAQ.</h2>
        <div className="lp-faq">
          <div className="lp-faq-item">
            <p className="lp-faq-q">Does my teen know I can see their dashboard?</p>
            <p className="lp-faq-a">
              Yes — and they can see exactly what you see before it reaches you.
              There are no secret feeds. Your teen controls the privacy dial and
              can review what&apos;s shared at any time.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">What if I see something concerning?</p>
            <p className="lp-faq-a">
              The dashboard includes guidance on how to open a conversation when a
              pattern spikes. If the system detects a safety concern, a mentor is
              alerted and you are notified too — with clear guidance on next steps,
              not just a flag.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Do I need to be a counsellor to use this?</p>
            <p className="lp-faq-a">
              No. The dashboard is designed to be read without a psychology degree.
              Every pattern has a plain-English explanation. Every suggested moment
              has a script you can use or adapt.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Can I use EmpathiQ without connecting it to my teen&apos;s account?</p>
            <p className="lp-faq-a">
              Yes. The parent survey helps us understand family context and improve
              the insights we surface. You can fill it in independently, and it
              takes about 4 minutes.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Is my survey data shared with anyone?</p>
            <p className="lp-faq-a">
              Survey data is used in aggregate to improve platform-wide insights. It
              is never shared with your teen&apos;s school, third-party marketers, or
              other parents.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="lp-cta-block">
        <h2 className="lp-cta-title">Ready to support without surveilling?</h2>
        <p className="lp-cta-body">
          Fill in the parent survey — it takes 4 minutes and helps us build a
          sharper picture of what families in your situation are navigating. No
          commitment, no login required.
        </p>
        <div className="lp-cta-actions">
          <Link href="/survey/parent" className="lp-btn-primary lp-btn-primary-amber">
            Take the parent survey
          </Link>
          <Link href="/parent" className="lp-btn-secondary">
            See the dashboard →
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
