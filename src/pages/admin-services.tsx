import { ChevronLeft, Plus, Trash2, Scissors, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/loading-spinner";
import ConfirmModal from "../components/modal";
import useServicesPage from "../hooks/useServicesPage";
import type { Service } from "@/types/service/service.types";

function AdminServicesPage() {
  const navigate = useNavigate();
  const {
    services,
    isLoadingServices,
    showAddForm,
    setShowAddForm,
    newServiceName,
    setNewServiceName,
    newServiceValue,
    handleValueChange,
    isCreating,
    isDeleting,
    handleCreateService,
    handleDeleteService,
    // Modal de confirmação
    deleteModalOpen,
    deleteModalMessage,
    confirmDelete,
    closeDeleteModal,
  } = useServicesPage();

  const handleGoBack = () => navigate("/admin");

  const isProcessing = isCreating || isDeleting;

  return (
    <div className="app-page-bg flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 flex-col">
      {isProcessing && <LoadingSpinner fullScreen message="Processando..." />}

      <div className="flex w-full max-w-4xl mx-auto flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E] flex items-center gap-2">
              <Scissors className="w-6 h-6" />
              Gerenciar Serviços
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Adicione, edite ou remova serviços da barbearia
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Novo Serviço</span>
            </button>
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Formulário para adicionar novo serviço */}
        {showAddForm && (
          <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
            <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Adicionar Novo Serviço
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-white/80 text-sm mb-2">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Ex: Corte de Cabelo"
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E] placeholder:text-white/30"
                />
              </div>

              <div className="flex-1">
                <label className="block text-white/80 text-sm mb-2">
                  Valor (R$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={newServiceValue}
                    onChange={(e) => handleValueChange(e.target.value)}
                    placeholder="Ex: 35,00"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E] placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewServiceName("");
                    handleValueChange("");
                  }}
                  className="px-4 py-3 bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateService}
                  disabled={!newServiceName.trim() || !newServiceValue.trim()}
                  className="px-6 py-3 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de serviços */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5" /> Serviços Cadastrados
          </h2>

          {isLoadingServices ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner message="Carregando serviços..." size="sm" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <Scissors className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">Nenhum serviço cadastrado.</p>
              <p className="text-white/40 text-sm mt-1">
                Clique em "Novo Serviço" para começar.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service: Service) => (
                <div
                  key={service.id}
                  className="bg-black border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-[#B8952E]/50 transition-colors group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-medium">
                      {service.name}
                    </span>
                    <span className="text-[#B8952E] font-semibold">
                      R$ {service.value}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteService(service.id, service.name)
                    }
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                    title="Deletar serviço"
                  >
                    <Trash2 className="w-5 h-5 text-white/70 group-hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        message={deleteModalMessage}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}

export default AdminServicesPage;
