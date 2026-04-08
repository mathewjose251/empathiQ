import Link from "next/link";
import "./(marketing)/landing.css";

/*
 * ─── ROLE-AWARE HOME ────────────────────────────────────────────
 *
 * Public-facing root. Visitors select their role and are routed to
 * the appropriate pillar landing page or portal entry point.
 *
 * No auth required. No data fetching.
 */

export default function HomePage() {
  return (
    <div className="lp-page">
      {/* ── Nav ── */}
      <nav className="lp-topnav">
        <span className="lp-wordmark">EmpathiQ</span>
        <div className="lp-nav-links">
          <Link href="/for-teens" className="lp-nav-link">For Teens</Link>
          <Link href="/for-parents" className="lp-nav-link">For Parents</Link>
          <Link href="/for-mentors" className="lp-nav-link">For Mentors</Link>
          <Link href="/for-schools" className="lp-nav-link">For Schools</Link>
          <Link href="/login" className="lp-nav-cta">Sign in</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-eyebrow">EmpathiQ</div>
        <h1 className="lp-hero-title">
          Emotional literacy for teens. Built for India.
        </h1>
        <p className="lp-hero-lede">
          A psychoeducation platform that helps teenagers understand their own
          thinking patterns — through story missions, anonymous peer reflection,
          and tools that fit in a bad week. Private by design. No clinical
          gatekeeping. No surveillance.
        </p>
        <div className="lp-hero-actions">
          <Link href="/survey/teen" className="lp-btn-primary">
            Join the waitlist →
          </Link>
          <Link href="/about" className="lp-btn-secondary">
            Learn more
          </Link>
        </div>
      </section>

      {/* ── Role selector ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Find your path</div>
        <h2 className="lp-section-title">Who are you here for?</h2>
        <p className="lp-section-body">
          EmpathiQ works differently for each person in the ecosystem. Choose
          your role to see exactly what it does for you.
        </p>

        <div className="lp-role-grid">
          <Link href="/for-teens" className="lp-role-card lp-role-card-cyan">
            <span className="lp-role-emoji">🎓</span>
            <h3 className="lp-role-title">I&apos;m a teen</h3>
            <p className="lp-role-desc">
              Story missions, anonymous peer feed, tools for bad weeks. Your
              privacy, your dial.
            </p>
            <span className="lp-role-cta lp-role-cta-cyan">See how it works →</span>
          </Link>

          <Link href="/for-parents" className="lp-role-card lp-role-card-amber">
            <span className="lp-role-emoji">👪</span>
            <h3 className="lp-role-title">I&apos;m a parent</h3>
            <p className="lp-role-desc">
              Emotional weather, not a diary. Support your teen without breaking
              trust.
            </p>
            <span className="lp-role-cta lp-role-cta-amber">See the parent view →</span>
          </Link>

          <Link href="/for-mentors" className="lp-role-card lp-role-card-mint">
            <span className="lp-role-emoji">🩺</span>
            <h3 className="lp-role-title">I&apos;m a counsellor</h3>
            <p className="lp-role-desc">
              Cohort patterns, individual risk flags, session prompts. Clinical
              decision support.
            </p>
            <span className="lp-role-cta lp-role-cta-mint">See the mentor portal →</span>
          </Link>

          <Link href="/for-schools" className="lp-role-card lp-role-card-rose">
            <span className="lp-role-emoji">🏫</span>
            <h3 className="lp-role-title">I represent a school</h3>
            <p className="lp-role-desc">
              Cohort-level emotional intelligence before it reaches the
              counsellor&apos;s queue.
            </p>
            <span className="lp-role-cta lp-role-cta-rose">See the school view →</span>
          </Link>
        </div>
      </section>

      {/* ── What EmpathiQ is (and isn&apos;t) ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">What we are</div>
        <h2 className="lp-section-title">Psychoeducation. Not therapy. Not surveillance.</h2>
        <div className="lp-card-grid">
          <div className="lp-card lp-card-mint">
            <span className="lp-card-icon">✅</span>
            <h3 className="lp-card-title">What EmpathiQ is</h3>
            <p className="lp-card-body">
              A psychoeducation tool that teaches thinking pattern recognition
              through stories and missions. Evidence-based (REBT). India-built.
              Privacy-first. Works for the whole family ecosystem.
            </p>
          </div>
          <div className="lp-card lp-card-rose">
            <span className="lp-card-icon">❌</span>
            <h3 className="lp-card-title">What EmpathiQ is not</h3>
            <p className="lp-card-body">
              Not a therapy app. Not a mood tracker. Not a surveillance tool for
              parents or schools. Not a replacement for clinical support when it&apos;s
              needed. We will always say so when it is.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <span className="lp-footer-word">EmpathiQ</span>
        <div className="lp-footer-links">
          <Link href="/for-teens">Teens</Link>
          <Link href="/for-parents">Parents</Link>
          <Link href="/for-mentors">Mentors</Link>
          <Link href="/for-schools">Schools</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Sign in</Link>
        </div>
        <p className="lp-footer-note">
          EmpathiQ is a psychoeducation platform, not a therapy service. If you
          or someone you know is in crisis, call TeleMANAS: 14416 (toll-free,
          24/7).
        </p>
      </footer>
    </div>
  );
}
