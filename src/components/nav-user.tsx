import { ChevronsUpDown, LogOut, Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getInitialName } from "@/utils/getInitialNames";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import type { NavUserData } from "@/types/navigation/navigation.types";
import api from "@/http/api";
import { ENDPOINTS } from "@/endpoints";

function UserAccountDropdownBody({
  user,
  avatarSrc,
}: {
  user: NavUserData;
  avatarSrc?: string;
}) {
  const { openEditProfile } = useSidebar();
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function logOut() {
    try {
      await api.post(ENDPOINTS.auth.logout);
    } catch {
      // Mesmo com falha no servidor, forçamos limpeza local da sessão.
    } finally {
      logout();
    }
    navigate("/login");
  }

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={avatarSrc} alt={user.name} />
            <AvatarFallback className="rounded-lg bg-[#B8952E]">
              {getInitialName(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={openEditProfile} className="cursor-pointer">
        <Pencil />
        Editar perfil
      </DropdownMenuItem>
      <DropdownMenuItem onClick={logOut} className="cursor-pointer">
        <LogOut />
        Sair
      </DropdownMenuItem>
    </>
  );
}

export function NavUser({ user }: { user: NavUserData }) {
  const { isMobile } = useSidebar();
  const { user: authUser } = useAuth();
  const avatarSrc = user.avatarUrl ?? authUser?.avatarUrl ?? undefined;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={avatarSrc} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-[#B8952E]">
                  {getInitialName(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-neutral-800 text-white"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <UserAccountDropdownBody user={user} avatarSrc={avatarSrc} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function MobileHeaderNavUser() {
  const { isMobile, openMobile } = useSidebar();
  const { user: authUser } = useAuth();

  const user: NavUserData = {
    name: authUser?.name ?? "Usuário",
    avatarUrl: authUser?.avatarUrl ?? null,
  };
  const avatarSrc = user.avatarUrl ?? authUser?.avatarUrl ?? undefined;

  if (!isMobile || openMobile) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 rounded-lg p-0 text-sidebar-foreground hover:bg-sidebar-accent/20"
          aria-label="Menu da conta"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={avatarSrc} alt={user.name} />
            <AvatarFallback className="rounded-lg bg-[#B8952E] text-white">
              {getInitialName(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg bg-neutral-800 text-white"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <UserAccountDropdownBody user={user} avatarSrc={avatarSrc} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
