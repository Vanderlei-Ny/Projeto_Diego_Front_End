import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/http/api";
import { ENDPOINTS } from "@/endpoints";
import useAuth from "@/hooks/useAuth";
import type { AdminUser, UserHierarchy } from "@/types/admin/admin.types";

export default function useAdminUsersPage() {
  const queryClient = useQueryClient();
  const { user: loggedUser } = useAuth();

  const [search, setSearch] = useState("");
  const [pendingRoles, setPendingRoles] = useState<
    Record<number, UserHierarchy>
  >({});

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.user.adminListAll);
      return res.data as AdminUser[];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (payload: { id: number; hierarchy: UserHierarchy }) => {
      await api.patch(ENDPOINTS.user.adminUpdateHierarchy(payload.id), {
        hierarchy: payload.hierarchy,
      });
    },
    onSuccess: () => {
      toast.success("Permissão atualizada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const visibleUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return users;

    return users.filter((item) => {
      const byName = item.name?.toLowerCase().includes(normalizedSearch);
      const byEmail = item.email.toLowerCase().includes(normalizedSearch);
      const byPhone = item.phoneNumber
        ?.toLowerCase()
        .includes(normalizedSearch);
      return Boolean(byName || byEmail || byPhone);
    });
  }, [users, search]);

  const getSelectedRole = (userData: AdminUser): UserHierarchy => {
    return pendingRoles[userData.id] ?? userData.hierarchy;
  };

  const handleRoleChange = (userId: number, role: UserHierarchy) => {
    setPendingRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleSaveRole = async (targetUser: AdminUser) => {
    const nextRole = getSelectedRole(targetUser);

    if (nextRole === targetUser.hierarchy) return;

    try {
      await updateRoleMutation.mutateAsync({
        id: targetUser.id,
        hierarchy: nextRole,
      });
    } catch (_error) {
      // handled by axios interceptor + mutation feedback
    }
  };

  return {
    users,
    visibleUsers,
    search,
    setSearch,
    isLoading,
    isUpdatingRole: updateRoleMutation.isPending,
    loggedUserId: loggedUser?.userId ?? null,
    getSelectedRole,
    handleRoleChange,
    handleSaveRole,
  };
}
