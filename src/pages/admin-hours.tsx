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
import LoadingSpinner from "../components/loading-spinner";
import ConfirmModal from "../components/modal";
import useHoursPage from "@/pages/admin/schedules/useSchedulesPage";

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
};

function AdminHoursPage() {
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
  } = useHoursPage();

  const handleGoBack = () => navigate("/admin");

  const isProcessing =
    isAddingHour || isRemovingHour || isCreatingDay || isRemovingDay;

  return (
    <div className="app-page-bg flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 flex-col transition-colors">
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
              className="flex items-center gap-2 px-4 py-2 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
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
                    {availableDaysToAdd.map((day: DiaDaSemana) => (
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
                    className="px-6 py-3 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className={`bg-black border rounded-xl overflow-hidden transition-all ${
                    selectedDayToManage === day.id
                      ? "border-[#B8952E]"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 text-white">
                      <button
                        onClick={() =>
                          setSelectedDayToManage(
                            selectedDayToManage === day.id ? null : day.id,
                          )
                        }
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            selectedDayToManage === day.id
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                        />
                      </button>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {dayNameMap[day.weekday]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveDay(day.id)}
                        className="p-2 rounded-lg text-white hover:bg-yellow-200/50 hover:text-[#B8952E] transition-colors"
                        title="Remover dia"
                      >
                        <Trash2 className="w-5 h-5 " />
                      </button>
                    </div>
                  </div>

                  {selectedDayToManage === day.id && (
                    <div className="border-t border-white/5 p-4 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap text-sm text-white/80">
                        <div className="flex gap-2">
                          <Clock className="text-[#B8952E]" />
                          <span>Horários:</span>
                        </div>
                        {day.hours.length === 0 ? (
                          <span className="text-white/50">
                            Nenhum horário cadastrado.
                          </span>
                        ) : (
                          day.hours.map((hour: Hour) => (
                            <span
                              key={hour.id}
                              className="flex items-center gap-2 px-3 py-2 bg-[#B8952E] rounded-lg"
                            >
                              {hour.availableHour}
                              <button
                                onClick={() => handleRemoveHour(hour.id)}
                                className="text-white/70 hover:text-[#B8952E]"
                                title="Remover horário"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={newHourInput}
                          onChange={(e) =>
                            handleHourInputChange(e.target.value)
                          }
                          placeholder="Ex: 14:30"
                          className="w-full sm:w-48 px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (selectedDayToManage !== day.id) {
                                setSelectedDayToManage(day.id);
                              }
                              handleAddHour();
                            }}
                            disabled={!newHourInput.trim()}
                            className="px-4 py-3 bg-[#B8952E] text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Adicionar Horário
                          </button>
                          <button
                            onClick={() => handleHourInputChange("")}
                            className="px-4 py-3 bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-600 transition-colors"
                          >
                            Limpar
                          </button>
                        </div>
                      </div>
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

export default AdminHoursPage;
