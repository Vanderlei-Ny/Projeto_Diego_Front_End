import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInsertEmailAndPhoneNumber from "../useInsertEmailAndPhoneNumber";
import useAuth from "../useAuth";

export default function useInsertEmailPhonePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { updateInfo, isLoading } = useInsertEmailAndPhoneNumber();

  useEffect(() => {
    if (!user?.userId) {
      navigate("/cadastro");
    }
  }, [navigate, user]);

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
        navigate("/home");
      } catch (err) {
        setError("Erro ao atualizar informações");
      }
    } catch (error) {
      setError("Erro na conexão com o servidor!");
    }
  };

  return {
    name,
    setName,
    telefone,
    setTelefone,
    error,
    setError,
    isLoading,
    handleTelefoneChange,
    handleSubmit,
  };
}
