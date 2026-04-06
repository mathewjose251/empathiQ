"use client";

import { useRouter } from "next/navigation";

export function PreviewLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  return (
    <button className="logout-button" onClick={handleLogout} type="button">
      Log out
    </button>
  );
}
