"use client";

import { useState } from "react";
import Link from "next/link";
export default function SafetyPage() {
  const [isCrisisMode, setIsCrisisMode] = useState(false);

  // Determine mode: crisis if explicitly activated, amber otherwise
  const mode = isCrisisMode ? "crisis" : "amber";

  return (
    <div className="teen-page teen-fade-in">
      {mode === "amber" ? (
        /* AMBER MODE */
        <>
          <div className="teen-text-center teen-mb-16">
            <div style={{ fontSize: "2.5rem" }} className="teen-mb-8">💛</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }} className="teen-mb-4">We want to make sure you&apos;re okay</h1>
            <p className="teen-text-muted teen-text-small">
              We've noticed you've been feeling low lately. That's okay—many people go through this. You're not alone.
            </p>
          </div>

          <div className="teen-card teen-mb-12 teen-text-center">
            <p className="teen-text-small teen-text-muted teen-mb-8">
              When you're struggling, reaching out is a sign of strength. Choose what feels right for you right now.
            </p>
          </div>

          {/* Option buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="teen-mb-16">
            <Link href="/teen">
              <button className="teen-btn teen-btn-outline">💬 Talk to my mentor</button>
            </Link>

            <a href="tel:14416">
              <button className="teen-btn teen-btn-outline">☎️ TeleMANAS: 14416</button>
            </a>

            <Link href="/teen/toolbox">
              <button className="teen-btn teen-btn-outline">🧰 Open my toolbox</button>
            </Link>

            <Link href="/teen">
              <button className="teen-btn teen-btn-outline">✨ I'm okay, keep going</button>
            </Link>
          </div>

          {/* Crisis activation */}
          <div className="teen-text-center">
            <button
              onClick={() => setIsCrisisMode(true)}
              className="teen-text-rose teen-text-small"
              style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Need immediate help?
            </button>
          </div>
        </>
      ) : (
        /* CRISIS MODE */
        <>
          <div className="teen-text-center teen-mb-16">
            <div style={{ fontSize: "3rem" }} className="teen-mb-8">🆘</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }} className="teen-mb-4 teen-text-rose">You&apos;re not alone</h1>
            <p className="teen-text-muted teen-text-small">
              We're here. These people are here. Please reach out to one of them right now.
            </p>
          </div>

          {/* Crisis helplines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="teen-mb-16">
            <div className="teen-card">
              <div className="teen-text-accent" style={{ fontWeight: 600 }}>TeleMANAS Helpline</div>
              <div className="teen-text-small teen-text-muted teen-mb-4">
                Free, 24/7 support for mental health crisis
              </div>
              <a href="tel:14416">
                <button className="teen-btn teen-btn-rose">📞 Call 14416 (Toll-free)</button>
              </a>
            </div>

            <div className="teen-card">
              <div className="teen-text-accent" style={{ fontWeight: 600 }}>Vandrevala Foundation</div>
              <div className="teen-text-small teen-text-muted teen-mb-4">
                24/7 crisis support via WhatsApp
              </div>
              <a href="tel:9999666555">
                <button className="teen-btn teen-btn-rose">💬 WhatsApp 9999 666 555</button>
              </a>
            </div>

            <div className="teen-card">
              <div className="teen-text-accent" style={{ fontWeight: 600 }}>AASRA</div>
              <div className="teen-text-small teen-text-muted teen-mb-4">
                24/7 emotional support
              </div>
              <a href="tel:+912227546669">
                <button className="teen-btn teen-btn-rose">📞 +91-22-2754 6669</button>
              </a>
            </div>

            <div className="teen-card">
              <div className="teen-text-accent" style={{ fontWeight: 600 }}>iCALL</div>
              <div className="teen-text-small teen-text-muted teen-mb-4">
                Mon-Sat, 8am-10pm IST
              </div>
              <a href="tel:02225521111">
                <button className="teen-btn teen-btn-rose">📞 022-2552 1111</button>
              </a>
            </div>
          </div>

          {/* Important note */}
          <div className="teen-card teen-text-center teen-mb-8">
            <div className="teen-text-small teen-text-rose teen-mb-4">⚠️ Important</div>
            <p className="teen-text-xs teen-text-muted">
              Your mentor and a trusted adult will be notified so we can make sure you're safe.
            </p>
          </div>

          {/* Back button */}
          <div>
            <button
              onClick={() => setIsCrisisMode(false)}
              className="teen-text-muted teen-text-small teen-text-center"
              style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline", width: "100%", display: "block" }}
            >
              ← Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}
