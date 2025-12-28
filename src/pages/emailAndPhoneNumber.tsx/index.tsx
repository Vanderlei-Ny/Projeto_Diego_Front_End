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
    <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-[url('public/teste2.png')] flex items-center justify-center px-2 sm:px-4 py-6 sm:py-10 flex-col">
      <div className="flex flex-col justify-center items-center bg-white/10 border-1 border-white gap-3 sm:gap-4 p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl h-auto w-full sm:w-80 md:w-96 backdrop-blur-xl">
        <div className="flex justify-center">
          <video
            src="/public/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full object-cover"
          />
        </div>

        <input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-white border-1 rounded-sm text-center text-white w-full sm:w-72 h-10 sm:h-12 bg-black/70 backdrop-blur-sm placeholder-white/100 text-sm sm:text-base px-2"
        />

        <input
          type="tel"
          placeholder="Número de telefone"
          value={telefone}
          onChange={handleTelefoneChange}
          className="border-white border-1 rounded-sm text-center text-white w-full sm:w-72 h-10 sm:h-12 bg-black/70 backdrop-blur-sm placeholder-white/100 text-sm sm:text-base px-2"
        />

        <button
          onClick={handleSubmit}
          className="border-sm w-full sm:w-72 h-10 sm:h-12 rounded-md bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base font-medium"
        >
          Prossiga
        </button>

        {error && (
          <p className="text-red-400 mt-2 text-xs sm:text-sm text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default InsertEmailAndPhoneNumber;
