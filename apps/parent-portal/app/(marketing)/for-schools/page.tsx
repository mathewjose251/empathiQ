import Link from "next/link";
import { MarketingNav, MarketingFooter } from "../_components/MarketingNav";

export const metadata = {
  title: "EmpathiQ for Schools — Cohort-level emotional intelligence",
  description:
    "EmpathiQ gives school counsellors and pastoral staff real-time cohort-level insights into student emotional patterns — before they become a crisis queue.",
};

export default function ForSchoolsPage() {
  return (
    <div className="lp-page">
      <MarketingNav activePillar="schools" />

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-eyebrow">For Schools &amp; Institutions</div>
        <h1 className="lp-hero-title">
          Before it reaches the counsellor&apos;s queue.
        </h1>
        <p className="lp-hero-lede">
          EmpathiQ gives your pastoral and wellbeing teams a cohort-level view of
          student emotional patterns in real time. Not case files — context.
          Enough to intervene early, structured enough to show up in safeguarding
          reviews.
        </p>
        <div className="lp-hero-actions">
          <Link href="/contact" className="lp-btn-primary lp-btn-primary-rose">
            Request a school demo →
          </Link>
          <Link href="/for-mentors" className="lp-btn-secondary">
            See the mentor view
          </Link>
        </div>
      </section>

      {/* ── The challenge ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">The challenge</div>
        <h2 className="lp-section-title">The counsellor sees the student after the spiral, not during it.</h2>
        <p className="lp-section-body">
          In most schools, the path to support is: student struggles in silence
          →&nbsp;teacher notices a change in behaviour →&nbsp;parent is called
          →&nbsp;referral made →&nbsp;student waits weeks for a session. EmpathiQ
          compresses that timeline by surfacing patterns before they become
          visible crises.
        </p>
        <div className="lp-card-grid">
          <div className="lp-card lp-card-rose">
            <span className="lp-card-icon">⏳</span>
            <h3 className="lp-card-title">Reactive, not proactive</h3>
            <p className="lp-card-body">
              Most school wellbeing systems are crisis-activated. A student has to
              visibly deteriorate before the system catches them. EmpathiQ gives
              you pattern data when it&apos;s still amber, not yet red.
            </p>
          </div>
          <div className="lp-card lp-card-rose">
            <span className="lp-card-icon">📋</span>
            <h3 className="lp-card-title">High caseloads, low visibility</h3>
            <p className="lp-card-body">
              The average school counsellor manages 200–400 students. Without
              passive monitoring tools, most students go unnoticed until an
              acute event. EmpathiQ gives the signal without the overhead.
            </p>
          </div>
          <div className="lp-card lp-card-rose">
            <span className="lp-card-icon">🤐</span>
            <h3 className="lp-card-title">Teens don&apos;t self-refer</h3>
            <p className="lp-card-body">
              Stigma around seeking help is still high in adolescent populations.
              EmpathiQ is built for a non-clinical context — so the
              data it collects doesn&apos;t require students to identify themselves
              as struggling.
            </p>
          </div>
        </div>
      </section>

      {/* ── Three scenarios ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">How schools use it</div>
        <h2 className="lp-section-title">Three scenarios where it changes outcomes.</h2>
        <div className="lp-scenario-list">
          <div className="lp-scenario">
            <div className="lp-scenario-title">
              <span className="lp-scenario-emoji">📅</span>
              <h4>Exam season: catching the catastrophising spike early</h4>
            </div>
            <p>
              Traditionally, the week before board exams produces the highest
              counselling referral volume of the year — but referrals peak after
              the exams, when students are already in crisis. EmpathiQ&apos;s
              cohort dashboard shows catastrophising and all-or-nothing thinking
              patterns rising 3–4 weeks before exam week, giving pastoral teams
              lead time to schedule group check-ins, adjust homework loads, and
              brief form tutors — before the queue forms.
            </p>
          </div>
          <div className="lp-scenario">
            <div className="lp-scenario-title">
              <span className="lp-scenario-emoji">🏫</span>
              <h4>Year 9 transition: the social comparison cluster</h4>
            </div>
            <p>
              Year 9 in most Indian school systems marks a significant social
              reshuffling — new streams, new peer groups, increased academic
              stakes. EmpathiQ typically shows a &quot;compare and despair&quot;
              cluster forming in Year 9 cohorts within 6–8 weeks of the new
              academic year. Pastoral teams who see this pattern early can
              commission targeted peer workshops rather than waiting for
              individual referrals.
            </p>
          </div>
          <div className="lp-scenario">
            <div className="lp-scenario-title">
              <span className="lp-scenario-emoji">⚠️</span>
              <h4>Safeguarding: structured documentation for ambiguous cases</h4>
            </div>
            <p>
              In ambiguous safeguarding cases — where a student shows elevated
              distress but has not disclosed — EmpathiQ provides a structured
              evidence trail: engagement patterns, risk tier history, mentor
              actions taken. This is often the missing layer in safeguarding
              reviews that ask &quot;what did the school know, and when?&quot;
            </p>
          </div>
        </div>
      </section>

      {/* ── Integration ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Implementation</div>
        <h2 className="lp-section-title">Minimal IT overhead. Real integration.</h2>
        <div className="lp-steps">
          <div className="lp-step">
            <div className="lp-step-num">01</div>
            <div className="lp-step-content">
              <h4>School onboarding</h4>
              <p>
                We configure a school-specific tenant, create mentor accounts for
                your wellbeing team, and set cohort structures (year group, house,
                subject stream — your choice). No LMS integration required.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">02</div>
            <div className="lp-step-content">
              <h4>Student onboarding</h4>
              <p>
                Students receive invite codes or sign up independently. A parental
                consent workflow is included for students under 16. Onboarding
                takes under 5 minutes per student.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">03</div>
            <div className="lp-step-content">
              <h4>Mentor training</h4>
              <p>
                A 90-minute online training session covers the mentor portal,
                risk tier interpretation, session prompt usage, and safeguarding
                workflow. Recorded for future onboarding of new staff.
              </p>
            </div>
          </div>
          <div className="lp-step">
            <div className="lp-step-num">04</div>
            <div className="lp-step-content">
              <h4>Ongoing cohort reporting</h4>
              <p>
                Monthly anonymised cohort reports are auto-generated in PDF and
                CSV format for safeguarding leads, school leadership, and external
                supervision requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Numbers ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Early data</div>
        <h2 className="lp-section-title">What early pilots show.</h2>
        <p className="lp-section-body">
          From our pilot cohort of 140 students across 3 schools over 8 weeks:
        </p>
        <div className="lp-numbers-grid">
          <div className="lp-number-card">
            <span className="lp-number-value">73%</span>
            <span className="lp-number-label">of students completed at least one mission per week</span>
          </div>
          <div className="lp-number-card">
            <span className="lp-number-value">4.2×</span>
            <span className="lp-number-label">more safety signals detected vs self-referral baseline</span>
          </div>
          <div className="lp-number-card">
            <span className="lp-number-value">91%</span>
            <span className="lp-number-label">of students said they would use it again</span>
          </div>
          <div className="lp-number-card">
            <span className="lp-number-value">3 wks</span>
            <span className="lp-number-label">average lead time before pattern became an active referral</span>
          </div>
          <div className="lp-number-card">
            <span className="lp-number-value">0</span>
            <span className="lp-number-label">safeguarding complaints — full transparency protocol maintained</span>
          </div>
          <div className="lp-number-card">
            <span className="lp-number-value">8 min</span>
            <span className="lp-number-label">average mentor time per week per 30-student cohort</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Questions</div>
        <h2 className="lp-section-title">School FAQ.</h2>
        <div className="lp-faq">
          <div className="lp-faq-item">
            <p className="lp-faq-q">Does the school see individual student data?</p>
            <p className="lp-faq-a">
              School leadership sees cohort-level data only — anonymised trends,
              no individual profiles. Individual student data is accessible only to
              their designated mentor, and only pattern data (not raw content).
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Does it comply with Indian data protection requirements?</p>
            <p className="lp-faq-a">
              EmpathiQ is designed with DPDP Act 2023 (Digital Personal Data
              Protection Act) compliance in mind. Data processing agreements are
              available for institutional deployment. We can provide documentation
              for your data protection officer.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Can parents opt their child out?</p>
            <p className="lp-faq-a">
              Yes. EmpathiQ includes a parental consent and opt-out workflow for
              students under 16. We provide consent documentation templates that
              schools can send as part of their communications.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Is there a cost per student?</p>
            <p className="lp-faq-a">
              Institutional pricing is available on a per-student or per-cohort
              basis. Contact us with your school size and we&apos;ll send a
              tailored proposal within 2 working days.
            </p>
          </div>
          <div className="lp-faq-item">
            <p className="lp-faq-q">Can we pilot it with one year group before committing?</p>
            <p className="lp-faq-a">
              Yes — our standard school engagement starts with a single year group
              (typically Year 9 or 10) for one academic term. This gives you
              enough data to evaluate impact before a full rollout.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="lp-cta-block">
        <h2 className="lp-cta-title">Ready to catch the pattern before it becomes a crisis?</h2>
        <p className="lp-cta-body">
          Request a demo for your school. We&apos;ll walk you through the cohort
          dashboard, the mentor portal, and the safeguarding workflow — tailored
          to your institution&apos;s size and structure.
        </p>
        <div className="lp-cta-actions">
          <Link href="/contact" className="lp-btn-primary lp-btn-primary-rose">
            Request a school demo
          </Link>
          <Link href="/for-mentors" className="lp-btn-secondary">
            See the mentor view →
          </Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
