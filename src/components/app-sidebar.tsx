"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  House,
  SquareTerminal,
  Clock,
  LayoutDashboard,
  Scissors,
  CalendarOff,
  BarChart3,
  Image,
} from "lucide-react";

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
      allowedRoles: ["ADMIN"],
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: BarChart3,
          allowedRoles: ["ADMIN"],
        },
        {
          title: "Agendamentos",
          url: "/admin",
          icon: LayoutDashboard,
          allowedRoles: ["ADMIN"],
        },
        {
          title: "Horários",
          url: "/admin/horarios",
          icon: Clock,
          allowedRoles: ["ADMIN"],
        },
        {
          title: "Serviços",
          url: "/admin/servicos",
          icon: Scissors,
          allowedRoles: ["ADMIN"],
        },
        {
          title: "Folgas",
          url: "/admin/folgas",
          icon: CalendarOff,
          allowedRoles: ["ADMIN"],
        },
        {
          title: "Carousel",
          url: "/admin/carousel",
          icon: Image,
          allowedRoles: ["ADMIN"],
        },
      ],
    },
  ],
};

export const AppSidebar = React.memo(function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userApplication = React.useMemo(
    () => ({
      name: user?.name ?? "Usuário",
    }),
    [user?.name],
  );

  // Combinar roles do array + hierarchy para garantir que admin seja reconhecido
  const safeRoles = React.useMemo(() => {
    const roles: string[] = [];
    if (Array.isArray(user?.roles)) {
      roles.push(...user.roles);
    }
    // Adiciona hierarchy como role também (ADMIN, CLIENT, etc)
    if (user?.hierarchy) {
      roles.push(user.hierarchy);
    }
    return roles.length > 0 ? roles : null;
  }, [user?.roles, user?.hierarchy]);

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
});
