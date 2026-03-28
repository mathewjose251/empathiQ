import { AppShell } from "../_components/AppShell";
import { AdminPackModerationConsole } from "../_components/AdminPackModerationConsole";
import {
  MetricGrid,
  PortalCardGrid,
  TimelineStrip,
} from "../_components/Cards";
import { HeroSection } from "../_components/HeroSection";
import {
  getAdminPackConsoleData,
  getAdminPageData,
} from "../_lib/portalApi";

export default async function AdminPage() {
  const [data, packConsole] = await Promise.all([
    getAdminPageData(),
    getAdminPackConsoleData(),
  ]);

  return (
    <AppShell eyebrow="Admin Hub" navItems={data.navItems}>
      <HeroSection
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        lede={data.hero.lede}
      >
        <MetricGrid metrics={data.metrics} />
      </HeroSection>

      <PortalCardGrid cards={data.roleCards} />
      <TimelineStrip
        eyebrow="Admin responsibilities"
        title="Coordinate, don&apos;t intrude"
        items={data.timeline}
      />
      <AdminPackModerationConsole payload={packConsole} />
    </AppShell>
  );
}
