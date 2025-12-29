import ImageCarousel from "../components/components";
import ConfirmModal from "../components/modal";
import useHomePage from "../hooks/page/useHomePage";
import LoadingSpinner from "../components/loading-spinner";
import { Trash2, Instagram, MessageCircle, Facebook } from "lucide-react";
import { toast } from "sonner";

function HomeInterface() {
  const {
    user,
    authLoading,
    agendamentos,
    loading,
    modalOpen,
    openDeleteModal,
    confirmDelete,
    closeModal,
  } = useHomePage();

  // Show loading state while auth context is loading
  if (authLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-black">
        <LoadingSpinner message="Carregando..." size="lg" />
      </div>
    );
  }

  // Ensure user exists
  if (!user) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-black">
        <div className="text-white text-center">
          <p>Erro: Usuário não encontrado</p>
        </div>
      </div>
    );
  }

  // Handlers moved into useHomePage hook

  return (
    <>
      <div className="flex w-full px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-10 min-h-screen md:h-screen ">
        <div className="flex w-full h-full flex-col items-center p-3 sm:p-6 md:p-10 bg-black rounded-[15px] gap-3 sm:gap-4">
          <div className="flex flex-col md:justify-between lg:flex-row w-full bg-neutral-800 rounded-[15px] gap-3 sm:gap-4 md:gap-0">
            <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 md:py-0 md:px-0">
              <div
                className="
                  flex items-center 
                  justify-center 
                  bg-neutral-900 
                  text-[#B8952E] 
                  rounded-[15px] 
                  p-2
                  text-xs sm:text-sm md:text-base
                  gap-2
                  "
              >
                <p>Barbearia Diego Bueno</p>
                <img
                  src="/scissors.svg"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  alt="Tesoura"
                />
              </div>
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
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#B8952E] rounded-[10px] font-medium hover:bg-yellow-400 transition-colors text-sm sm:text-base">
                  Agendar
                </button>
              </div>
            </div>
            <div
              className="
                  flex items-center 
                  px-2 sm:px-4 py-3 sm:py-4
                  justify-center 
                  w-full md:w-auto
                  "
            >
              <div className="max-w-[300px] sm:max-w-[350px] md:max-w-[400px] w-full mx-auto">
                <ImageCarousel />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full h-full justify-between items-stretch gap-3 sm:gap-4 min-h-0 bg-neutral-800 rounded-[15px] p-3 sm:p-4">
            <div className="relative group flex items-center cursor-pointer lg:flex">
              <div className="rounded-md w-5 h-full bg-[#B8952E] hover:bg-yellow-400 transition-colors duration-200" />
              <div className="absolute hidden flex-col left-full ml-3 top-1/2 -translate-y-1/2 z-10 group-hover:flex bg-neutral-900/95 rounded-md shadow-lg p-2 gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-800"
                >
                  <MessageCircle className="text-[#B8952E]" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-800"
                >
                  <Instagram className="text-[#B8952E]" />
                </a>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  aria-label="Facebook"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-800"
                >
                  <Facebook className="text-[#B8952E]" />
                </a>
              </div>
            </div>
            <div className="flex flex-col w-full lg:w-75 bg-neutral-900 items-start justify-start px-2 sm:px-4 py-3 sm:py-4 rounded-md max-h-screen lg:max-h-full min-w-0 overflow-hidden">
              <p className="text-[#B8952E] font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                Seus agendamentos
              </p>
              <div className="w-full overflow-y-auto max-h-[300px] sm:max-h-[350px] lg:max-h-full space-y-2 sm:space-y-3 pt-2">
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
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat bg-center cursor-pointer flex-shrink-0 hover:text-yellow-400 transition-colors p-1"
                        title="Deletar agendamento"
                      >
                        <Trash2 className="text-[#B8952E] w-full h-full" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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
