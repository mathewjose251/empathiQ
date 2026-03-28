import type {
  MentorPackViewPayload,
  ParentPackDigestPayload,
} from "../../../../packages/shared/src/contracts/pack";

export function ParentPackDigestView({
  digest,
}: {
  digest: ParentPackDigestPayload;
}) {
  return (
    <>
      <section className="digest-banner">
        <span className="panel-label">Pack privacy boundary</span>
        <p>{digest.privacyBoundaryNotice}</p>
      </section>

      <section className="panel-grid">
        {digest.themeCards.map((card) => (
          <article className="panel" key={card.label}>
            <span className="panel-label">{card.label}</span>
            <h3>{card.direction}</h3>
            <p>{card.insight}</p>
          </article>
        ))}
      </section>

      <section className="system-strip">
        <div>
          <span className="panel-label">Recent Pack signals</span>
          <h3>What is safe to surface at home</h3>
        </div>
        <ol>
          {digest.recentSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ol>
      </section>

      <section className="digest-banner">
        <span className="panel-label">Mentor note</span>
        <p>{digest.staffNote}</p>
      </section>
    </>
  );
}

export function MentorPackConsole({
  view,
}: {
  view: MentorPackViewPayload;
}) {
  return (
    <>
      <section className="digest-banner">
        <span className="panel-label">Redaction boundary</span>
        <p>{view.redactionNotice}</p>
      </section>

      <section className="mentor-pack-grid">
        <article className="panel">
          <span className="panel-label">Theme counts</span>
          <div className="pack-list">
            {view.themeCounts.map((item) => (
              <div className="pack-row" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <span className="panel-label">Moderation queue</span>
          <div className="pack-list">
            {view.moderationCounts.map((item) => (
              <div className="pack-row" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="flagged-board">
        <div className="flagged-board-head">
          <span className="panel-label">Flagged Pack items</span>
          <h3>Redacted review queue</h3>
        </div>

        <div className="flagged-grid">
          {view.flaggedPosts.map((post) => (
            <article className="flagged-card" key={post.id}>
              <div className="feed-head">
                <strong>{post.thinkingTrapTag}</strong>
                <span>{post.moderationStatus}</span>
              </div>
              <p>{post.redactedExcerpt}</p>
              <div className="reaction-row">
                {post.safetyFlags.map((flag) => (
                  <span className="reaction-chip" key={`${post.id}-${flag}`}>
                    {flag.replaceAll("_", " ")}
                  </span>
                ))}
                {typeof post.reportCount === "number" ? (
                  <span className="reaction-chip">Reports · {post.reportCount}</span>
                ) : null}
              </div>
              <span className="ghost-note">{post.createdLabel}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="system-strip">
        <div>
          <span className="panel-label">Mentor actions</span>
          <h3>What to do next</h3>
        </div>
        <ol>
          {view.coachActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
