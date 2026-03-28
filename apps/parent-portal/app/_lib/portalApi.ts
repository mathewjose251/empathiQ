import "server-only";

import type {
  AdminPackConsolePayload,
  MentorPackViewPayload,
  PackFeedPayload,
  ParentPackDigestPayload,
} from "@empathiq/shared/contracts/pack";
import type {
  AdminPagePayload,
  MentorPagePayload,
  OverviewPagePayload,
  ParentPagePayload,
  TeenPreviewPagePayload,
} from "@empathiq/shared/contracts/webPortal";
import type { WorkshopPagePayload } from "@empathiq/shared/contracts/workshops";
import {
  getAdminPayload,
  getMentorPayload,
  getOverviewPayload,
  getParentPayload,
  getTeenPreviewPayload,
} from "../_data/portalData";
import { getDoseWorkshopPayload } from "../_data/workshopData";
import {
  getAdminPackConsole,
  getMentorPackView,
  getParentPackDigest,
  getTeenPackFeed,
} from "../_data/packData";

async function loadJson<T>(path: string, fallback: () => T): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    return fallback();
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallback();
  }
}

export function getOverviewPageData(): Promise<OverviewPagePayload> {
  return loadJson("/api/overview", getOverviewPayload);
}

export function getAdminPageData(): Promise<AdminPagePayload> {
  return loadJson("/api/admin", getAdminPayload);
}

export function getParentPageData(): Promise<ParentPagePayload> {
  return loadJson("/api/parent", getParentPayload);
}

export function getMentorPageData(): Promise<MentorPagePayload> {
  return loadJson("/api/mentor", getMentorPayload);
}

export function getTeenPreviewPageData(): Promise<TeenPreviewPagePayload> {
  return loadJson("/api/teen-preview", getTeenPreviewPayload);
}

export function getTeenPackFeedData(): Promise<PackFeedPayload> {
  return loadJson("/api/pack/feed", getTeenPackFeed);
}

export function getParentPackDigestData(): Promise<ParentPackDigestPayload> {
  return loadJson("/api/pack/parent-digest", getParentPackDigest);
}

export function getMentorPackViewData(): Promise<MentorPackViewPayload> {
  return loadJson("/api/pack/mentor-view", getMentorPackView);
}

export function getAdminPackConsoleData(): Promise<AdminPackConsolePayload> {
  return loadJson("/api/pack/admin-view", getAdminPackConsole);
}

export function getDoseWorkshopPageData(): Promise<WorkshopPagePayload> {
  return loadJson("/api/admin/workshops/family-dose", getDoseWorkshopPayload);
}
