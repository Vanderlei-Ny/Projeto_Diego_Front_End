import { useEffect, useState } from "react";
import ImageCarousel from "../components/components";
import MobileCarousel from "../components/MobileCarousel";
import SocialIcons from "../components/SocialIcons";
import BarbershopLogo from "../components/BarbershopLogo";
import ConfirmModal from "../components/modal";
import useHomePage from "../hooks/useHomePage";
import LoadingSpinner from "../components/loading-spinner";
import InstallAppModal from "../components/InstallAppModal";
import useInstallPrompt from "../hooks/useInstallPrompt";
import {
  ArrowRight,
  CalendarDays,
  Download,
  Scissors,
  Shield,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function HomeInterface() {
  const navigate = useNavigate();
  const {
    user,
    agendamentos,
    loading,
    isDeleting,
    isAdmin,
    modalOpen,
    openDeleteModal,
    confirmDelete,
    closeModal,
  } = useHomePage();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [isInstallDialogOpen, setIsInstallDialogOpen] = useState(false);

  useEffect(() => {
    const shouldShowInstall = localStorage.getItem("showInstallPrompt") === "1";

    if (shouldShowInstall && canInstall) {
      setIsInstallDialogOpen(true);
      localStorage.removeItem("showInstallPrompt");
    }
  }, [canInstall]);

  // Ensure user exists (já validado pelo RequireAuth)
  if (!user) {
    return null;
  }

  // Handlers moved into useHomePage hook

  const firstName = user.name?.split(" ")[0] ?? "Cliente";

  const handleInstallClick = async () => {
    const result = await promptInstall();

    if (result?.outcome === "accepted") {
      setIsInstallDialogOpen(false);
    } else {
      setIsInstallDialogOpen(false);
    }
  };

  return (
    <>
      <div className="app-page-bg w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-10">
        <div className="flex w-full h-full flex-col items-center p-3 sm:p-6 md:p-10 gap-3 sm:gap-4 min-h-0 lg:h-[calc(100vh-5rem)]">
          <div className="relative flex flex-col justify-between lg:flex-row w-full bg-neutral-800 rounded-[15px] p-4 md:p-6 gap-4 border border-white/10">
            {canInstall && (
              <button
                type="button"
                onClick={() => setIsInstallDialogOpen(true)}
                title="Instalar aplicativo"
                className="absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-black/50 text-white/80 hover:text-white hover:border-[#B8952E]/60 hover:bg-black/70 transition"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
            <div className="flex h-full flex-col justify-between gap-4 sm:gap-5 px-3 sm:px-4 py-3 sm:py-4 md:py-0 md:px-0 lg:max-w-[520px]">
              <BarbershopLogo variant="mobile" className="lg:hidden" />
              <BarbershopLogo
                variant="desktop"
                className="hidden lg:flex w-fit"
              />

              <div className="space-y-3">
                <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Bem-vindo, <span className="text-[#B8952E]">{firstName}</span>
                </h1>

                <p className="text-white/70 text-sm sm:text-base max-w-xl">
                  Experiência completa de barbearia: agende seu horário em
                  segundos, acompanhe seus atendimentos e mantenha seu estilo
                  sempre em dia.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/80">
                  <CalendarDays className="w-3.5 h-3.5 text-[#B8952E]" /> Ter a
                  Sáb
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/80">
                  <Scissors className="w-3.5 h-3.5 text-[#B8952E]" /> Estilo em
                  dia
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {!isAdmin && (
                  <button
                    onClick={() => navigate("/agendamento")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-[#B8952E] rounded-[10px] font-semibold hover:bg-yellow-400 transition-colors text-sm sm:text-base text-black"
                  >
                    Agendar agora <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {isAdmin && (
                  <>
                    <button
                      onClick={() => navigate("/admin?quick=1")}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-[#B8952E] rounded-[10px] font-semibold hover:bg-yellow-400 transition-colors text-sm sm:text-base text-black"
                    >
                      Agendamento rápido <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate("/admin")}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-neutral-700 border border-[#B8952E] rounded-[10px] font-medium hover:bg-neutral-600 transition-colors text-sm sm:text-base text-[#B8952E]"
                    >
                      <Shield className="w-4 h-4" /> Painel Admin
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="lg:hidden w-full">
              <MobileCarousel />
            </div>

            <div className="hidden lg:flex items-center justify-center w-auto px-4 py-4">
              <ImageCarousel />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full lg:flex-1 justify-between items-stretch gap-3 sm:gap-4 min-h-0 bg-neutral-800 rounded-[15px] p-4 md:p-6 overflow-hidden">
            <SocialIcons variant="desktop" />

            {!isAdmin && (
              <div className="flex flex-col w-full lg:w-75 bg-black border border-white/10 items-start justify-start px-4 py-4 rounded-xl h-full max-h-full min-w-0 overflow-hidden">
                <div className="mb-2 sm:mb-3 w-full flex items-center justify-between gap-2">
                  <p className="text-[#B8952E] font-semibold text-sm sm:text-base">
                    Seus agendamentos
                  </p>
                  <span className="text-xs px-2 py-1 rounded-md border border-[#B8952E]/40 bg-[#B8952E]/10 text-[#F2D37A]">
                    {agendamentos.length} marcado(s)
                  </span>
                </div>

                <div className="w-full flex-1 min-h-0 overflow-y-auto space-y-2 sm:space-y-3 pt-2">
                  {loading ? (
                    <div className="flex items-center justify-center w-full py-8">
                      <LoadingSpinner
                        message="Carregando agendamentos..."
                        size="sm"
                      />
                    </div>
                  ) : agendamentos.length === 0 ? (
                    <div className="w-full rounded-lg border border-white/10 bg-black/60 p-4 text-center">
                      <p className="text-white text-xs sm:text-sm">
                        Nenhum agendamento encontrado.
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        Faça seu primeiro agendamento e garanta seu horário.
                      </p>
                    </div>
                  ) : (
                    agendamentos.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between w-full p-2 sm:p-3 text-white mb-2 sm:mb-3 bg-black border border-white/10 rounded-lg gap-2 hover:border-[#B8952E]/40 transition-colors"
                      >
                        <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
                          <span className="text-[#F2D37A] text-xs sm:text-sm font-semibold">
                            Agendamento confirmado
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

                          {item.nameServices && item.nameServices.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.nameServices.slice(0, 2).map((service) => (
                                <span
                                  key={service}
                                  className="px-2 py-0.5 rounded border border-white/10 bg-black/60 text-[10px] text-white/80"
                                >
                                  {service}
                                </span>
                              ))}
                              {item.nameServices.length > 2 ? (
                                <span className="px-2 py-0.5 rounded border border-white/10 bg-black/60 text-[10px] text-white/60">
                                  +{item.nameServices.length - 2}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </div>

                        <button
                          onClick={() => openDeleteModal(item.id)}
                          disabled={isDeleting || loading}
                          className="flex-shrink-0 cursor-pointer hover:text-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Deletar agendamento"
                        >
                          <Trash2 className="text-[#B8952E] w-5 h-5 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <SocialIcons variant="mobile" />
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onConfirm={confirmDelete}
        onCancel={closeModal}
        message="Tem certeza que deseja deletar este agendamento?"
        isProcessing={isDeleting || loading}
      />

      <InstallAppModal
        isOpen={isInstallDialogOpen && canInstall}
        onConfirm={handleInstallClick}
        onCancel={() => setIsInstallDialogOpen(false)}
      />
    </>
  );
}

export default HomeInterface;
