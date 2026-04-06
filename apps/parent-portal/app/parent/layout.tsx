import Link from "next/link";
import type { ReactNode } from "react";

import { PreviewLogoutButton } from "../_components/PreviewLogoutButton";

const PARENT_NAV = [
  { href: "/parent", label: "Home", emoji: "🏠" },
  { href: "/parent/insights", label: "Insights", emoji: "📊" },
  { href: "/parent/learn", label: "Learn", emoji: "💡" },
  { href: "/parent/moments", label: "Moments", emoji: "🤝" },
  { href: "/parent/survey", label: "Survey", emoji: "📝" },
];

const ECOSYSTEM_NAV = [
  { href: "/", label: "Overview" },
  { href: "/admin", label: "Admin" },
  { href: "/mentor", label: "Mentor" },
  { href: "/teen-preview", label: "Teen" },
];

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <main className="parent-shell">
      <header className="parent-topbar">
        <div className="parent-topbar-left">
          <span className="parent-brand">EmpathiQ</span>
          <span className="parent-brand-tag">Parent Dashboard</span>
        </div>
        <nav className="parent-topbar-right">
          {ECOSYSTEM_NAV.map((item) => (
            <Link className="parent-eco-link" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <PreviewLogoutButton />
        </nav>
      </header>

      <div className="parent-layout">
        <aside className="parent-sidebar">
          <nav className="parent-sidebar-nav">
            {PARENT_NAV.map((item) => (
              <Link className="parent-nav-item" href={item.href} key={item.href}>
                <span className="parent-nav-emoji">{item.emoji}</span>
                <span className="parent-nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="parent-sidebar-footer">
            <div className="parent-privacy-badge">
              <span className="parent-privacy-icon">🔒</span>
              <div>
                <strong>Privacy-first</strong>
                <p>Your teen controls what you see. Raw reflections stay private.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="parent-content">{children}</section>
      </div>
    </main>
  );
}
