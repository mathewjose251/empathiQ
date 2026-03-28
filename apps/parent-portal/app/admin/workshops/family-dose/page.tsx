import { AdminWorkshopPlanner } from "../../../_components/AdminWorkshopPlanner";
import { AppShell } from "../../../_components/AppShell";
import { MetricGrid } from "../../../_components/Cards";
import { HeroSection } from "../../../_components/HeroSection";
import { getDoseWorkshopPageData } from "../../../_lib/portalApi";

export default async function FamilyDoseWorkshopPage() {
  const data = await getDoseWorkshopPageData();

  return (
    <AppShell
      eyebrow="Workshop Ops"
      navItems={data.navItems}
      className="workshop-theme-shell"
    >
      <HeroSection
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        lede={data.hero.lede}
      >
        <MetricGrid metrics={data.metrics} />
      </HeroSection>

      <AdminWorkshopPlanner payload={data} />
    </AppShell>
  );
}
