import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmpathiQ Parent Portal",
  description: "A calm, plain-language insight dashboard for families and mentors.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
