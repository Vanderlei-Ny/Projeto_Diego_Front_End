import { ChevronLeft, Plus, Calendar, Clock, User, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/loading-spinner";
import ConfirmModal from "../components/modal";
import AgendamentoCalendar from "./scheduling/SchedulingCalendar";
import useAdminPage from "../hooks/useAdminPage";
import type { AdminAgendamento } from "@/types/scheduling/scheduling.types";
import { getTodayAndTomorrowBrDateKeys } from "@/utils/calendarDate";

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
  const isProcessing = isCreating || isDeleting;

  const getDateStatus = (listaAgendamentos: AdminAgendamento[]) => {
    const reference = listaAgendamentos[0];
    const referenceDateKey = reference?.dataAgendamento?.trim();

    if (!referenceDateKey) {
      return {
        label: "Próximos dias",
        className: "text-blue-300 border-blue-400/30 bg-blue-500/10",
      };
    }

    const { todayKey, tomorrowKey } = getTodayAndTomorrowBrDateKeys();

    if (referenceDateKey === todayKey) {
      return {
        label: "Hoje",
        className: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
      };
    }

    if (referenceDateKey === tomorrowKey) {
      return {
        label: "Amanhã",
        className: "text-amber-300 border-amber-400/30 bg-amber-500/10",
      };
    }

    return {
      label: "Próximos dias",
      className: "text-blue-300 border-blue-400/30 bg-blue-500/10",
    };
  };

  // Agrupar agendamentos por data
  const agendamentosPorData = agendamentos.reduce<
    Record<string, AdminAgendamento[]>
  >(
    (
      acc: Record<string, AdminAgendamento[]>,
      agendamento: AdminAgendamento,
    ) => {
      const data = agendamento.dataAgendamento;
      if (!acc[data]) {
        acc[data] = [];
      }
      acc[data].push(agendamento);
      return acc;
    },
    {},
  );

  return (
    <div className="app-page-bg flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 flex-col">
      {isProcessing && (
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

        {isLoading ? (
          <div className="bg-neutral-800 rounded-[15px] p-6 min-h-[45vh] flex items-center justify-center">
            <LoadingSpinner message="Carregando agendamentos..." size="lg" />
          </div>
        ) : (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
              {/* Data */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Data *
                </h3>
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <AgendamentoCalendar
                    key={selectedDate?.toISOString() ?? "no-date"}
                    selectedDate={selectedDate}
                    onSelect={handleDateSelect}
                    activeWeekdays={activeWeekdays}
                    showContainer={false}
                    title=""
                  />
                </div>
              </div>

              {/* Horários */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Horário *
                </h3>
                <div className="bg-black/30 border border-white/10 rounded-xl p-4 min-h-[140px]">
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
                        hoursAgendados.length > 0 && (
                          <p className="col-span-full rounded-md border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                            Todos os horários deste dia já foram agendados.
                            Escolha uma outra data.
                          </p>
                        )}

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
              </div>

              {/* Serviços */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Serviços
                </h3>
                <div className="bg-black/30 border border-white/10 rounded-xl p-4 min-h-[140px]">
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
                ([data, listaAgendamentos]) => {
                  const dateStatus = getDateStatus(listaAgendamentos);

                  return (
                    <div
                      key={data}
                      className="bg-black rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#B8952E]" />
                          <span className="text-white font-semibold">
                            {data}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${dateStatus.className}`}
                        >
                          {dateStatus.label}
                        </span>
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
                                {agendamento.horario} -{" "}
                                {agendamento.diaDaSemana}
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
                  );
                },
              )}
            </div>
          )}
        </div>

          </>
        )}
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
