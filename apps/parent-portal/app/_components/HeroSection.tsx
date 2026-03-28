import type { ReactNode } from "react";

interface HeroSectionProps {
  eyebrow: string;
  title: string;
  lede: string;
  children?: ReactNode;
}

export function HeroSection({
  eyebrow,
  title,
  lede,
  children,
}: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
      {children}
    </section>
  );
}
