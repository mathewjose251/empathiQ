import { AppShell } from "../../_components/AppShell";
import { AdminSurveyResults } from "../../_components/AdminSurveyResults";
import { HeroSection } from "../../_components/HeroSection";
import { MetricGrid } from "../../_components/Cards";
import { getAdminPayload } from "../../_data/portalData";
import { getSurveyDashboardData, getSurveyResponsePage } from "../../_lib/surveyStore";

export const dynamic = "force-dynamic";

export default async function AdminSurveyPage() {
  const [adminData, dashboard, initialPage] = await Promise.all([
    getAdminPayload(),
    getSurveyDashboardData(),
    getSurveyResponsePage(0, 25),
  ]);

  return (
    <AppShell eyebrow="Survey Admin" navItems={adminData.navItems}>
      <HeroSection
        eyebrow="Survey Insights"
        title="What families are telling us"
        lede="Aggregated signals from teen, tween, and parent surveys. Each bar shows what percentage of all respondents selected that option. Use the table below to drill into individual responses."
      >
        <MetricGrid
          metrics={[
            { label: "Total responses", value: dashboard.totalResponses.toLocaleString(), detail: "All audiences combined" },
            { label: "Teen", value: dashboard.teenResponses.toLocaleString(), detail: "Direct signals from teens" },
            { label: "Tween", value: dashboard.tweenResponses.toLocaleString(), detail: "Ages 10–13 check-ins" },
            { label: "Parent", value: dashboard.parentResponses.toLocaleString(), detail: "Family-side context" },
            { label: "Follow-up consent", value: dashboard.followUpConsentCount.toLocaleString(), detail: `${dashboard.totalResponses > 0 ? Math.round((dashboard.followUpConsentCount / dashboard.totalResponses) * 100) : 0}% of respondents` },
            { label: "Storage", value: dashboard.storageMode, detail: dashboard.storageMode === "DATABASE" ? "Persisting to PostgreSQL" : "Preview memory — restarts clear data" },
          ]}
        />
      </HeroSection>

      <AdminSurveyResults dashboard={dashboard} initialPage={initialPage} />
    </AppShell>
  );
}
