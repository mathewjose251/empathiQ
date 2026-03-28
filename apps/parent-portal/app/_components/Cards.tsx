import Link from "next/link";

import type {
  SpotlightContent,
  MetricData,
  PanelData,
  PortalCardData,
  TimelineItem,
} from "../../../../packages/shared/src/contracts/webPortal";

export function PortalCardGrid({ cards }: { cards: PortalCardData[] }) {
  return (
    <section className="portal-grid">
      {cards.map((card) => (
        <Link
          className={`portal-card${card.accent ? ` portal-card-${card.accent}` : ""}`}
          href={card.href}
          key={card.href}
        >
          <span className="panel-label">{card.label}</span>
          <h3>{card.title}</h3>
          <p>{card.detail}</p>
          <span className="portal-action">Open view</span>
        </Link>
      ))}
    </section>
  );
}

export function MetricGrid({ metrics }: { metrics: MetricData[] }) {
  return (
    <section className="admin-stat-grid">
      {metrics.map((metric) => (
        <article className="mini-stat" key={metric.label}>
          <span className="panel-label">{metric.label}</span>
          <strong>{metric.value}</strong>
          {metric.detail ? <p>{metric.detail}</p> : null}
        </article>
      ))}
    </section>
  );
}

export function PanelGrid({ panels }: { panels: PanelData[] }) {
  return (
    <section className="panel-grid">
      {panels.map((panel) => (
        <article className="panel" key={panel.label}>
          <span className="panel-label">{panel.label}</span>
          <h3>{panel.title}</h3>
          <p>{panel.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function TimelineStrip({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: TimelineItem[];
}) {
  return (
    <section className="system-strip">
      <div>
        <span className="panel-label">{eyebrow}</span>
        <h3>{title}</h3>
      </div>
      <ol>
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ol>
    </section>
  );
}

export function StorySpotlight({ spotlight }: { spotlight: SpotlightContent }) {
  return (
    <div className="hero-grid">
      <article className="story-card">
        <span className="chip">{spotlight.chip}</span>
        <h2>{spotlight.title}</h2>
        <p>{spotlight.detail}</p>
      </article>

      <article className="dial-card">
        <div className="dial-ring">
          <div className="dial-core">
            <strong>{spotlight.dialValue}</strong>
            <span>{spotlight.dialLabel}</span>
          </div>
        </div>
      </article>
    </div>
  );
}

export function SignalGrid({ metrics }: { metrics: MetricData[] }) {
  return (
    <section className="mentor-grid">
      {metrics.map((metric) => (
        <article className="signal-card" key={metric.label}>
          <span className="panel-label">{metric.label}</span>
          <strong>{metric.value}</strong>
          <p>{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function TeenStage({
  story,
  choices,
  reflectionPrompt,
  packFeed,
}: {
  story: SpotlightContent;
  choices: PanelData[];
  reflectionPrompt: string;
  packFeed: Array<{
    id: string;
    alias: string;
    mood: string;
    text: string;
  }>;
}) {
  return (
    <>
      <section className="teen-stage teen-stage-main">
        <article className="mission-scene">
          <div className="mission-scene-glow" />
          <div className="mission-meta">
            <span className="chip">{story.chip}</span>
            <span className="story-beat">03 minutes · Night signal</span>
          </div>
          <h2>{story.title}</h2>
          <p>{story.detail}</p>
          <div className="sense-row">
            <span className="sense-pill">Pause</span>
            <span className="sense-pill">Feet on floor</span>
            <span className="sense-pill">Name 3 sounds</span>
          </div>
        </article>

        <div className="choice-stack">
          {choices.map((choice, index) => (
            <article className={`choice-card choice-card-${index + 1}`} key={choice.label}>
              <div className="choice-head">
                <span className="panel-label">{choice.label}</span>
                <span className="choice-badge">
                  {index === 0 ? "Grounded path" : "Trap path"}
                </span>
              </div>
              <h3>{choice.title}</h3>
              <p>{choice.detail}</p>
              <div className="choice-footer">
                <span>{index === 0 ? "Narrative opens" : "Pressure spikes"}</span>
                <span>Send tag</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="teen-stage teen-stage-secondary">
        <article className="reflection-card">
          <div className="reflection-top">
            <span className="panel-label">Anonymous reflection</span>
            <span className="reflection-state">Pack-safe</span>
          </div>
          <h3>Share the thought under the thought.</h3>
          <p>{reflectionPrompt}</p>
          <div className="mock-textarea">
            <p>
              I could feel my mind trying to make one test mean everything. Slowing
              down made the situation feel smaller and more workable.
            </p>
          </div>
          <div className="reflection-actions">
            <button className="primary-action" type="button">Post to Pack</button>
            <span className="ghost-note">Identity hidden, feeling visible</span>
          </div>
        </article>

        <article className="feed-card">
          <div className="reflection-top">
            <span className="panel-label">Pack feed</span>
            <span className="reflection-state">3 recent echoes</span>
          </div>
          <div className="feed-stack">
            {packFeed.map((item) => (
              <div className="feed-item" key={item.id}>
                <div className="feed-head">
                  <strong>{item.alias}</strong>
                  <span>{item.mood}</span>
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
