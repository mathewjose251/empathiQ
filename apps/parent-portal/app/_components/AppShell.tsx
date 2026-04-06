import Link from "next/link";
import type { ReactNode } from "react";

import type { NavItem } from "@empathiq/shared/contracts/webPortal";
import { PreviewLogoutButton } from "./PreviewLogoutButton";

interface AppShellProps {
  eyebrow: string;
  navItems: NavItem[];
  children: ReactNode;
  className?: string;
}

export function AppShell({
  eyebrow,
  navItems,
  children,
  className,
}: AppShellProps) {
  return (
    <main className={["shell", className].filter(Boolean).join(" ")}>
      <section className="topbar">
        <div className="eyebrow">{eyebrow}</div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <PreviewLogoutButton />
        </nav>
      </section>

      {children}
    </main>
  );
}
