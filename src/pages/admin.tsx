import { ChevronLeft, Plus, Calendar, Clock, User, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/loading-spinner";
import ConfirmModal from "../components/modal";
import AgendamentoCalendar from "./agendamento/AgendamentoCalendar";
import useAdminPage from "./admin/useAdminPage";

interface AgendamentoService {
  id: number;
  nome: string;
  valor: string;
}

interface Agendamento {
  id: number;
  dataAgendamento: string;
  dataOriginal: string;
  nomeCliente: string;
  telefone: string | null;
  email: string | null;
  userId: number | null;
  agendado: boolean;
  horario: string;
  diaDaSemana: string;
  services: AgendamentoService[];
}

function AdminPage() {
  const navigate = useNavigate();
  const {
    agendamentos,
    services,
    isLoading,
    isCreating,
    isDeleting,
    showForm,
    setShowForm,
    selectedDate,
    selectedHour,
    selectedServices,
    nomeCliente,
    setNomeCliente,
    hoursDisponible,
    hoursAgendados,
    activeWeekdays,
    isVerifyingDay,
    handleDateSelect,
    handleHourSelect,
    handleServiceToggle,
    handleCreateAgendamento,
    handleDeleteAgendamento,
    // Modal de confirmação
    deleteModalOpen,
    deleteModalMessage,
    confirmDelete,
    closeDeleteModal,
  } = useAdminPage();

  const handleGoHome = () => navigate("/home");

  // Agrupar agendamentos por data
  const agendamentosPorData = agendamentos.reduce<
    Record<string, Agendamento[]>
  >((acc: Record<string, Agendamento[]>, agendamento: Agendamento) => {
    const data = agendamento.dataAgendamento;
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(agendamento);
    return acc;
  }, {});

  return (
    <div className="flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 bg-black flex-col">
      {(isLoading || isCreating || isDeleting) && (
        <LoadingSpinner fullScreen message="Processando..." />
      )}

      <div className="flex w-full max-w-7xl mx-auto flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E]">
              Painel do Administrador
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Gerencie os agendamentos dos clientes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showForm
                  ? "bg-neutral-600 text-white"
                  : "bg-[#B8952E] text-black hover:bg-[#a38427]"
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Novo Agendamento</span>
            </button>
            <button
              onClick={handleGoHome}
              className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Formulário de Novo Agendamento */}
        {showForm && (
          <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
            <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Criar Agendamento para Cliente
            </h2>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Nome do Cliente */}
              <div className="flex-1">
                <label className="block text-white/80 text-sm mb-2">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  placeholder="Digite o nome do cliente"
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E]"
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-6">
              {/* Calendário */}
              <div className="lg:w-1/3">
                <AgendamentoCalendar
                  key={selectedDate?.toISOString() ?? "no-date"}
                  selectedDate={selectedDate}
                  onSelect={handleDateSelect}
                  activeWeekdays={activeWeekdays}
                />
              </div>

              {/* Horários */}
              <div className="lg:w-1/3">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Horário *
                </h3>
                {isVerifyingDay ? (
                  <div className="flex items-center justify-center py-6">
                    <LoadingSpinner
                      message="Carregando horários..."
                      size="sm"
                    />
                  </div>
                ) : !selectedDate ? (
                  <p className="text-white/60 text-sm">
                    Selecione uma data primeiro.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {hoursDisponible.length === 0 &&
                      hoursAgendados.length === 0 && (
                        <p className="col-span-full text-white/60 text-sm">
                          Nenhum horário disponível.
                        </p>
                      )}
                    {hoursDisponible.map((hour) => (
                      <button
                        key={hour.id}
                        onClick={() => handleHourSelect(hour.id)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedHour === hour.id
                            ? "bg-[#B8952E] border-[#B8952E] text-black"
                            : "bg-black border-white/10 text-white"
                        }`}
                      >
                        {hour.availableHour}
                      </button>
                    ))}
                    {hoursAgendados.map((hour) => (
                      <button
                        key={hour.id}
                        disabled
                        className="py-2 rounded-lg text-sm bg-black border-white/5 text-white/20 cursor-not-allowed"
                      >
                        {hour.availableHour}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Serviços */}
              <div className="lg:w-1/3">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Serviços
                </h3>
                <div className="space-y-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedServices.includes(service.id)
                          ? "bg-[#B8952E] border-[#B8952E] text-black"
                          : "bg-black border-white/10 text-white"
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="font-semibold">{service.name}</span>
                        <span
                          className={
                            selectedServices.includes(service.id)
                              ? "text-black/60"
                              : "text-white/60"
                          }
                        >
                          R$ {service.value}
                        </span>
                      </div>
                      {selectedServices.includes(service.id) && <CheckIcon />}
                    </button>
                  ))}
                  {services.length === 0 && (
                    <p className="text-white/60 text-sm">
                      Nenhum serviço cadastrado.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer de ações */}
            <div className="flex flex-col md:flex-row gap-3 mt-6">
              <button
                onClick={handleCreateAgendamento}
                disabled={
                  !selectedDate ||
                  !selectedHour ||
                  selectedServices.length === 0
                }
                className="px-6 py-3 bg-[#B8952E] text-black font-semibold rounded-lg hover:bg-[#d4af37] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Criar Agendamento
              </button>
            </div>
          </div>
        )}

        {/* Lista de Agendamentos */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Agendamentos
          </h2>

          {Object.keys(agendamentosPorData).length === 0 ? (
            <p className="text-white/60">Nenhum agendamento cadastrado.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(agendamentosPorData).map(
                ([data, listaAgendamentos]) => (
                  <div
                    key={data}
                    className="bg-black rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-[#B8952E]" />
                      <span className="text-white font-semibold">{data}</span>
                    </div>
                    <div className="space-y-2">
                      {listaAgendamentos.map((agendamento) => (
                        <div
                          key={agendamento.id}
                          className="flex items-center justify-between bg-neutral-900 rounded-lg p-3 border border-white/5"
                        >
                          <div className="flex flex-col text-sm text-white gap-1">
                            <span className="font-semibold">
                              {agendamento.nomeCliente}
                            </span>
                            <span className="text-white/70">
                              {agendamento.horario} - {agendamento.diaDaSemana}
                            </span>
                            <span className="text-white/60">
                              Serviços:{" "}
                              {agendamento.services
                                .map((s) => s.nome)
                                .join(", ")}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteAgendamento(agendamento.id)
                            }
                            className="p-2 rounded-lg hover:bg-red-900/30 transition-colors"
                            title="Cancelar agendamento"
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
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

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AdminPage;
