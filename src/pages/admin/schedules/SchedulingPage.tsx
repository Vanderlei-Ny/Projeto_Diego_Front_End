import {
  ChevronLeft,
  Plus,
  Clock,
  Trash2,
  X,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/loading-spinner";
import ConfirmModal from "../../../components/modal";
import useHorariosPage from "./useSchedulesPage";

interface Hour {
  id: number;
  availableHour: string;
}

interface DayWithHours {
  id: number;
  weekday: string;
  isActive: boolean;
  hours: Hour[];
}

type DiaDaSemana =
  | "DOMINGO"
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO";

// Mapa para traduzir os dias
const dayNameMap: Record<string, string> = {
  DOMINGO: "Domingo",
  SEGUNDA: "Segunda-feira",
  TERCA: "Terça-feira",
  QUARTA: "Quarta-feira",
  QUINTA: "Quinta-feira",
  SEXTA: "Sexta-feira",
  SABADO: "Sábado",
  // English enum keys mapping to Portuguese
  SUNDAY: "Domingo",
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
};

function SchedulingPage() {
  const navigate = useNavigate();
  const {
    allDaysAndHours,
    isLoadingDays,
    selectedDayToManage,
    setSelectedDayToManage,
    newHourInput,
    handleHourInputChange,
    showAddDayForm,
    setShowAddDayForm,
    newDayName,
    setNewDayName,
    availableDaysToAdd,
    isAddingHour,
    isRemovingHour,
    isTogglingDay,
    isCreatingDay,
    isRemovingDay,
    handleAddHour,
    handleRemoveHour,
    handleCreateDay,
    handleRemoveDay,
    // Modal de confirmação
    deleteModalOpen,
    deleteModalMessage,
    confirmDelete,
    closeDeleteModal,
  } = useHorariosPage();

  const handleGoBack = () => navigate("/admin");

  const isProcessing =
    isAddingHour ||
    isRemovingHour ||
    isTogglingDay ||
    isCreatingDay ||
    isRemovingDay;

  return (
    <div className="flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 bg-black flex-col">
      {isProcessing && <LoadingSpinner fullScreen message="Processando..." />}

      <div className="flex w-full max-w-4xl mx-auto flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E] flex items-center gap-2">
              <CalendarDays className="w-6 h-6" />
              Gerenciar Horários
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Configure os dias e horários de funcionamento
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddDayForm(!showAddDayForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-[#a38427] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Adicionar Dia</span>
            </button>
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Formulário para adicionar novo dia */}
        {showAddDayForm && (
          <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
            <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Adicionar Novo Dia
            </h2>

            {availableDaysToAdd.length === 0 ? (
              <p className="text-white/60">
                Todos os dias já estão cadastrados.
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-white/80 text-sm mb-2">
                    Dia da Semana
                  </label>
                  <select
                    value={newDayName}
                    onChange={(e) =>
                      setNewDayName(e.target.value as DiaDaSemana | "")
                    }
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E]"
                  >
                    <option value="">Selecione o dia...</option>
                    {availableDaysToAdd.map((day) => (
                      <option key={day} value={day}>
                        {dayNameMap[day]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={() => {
                      setShowAddDayForm(false);
                      setNewDayName("");
                    }}
                    className="px-4 py-3 bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateDay}
                    disabled={!newDayName}
                    className="px-6 py-3 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-[#a38427] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Criar Dia
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lista de dias cadastrados */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Dias de Funcionamento
          </h2>

          {isLoadingDays ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner message="Carregando dias..." size="sm" />
            </div>
          ) : allDaysAndHours.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">Nenhum dia cadastrado.</p>
              <p className="text-white/40 text-sm mt-1">
                Clique em "Adicionar Dia" para começar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allDaysAndHours.map((day: DayWithHours) => (
                <div
                  key={day.id}
                  className={`bg-black border border-white/10 rounded-xl overflow-hidden transition-all ${
                    selectedDayToManage === day.id
                      ? "ring-2 ring-[#B8952E]"
                      : ""
                  }`}
                >
                  {/* Cabeçalho do dia */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-900/50 transition-colors"
                    onClick={() =>
                      setSelectedDayToManage(
                        selectedDayToManage === day.id ? null : day.id,
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium text-white">
                        DEBUG: {JSON.stringify(day.weekday)} -{" "}
                        {day.weekday
                          ? dayNameMap[day.weekday] || day.weekday
                          : "Sem nome"}
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-800 rounded-full text-white/60 text-xs">
                        {day.hours?.length || 0} horário
                        {(day.hours?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={`w-5 h-5 text-white/60 transition-transform ${
                          selectedDayToManage === day.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Conteúdo expandido */}
                  {selectedDayToManage === day.id && (
                    <div className="p-4 border-t border-white/10 bg-neutral-900/30">
                      {/* Adicionar novo horário */}
                      <div className="mb-4">
                        <label className="block text-white/80 text-sm mb-2">
                          Adicionar Horário
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newHourInput}
                            onChange={(e) =>
                              handleHourInputChange(e.target.value)
                            }
                            placeholder="Digite: 0900 → 09:00"
                            className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E] placeholder:text-white/30"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAddHour()
                            }
                          />
                          <button
                            onClick={handleAddHour}
                            className="px-4 py-3 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-[#a38427] transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Lista de horários */}
                      <div className="mb-4">
                        <label className="block text-white/80 text-sm mb-2">
                          Horários Cadastrados
                        </label>
                        {day.hours.length === 0 ? (
                          <p className="text-white/40 text-sm py-2">
                            Nenhum horário cadastrado. Adicione acima.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {day.hours.map((hour: Hour) => {
                              console.log("⏰ Horário:", hour);
                              return (
                                <div
                                  key={hour.id}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-black border border-white/10 rounded-lg group hover:border-[#B8952E]/50 transition-colors"
                                >
                                  <Clock className="w-4 h-4 text-[#B8952E]" />
                                  <span className="text-white font-medium">
                                    DEBUG: {JSON.stringify(hour.availableHour)}{" "}
                                    - {hour.availableHour || "Sem horário"}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveHour(hour.id)}
                                    className="p-1 hover:bg-red-900/30 rounded transition-colors opacity-50 group-hover:opacity-100"
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Botão remover dia */}
                      <button
                        onClick={() => handleRemoveDay(day.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 border border-red-900/30 text-red-500 rounded-lg font-medium hover:bg-red-900/40 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        Remover Dia
                      </button>
                    </div>
                  )}
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

export default SchedulingPage;
