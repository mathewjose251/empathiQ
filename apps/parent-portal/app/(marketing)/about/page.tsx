import Link from "next/link";
import { MarketingNav, MarketingFooter } from "../_components/MarketingNav";

export const metadata = {
  title: "About EmpathiQ — Psychoeducation for the generation that grew up online",
  description:
    "EmpathiQ is a psychoeducation platform for teenagers built on REBT principles, designed to teach emotional literacy without surveillance or clinical gatekeeping.",
};

export default function AboutPage() {
  return (
    <div className="lp-page">
      <MarketingNav />

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-eyebrow">About</div>
        <h1 className="lp-hero-title">
          Emotional literacy for the generation that grew up online.
        </h1>
        <p className="lp-hero-lede">
          EmpathiQ is a psychoeducation platform built on REBT (Rational Emotive
          Behaviour Therapy) principles. We believe that teenagers who understand
          their own thinking patterns — not just manage their moods — build
          resilience that lasts.
        </p>
      </section>

      {/* ── Mission ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">Our mission</div>
        <h2 className="lp-section-title">Teach the pattern. Change the reaction.</h2>
        <p className="lp-section-body">
          Most mental health apps for teens are symptom managers. They help you
          breathe when you&apos;re anxious, but they don&apos;t help you understand
          why the anxiety started in the first place. EmpathiQ is built on a
          different premise: if you know that your 3am spiral is &quot;catastrophising&quot;
          — an identifiable, named pattern with identifiable triggers — you can
          interrupt it earlier. Not because an app told you to breathe, but because
          you understand what&apos;s happening.
        </p>
      </section>

      {/* ── Principles ── */}
      <section className="lp-section">
        <div className="lp-section-eyebrow">How we build</div>
        <h2 className="lp-section-title">Five things we believe.</h2>
        <div className="lp-card-grid">
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🔒</span>
            <h3 className="lp-card-title">Privacy is the product</h3>
            <p className="lp-card-body">
              We don&apos;t give parents, schools, or mentors access to teen
              content. Not because we forgot to build it — because we deliberately
              didn&apos;t. Privacy isn&apos;t a feature. It&apos;s the foundation.
            </p>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🎯</span>
            <h3 className="lp-card-title">Understanding over coping</h3>
            <p className="lp-card-body">
              Coping skills treat the symptom. Pattern recognition treats the
              cause. REBT has 60 years of evidence behind it. We&apos;re not
              reinventing therapy — we&apos;re making its core insight accessible to
              13-year-olds.
            </p>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🏡</span>
            <h3 className="lp-card-title">Family systems matter</h3>
            <p className="lp-card-body">
              A teen&apos;s emotional patterns don&apos;t exist in isolation from
              their family. EmpathiQ involves parents in a bounded way — enough to
              support, not enough to surveil.
            </p>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🌐</span>
            <h3 className="lp-card-title">India-first, not India-adapted</h3>
            <p className="lp-card-body">
              EmpathiQ is built for Indian teens — with scenarios drawn from Indian
              family dynamics, academic pressure systems, and social contexts.
              Not adapted from Western models. Built here.
            </p>
          </div>
          <div className="lp-card lp-card-cyan">
            <span className="lp-card-icon">🤝</span>
            <h3 className="lp-card-title">Transparent about limits</h3>
            <p className="lp-card-body">
              We&apos;re a psychoeducation app. We are not a therapy service. We
              will always say when a user needs something we can&apos;t provide —
              and point them to something real.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="lp-cta-block">
        <h2 className="lp-cta-title">Who are you here for?</h2>
        <p className="lp-cta-body">
          EmpathiQ works for teens, parents, counsellors, and schools. Find the
          right place to start.
        </p>
        <div className="lp-cta-actions">
          <Link href="/for-teens" className="lp-btn-primary">Teens</Link>
          <Link href="/for-parents" className="lp-btn-secondary">Parents</Link>
          <Link href="/for-mentors" className="lp-btn-secondary">Mentors</Link>
          <Link href="/for-schools" className="lp-btn-secondary">Schools</Link>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
