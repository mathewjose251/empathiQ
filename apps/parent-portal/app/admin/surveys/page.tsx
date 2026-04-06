import { AppShell } from "../../_components/AppShell";
import { AdminSurveyResults } from "../../_components/AdminSurveyResults";
import { HeroSection } from "../../_components/HeroSection";
import { MetricGrid } from "../../_components/Cards";
import { getAdminPayload } from "../../_data/portalData";
import { getSurveyDashboardData } from "../../_lib/surveyStore";

export const dynamic = "force-dynamic";

export default async function AdminSurveyPage() {
  const [adminData, dashboard] = await Promise.all([
    getAdminPayload(),
    getSurveyDashboardData(),
  ]);

  return (
    <AppShell eyebrow="Survey Admin" navItems={adminData.navItems}>
      <HeroSection
        eyebrow="Survey Inbox"
        title="Read what tweens, teens, and parents are actually saying."
        lede="This page gives you the current survey flow in one place: how many responses came in, where the conflicts cluster, and whether the data is still in preview memory or already persisting in PostgreSQL."
      >
        <MetricGrid
          metrics={[
            {
              label: "Total responses",
              value: `${dashboard.totalResponses}`,
              detail: "Combined teen and parent submissions",
            },
            {
              label: "Tween responses",
              value: `${dashboard.tweenResponses}`,
              detail: "Gentler age-fit check-ins for 10 to 12",
            },
            {
              label: "Teen responses",
              value: `${dashboard.teenResponses}`,
              detail: "Direct signals from the teen intake form",
            },
            {
              label: "Parent responses",
              value: `${dashboard.parentResponses}`,
              detail: "Family-side context and conflict patterns",
            },
            {
              label: "Storage mode",
              value: dashboard.storageMode,
              detail:
                dashboard.storageMode === "DATABASE"
                  ? "Responses survive redeploys and restarts"
                  : "Responses reset when the server restarts",
            },
          ]}
        />
      </HeroSection>

      <AdminSurveyResults dashboard={dashboard} />
    </AppShell>
  );
}
