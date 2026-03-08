import type { LucideIcon } from "lucide-react";
import type { Icon } from "@tabler/icons-react";

export interface NavMainChildItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  allowedRoles?: string[];
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  allowedRoles?: string[];
  items?: NavMainChildItem[];
}

export interface NavUserData {
  name: string;
}

export interface NavProjectItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface NavDocumentItem {
  name: string;
  url: string;
  icon: Icon;
}

export interface NavSecondaryItem {
  title: string;
  url: string;
  icon: Icon;
}
