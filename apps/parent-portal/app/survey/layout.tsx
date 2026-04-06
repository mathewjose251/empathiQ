import type { ReactNode } from "react";

export default function SurveyLayout({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem 4rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >
        <div
          style={{
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(173,201,255,0.1)",
          }}
        >
          <span
            style={{
              fontFamily: "'Trebuchet MS', sans-serif",
              fontSize: "0.78rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--cyan)",
            }}
          >
            EmpathiQ
          </span>
        </div>
        {children}
      </div>
    </main>
  );
}
