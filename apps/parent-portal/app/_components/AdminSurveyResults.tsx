"use client";

import { useState, useCallback } from "react";
import type { SurveyDashboardData, SurveyResponseRecord, SurveyResponsePage, AggregateItem } from "../_lib/surveyStore";

const PAGE_SIZE = 25;

const AUDIENCE_TABS = [
  { key: "", label: "All" },
  { key: "TEEN", label: "Teen" },
  { key: "TWEEN", label: "Tween" },
  { key: "PARENT", label: "Parent" },
] as const;

function fmt(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

function AudienceBadge({ audience }: { audience: string }) {
  const colors: Record<string, [string, string]> = {
    TEEN:   ["rgba(136,224,255,0.15)", "var(--cyan)"],
    TWEEN:  ["rgba(142,243,207,0.15)", "var(--mint)"],
    PARENT: ["rgba(255,210,143,0.15)", "var(--amber)"],
  };
  const [bg, color] = colors[audience] ?? ["rgba(255,255,255,0.08)", "var(--muted)"];
  return (
    <span style={{ padding: "2px 10px", borderRadius: "999px", fontSize: "0.72rem", fontFamily: "'Trebuchet MS',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", background: bg, color, whiteSpace: "nowrap" }}>
      {audience === "TEEN" ? "Teen" : audience === "TWEEN" ? "Tween" : "Parent"}
    </span>
  );
}

function BarChart({ title, color, items }: { title: string; color: string; items: AggregateItem[] }) {
  if (!items.length) return null;
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: "20px", background: "var(--panel)", padding: "22px 24px" }}>
      <span className="panel-label" style={{ display: "block", marginBottom: "14px" }}>{title}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((item) => (
          <div key={item.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text)" }}>{item.label}</span>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "'Trebuchet MS',sans-serif", fontVariantNumeric: "tabular-nums" }}>
                {item.count.toLocaleString()} · {item.pct}%
              </span>
            </div>
            <div style={{ height: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${item.pct}%`, borderRadius: "999px", background: color, transition: "width 0.4s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpandedRow({ r }: { r: SurveyResponseRecord }) {
  function TagRow({ label, values }: { label: string; values: string[] }) {
    if (!values.length) return null;
    return (
      <div style={{ marginBottom: "10px" }}>
        <span style={{ fontSize: "0.7rem", fontFamily: "'Trebuchet MS',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "5px" }}>{label}</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {values.map((v) => (
            <span key={v} style={{ padding: "2px 10px", borderRadius: "999px", fontSize: "0.78rem", background: "rgba(136,224,255,0.1)", color: "var(--cyan)", border: "1px solid rgba(136,224,255,0.2)" }}>{v}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 20px 20px", borderTop: "1px solid var(--line)", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "16px" }}>
        <TagRow label="Main concerns" values={r.mainConcerns} />
        <TagRow label="Pressure points" values={r.pressurePoints} />
        <TagRow label="Home conflict" values={r.homeConflictThemes} />
        <TagRow label="School conflict" values={r.schoolConflictThemes} />
        <TagRow label="Support needs" values={r.supportNeeds} />
        {r.feelingWords.length > 0 && <TagRow label="Feeling words" values={r.feelingWords} />}
      </div>
      {r.openText && (
        <div style={{ marginTop: "12px", padding: "12px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--line)" }}>
          <span style={{ fontSize: "0.7rem", fontFamily: "'Trebuchet MS',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "6px" }}>Open text</span>
          <p style={{ margin: 0, color: "var(--text)", lineHeight: 1.7, fontSize: "0.9rem" }}>{r.openText}</p>
        </div>
      )}
      <div style={{ marginTop: "10px", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "'Trebuchet MS',sans-serif" }}>
        ID: {r.id} · {r.followUpConsent ? "✓ Open to follow-up" : "No follow-up"}
      </div>
    </div>
  );
}

export function AdminSurveyResults({
  dashboard,
  initialPage,
}: {
  dashboard: SurveyDashboardData;
  initialPage: SurveyResponsePage;
}) {
  const [audience, setAudience] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<SurveyResponsePage>(initialPage);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  const fetchPage = useCallback(async (newPage: number, newAudience: string) => {
    setLoading(true);
    setExpanded(null);
    try {
      const params = new URLSearchParams({ page: String(newPage), pageSize: String(PAGE_SIZE) });
      if (newAudience) params.set("audience", newAudience);
      const res = await fetch(`/api/survey/admin/responses?${params}`);
      const json = (await res.json()) as SurveyResponsePage;
      setData(json);
      setPage(newPage);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleTab(key: string) {
    setAudience(key);
    void fetchPage(0, key);
  }

  function handlePrev() { if (page > 0) void fetchPage(page - 1, audience); }
  function handleNext() { if (page < totalPages - 1) void fetchPage(page + 1, audience); }

  const tabCounts: Record<string, number> = {
    "": dashboard.totalResponses,
    TEEN: dashboard.teenResponses,
    TWEEN: dashboard.tweenResponses,
    PARENT: dashboard.parentResponses,
  };

  // ── Insight grid ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Aggregate charts — 2-col grid */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "20px", margin: "32px 0" }}>
        <BarChart title="Top concerns" color="var(--cyan)"  items={dashboard.topConcerns} />
        <BarChart title="Pressure points" color="var(--rose)" items={dashboard.topPressurePoints} />
        <BarChart title="Home conflict themes" color="var(--amber)" items={dashboard.topHomeConflicts} />
        <BarChart title="School conflict themes" color="var(--mint)" items={dashboard.topSchoolConflicts} />
        <BarChart title="Support needs" color="var(--cyan)" items={dashboard.topSupportNeeds} />
        <BarChart title="Feeling words" color="var(--rose)" items={dashboard.topFeelingWords} />
      </section>

      {/* Response table */}
      <section style={{ border: "1px solid var(--line)", borderRadius: "28px", background: "var(--panel)", overflow: "hidden", marginBottom: "40px" }}>

        {/* Table header */}
        <div style={{ padding: "20px 24px 0", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <div>
              <span className="panel-label">Individual responses</span>
              <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                {data.total.toLocaleString()} total · click any row to expand
              </p>
            </div>
            <span style={{ fontSize: "0.78rem", fontFamily: "'Trebuchet MS',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", color: dashboard.storageMode === "DATABASE" ? "var(--mint)" : "var(--amber)", padding: "4px 12px", borderRadius: "999px", border: `1px solid ${dashboard.storageMode === "DATABASE" ? "rgba(142,243,207,0.3)" : "rgba(255,210,143,0.3)"}` }}>
              {dashboard.storageMode === "DATABASE" ? "PostgreSQL" : "Preview memory"}
            </span>
          </div>

          {/* Audience tabs */}
          <div style={{ display: "flex", gap: "4px" }}>
            {AUDIENCE_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTab(tab.key)}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "10px 10px 0 0",
                  background: audience === tab.key ? "rgba(255,255,255,0.08)" : "transparent",
                  color: audience === tab.key ? "var(--text)" : "var(--muted)",
                  fontFamily: "'Trebuchet MS',sans-serif",
                  fontSize: "0.82rem",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  borderBottom: audience === tab.key ? "2px solid var(--cyan)" : "2px solid transparent",
                }}
              >
                {tab.label}
                <span style={{ marginLeft: "6px", fontSize: "0.72rem", color: "var(--muted)" }}>
                  {tabCounts[tab.key]?.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "160px 80px 80px 1fr 160px 60px", gap: "12px", padding: "10px 24px", borderBottom: "1px solid var(--line)", background: "rgba(255,255,255,0.02)" }}>
          {["Date", "Type", "Age", "Top concerns", "Open text", "F/U"].map((h) => (
            <span key={h} style={{ fontSize: "0.7rem", fontFamily: "'Trebuchet MS',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>Loading…</div>
        ) : data.responses.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>No responses yet.</div>
        ) : (
          data.responses.map((r) => {
            const isOpen = expanded === r.id;
            const ageBand = r.audience === "PARENT" ? (r.teenAgeBand ?? "—") : (r.ageBand ?? "—");
            const topTwo = r.mainConcerns.filter((c) => c !== "None of these" && c !== "Nothing right now" && c !== "We're doing alright").slice(0, 2);
            const snippet = r.openText ? r.openText.slice(0, 72) + (r.openText.length > 72 ? "…" : "") : "—";

            return (
              <div key={r.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <div
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  style={{ display: "grid", gridTemplateColumns: "160px 80px 80px 1fr 160px 60px", gap: "12px", padding: "12px 24px", cursor: "pointer", transition: "background 0.12s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{fmt(r.createdAt)}</span>
                  <AudienceBadge audience={r.audience} />
                  <span style={{ fontSize: "0.82rem", color: "var(--text)" }}>{ageBand}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
                    {topTwo.length > 0
                      ? topTwo.map((c) => (
                          <span key={c} style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "0.72rem", background: "rgba(136,224,255,0.1)", color: "var(--cyan)", border: "1px solid rgba(136,224,255,0.18)" }}>{c}</span>
                        ))
                      : <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>—</span>}
                    {r.mainConcerns.length > 2 && <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>+{r.mainConcerns.length - 2}</span>}
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{snippet}</span>
                  <span style={{ fontSize: "0.8rem", textAlign: "center" }}>{r.followUpConsent ? "✓" : "·"}</span>
                </div>
                {isOpen && <ExpandedRow r={r} />}
              </div>
            );
          })
        )}

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderTop: "1px solid var(--line)" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            {data.total > 0
              ? `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, data.total)} of ${data.total.toLocaleString()}`
              : "No results"}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" onClick={handlePrev} disabled={page === 0 || loading}
              style={{ padding: "7px 16px", borderRadius: "999px", border: "1px solid var(--line)", background: "transparent", color: page === 0 ? "var(--muted)" : "var(--text)", cursor: page === 0 ? "not-allowed" : "pointer", fontFamily: "'Trebuchet MS',sans-serif", fontSize: "0.8rem" }}>
              ← Prev
            </button>
            <span style={{ padding: "7px 14px", fontSize: "0.82rem", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
              {page + 1} / {totalPages}
            </span>
            <button type="button" onClick={handleNext} disabled={page >= totalPages - 1 || loading}
              style={{ padding: "7px 16px", borderRadius: "999px", border: "1px solid var(--line)", background: "transparent", color: page >= totalPages - 1 ? "var(--muted)" : "var(--text)", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontFamily: "'Trebuchet MS',sans-serif", fontSize: "0.8rem" }}>
              Next →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
