import { useState } from "react";
import ImageCarousel from "../../components/components";
import ConfirmModal from "../../components/modal";
import useHome from "../../hooks/useHome";

function HomeInterface() {
  const { agendamentos, deleteAgendamento } = useHome();

  const [modalOpen, setModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const openDeleteModal = (id: number) => {
    setIdToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (idToDelete === null) return;

    try {
      await deleteAgendamento(idToDelete);
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar agendamento.");
    } finally {
      setModalOpen(false);
      setIdToDelete(null);
    }
  };

  return (
    <>
      <div className="w-full max-w-[1400px] flex flex-col items-center ">
        <div className="flex flex-col md:justify-between lg:flex-row w-full sm:max-w-[400px] lg:max-w-[1250px] lg:h-[374px] bg-gray-500 rounded-[15px] border-[3px] sm:h-auto">
          <div className="flex px-3 items-center justify-center"></div>
          <div className="hidden lg:flex flex-1 justify-end items-center p-12">
            <ImageCarousel />
          </div>
        </div>

        <div className="lg:hidden mt-6 w-full max-w-[350px] sm:max-w-[380px] flex justify-center">
          <ImageCarousel />
        </div>

        <div className="w-full max-w-[1250px] mt-6 flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-6 sm:gap-8">
          <div className="w-full max-w-[350px] sm:max-w-[380px] lg:w-96 min-h bg-gray-500 rounded-2xl border-[3px] p-4 sm:p-6">
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="text-white text-lg sm:text-xl font-extrabold font-['Inter'] text-center mb-4">
                Seus agendamentos
              </div>
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[url('/navalha.png')] bg-contain bg-no-repeat bg-center mb-4"></div>
            </div>

            {agendamentos.length === 0 ? (
              <p className="text-white text-center text-sm sm:text-base">
                Nenhum agendamento encontrado.
              </p>
            ) : (
              agendamentos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between w-full p-3 sm:p-4 border border-[#D4B879] rounded-2xl bg-black/40 text-white mb-3"
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <span className="text-white text-sm sm:text-base font-bold">
                      Realizado
                    </span>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 flex-wrap">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="whitespace-nowrap">
                        {item.dataAgendamento}
                      </span>
                      <span className="whitespace-nowrap">{item.hour}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openDeleteModal(item.id)}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-[url('/lixeira.svg')] bg-contain bg-no-repeat bg-center cursor-pointer flex-shrink-0 ml-2"
                  ></button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
        message="Tem certeza que deseja deletar este agendamento?"
      />
    </>
  );
}

export default HomeInterface;
