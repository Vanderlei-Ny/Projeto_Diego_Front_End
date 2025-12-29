"use client";

import * as React from "react";
import { Bot, GalleryVerticalEnd, House, SquareTerminal } from "lucide-react";

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
      name: "Barberia Diego Bueno",
      logo: GalleryVerticalEnd,
      plan: "Barbearia",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: House,
      isActive: true,
    },
    {
      title: "Admin",
      url: "/admin",
      icon: SquareTerminal,
      allowedRoles: ["admin"],
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          allowedRoles: ["admin"],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  console.log("👤 AppSidebar - user:", user);
  console.log(
    "👤 AppSidebar - user?.roles:",
    user?.roles,
    "tipo:",
    typeof user?.roles,
    "array?:",
    Array.isArray(user?.roles)
  );

  const userApplication = {
    name: user?.name ?? "Usuário",
  };

  const safeRoles = Array.isArray(user?.roles) ? user?.roles : null;
  console.log("👤 AppSidebar - safeRoles após validação:", safeRoles);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center relative">
        <TeamSwitcher teams={data.teams} />
        <SidebarTrigger className="absolute top-2 -right-10 text-white md:-right-8 md:group-data-[side=right]:-left-8 md:top-2 md:z-20" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} userRoles={safeRoles} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userApplication} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
