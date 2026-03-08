"use client";

import * as React from "react";
import {
  House,
  SquareTerminal,
  Clock,
  LayoutDashboard,
  Scissors,
  CalendarOff,
  BarChart3,
  Image,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
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
  navMain: [
    {
      title: "Início",
      url: "/home",
      icon: House,
      isActive: true,
    },
    {
      title: "Administrador",
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
          title: "Usuários",
          url: "/admin/usuarios",
          icon: Users,
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

  const isAdmin = user?.hierarchy === "ADMIN";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center relative p-3">
        <div className="flex w-full items-center gap-3 px-3 py-2.5 transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:px-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#B8952E]/20 text-[#B8952E]">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
              loading="eager"
            />
          </div>
          <div className="flex min-w-0 flex-col overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              Barbearia Diego Bueno
            </span>
            {isAdmin && (
              <span className="text-xs text-sidebar-foreground/70">
                Painel administrativo
              </span>
            )}
          </div>
        </div>
        <SidebarTrigger className="absolute top-2 -right-10 text-sidebar-foreground md:-right-8 md:group-data-[side=right]:-left-8 md:top-2 md:z-20" />
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
