import { AppShell } from "../_components/AppShell";
import { SignalGrid, TimelineStrip } from "../_components/Cards";
import { HeroSection } from "../_components/HeroSection";
import { MentorPackConsole } from "../_components/PackViews";
import {
  getMentorPackViewData,
  getMentorPageData,
} from "../_lib/portalApi";

export default async function MentorPage() {
  const [data, packView] = await Promise.all([
    getMentorPageData(),
    getMentorPackViewData(),
  ]);

  return (
    <AppShell eyebrow="Mentor UX" navItems={data.navItems}>
      <HeroSection
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        lede={data.hero.lede}
      />
      <SignalGrid metrics={data.metrics} />
      <TimelineStrip
        eyebrow="Mentor interpretation"
        title="Recommended posture"
        items={data.timeline}
      />
      <MentorPackConsole view={packView} />
    </AppShell>
  );
}
