import type { HeroContent, MetricData, NavItem } from "./webPortal";

export type WorkshopAccent = "cyan" | "mint" | "amber";

export interface WorkshopField {
  label: string;
  value: string;
  helper?: string;
}

export interface WorkshopModule {
  label: string;
  title: string;
  detail: string;
  bullets: string[];
  accent?: WorkshopAccent;
}

export interface WorkshopRoadmapPhase {
  id: string;
  label: string;
  title: string;
  detail: string;
  deliverables: string[];
}

export interface WorkshopSession {
  id: string;
  startTime: string;
  duration: string;
  title: string;
  tagline: string;
  signals: string[];
  flow: string[];
  enrichments: string[];
  adminOutputs: string[];
}

export interface WorkshopDayPlan {
  id: string;
  label: string;
  title: string;
  summary: string;
  checkpoint: string;
  sessions: WorkshopSession[];
}

export interface WorkshopFollowThrough {
  label: string;
  title: string;
  detail: string;
  owner: string;
}

export interface WorkshopPagePayload {
  navItems: NavItem[];
  hero: HeroContent;
  metrics: MetricData[];
  setup: WorkshopField[];
  safeguards: WorkshopField[];
  modules: WorkshopModule[];
  roadmap: WorkshopRoadmapPhase[];
  days: WorkshopDayPlan[];
  followThrough: WorkshopFollowThrough[];
  adminChecklist: string[];
}
