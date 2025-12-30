import ImageCarousel from "../components/components";
import MobileCarousel from "../components/MobileCarousel";
import SocialIcons from "../components/SocialIcons";
import BarbershopLogo from "../components/BarbershopLogo";
import ConfirmModal from "../components/modal";
import useHomePage from "../hooks/page/useHomePage";
import LoadingSpinner from "../components/loading-spinner";
import { Separator } from "../components/ui/separator";
import { Trash2 } from "lucide-react";

function HomeInterface() {
  const {
    user,
    agendamentos,
    loading,
    modalOpen,
    openDeleteModal,
    confirmDelete,
    closeModal,
  } = useHomePage();

  // Ensure user exists (já validado pelo RequireAuth)
  if (!user) {
    return null;
  }

  // Handlers moved into useHomePage hook

  return (
    <>
      <div className="flex w-full px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-10 min-h-screen md:h-screen ">
        <div className="flex w-full h-full flex-col items-center p-3 sm:p-6 md:p-10 bg-black rounded-[15px] gap-3 sm:gap-4">
          <div className="flex flex-col justify-between lg:flex-row w-full bg-neutral-800 rounded-[15px] gap-3 sm:gap-4 md:gap-0">
            {/* Nome da barbearia - Mobile (topo) */}
            <BarbershopLogo variant="mobile" className="lg:hidden mx-3 mt-3" />

            {/* Mobile Carousel - visível apenas em mobile */}
            <div className="lg:hidden w-full">
              <MobileCarousel />
            </div>

            {/* Separator visível apenas no mobile */}
            <div className="lg:hidden w-full px-4">
              <Separator className="bg-neutral-700" />
            </div>

            {/* Conteúdo Desktop - Nome + Botão à esquerda */}
            <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 md:py-0 md:px-0">
              {/* Nome da barbearia - Desktop */}
              <BarbershopLogo variant="desktop" className="hidden lg:flex" />
              {/* aqui eu vou colocar o icon da empresa */}
              <div
                className="
                  flex flex-col
                  justify-center 
                  px-3 sm:px-5 py-3 sm:py-5
                  gap-3
                  "
              >
                <p className="text-gray-100 font-medium text-sm sm:text-base">
                  Agende já
                </p>
                <button
                  onClick={() => (window.location.href = "/agendamento")}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#B8952E] rounded-[10px] font-medium hover:bg-yellow-400 transition-colors text-sm sm:text-base"
                >
                  Agendar
                </button>
              </div>
            </div>

            {/* Desktop Carousel - visível apenas em desktop */}
            <div className="hidden lg:flex items-center justify-center w-auto px-4 py-4">
              <ImageCarousel />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full h-auto lg:h-full justify-between items-stretch gap-3 sm:gap-4 min-h-0 bg-neutral-800 rounded-[15px] p-3 sm:p-4">
            {/* Barra lateral de redes sociais - Desktop */}
            <SocialIcons variant="desktop" />
            <div className="flex flex-col w-full lg:w-75 bg-neutral-900 items-start justify-start px-2 sm:px-4 py-3 sm:py-4 rounded-md max-h-screen lg:max-h-full min-w-0 overflow-hidden">
              <p className="text-[#B8952E] font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                Seus agendamentos
              </p>
              <div className="w-full overflow-y-auto sm:max-h-[350px] lg:max-h-full space-y-2 sm:space-y-3 pt-2">
                {loading ? (
                  <div className="flex items-center justify-center w-full py-8">
                    <LoadingSpinner
                      message="Carregando agendamentos..."
                      size="sm"
                    />
                  </div>
                ) : agendamentos.length === 0 ? (
                  <p className="text-white text-center text-xs sm:text-sm">
                    Nenhum agendamento encontrado.
                  </p>
                ) : (
                  agendamentos.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between w-full p-2 sm:p-3 text-white mb-2 sm:mb-3 bg-neutral-800 rounded-md gap-2"
                    >
                      <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
                        <span className="text-white text-xs sm:text-sm font-bold">
                          Realizado
                        </span>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs text-white/90 flex-wrap">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3 h-3 flex-shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="whitespace-nowrap text-xs">
                            {item.dataAgendamento}
                          </span>
                          <span className="whitespace-nowrap text-xs">
                            {item.hour}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => openDeleteModal(item.id)}
                        className="flex-shrink-0 cursor-pointer hover:text-yellow-400 transition-colors"
                        title="Deletar agendamento"
                      >
                        <Trash2 className="text-[#B8952E] w-5 h-5 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <SocialIcons variant="mobile" />
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onConfirm={confirmDelete}
        onCancel={closeModal}
        message="Tem certeza que deseja deletar este agendamento?"
      />
    </>
  );
}

export default HomeInterface;
