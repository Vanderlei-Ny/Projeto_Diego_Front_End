import { ChevronLeft, ShieldCheck, UserRoundCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAdminUsersPage from "@/hooks/useAdminUsersPage";
import type { UserHierarchy } from "@/types/admin/admin.types";

const ROLE_LABEL: Record<UserHierarchy, string> = {
  ADMIN: "Administrador",
  CLIENT: "Cliente",
};

function AdminUsersPage() {
  const navigate = useNavigate();
  const {
    users,
    visibleUsers,
    search,
    setSearch,
    isLoading,
    isUpdatingRole,
    loggedUserId,
    getSelectedRole,
    handleRoleChange,
    handleSaveRole,
  } = useAdminUsersPage();

  const isProcessing = isUpdatingRole;

  return (
    <div className="app-page-bg flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 flex-col">
      {isProcessing && (
        <LoadingSpinner fullScreen message="Processando..." />
      )}

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-4 sm:gap-6">
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E] flex items-center gap-2">
              <UserRoundCog className="w-6 h-6" />
              Gerenciar Usuários
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Altere o perfil de acesso dos usuários com segurança
            </p>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        {isLoading ? (
          <div className="bg-neutral-800 rounded-[15px] p-6 min-h-[45vh] flex items-center justify-center">
            <LoadingSpinner message="Carregando usuários..." size="lg" />
          </div>
        ) : (
          <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
            <p className="text-[#B8952E] font-semibold text-sm sm:text-base">
              Usuários cadastrados ({users.length})
            </p>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, email ou telefone"
              className="w-full sm:w-80 px-4 py-2.5 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E] placeholder:text-white/40"
            />
          </div>

          {visibleUsers.length === 0 ? (
            <p className="text-white/60 text-sm">Nenhum usuário encontrado.</p>
          ) : (
            <div className="grid gap-3">
              {visibleUsers.map((item) => {
                const selectedRole = getSelectedRole(item);
                const isDirty = selectedRole !== item.hierarchy;
                const isCurrentLoggedUser = loggedUserId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-black border border-white/10 rounded-xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">
                        {item.name?.trim() || "Sem nome"}
                      </p>
                      <p className="text-white/70 text-sm truncate">
                        {item.email}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        {item.phoneNumber
                          ? `📞 ${item.phoneNumber}`
                          : "Telefone não informado"}
                      </p>
                      {isCurrentLoggedUser && (
                        <span className="inline-flex mt-2 items-center gap-1 rounded-md border border-[#B8952E]/40 bg-[#B8952E]/15 px-2 py-1 text-[11px] text-[#F2D37A]">
                          <ShieldCheck className="w-3 h-3" /> Sua conta
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <Select
                        value={selectedRole}
                        onValueChange={(value) =>
                          handleRoleChange(item.id, value as UserHierarchy)
                        }
                      >
                        <SelectTrigger className="min-w-44">
                          <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CLIENT">
                            {ROLE_LABEL.CLIENT}
                          </SelectItem>
                          <SelectItem value="ADMIN">
                            {ROLE_LABEL.ADMIN}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <button
                        onClick={() => handleSaveRole(item)}
                        disabled={!isDirty || isUpdatingRole}
                        className="px-4 py-2 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
