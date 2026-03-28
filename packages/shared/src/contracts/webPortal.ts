export interface NavItem {
  href: string;
  label: string;
}

export interface PortalCardData {
  href: string;
  label: string;
  title: string;
  detail: string;
  accent?: "cyan" | "mint" | "amber";
}

export interface MetricData {
  label: string;
  value: string;
  detail?: string;
}

export interface PanelData {
  label: string;
  title: string;
  detail: string;
}

export interface TimelineItem {
  id: string;
  text: string;
}

export interface TeenMissionChoice {
  id: string;
  label: string;
  title: string;
  detail: string;
  tag: string;
  branchLabel: string;
  consequence: string;
  mood: string;
}

export interface PackFeedItem {
  id: string;
  alias: string;
  mood: string;
  text: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  lede: string;
}

export interface SpotlightContent {
  chip: string;
  title: string;
  detail: string;
  dialValue: string;
  dialLabel: string;
}

export interface OverviewPagePayload {
  navItems: NavItem[];
  hero: HeroContent;
  metrics: MetricData[];
  portals: PortalCardData[];
  panels: PanelData[];
  timeline: TimelineItem[];
  spotlight: SpotlightContent;
}

export interface AdminPagePayload {
  navItems: NavItem[];
  hero: HeroContent;
  metrics: MetricData[];
  roleCards: PortalCardData[];
  timeline: TimelineItem[];
}

export interface ParentPagePayload {
  navItems: NavItem[];
  hero: HeroContent;
  panels: PanelData[];
}

export interface MentorPagePayload {
  navItems: NavItem[];
  hero: HeroContent;
  metrics: MetricData[];
  timeline: TimelineItem[];
}

export interface TeenPreviewPagePayload {
  navItems: NavItem[];
  hero: HeroContent;
  story: SpotlightContent;
  choices: TeenMissionChoice[];
  timeline: TimelineItem[];
  reflectionPrompt: string;
  packFeed: PackFeedItem[];
}
