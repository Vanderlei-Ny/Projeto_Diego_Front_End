import { useState } from "react";
import ImageCarousel from "../components/components";
import ConfirmModal from "../components/modal";
import useHome from "../hooks/useHome";

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
      <div className="flex w-full px-8 py-10 h-screen ">
        <div className="flex w-full flex-col items-center p-10 bg-black rounded-[15px] gap-4">
          <div className="flex flex-col md:justify-between lg:flex-row w-full bg-neutral-800 rounded-[15px] ">
            <div className="flex h-full flex-col justify-between">
              <div
                className="
                  flex items-center 
                  justify-center 
                  bg-neutral-900 
                  text-[#B8952E] 
                  rounded-[15px] 
                  p-2
                  "
              >
                <p>Barbearia</p>
                <img src="public/scissors.svg" />
              </div>
              {/* aqui eu vou colocar o icon da empresa */}
              <div
                className="
                  flex flex-col
                  justify-center 
                  px-5 py-5
                  gap-3
                  "
              >
                <p className="text-gray-100 font-medium">Agende já</p>
                <button className="w-67 h-15 bg-[#B8952E] rounded-[10px] font-medium hover:bg-yellow-400">
                  Agendar
                </button>
              </div>
            </div>
            <div
              className="
                  flex items-center 
                  px-4 py-4
                  justify-center 
                  "
            >
              <div className="max-w-[400px] w-full mx-auto">
                <ImageCarousel />
              </div>
            </div>
          </div>
          <div className="flex w-full h-full justify-between bg-neutral-800 rounded-[15px] p-4">
            <div className="div"></div>
            <div className="flex rounded-md w-75 bg-neutral-900 itens-center justify-center p-2">
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
