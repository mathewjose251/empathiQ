import { AppShell } from "../_components/AppShell";
import { PanelGrid } from "../_components/Cards";
import { HeroSection } from "../_components/HeroSection";
import { ParentPackDigestView } from "../_components/PackViews";
import {
  getParentPackDigestData,
  getParentPageData,
} from "../_lib/portalApi";

export default async function ParentPage() {
  const [data, packDigest] = await Promise.all([
    getParentPageData(),
    getParentPackDigestData(),
  ]);

  return (
    <AppShell eyebrow="Parent UX" navItems={data.navItems}>
      <HeroSection
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        lede={data.hero.lede}
      />
      <PanelGrid panels={data.panels} />
      <ParentPackDigestView digest={packDigest} />
    </AppShell>
  );
}
