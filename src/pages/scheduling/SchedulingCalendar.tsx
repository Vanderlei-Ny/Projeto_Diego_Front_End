import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { useCallback, useState } from "react";
import dayjs from "dayjs";
import type { AgendamentoCalendarProps } from "@/types/components/component-props.types";

export default function AgendamentoCalendar({
  selectedDate,
  onSelect,
  activeWeekdays = [],
  diasBloqueados = [],
  disablePastDates = true,
  showContainer = true,
  showSelectedSummary = true,
  title = "Data",
  className = "",
}: AgendamentoCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDayName = (date: Date) => {
    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return days[date.getDay()];
  };

  const handleSelectDate = useCallback(
    (date: Date | undefined) => {
      if (!date) return;

      onSelect(date);

      // Aguarda mais tempo para o calendário renderizar a seleção visualmente
      setIsOpen(false);
    },
    [onSelect],
  );

  return (
    <div
      className={`${showContainer ? "bg-neutral-800 rounded-[15px] p-4" : ""} ${className}`.trim()}
    >
      {title ? (
        <h2 className="text-lg font-semibold text-[#B8952E] mb-4">{title}</h2>
      ) : null}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white hover:border-white/20 transition-colors">
            <CalendarIcon className="w-5 h-5 text-[#B8952E]" />
            {selectedDate
              ? selectedDate.toLocaleDateString("pt-BR")
              : "Selecione uma data"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-700">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            disabled={(date) => {
              const today = new Date(new Date().setHours(0, 0, 0, 0));
              const isPast = date < today;

              if (disablePastDates && isPast) return true;

              // Verificar se o dia está bloqueado
              const dateStr = dayjs(date).format("YYYY-MM-DD");
              if (diasBloqueados.includes(dateStr)) {
                return true;
              }

              if (activeWeekdays && activeWeekdays.length > 0) {
                const weekdayIndex = date.getDay();
                const weekdayMap = [
                  "DOMINGO",
                  "SEGUNDA",
                  "TERCA",
                  "QUARTA",
                  "QUINTA",
                  "SEXTA",
                  "SABADO",
                ];
                const weekday = weekdayMap[weekdayIndex];
                const isAllowed = weekday && activeWeekdays.includes(weekday);
                return !isAllowed;
              }

              return false;
            }}
            showOutsideDays
            classNames={{
              day_selected:
                "rdp-day_selected bg-[#B8952E] text-black font-bold border-2 border-[#F2D37A]",
            }}
            className="bg-neutral-900 text-white [--rdp-accent-color:#B8952E] [--rdp-accent-background:#B8952E] [&_.rdp-caption]:text-[#F2D37A] [&_.rdp-nav_button]:text-[#F2D37A] hover:[&_.rdp-nav_button]:bg-neutral-700 [&_.rdp-head_cell]:text-[#F2D37A] [&_.rdp-day]:text-[#F2D37A] [&_.rdp-day_today]:text-[#F2D37A] [&_.rdp-day_today]:font-bold [&_.rdp-day_selected]:bg-[#B8952E] [&_.rdp-day_selected]:text-black [&_.rdp-day_selected]:font-bold [&_.rdp-day_selected]:border-2 [&_.rdp-day_selected]:border-[#F2D37A] [&_.rdp-day_disabled]:opacity-30 [&_.rdp-day_disabled]:text-white/40 [&_.rdp-button:hover:not([disabled])]:bg-neutral-800"
          />
        </PopoverContent>
      </Popover>

      {showSelectedSummary && selectedDate && (
        <div className="mt-4 p-3 bg-black rounded-lg border border-[#B8952E]/30">
          <p className="text-white/70 text-xs uppercase tracking-wider">
            Data selecionada
          </p>
          <p className="text-[#F2D37A] text-lg font-bold mt-1">
            {getDayName(selectedDate)} ·{" "}
            {selectedDate.toLocaleDateString("pt-BR")}
          </p>
        </div>
      )}
    </div>
  );
}
