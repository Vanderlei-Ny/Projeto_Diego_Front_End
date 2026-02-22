import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../http/api";
import useAuth from "./useAuth";

interface Service {
  id: number;
  name: string;
  value: string;
}

export default function useServicosPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Estados
  const [showAddForm, setShowAddForm] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceValue, setNewServiceValue] = useState("");

  // Estados do modal de confirmação
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Buscar todos os serviços
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get("/service");
      return res.data as Service[];
    },
    enabled: isAdmin,
  });

  // Mutation para criar serviço
  const createServiceMutation = useMutation({
    mutationFn: async (data: { name: string; value: string }) => {
      const res = await api.post("/service/createService", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Serviço criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setShowAddForm(false);
      setNewServiceName("");
      setNewServiceValue("");
    },
    onError: () => {
      toast.error("Erro ao criar serviço");
    },
  });

  // Mutation para deletar serviço
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/service/deleteService/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Serviço deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: () => {
      toast.error("Erro ao deletar serviço");
    },
  });

  // Handlers
  const handleCreateService = () => {
    if (!newServiceName.trim()) {
      toast.error("Digite o nome do serviço");
      return;
    }
    if (!newServiceValue.trim()) {
      toast.error("Digite o valor do serviço");
      return;
    }

    createServiceMutation.mutate({
      name: newServiceName.trim(),
      value: newServiceValue.trim(),
    });
  };

  const handleDeleteService = (id: number, name: string) => {
    setDeleteModalMessage(
      `Tem certeza que deseja deletar o serviço "${name}"?`,
    );
    setPendingDeleteId(id);
    setDeleteModalOpen(true);
  };

  // Funções do modal de confirmação
  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      deleteServiceMutation.mutate(pendingDeleteId);
    }
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteModalMessage("");
    setPendingDeleteId(null);
  };

  // Formatar valor enquanto digita em formato de moeda brasileira
  const handleValueChange = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Se não tem números, limpa o campo
    if (!numbers) {
      setNewServiceValue("");
      return;
    }

    // Converte para número e formata como moeda
    const numberValue = parseInt(numbers) / 100;
    const formatted = numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setNewServiceValue(formatted);
  };

  return {
    services,
    isLoadingServices,
    showAddForm,
    setShowAddForm,
    newServiceName,
    setNewServiceName,
    newServiceValue,
    handleValueChange,
    isCreating: createServiceMutation.isPending,
    isDeleting: deleteServiceMutation.isPending,
    handleCreateService,
    handleDeleteService,
    // Modal de confirmação
    deleteModalOpen,
    deleteModalMessage,
    confirmDelete,
    closeDeleteModal,
  };
}
