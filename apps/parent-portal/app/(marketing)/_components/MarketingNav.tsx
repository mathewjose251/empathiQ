import Link from "next/link";

interface MarketingNavProps {
  activePillar?: "teens" | "parents" | "mentors" | "schools";
}

export function MarketingNav({ activePillar }: MarketingNavProps) {
  return (
    <nav className="lp-topnav">
      <Link href="/" className="lp-wordmark">
        EmpathiQ
      </Link>
      <div className="lp-nav-links">
        <Link
          href="/for-teens"
          className={`lp-nav-link${activePillar === "teens" ? " active" : ""}`}
        >
          For Teens
        </Link>
        <Link
          href="/for-parents"
          className={`lp-nav-link${activePillar === "parents" ? " active" : ""}`}
        >
          For Parents
        </Link>
        <Link
          href="/for-mentors"
          className={`lp-nav-link${activePillar === "mentors" ? " active" : ""}`}
        >
          For Mentors
        </Link>
        <Link
          href="/for-schools"
          className={`lp-nav-link${activePillar === "schools" ? " active" : ""}`}
        >
          For Schools
        </Link>
        <Link href="/login" className="lp-nav-cta">
          Sign in
        </Link>
      </div>
    </nav>
  );
}

export function MarketingFooter() {
  return (
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
        EmpathiQ is a psychoeducation platform, not a therapy service. If you or
        someone you know is in crisis, call TeleMANAS: 14416 (toll-free, 24/7).
      </p>
    </footer>
  );
}
