import type { Metadata } from "next";
import { TeenProvider } from "./_context/TeenContext";
import BottomNav from "./_components/BottomNav";
import "./teen.css";

export const metadata: Metadata = {
  title: "EmpathiQ — Your Space",
  description: "Your stories. Your growth. Your space.",
};

export default function TeenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeenProvider>
      <div className="teen-app">
        {children}
        <BottomNav />
      </div>
    </TeenProvider>
  );
}
