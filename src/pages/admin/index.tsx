import {
  ChevronLeft,
  Plus,
  Calendar,
  Clock,
  User,
  Trash2,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/loading-spinner";
import ConfirmModal from "../../components/modal";
import AgendamentoCalendar from "../agendamento/AgendamentoCalendar";
import useAdminPage from "./useAdminPage";

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

interface Hour {
  id: number;
  availableHour: string;
}

interface Service {
  id: number;
  nameService: string;
  valueService: string;
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
  const handleGoToHorarios = () => navigate("/admin/horarios");

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
              onClick={handleGoToHorarios}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-600 transition-colors"
            >
              <CalendarDays className="w-5 h-5" />
              <span className="hidden sm:inline">Horários</span>
            </button>
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
                    {hoursDisponible.map((hour: Hour) => (
                      <button
                        key={hour.id}
                        onClick={() => handleHourSelect(hour.id)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedHour === hour.id
                            ? "bg-[#B8952E] border-[#B8952E] text-black"
                            : "bg-black border-white/10 text-white hover:border-white/30"
                        }`}
                      >
                        {hour.availableHour}
                      </button>
                    ))}
                    {hoursAgendados.map((hour: Hour) => (
                      <button
                        key={hour.id}
                        disabled
                        className="py-2 rounded-lg text-sm font-medium border bg-red-900/30 border-red-900/50 text-red-500 cursor-not-allowed"
                      >
                        {hour.availableHour}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Serviços */}
              <div className="lg:w-1/3">
                <h3 className="text-white font-medium mb-3">Serviços *</h3>
                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                  {services.map((service: Service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        selectedServices.includes(service.id)
                          ? "bg-[#B8952E]/20 border-[#B8952E] text-[#B8952E]"
                          : "bg-black border-white/10 text-white hover:border-white/30"
                      }`}
                    >
                      <span className="text-sm">{service.nameService}</span>
                      <span className="text-sm font-medium">
                        R$ {service.valueService}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botão de Criar */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCreateAgendamento}
                disabled={
                  !nomeCliente.trim() ||
                  !selectedDate ||
                  !selectedHour ||
                  selectedServices.length === 0
                }
                className="px-6 py-3 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-[#a38427] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Agendamento
              </button>
            </div>
          </div>
        )}

        {/* Lista de Agendamentos */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Todos os Agendamentos
          </h2>

          {agendamentos.length === 0 ? (
            <p className="text-white/60 text-center py-8">
              Nenhum agendamento encontrado.
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(agendamentosPorData)
                .sort((a, b) => {
                  const dateA = new Date(
                    agendamentos.find(
                      (ag: Agendamento) => ag.dataAgendamento === a[0]
                    )?.dataOriginal || 0
                  );
                  const dateB = new Date(
                    agendamentos.find(
                      (ag: Agendamento) => ag.dataAgendamento === b[0]
                    )?.dataOriginal || 0
                  );
                  return dateA.getTime() - dateB.getTime();
                })
                .map(([data, agendamentosDoDia]: [string, Agendamento[]]) => (
                  <div key={data}>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#B8952E]" />
                      {data}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {agendamentosDoDia.map((agendamento) => (
                        <div
                          key={agendamento.id}
                          className="bg-black border border-white/10 rounded-lg p-4 flex flex-col gap-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-[#B8952E]" />
                              <span className="text-white font-medium">
                                {agendamento.nomeCliente}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteAgendamento(agendamento.id)
                              }
                              className="p-1.5 hover:bg-red-900/30 rounded transition-colors"
                              title="Cancelar agendamento"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{agendamento.horario}</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {agendamento.services.map(
                              (service: AgendamentoService) => (
                                <span
                                  key={service.id}
                                  className="px-2 py-1 bg-[#B8952E]/20 text-[#B8952E] text-xs rounded"
                                >
                                  {service.nome}
                                </span>
                              )
                            )}
                          </div>

                          {agendamento.telefone && (
                            <p className="text-white/40 text-xs">
                              📞 {agendamento.telefone}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
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

export default AdminPage;
