import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  userRoles,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    allowedRoles?: string[];
    items?: {
      title: string;
      url: string;
      allowedRoles?: string[];
    }[];
  }[];
  userRoles?: string[] | null;
}) {
  // helper that checks if userRoles intersect with allowedRoles
  // Behavior:
  // - allowedRoles === undefined -> visible to all
  // - allowedRoles === [] -> visible to none
  function hasAccess(allowedRoles?: string[] | undefined) {
    // Se não há roles permitidas especificadas, todos têm acesso
    if (allowedRoles === undefined) return true; // public

    // Se a lista de roles permitidas está vazia, ninguém tem acesso
    if (Array.isArray(allowedRoles) && allowedRoles.length === 0) return false; // restricted to nobody

    // Se o usuário não tem roles, sem acesso
    if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0)
      return false;

    const lowerUserRoles = userRoles.map((r) => r?.toLowerCase() ?? "");
    return allowedRoles.some((r) =>
      lowerUserRoles.includes(r?.toLowerCase() ?? "")
    );
  }

  const visibleItems =
    items?.filter((item) => hasAccess(item.allowedRoles)) ?? [];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) =>
          item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items
                      ?.filter((sub) => hasAccess(sub.allowedRoles))
                      .map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2 w-full ">
                  {item.icon && <item.icon className="text-[#B8952E]" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
