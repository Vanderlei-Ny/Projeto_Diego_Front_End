import {
  ChevronLeft,
  Plus,
  Trash2,
  CalendarOff,
  AlertTriangle,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/loading-spinner";
import ConfirmModal from "../components/modal";
import AgendamentoCalendar from "./scheduling/SchedulingCalendar";
import useTimeOffPage from "./admin/timeOff/useTimeOffPage";
import type {
  AgendamentoNoDia,
  DiaBloqueado,
} from "@/types/time-off/time-off.types";

function AdminTimeOffPage() {
  const navigate = useNavigate();
  const {
    diasBloqueados,
    isLoadingDias,
    selectedDate,
    handleDateSelect,
    motivo,
    setMotivo,
    agendamentosNoDia,
    showAgendamentosWarning,
    isCreating,
    isRemoving,
    handleCreateDiaBloqueado,
    handleRemoveDiaBloqueado,
    // Modal de confirmação
    deleteModalOpen,
    deleteModalMessage,
    confirmDelete,
    closeDeleteModal,
  } = useTimeOffPage();

  const handleGoBack = () => navigate("/admin");

  const isProcessing = isCreating || isRemoving;

  return (
    <div className="app-page-bg flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 flex-col">
      {isProcessing && <LoadingSpinner fullScreen message="Processando..." />}

      <div className="flex w-full max-w-4xl mx-auto flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E] flex items-center gap-2">
              <CalendarOff className="w-6 h-6" />
              Gerenciar Folgas
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Bloqueie dias específicos (folgas, feriados, imprevistos)
            </p>
          </div>
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Formulário para bloquear dia */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6 ">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Bloquear Novo Dia
          </h2>

          <div className="flex flex-col gap-6">
            {/* Campo de motivo */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Motivo (opcional)
              </label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Folga, Feriado, Imprevisto..."
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E] placeholder:text-white/30"
              />
            </div>

            <div className="flex flex-col w-full gap-3">
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <AgendamentoCalendar
                  selectedDate={selectedDate}
                  onSelect={handleDateSelect}
                  activeWeekdays={[
                    "DOMINGO",
                    "SEGUNDA",
                    "TERCA",
                    "QUARTA",
                    "QUINTA",
                    "SEXTA",
                    "SABADO",
                  ]}
                  showContainer={false}
                  showSelectedSummary={false}
                  title="Selecione a Data"
                />
              </div>

              <div className="p-4 flex flex-col gap-4">
                {showAgendamentosWarning && agendamentosNoDia.length > 0 && (
                  <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-500 mb-3">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">
                        Existem {agendamentosNoDia.length} agendamento(s) neste
                        dia!
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                      Cancele os agendamentos antes de bloquear o dia:
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {agendamentosNoDia.map((ag: AgendamentoNoDia) => (
                        <div
                          key={ag.id}
                          className="flex items-center gap-3 bg-black/50 rounded p-2 text-sm"
                        >
                          <User className="w-4 h-4 text-white/40" />
                          <span className="text-white">{ag.cliente}</span>
                          <Clock className="w-4 h-4 text-white/40 ml-auto" />
                          <span className="text-white/60">{ag.horario}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCreateDiaBloqueado}
                  disabled={
                    !selectedDate ||
                    (showAgendamentosWarning && agendamentosNoDia.length > 0)
                  }
                  className="w-full px-6 py-3 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CalendarOff className="w-5 h-5" />
                  Bloquear Dia
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de dias bloqueados */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Dias Bloqueados
          </h2>

          {isLoadingDias ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner message="Carregando dias..." size="sm" />
            </div>
          ) : diasBloqueados.length === 0 ? (
            <div className="text-center py-8">
              <CalendarOff className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">Nenhum dia bloqueado.</p>
              <p className="text-white/40 text-sm mt-1">
                Selecione uma data acima para bloquear.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {diasBloqueados.map((dia: DiaBloqueado) => (
                <div
                  key={dia.id}
                  className="bg-black border border-[#B8952E]/30 rounded-xl p-4 flex items-center justify-between hover:border-[#B8952E] transition-colors group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-medium">
                      {dia.dataFormatada}
                    </span>
                    <span className="text-white/60 text-sm capitalize">
                      {dia.diaSemana}
                    </span>
                    {dia.motivo && (
                      <span className="text-[#B8952E] text-xs">
                        {dia.motivo}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      handleRemoveDiaBloqueado(dia.id, dia.dataFormatada)
                    }
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                    title="Desbloquear dia"
                  >
                    <Trash2 className="w-5 h-5 text-white/70 hover:text-red-400" />
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

export default AdminTimeOffPage;
