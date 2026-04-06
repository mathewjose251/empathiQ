import type { SurveyDashboardData } from "../_lib/surveyStore";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function SurveyTagList({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  if (!values.length) {
    return null;
  }

  return (
    <div className="survey-tag-group">
      <span>{label}</span>
      <div className="survey-tag-row">
        {values.map((value) => (
          <span className="survey-tag" key={`${label}-${value}`}>
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdminSurveyResults({
  dashboard,
}: {
  dashboard: SurveyDashboardData;
}) {
  function audienceLabel(audience: "TEEN" | "TWEEN" | "PARENT") {
    if (audience === "TEEN") return "Teen";
    if (audience === "TWEEN") return "Tween";
    return "Parent";
  }

  return (
    <>
      <section className="survey-insight-grid">
        <article className="panel">
          <span className="panel-label">Top concerns</span>
          <h3>What families, tweens, and teens name first</h3>
          <div className="survey-insight-list">
            {dashboard.topConcerns.length ? (
              dashboard.topConcerns.map((item) => (
                <div className="survey-insight-row" key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.count}</span>
                </div>
              ))
            ) : (
              <p>No concern data yet.</p>
            )}
          </div>
        </article>

        <article className="panel">
          <span className="panel-label">Home conflict</span>
          <h3>What is happening inside the house</h3>
          <div className="survey-insight-list">
            {dashboard.topHomeConflicts.length ? (
              dashboard.topHomeConflicts.map((item) => (
                <div className="survey-insight-row" key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.count}</span>
                </div>
              ))
            ) : (
              <p>No home-conflict signals yet.</p>
            )}
          </div>
        </article>

        <article className="panel">
          <span className="panel-label">School friction</span>
          <h3>What is breaking trust around teachers</h3>
          <div className="survey-insight-list">
            {dashboard.topSchoolConflicts.length ? (
              dashboard.topSchoolConflicts.map((item) => (
                <div className="survey-insight-row" key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.count}</span>
                </div>
              ))
            ) : (
              <p>No school-conflict signals yet.</p>
            )}
          </div>
        </article>
      </section>

      <section className="survey-results-list">
        <div className="survey-results-head">
          <div>
            <span className="panel-label">Responses</span>
            <h3>Latest tween, teen, and parent survey submissions</h3>
          </div>
          <span className="survey-storage-state">
            {dashboard.storageMode === "DATABASE"
              ? "Persisting to PostgreSQL"
              : "Preview memory only"}
          </span>
        </div>

        {dashboard.responses.length ? (
          <div className="survey-results-grid">
            {dashboard.responses.map((response) => (
              <article className="survey-response-card" key={response.id}>
                <div className="survey-response-head">
                  <div>
                    <span className="chip">
                      {audienceLabel(response.audience)}
                    </span>
                    <h4>{response.respondentLabel}</h4>
                  </div>
                  <div className="survey-response-meta">
                    <span>{formatTimestamp(response.createdAt)}</span>
                    <span>{response.identityMode}</span>
                  </div>
                </div>

                <div className="survey-response-body">
                  <p className="survey-response-summary">
                    {response.audience === "PARENT"
                      ? `Teen age band: ${response.teenAgeBand || "Unknown"} · ${response.householdContext || "Household context not entered"}`
                      : response.audience === "TWEEN"
                        ? `Tween age band: ${response.ageBand || "Unknown"}`
                        : `Age band: ${response.ageBand || "Unknown"}`}
                  </p>

                  <SurveyTagList label="Main concerns" values={response.mainConcerns} />
                  <SurveyTagList label="Pressure points" values={response.pressurePoints} />
                  <SurveyTagList label="Home conflict" values={response.homeConflictThemes} />
                  <SurveyTagList label="School conflict" values={response.schoolConflictThemes} />
                  <SurveyTagList label="Support needs" values={response.supportNeeds} />
                  <SurveyTagList label="Feeling words" values={response.feelingWords} />

                  {response.openText ? (
                    <div className="survey-open-text">
                      <span>Open text</span>
                      <p>{response.openText}</p>
                    </div>
                  ) : null}
                </div>

                <div className="survey-response-foot">
                  <span>Response id: {response.id}</span>
                  <span>
                    {response.followUpConsent
                      ? "Open to follow-up"
                      : "No follow-up requested"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel">
            <span className="panel-label">No responses yet</span>
            <h3>The survey inbox is empty</h3>
            <p>
              Open the public tween, teen, or parent survey links and submit a response.
              This admin page will start filling immediately, even in preview mode.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
