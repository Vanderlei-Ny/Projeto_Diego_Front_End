"use client";

import * as React from "react";
import { Bot, GalleryVerticalEnd, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
  },
  teams: [
    {
      name: "Barberia Style",
      logo: GalleryVerticalEnd,
      plan: "Barbearia",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userApplication = {
    name: user?.name ?? "Usuário",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center relative">
        <TeamSwitcher teams={data.teams} />
        <SidebarTrigger className="absolute top-2 -right-8 group-data-[side=right]:-left-8 z-20" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userApplication} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
