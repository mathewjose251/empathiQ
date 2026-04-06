import { TweenSurveyForm } from "../../_components/TweenSurveyForm";

const navItems = [
  { href: "/tween/survey", label: "Tween Survey" },
  { href: "/teen/survey", label: "Teen Survey" },
  { href: "/parent/survey", label: "Parent Survey" },
];

export default function TweenSurveyPage() {
  return (
    <main className="shell">
      <section className="topbar">
        <div className="eyebrow">Tween Survey</div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </section>

      <TweenSurveyForm />
    </main>
  );
}
