import { useState } from "react";
import { toast } from "sonner";
import useHome from "../useHome";
import useAuth from "../useAuth";

export default function useHomePage() {
  const { user, loading: authLoading } = useAuth();
  const { agendamentos, deleteAgendamento, loading, isDeleting } = useHome();

  const [modalOpen, setModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const openDeleteModal = (id: number) => {
    setIdToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (idToDelete === null) return;

    try {
      await deleteAgendamento(idToDelete);
      toast.success("Agendamento deletado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar agendamento.");
    } finally {
      setModalOpen(false);
      setIdToDelete(null);
    }
  };

  return {
    user,
    authLoading,
    agendamentos,
    loading,
    isDeleting,
    modalOpen,
    idToDelete,
    openDeleteModal,
    confirmDelete,
    closeModal: () => setModalOpen(false),
  };
}
