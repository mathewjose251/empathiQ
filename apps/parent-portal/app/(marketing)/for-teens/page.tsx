import Link from "next/link";
import { MarketingNav, MarketingFooter } from "../_components/MarketingNav";

export const metadata = {
  title: "EmpathiQ for Teens — Built for the moments you can't explain",
  description:
    "A psychoeducation app that helps you understand your own thinking patterns through story-based missions, anonymous peer reflection, and zero adult surveillance.",
};

export default function ForTeensPage() {
  return (
    <div className="lp-page">
      <MarketingNav activePillar="teens" />

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-eyebrow">For Teens</div>
        <h1 className="lp-hero-title">
          Built for the moments you can&apos;t explain.
        </h1>
        <p className="lp-hero-lede">
          EmpathiQ helps you understand what&apos;s going on inside your head —
          without turning it into homework. No journaling mandates. No parent
          surveillance. No therapist speak. Just short story missions, anonymous
          peer moments, and tools that actually fit in a bad week.
        </p>
        <div className="lp-hero-actions">
          <Link href="/survey/teen" className="lp-btn-primary">
            Join the waitlist →
          </Link>
          <Link href="/teen" className="lp-btn-secondary">
            See how it works
          </Link>
        </div>
      </section>

      {/* ── Why EmpathiQ ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Why it exists</div>
        <h2 className="lp-section-title">School teaches subjects. Nobody teaches the brain.</h2>
        <p className="lp-section-body">
          The stuff that derails your focus — exam panic that spirals into
          &quot;I&apos;m going to fail everything,&quot; a single unanswered text
          becoming &quot;nobody likes me&quot;, a mistake at work turning into
          &quot;I&apos;m useless&quot; — those are thinking patterns. They have
          names. And once you know the names, you can actually do something about
          them.
        </p>
        <div className="lp-card-grid">
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🎭</span>
            <h3 className="lp-card-title">Story missions, not worksheets</h3>
            <p className="lp-card-body">
              15 story scenarios — from exam panic to group chat silence — where
              you make choices and see the thinking pattern behind them. 3–5 minutes
              each, any time, any order.
            </p>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">👥</span>
            <h3 className="lp-card-title">The Pack — your anonymous crew</h3>
            <p className="lp-card-body">
              A feed of anonymised peer reflections. You can see you&apos;re not
              alone in the 3am spiral. You can add your own when you want. No
              usernames. No followers. No receipts.
            </p>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🛠️</span>
            <h3 className="lp-card-title">15 tools. Pick and use.</h3>
            <p className="lp-card-body">
              Breathing, grounding, thought challenging, reframing — 15 tools across
              5 categories. Each one is under 3 minutes. Each one earns you XP. No
              pressure to do all of them.
            </p>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🌱</span>
            <h3 className="lp-card-title">No diagnosis. No labels.</h3>
            <p className="lp-card-body">
              EmpathiQ doesn&apos;t tell you what&apos;s wrong with you. It shows
              you a pattern that showed up this week, gives it a name, and moves
              on. No clinical language. No permanent record. Just context for
              what&apos;s already happening in your head.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">How it works</div>
        <h2 className="lp-section-title">Five minutes. Real insight.</h2>
        <div className="lp-steps">
          <div className="lp-step">
            <div className="lp-step-num">01</div>
            <div className="lp-step-content">
              <h4>Pick a story that fits your week</h4>
              <p>
                Exam pressure, social awkwardness, family tension, comparison
                spirals — there&apos;s a mission for each. Start anywhere. No
                required order.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">02</div>
            <div className="lp-step-content">
              <h4>Make a choice. See the thinking pattern behind it.</h4>
              <p>
                Each mission has two paths. Both are real. After you choose, you
                get the name of the thinking pattern that drives that reaction —
                no judgment attached.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">03</div>
            <div className="lp-step-content">
              <h4>Reflect (or don&apos;t)</h4>
              <p>
                A single optional prompt. Write something, skip it, or just close
                the app. You earn XP either way — more for sharing, not zero for
                skipping.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">04</div>
            <div className="lp-step-content">
              <h4>Watch your avatar grow</h4>
              <p>
                From Seedling to Radiant — your avatar reflects how much
                you&apos;ve engaged, not how well you scored. There&apos;s no
                failing here.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">05</div>
            <div className="lp-step-content">
              <h4>Check in on the Pack when you feel alone</h4>
              <p>
                Anonymous peer reflections. The feed shows you what others
                wrestle with too. You can post your own. None of it gets back to
                school, parents, or your username.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Your privacy</div>
        <h2 className="lp-section-title">You control the dial.</h2>
        <p className="lp-section-body">
          Privacy isn&apos;t a checkbox buried in settings. It&apos;s the
          foundation of everything here. Here&apos;s exactly what happens with your
          data:
        </p>
        <div className="lp-visibility-list">
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">🟢</span>
            <div className="lp-vis-text">
              <strong>Always visible to parents</strong>
              <span>
                Whether you&apos;re active or inactive, your avatar stage, streak
                count. No content — just a &quot;still here&quot; signal.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">🟡</span>
            <div className="lp-vis-text">
              <strong>Visible if you choose</strong>
              <span>
                Mood trends (as a weather report), thinking trap categories (not
                specific choices), progress metrics.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">🔴</span>
            <div className="lp-vis-text">
              <strong>Never visible to anyone</strong>
              <span>
                Your specific mission choices, your Pack posts, your journal, your
                exact mood entries. These stay with you.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">⚠️</span>
            <div className="lp-vis-text">
              <strong>The one exception: safety</strong>
              <span>
                If you indicate you might hurt yourself, a mentor or trusted adult
                is contacted. And you are told exactly what was shared, with whom,
                and why. No silent alerts.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Questions</div>
        <h2 className="lp-section-title">Straight answers.</h2>
        <div className="lp-faq">
          <div className="lp-faq-item">
            <p className="lp-faq-q">Is this therapy?</p>
            <p className="lp-faq-a">
              No. EmpathiQ is a psychoeducation tool — it teaches you about
              thinking patterns, not treats them. If you need support beyond
              self-awareness, we&apos;ll always say so. And we&apos;ll point you
              somewhere real, not just give you another app.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Do I have to tell my parents I&apos;m using it?</p>
            <p className="lp-faq-a">
              You can use the survey and the teen sections without a linked parent
              account. If your school or parent connected you, they can see
              aggregate data only — never your content. You always know what they
              see.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">What if I&apos;m having a really bad time?</p>
            <p className="lp-faq-a">
              There&apos;s a safety section in the app with real Indian helplines
              (TeleMANAS: 14416, Vandrevala: 9999 666 555, AASRA:
              +91-22-2754 6669). These are verified, 24/7, and free. You can access
              them from the app at any point.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Will my school see my data?</p>
            <p className="lp-faq-a">
              Schools get cohort-level patterns only — no individual data, no
              usernames, no content. Think of it like a class-level weather report
              rather than a report card.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Is it free?</p>
            <p className="lp-faq-a">
              The core experience — missions, Pack, toolbox, avatar — is free.
              EmpathiQ is currently in an invite-only phase. Fill out the survey to
              get early access.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="lp-cta-block">
        <h2 className="lp-cta-title">Ready to understand your own brain?</h2>
        <p className="lp-cta-body">
          Join the waitlist. It takes 3 minutes. No parent sign-off needed. No
          commitment. Just early access when we open.
        </p>
        <div className="lp-cta-actions">
          <Link href="/survey/teen" className="lp-btn-primary">
            Join the waitlist
          </Link>
          <Link href="/teen" className="lp-btn-secondary">
            Explore first →
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
