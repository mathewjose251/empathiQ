import Link from "next/link";
import { MarketingNav, MarketingFooter } from "../_components/MarketingNav";

export const metadata = {
  title: "EmpathiQ for Mentors — Clinical decision support at scale",
  description:
    "EmpathiQ gives counsellors and school psychologists aggregated cohort insights, individual risk signals, and structured session prompts — without breaching teen privacy.",
};

export default function ForMentorsPage() {
  return (
    <div className="lp-page">
      <MarketingNav activePillar="mentors" />

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-eyebrow">For Counsellors &amp; Mentors</div>
        <h1 className="lp-hero-title">
          See the signal before the crisis.
        </h1>
        <p className="lp-hero-lede">
          EmpathiQ turns passive adolescent engagement into structured clinical
          signals. Not surveillance — decision support. Aggregated cohort
          patterns, individual risk flags, and session prompts that save time
          without replacing judgement.
        </p>
        <div className="lp-hero-actions">
          <Link href="/contact" className="lp-btn-primary lp-btn-primary-mint">
            Request mentor access →
          </Link>
          <Link href="/mentor" className="lp-btn-secondary">
            See the portal
          </Link>
        </div>
      </section>

      {/* ── What mentors see ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Your view</div>
        <h2 className="lp-section-title">Cohort patterns. Individual flags. No raw content.</h2>
        <p className="lp-section-body">
          The mentor portal gives you two lenses: a cohort-level view of which
          thinking patterns are spiking across your group this week, and an
          individual-level risk signal for students who may need a check-in. You
          never see specific mission answers, Pack posts, or journal entries.
        </p>
        <div className="lp-card-grid">
          <div className="lp-card lp-card-mint">
            <span className="lp-card-icon">📊</span>
            <h3 className="lp-card-title">Cohort dashboard</h3>
            <p className="lp-card-body">
              A live view of which thinking traps appear most across your cohort.
              Catastrophising spiking before exams. Compare-and-despair rising
              after results week. Pattern visibility before it becomes counselling
              demand.
            </p>
          </div>
          <div className="lp-card lp-card-mint">
            <span className="lp-card-icon">🚨</span>
            <h3 className="lp-card-title">Individual risk flags</h3>
            <p className="lp-card-body">
              When a student&apos;s engagement drops sharply, or safety gate
              responses indicate elevated distress, you receive a structured
              alert — risk tier (Green / Amber / Red / Crisis), context, and
              recommended next step.
            </p>
          </div>
          <div className="lp-card lp-card-mint">
            <span className="lp-card-icon">💬</span>
            <h3 className="lp-card-title">Session prompts</h3>
            <p className="lp-card-body">
              For each student, a set of session starters generated from their
              pattern data — not their specific answers. &ldquo;Jaanvi has been
              engaging with the catastrophising mission cluster. You might
              explore...&rdquo;
            </p>
          </div>
          <div className="lp-card lp-card-mint">
            <span className="lp-card-icon">📝</span>
            <h3 className="lp-card-title">Workshop creation</h3>
            <p className="lp-card-body">
              Build structured group workshops that students complete in their own
              time. Assign cohorts, track completion, see aggregate patterns
              across workshop modules without individual-level surveillance.
            </p>
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">How mentors use it</div>
        <h2 className="lp-section-title">Fits into your existing workflow.</h2>
        <div className="lp-steps">
          <div className="lp-step">
            <div className="lp-step-num">01</div>
            <div className="lp-step-content">
              <h4>Monday morning cohort review</h4>
              <p>
                5 minutes on the cohort dashboard. Which patterns are elevated?
                Which students have disengaged? Is there a pre-exam stress cluster
                building? This week&apos;s temperature before your first session.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">02</div>
            <div className="lp-step-content">
              <h4>Review flagged students</h4>
              <p>
                Students with elevated risk signals appear in your queue with tier
                labels (Amber, Red, Crisis), last engagement date, and suggested
                actions. You decide — the system never acts without you.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">03</div>
            <div className="lp-step-content">
              <h4>Pre-session prep</h4>
              <p>
                Pull up a student&apos;s pattern summary before a session. Not
                their words — the shape of their week. Go in already knowing
                what&apos;s been active.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">04</div>
            <div className="lp-step-content">
              <h4>Post-session notes (optional)</h4>
              <p>
                Log observations that feed back into the student&apos;s pattern
                model. These are mentor-only and never visible to parents,
                students, or school admin unless you share them.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">05</div>
            <div className="lp-step-content">
              <h4>Monthly cohort reporting</h4>
              <p>
                Export anonymised cohort trend reports for school leadership,
                safeguarding reviews, or external supervision. No student
                identifiers included unless you specify.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Safety ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Safety system</div>
        <h2 className="lp-section-title">You&apos;re always in the loop. You&apos;re always in control.</h2>
        <p className="lp-section-body">
          EmpathiQ has a four-tier safety classification system built into every
          student&apos;s journey. When distress indicators are present, the
          system routes to you — not to automated messaging, not to parents
          first, not to an AI decision.
        </p>
        <div className="lp-card-grid">
          <div className="lp-card">
            <span className="lp-card-icon">🟢</span>
            <h3 className="lp-card-title">Green</h3>
            <p className="lp-card-body">
              Normal engagement, no distress indicators. No action required.
            </p>
          </div>
          <div className="lp-card">
            <span className="lp-card-icon">🟡</span>
            <h3 className="lp-card-title">Amber</h3>
            <p className="lp-card-body">
              Elevated distress patterns. Flag in your queue. Suggested: check-in
              at next natural opportunity.
            </p>
          </div>
          <div className="lp-card">
            <span className="lp-card-icon">🔴</span>
            <h3 className="lp-card-title">Red</h3>
            <p className="lp-card-body">
              Active distress signal. Direct alert to you with priority queue
              placement. Suggested: same-day contact.
            </p>
          </div>
          <div className="lp-card">
            <span className="lp-card-icon">🆘</span>
            <h3 className="lp-card-title">Crisis</h3>
            <p className="lp-card-body">
              Self-harm indication. Immediate alert to you and designated school
              safeguarding contact. Student is shown crisis helplines in-app and
              told exactly what was shared.
            </p>
          </div>
        </div>
      </section>

      {/* ── Privacy / compliance ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Compliance</div>
        <h2 className="lp-section-title">Designed to meet your safeguarding obligations.</h2>
        <div className="lp-visibility-list">
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">✅</span>
            <div className="lp-vis-text">
              <strong>No raw adolescent content in mentor view</strong>
              <span>
                You see aggregated patterns, risk tiers, and prompts — never the
                exact words, choices, or reflections that generated them.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">✅</span>
            <div className="lp-vis-text">
              <strong>Student-transparent safety alerts</strong>
              <span>
                When a safety alert is triggered, the student is told what was
                shared, with whom, and why. No silent monitoring.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">✅</span>
            <div className="lp-vis-text">
              <strong>Data processing agreements available</strong>
              <span>
                For institutional deployment, we provide DPAs aligned with Indian
                data protection requirements and DPDP Act 2023 compliance.
              </span>
            </div>
          </div>
          <div className="lp-visibility-row">
            <span className="lp-vis-icon">✅</span>
            <div className="lp-vis-text">
              <strong>Audit trail for safety actions</strong>
              <span>
                Every safety flag, mentor acknowledgement, and action taken is
                logged with timestamps for safeguarding review.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Questions</div>
        <h2 className="lp-section-title">Mentor FAQ.</h2>
        <div className="lp-faq">
          <div className="lp-faq-item">
            <p className="lp-faq-q">Do I need to be a licensed counsellor to be a mentor?</p>
            <p className="lp-faq-a">
              Access tiers are available for different roles — school psychologists,
              trained counsellors, and pastoral care staff have different
              permission levels. Contact us to discuss your role and institution.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Can I use EmpathiQ alongside my existing counselling practice?</p>
            <p className="lp-faq-a">
              Yes — it&apos;s designed as a supplement, not a replacement. The
              session prompts and pattern summaries are inputs to your practice,
              not prescriptions for it.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">What happens if I disagree with a risk tier assessment?</p>
            <p className="lp-faq-a">
              You can override any risk tier with a manual note explaining your
              judgement. The system surfaces signals; clinical decisions are always
              yours.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">How is the cohort data anonymised?</p>
            <p className="lp-faq-a">
              Individual-level data is never shared in cohort reports. Pattern
              aggregation uses k-anonymity principles (minimum cohort size of 5
              before a pattern is reported) to prevent re-identification.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Can I request a demo for my institution?</p>
            <p className="lp-faq-a">
              Yes. Use the contact form and specify your institution, role, and
              rough cohort size. We&apos;ll arrange a walkthrough of the mentor portal
              within 3 working days.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="lp-cta-block">
        <h2 className="lp-cta-title">See the signal before the crisis.</h2>
        <p className="lp-cta-body">
          Request mentor access or a demo walkthrough. We&apos;ll get back within
          3 working days with a personalised walkthrough of the mentor portal for
          your institution.
        </p>
        <div className="lp-cta-actions">
          <Link href="/contact" className="lp-btn-primary lp-btn-primary-mint">
            Request mentor access
          </Link>
          <Link href="/mentor" className="lp-btn-secondary">
            Explore the portal →
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
