"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/teen", icon: "\u{1F3E0}", label: "Home" },
  { href: "/teen/stories", icon: "\u{1F4D6}", label: "Stories" },
  { href: "/teen/pack", icon: "\u{1F465}", label: "Pack" },
  { href: "/teen/me", icon: "\u{1F331}", label: "Me" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="teen-nav">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/teen"
            ? pathname === "/teen"
            : pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`teen-nav-item ${isActive ? "active" : ""}`}
          >
            <span className="teen-nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
