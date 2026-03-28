import { AppShell } from "../_components/AppShell";
import { TimelineStrip } from "../_components/Cards";
import { HeroSection } from "../_components/HeroSection";
import { TeenMissionExperience } from "../_components/TeenMissionExperience";
import {
  getTeenPackFeedData,
  getTeenPreviewPageData,
} from "../_lib/portalApi";

export default async function TeenPreviewPage() {
  const [data, feed] = await Promise.all([
    getTeenPreviewPageData(),
    getTeenPackFeedData(),
  ]);

  return (
    <AppShell eyebrow="Teen Preview" navItems={data.navItems}>
      <HeroSection
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        lede={data.hero.lede}
      />
      <TeenMissionExperience
        story={data.story}
        choices={data.choices}
        reflectionPrompt={data.reflectionPrompt}
        feed={feed}
      />
      <TimelineStrip
        eyebrow="Anonymous reflection"
        title="Pack-safe posting flow"
        items={data.timeline}
      />
    </AppShell>
  );
}
