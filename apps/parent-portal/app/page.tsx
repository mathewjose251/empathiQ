import { AppShell } from "./_components/AppShell";
import {
  MetricGrid,
  PanelGrid,
  PortalCardGrid,
  StorySpotlight,
  TimelineStrip,
} from "./_components/Cards";
import { HeroSection } from "./_components/HeroSection";
import { getOverviewPageData } from "./_lib/portalApi";

export default async function HomePage() {
  const data = await getOverviewPageData();

  return (
    <AppShell eyebrow="EmpathiQ Control Surface" navItems={data.navItems}>
      <HeroSection
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        lede={data.hero.lede}
      >
        <StorySpotlight spotlight={data.spotlight} />
        <MetricGrid metrics={data.metrics} />
      </HeroSection>

      <PortalCardGrid cards={data.portals} />
      <PanelGrid panels={data.panels} />
      <TimelineStrip
        eyebrow="Silent AI flow"
        title="From mission choice to mentor insight"
        items={data.timeline}
      />
    </AppShell>
  );
}
