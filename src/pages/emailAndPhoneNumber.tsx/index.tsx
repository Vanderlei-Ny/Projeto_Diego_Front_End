import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInsertEmailAndPhoneNumber from "../../hooks/useInsertEmailAndPhoneNumber";
import useAuth from "../../hooks/useAuth";

function InsertEmailAndPhoneNumber() {
  const navigation = useNavigate();
  const [name, setName] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { updateInfo } = useInsertEmailAndPhoneNumber();

  useEffect(() => {
    if (!user?.userId) {
      navigation("/cadastro");
    }
  }, [navigation, user]);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");

    if (input.length > 11) input = input.slice(0, 11);

    let formatted = input;

    if (input.length > 0) {
      formatted = `(${input.slice(0, 2)}`;
    }
    if (input.length >= 3) {
      formatted += `) ${input.slice(2, 7)}`;
    }
    if (input.length >= 8) {
      formatted += `-${input.slice(7)}`;
    }

    setTelefone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      try {
        await updateInfo(name, telefone);
        // Optionally clear temp data
        navigation("/home");
      } catch (err) {
        setError("Erro ao atualizar informações");
      }
    } catch (error) {
      setError("Erro na conexão com o servidor!");
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-black bg-cover bg-center bg-no-repeat bg-fixed px-2 sm:px-4 md:px-8 py-6 sm:py-10">
      <div className="flex w-full flex-col md:flex-row items-stretch gap-4 sm:gap-6 lg:gap-8 bg-black/90 rounded-[15px] p-4 sm:p-6 md:p-8 max-w-4xl mx-auto border border-white/10">
        <div className="flex flex-col justify-between gap-4 w-full md:w-5/12 bg-neutral-900 rounded-[15px] p-4 sm:p-5">
          <div className="flex items-center justify-center bg-neutral-800 text-[#B8952E] rounded-[12px] p-3 text-sm sm:text-base gap-2">
            <p>Barbearia Diego Bueno</p>
            <img src="/scissors.svg" className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex justify-center items-center flex-1">
            <video
              src="/video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full object-cover border-4 border-[#B8952E]"
            />
          </div>

          <div className="flex flex-col gap-3 itens-center justify-center w-full">
            <p className="text-gray-100 font-medium text-sm sm:text-base ">
              Preencha o restante dos dados.
            </p>
          </div>
        </div>

        {/* Lado direito - formulário */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-7/12 bg-neutral-800 rounded-[15px] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 text-white"
        >
          <div className="flex flex-col gap-2 w-full max-w-md">
            <label className="text-sm text-white/80">Nome completo</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-white/10 rounded-md w-full h-12 bg-black/70 backdrop-blur-sm placeholder-white/70 text-base px-3 focus:border-[#B8952E] focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-full max-w-md">
            <label className="text-sm text-white/80">Telefone</label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={handleTelefoneChange}
              className="border border-white/10 rounded-md w-full h-12 bg-black/70 backdrop-blur-sm placeholder-white/70 text-base px-3 focus:border-[#B8952E] focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm w-full max-w-md">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full max-w-md h-12 rounded-md bg-[#B8952E] text-black font-semibold hover:bg-yellow-400 transition-colors duration-200"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}

export default InsertEmailAndPhoneNumber;
