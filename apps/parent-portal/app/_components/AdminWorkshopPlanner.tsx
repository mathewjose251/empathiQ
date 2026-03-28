import type { WorkshopPagePayload } from "../../../../packages/shared/src/contracts/workshops";

function accentClass(accent?: "cyan" | "mint" | "amber") {
  return accent ? ` workshop-module-${accent}` : "";
}

function toneClass(signals: string[]) {
  if (signals.some((signal) => signal.includes("Oxytocin"))) {
    return " workshop-session-tone-oxytocin";
  }

  if (signals.some((signal) => signal.includes("Serotonin"))) {
    return " workshop-session-tone-serotonin";
  }

  if (signals.some((signal) => signal.includes("Dopamine"))) {
    return " workshop-session-tone-dopamine";
  }

  if (signals.some((signal) => signal.includes("Endorphins"))) {
    return " workshop-session-tone-endorphins";
  }

  return " workshop-session-tone-digital";
}

function pillClass(signal: string) {
  if (signal.includes("Oxytocin")) {
    return " signal-pill-oxytocin";
  }

  if (signal.includes("Serotonin")) {
    return " signal-pill-serotonin";
  }

  if (signal.includes("Dopamine")) {
    return " signal-pill-dopamine";
  }

  if (signal.includes("Endorphins")) {
    return " signal-pill-endorphins";
  }

  return " signal-pill-digital";
}

export function AdminWorkshopPlanner({
  payload,
}: {
  payload: WorkshopPagePayload;
}) {
  const legend = [
    {
      label: "D",
      title: "Dopamine",
      note: "Effort, discovery, and finishing something real.",
      className: "dose-legend-dopamine",
    },
    {
      label: "O",
      title: "Oxytocin",
      note: "Eye contact, vulnerability, and safe connection.",
      className: "dose-legend-oxytocin",
    },
    {
      label: "S",
      title: "Serotonin",
      note: "Confidence, sunlight, contribution, and steadiness.",
      className: "dose-legend-serotonin",
    },
    {
      label: "E",
      title: "Endorphins",
      note: "Movement, laughter, and body-based energy.",
      className: "dose-legend-endorphins",
    },
    {
      label: "DX",
      title: "Digital reset",
      note: "Where screens, sleep, and family friction get renegotiated.",
      className: "dose-legend-digital",
    },
  ];

  return (
    <>
      <section className="dose-legend-strip">
        {legend.map((item) => (
          <article className={`dose-legend-card ${item.className}`} key={item.title}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </section>

      <section className="workshop-launch-grid">
        <article className="workshop-card">
          <div className="workshop-card-head">
            <span className="panel-label">Workshop setup</span>
            <span className="workshop-kicker">Admin planning sheet</span>
          </div>
          <h2>Launch the next cohort with real guardrails.</h2>
          <p className="workshop-intro">
            The page is designed as a true admin operating module: cohort shape,
            safety posture, programme enrichments, and the roadmap for what we
            should build next in the platform.
          </p>
          <div className="workshop-field-grid">
            {payload.setup.map((field) => (
              <article className="workshop-field" key={field.label}>
                <span className="panel-label">{field.label}</span>
                <strong>{field.value}</strong>
                {field.helper ? <p>{field.helper}</p> : null}
              </article>
            ))}
          </div>
        </article>

        <article className="workshop-card">
          <div className="workshop-card-head">
            <span className="panel-label">Safety and privacy</span>
            <span className="workshop-kicker">Non-negotiables</span>
          </div>
          <h2>Protect trust before we chase impact.</h2>
          <p className="workshop-intro">
            This workshop sits inside the EmpathiQ system, so it must keep the
            same privacy-first and support-first posture as the rest of the
            product.
          </p>
          <div className="workshop-field-grid">
            {payload.safeguards.map((field) => (
              <article className="workshop-field" key={field.label}>
                <span className="panel-label">{field.label}</span>
                <strong>{field.value}</strong>
                {field.helper ? <p>{field.helper}</p> : null}
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="workshop-module-grid">
        {payload.modules.map((module) => (
          <article
            className={`workshop-module-card${accentClass(module.accent)}`}
            key={module.title}
          >
            <span className="panel-label">{module.label}</span>
            <h3>{module.title}</h3>
            <p>{module.detail}</p>
            <ul className="workshop-list">
              {module.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="workshop-roadmap-board">
        <div className="workshop-section-head">
          <span className="panel-label">Roadmap</span>
          <h2>What we should build next around the workshop.</h2>
          <p>
            The workshop itself is only the visible part. The real advantage is
            the system that surrounds it before, during, and after delivery.
          </p>
        </div>

        <div className="roadmap-grid">
          {payload.roadmap.map((phase) => (
            <article className="roadmap-card" key={phase.id}>
              <div className="workshop-card-head">
                <span className="panel-label">{phase.label}</span>
                <span className="workshop-kicker">Next build slice</span>
              </div>
              <h3>{phase.title}</h3>
              <p>{phase.detail}</p>
              <ul className="workshop-list">
                {phase.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="workshop-day-stack">
        {payload.days.map((day, index) => (
          <article className={`workshop-day workshop-day-${index + 1}`} key={day.id}>
            <div className="workshop-day-head">
              <div>
                <span className="panel-label">{day.label}</span>
                <h2>{day.title}</h2>
              </div>
              <p>{day.summary}</p>
            </div>

            <div className="workshop-session-grid">
              {day.sessions.map((session) => (
                <article
                  className={`workshop-session-card${toneClass(session.signals)}`}
                  key={session.id}
                >
                  <div className="workshop-session-top">
                    <div>
                      <span className="panel-label">
                        {session.startTime} · {session.duration}
                      </span>
                      <h3>{session.title}</h3>
                    </div>
                    <span className="workshop-kicker">{session.tagline}</span>
                  </div>

                  <div className="signal-row">
                    {session.signals.map((signal) => (
                      <span className={`signal-pill${pillClass(signal)}`} key={signal}>
                        {signal}
                      </span>
                    ))}
                  </div>

                  <div className="session-detail-grid">
                    <section>
                      <span className="panel-label">Core flow</span>
                      <ul className="workshop-list">
                        {session.flow.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <span className="panel-label">EmpathiQ enrichments</span>
                      <ul className="workshop-list">
                        {session.enrichments.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <span className="panel-label">Admin outputs</span>
                      <ul className="workshop-list">
                        {session.adminOutputs.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </article>
              ))}
            </div>

            <div className="workshop-checkpoint">
              <span className="panel-label">Checkpoint</span>
              <p>{day.checkpoint}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="workshop-followthrough-board">
        <div className="workshop-section-head">
          <span className="panel-label">30-day follow-through</span>
          <h2>Turn the weekend into a real family workflow.</h2>
          <p>
            This is the piece that most workshop programmes lose. We keep the
            family moving with small next steps and role-based ownership.
          </p>
        </div>

        <div className="followthrough-grid">
          {payload.followThrough.map((item) => (
            <article className="followthrough-card" key={item.title}>
              <span className="panel-label">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <strong>{item.owner}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="workshop-checklist-card">
        <div className="workshop-section-head">
          <span className="panel-label">Admin checklist</span>
          <h2>What must stay true as we productize this.</h2>
        </div>
        <ul className="workshop-list">
          {payload.adminChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
