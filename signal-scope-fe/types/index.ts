export type StatusKind = "up" | "warn" | "down" | "info" | "muted";

export interface NavItem {
  href: string;
  label: string;
  badge?: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}
