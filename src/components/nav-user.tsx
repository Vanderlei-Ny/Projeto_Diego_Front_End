import { ChevronsUpDown, LogOut, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileModal from "@/components/EditProfileModal";
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
import useInsertEmailAndPhoneNumber from "@/hooks/useInsertEmailAndPhoneNumber";
import type { NavUserData } from "@/types/navigation/navigation.types";
import api from "@/http/api";
import { ENDPOINTS } from "@/endpoints";

export function NavUser({ user }: { user: NavUserData }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { user: authUser } = useAuth();
  const { updateInfo, isLoading: isSavingProfile } =
    useInsertEmailAndPhoneNumber();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const openEditProfileAfterSheetMsRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const avatarSrc = user.avatarUrl ?? authUser?.avatarUrl ?? undefined;

  const formatPhone = (value: string) => {
    let input = value.replace(/\D/g, "");

    if (input.length > 11) input = input.slice(0, 11);

    let formatted = input;

    if (input.length > 0) {
      formatted = `(${input.slice(0, 2)}`;
    }

    if (input.length >= 3) {
      formatted += `) ${input.slice(2, 7)}`;
    }

    if (input.length >= 8) {
      formatted += `-${input.slice(7)}`;
    }

    return formatted;
  };

  useEffect(() => {
    return () => {
      if (openEditProfileAfterSheetMsRef.current != null) {
        window.clearTimeout(openEditProfileAfterSheetMsRef.current);
      }
    };
  }, []);

  function openEditProfileModal() {
    setEditName(authUser?.name ?? "");
    setEditTelefone(authUser?.telefone ?? "");

    if (openEditProfileAfterSheetMsRef.current != null) {
      window.clearTimeout(openEditProfileAfterSheetMsRef.current);
      openEditProfileAfterSheetMsRef.current = null;
    }

    /*
      Mobile sidebar is a Radix Sheet (modal dialog). A portal to document.body
      sits outside the sheet content in the DOM tree, so Radix marks it inert
      and touches never reach the inputs. Close the sheet first, then open the
      modal after the sheet close transition (see sheet.tsx duration-300).
    */
    if (isMobile) {
      setOpenMobile(false);
      openEditProfileAfterSheetMsRef.current = window.setTimeout(() => {
        openEditProfileAfterSheetMsRef.current = null;
        setIsEditProfileOpen(true);
      }, 320);
    } else {
      setIsEditProfileOpen(true);
    }
  }

  function closeEditProfileModal() {
    setIsEditProfileOpen(false);
  }

  function handleEditTelefoneChange(value: string) {
    setEditTelefone(formatPhone(value));
  }

  async function saveProfile() {
    const cleanName = editName.trim();
    const cleanPhone = editTelefone.trim();

    if (!cleanName || !cleanPhone) {
      toast.error("Preencha nome e telefone para continuar.");
      return;
    }

    try {
      await updateInfo(cleanName, cleanPhone);
      toast.success("Perfil atualizado com sucesso!");
      setIsEditProfileOpen(false);
    } catch (_error) {
      toast.error("Erro ao atualizar seu perfil.");
    }
  }

  async function logOut() {
    try {
      await api.post(ENDPOINTS.auth.logout);
    } catch (_error) {
      // Mesmo com falha no servidor, forçamos limpeza local da sessão.
    } finally {
      logout();
      navigate("/login");
    }
  }

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
            <DropdownMenuItem
              onClick={openEditProfileModal}
              className="cursor-pointer"
            >
              <Pencil />
              Editar perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logOut} className="cursor-pointer">
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <EditProfileModal
          isOpen={isEditProfileOpen}
          name={editName}
          telefone={editTelefone}
          isSaving={isSavingProfile}
          onClose={closeEditProfileModal}
          onNameChange={setEditName}
          onTelefoneChange={handleEditTelefoneChange}
          onSave={saveProfile}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
