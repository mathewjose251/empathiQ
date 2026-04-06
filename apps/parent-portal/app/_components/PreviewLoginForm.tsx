"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PreviewLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();

  const [username, setUsername] = useState("testuser");
  const [password, setPassword] = useState("betternow");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to sign in right now.");
      }

      router.replace(nextPath);
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="login-copy">
        <span className="chip">Preview Login</span>
        <h1>Enter the protected build</h1>
        <p>
          The main app is now gated for review. Surveys stay public, but the rest of
          the ecosystem uses this preview login.
        </p>
      </div>

      <label className="login-field">
        <span>Username</span>
        <input
          autoComplete="username"
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          value={username}
        />
      </label>

      <label className="login-field">
        <span>Password</span>
        <input
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </label>

      <button className="login-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Enter preview"}
      </button>

      {error ? <p className="login-error">{error}</p> : null}

      <div className="login-hint">
        <strong>Test credentials</strong>
        <span>`testuser` / `betternow`</span>
      </div>

      <div className="login-links">
        <a href="/teen/survey">Open teen survey</a>
        <a href="/tween/survey">Open tween survey</a>
        <a href="/parent/survey">Open parent survey</a>
      </div>
    </form>
  );
}
