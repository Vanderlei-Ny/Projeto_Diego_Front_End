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
    <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-[url('public/teste2.png')] flex items-center justify-center px-4 py-10 flex-col">
      <div className="flex flex-col justify-center items-center bg-white/10 border-1 border-black gap-4 p-5 rounded-3xl h-120 backdrop-blur-xl w-70 md:w-80">
        <div className="flex justify-center">
          <video
            src="/public/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "190px",
              height: "190px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>

        <input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-white border-1 rounded-sm text-center text-white w-60 h-12 bg-black/70 backdrop-blur-sm placeholder-white/100 md:w-60 md:h-12"
        />

        <input
          type="tel"
          placeholder="Número de telefone"
          value={telefone}
          onChange={handleTelefoneChange}
          className="border-white border-1 rounded-sm text-center text-white w-60 h-12 bg-black/70 backdrop-blur-sm placeholder-white/100 md:w-60 md:h-12"
        />

        <button
          onClick={handleSubmit}
          className="border-sm w-60 h-12 rounded-md bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer md:w-60 md:h-12"
        >
          Prossiga
        </button>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default InsertEmailAndPhoneNumber;
