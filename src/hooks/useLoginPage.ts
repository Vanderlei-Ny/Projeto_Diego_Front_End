import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useLogin from "./useLogin";
import { getPersistedAuthToken } from "@/http/api";

export default function useLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginWithEmail, loginWithGoogle, isLoadingEmail, isLoadingGoogle } =
    useLogin();

  const isBusy = isLoadingEmail || isLoadingGoogle;

  useEffect(() => {
    const persistedToken = getPersistedAuthToken();
    if (persistedToken) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginWithEmail(email, password);

      if (data.user.name && data.user.telefone) {
        navigate("/home");
      } else {
        navigate("/insertEmailAndPhoneNumber");
      }
    } catch (err) {
      // Error handled silently
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    try {
      const result = await loginWithGoogle(credential);

      if (result.name && result.telefone) {
        navigate("/home");
      } else {
        toast.success("Login realizado! Complete seu perfil.");
        navigate("/insertEmailAndPhoneNumber");
      }
    } catch {
      toast.error("Erro ao fazer login com Google.");
    }
  };

  const goToCadastro = () => navigate("/cadastro");

  return {
    email,
    setEmail,
    password,
    setPassword,
    isBusy,
    isLoadingEmail,
    isLoadingGoogle,
    handleSubmit,
    handleGoogleCredential,
    goToCadastro,
  };
}
