import { ParentSurveyForm } from "../../_components/ParentSurveyForm";
import { AppShell } from "../../_components/AppShell";

const navItems = [
  { href: "/parent", label: "Parent Home" },
  { href: "/parent/survey", label: "Parent Survey" },
  { href: "/tween/survey", label: "Tween Survey" },
  { href: "/admin", label: "Admin" },
];

export default function ParentSurveyPage() {
  return (
    <AppShell eyebrow="Parent Survey" navItems={navItems}>
      <ParentSurveyForm />
    </AppShell>
  );
}
