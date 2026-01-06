import LoadingSpinner from "../components/loading-spinner";
import { ChevronLeft, Clock, Check } from "lucide-react";
import useAgendamentoPage from "./agendamento/useAgendamentoPage";
import AgendamentoCalendar from "./agendamento/AgendamentoCalendar";

function Agendamento() {
  const {
    services,
    hoursDisponible,
    hoursAgendados,
    dayData,
    isBusy,
    isVerifyingDay,
    selectedDate,
    selectedHour,
    selectedServices,
    activeWeekdays,
    diasBloqueados,
    handleDateSelect,
    handleServiceToggle,
    handleHourSelect,
    handleSubmit,
    handleGoHome,
  } = useAgendamentoPage();

  return (
    <div className="flex w-full h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 bg-black flex-col overflow-hidden">
      {isBusy && <LoadingSpinner fullScreen message="Processando..." />}

      <div className="flex w-full max-w-7xl mx-auto flex-col gap-4 sm:gap-6 h-full min-h-0">
        {/* Header */}
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6 flex-shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E]">
              Agende um atendimento
            </h1>
          </div>
          <button
            onClick={handleGoHome}
            className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Coluna Esquerda: Calendário */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <AgendamentoCalendar
              key={selectedDate?.toISOString() ?? "no-date"}
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
              activeWeekdays={activeWeekdays}
              diasBloqueados={diasBloqueados}
            />
          </div>

          {/* Coluna Direita: Horários e Serviços */}
          {selectedDate && (
            <div className="flex flex-col w-full lg:w-2/3 gap-4 flex-1 min-h-0">
              {/* Horários */}
              <div className="bg-neutral-800 rounded-[15px] p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Horários
                </h2>
                {isVerifyingDay ? (
                  <div className="flex items-center justify-center py-6">
                    <LoadingSpinner
                      message="Carregando horários..."
                      size="sm"
                    />
                  </div>
                ) : !dayData ? (
                  <div className="text-white/60 text-sm">
                    Selecione uma data válida para carregar os horários.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {hoursDisponible.length === 0 &&
                      hoursAgendados.length === 0 && (
                        <div className="col-span-full text-white/60 text-sm text-center">
                          Nenhum horário configurado para este dia.
                        </div>
                      )}

                    {hoursDisponible.map((hour) => (
                      <button
                        key={`available-${hour.id}`}
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
                        key={`busy-${hour.id}`}
                        disabled
                        className="py-2 rounded-lg text-sm bg-black border-white/5 text-white/20 cursor-not-allowed"
                      >
                        {hour.availableHour}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Serviços com Scroll */}
              <div className="bg-neutral-800 rounded-[15px] p-4 sm:p-6 flex-1 flex flex-col min-h-0">
                <h2 className="text-lg font-semibold text-[#B8952E] mb-4">
                  Serviços
                </h2>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {services.map((service) => (
                    <button
                      key={`service-${service.id}`}
                      onClick={() => handleServiceToggle(service.id)}
                      className={`w-full p-4 rounded-lg text-left border transition-all flex justify-between items-center ${
                        selectedServices.includes(service.id)
                          ? "bg-[#B8952E] border-[#B8952E] text-black"
                          : "bg-black border-white/10 text-white"
                      }`}
                    >
                      <div>
                        <p className="font-bold">{service.name}</p>
                        <p
                          className={
                            selectedServices.includes(service.id)
                              ? "text-black/70"
                              : "text-white/50"
                          }
                        >
                          R$ {service.value}
                        </p>
                      </div>
                      {selectedServices.includes(service.id) && (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Footer de Ação */}
                <div className="mt-4 pt-4 border-t border-white/10 flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      selectedServices.length === 0 || !selectedHour || isBusy
                    }
                    className="w-full py-3 bg-[#B8952E] text-black font-bold rounded-xl hover:bg-[#d4af37] disabled:opacity-30 transition-all"
                  >
                    Finalizar Agendamento
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Agendamento;
