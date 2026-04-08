import Link from "next/link";
import { MarketingNav, MarketingFooter } from "../_components/MarketingNav";

export const metadata = {
  title: "Contact EmpathiQ",
  description: "Get in touch with the EmpathiQ team for school partnerships, mentor access, press, or general enquiries.",
};

export default function ContactPage() {
  return (
    <div className="lp-page">
      <MarketingNav />

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-eyebrow">Contact</div>
        <h1 className="lp-hero-title">
          Get in touch.
        </h1>
        <p className="lp-hero-lede">
          Whether you&apos;re a school exploring a pilot, a counsellor requesting
          access, a parent with questions, or press — find the right path below.
        </p>
      </section>

      {/* ── Contact paths by pillar ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Find the right path</div>
        <h2 className="lp-section-title">Where do you want to start?</h2>
        <div className="lp-role-grid">
          <div className="lp-role-card lp-role-card-cyan">
            <span className="lp-role-emoji">🎓</span>
            <h3 className="lp-role-title">I&apos;m a teen</h3>
            <p className="lp-role-desc">
              Fill in the survey for early access. No login needed.
            </p>
            <Link href="/survey/teen" className="lp-role-cta lp-role-cta-cyan">
              Join the waitlist →
            </Link>
          </div>
          <div className="lp-role-card lp-role-card-amber">
            <span className="lp-role-emoji">👪</span>
            <h3 className="lp-role-title">I&apos;m a parent</h3>
            <p className="lp-role-desc">
              Fill in the parent survey or read how EmpathiQ works for families.
            </p>
            <Link href="/survey/parent" className="lp-role-cta lp-role-cta-amber">
              Take the survey →
            </Link>
          </div>
          <div className="lp-role-card lp-role-card-mint">
            <span className="lp-role-emoji">🩺</span>
            <h3 className="lp-role-title">I&apos;m a counsellor or mentor</h3>
            <p className="lp-role-desc">
              Request mentor portal access with your institution and role details.
            </p>
            <a
              href="mailto:mentors@empathiq.in?subject=Mentor%20Access%20Request"
              className="lp-role-cta lp-role-cta-mint"
            >
              Email us →
            </a>
          </div>
          <div className="lp-role-card lp-role-card-rose">
            <span className="lp-role-emoji">🏫</span>
            <h3 className="lp-role-title">I represent a school</h3>
            <p className="lp-role-desc">
              Request a demo for your institution. We respond within 3 working days.
            </p>
            <a
              href="mailto:schools@empathiq.in?subject=School%20Demo%20Request"
              className="lp-role-cta lp-role-cta-rose"
            >
              Request a demo →
            </a>
          </div>
        </div>
      </section>

      {/* ── Other contact ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Other enquiries</div>
        <h2 className="lp-section-title">Press, partnerships, and everything else.</h2>
        <div className="lp-card-grid">
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">📰</span>
            <h3 className="lp-card-title">Press &amp; media</h3>
            <p className="lp-card-body">
              For interview requests, product walkthroughs, or data on adolescent
              mental health trends in India.
            </p>
            <a
              href="mailto:press@empathiq.in"
              style={{ color: "var(--cyan)", fontSize: "0.9rem", marginTop: "12px", display: "block" }}
            >
              press@empathiq.in
            </a>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🤝</span>
            <h3 className="lp-card-title">Partnerships &amp; research</h3>
            <p className="lp-card-body">
              For NGO partnerships, academic collaborations, or mental health
              research access.
            </p>
            <a
              href="mailto:partnerships@empathiq.in"
              style={{ color: "var(--cyan)", fontSize: "0.9rem", marginTop: "12px", display: "block" }}
            >
              partnerships@empathiq.in
            </a>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🔒</span>
            <h3 className="lp-card-title">Privacy &amp; data</h3>
            <p className="lp-card-body">
              For data protection enquiries, DPDP Act compliance questions, or
              data subject access requests.
            </p>
            <a
              href="mailto:privacy@empathiq.in"
              style={{ color: "var(--cyan)", fontSize: "0.9rem", marginTop: "12px", display: "block" }}
            >
              privacy@empathiq.in
            </a>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">⚙️</span>
            <h3 className="lp-card-title">General</h3>
            <p className="lp-card-body">
              For anything else that doesn&apos;t fit the above categories.
            </p>
            <a
              href="mailto:hello@empathiq.in"
              style={{ color: "var(--cyan)", fontSize: "0.9rem", marginTop: "12px", display: "block" }}
            >
              hello@empathiq.in
            </a>
          </div>
        </div>
      </section>

      {/* ── Safety note ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Need help now?</div>
        <h2 className="lp-section-title">Crisis support lines.</h2>
        <p className="lp-section-body">
          Email is not the right channel for mental health emergencies. If you or
          someone you know is in crisis, contact one of these verified helplines
          directly:
        </p>
        <div className="lp-card-grid">
          <div className="lp-card">
            <h3 className="lp-card-title">TeleMANAS</h3>
            <p className="lp-card-body">
              Toll-free · 24/7 · Government of India
            </p>
            <p style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--cyan)", margin: "12px 0 0" }}>
              14416
            </p>
          </div>
          <div className="lp-card">
            <h3 className="lp-card-title">Vandrevala Foundation</h3>
            <p className="lp-card-body">
              24/7 · WhatsApp available
            </p>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--cyan)", margin: "12px 0 0" }}>
              9999 666 555
            </p>
          </div>
          <div className="lp-card">
            <h3 className="lp-card-title">AASRA</h3>
            <p className="lp-card-body">
              24/7
            </p>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--cyan)", margin: "12px 0 0" }}>
              +91-22-2754 6669
            </p>
          </div>
          <div className="lp-card">
            <h3 className="lp-card-title">iCALL</h3>
            <p className="lp-card-body">
              Mon–Sat · 8am–10pm IST
            </p>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--cyan)", margin: "12px 0 0" }}>
              022-2552 1111
            </p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
