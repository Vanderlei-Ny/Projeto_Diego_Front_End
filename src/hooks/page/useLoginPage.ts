import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { CredentialResponse } from "@react-oauth/google";
import useLogin from "../useLogin";

export default function useLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginWithEmail, loginWithGoogle, isLoadingEmail, isLoadingGoogle } =
    useLogin();

  const isBusy = isLoadingEmail || isLoadingGoogle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginWithEmail(email, password);

      if (data.user.name && data.user.telefone) {
        navigate("/home");
      } else {
        navigate("/insertEmailAndPhoneNumber");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    const token = credentialResponse.credential;
    console.log(
      "🔑 Token recebido do Google:",
      token ? "SIM (tamanho: " + token.length + ")" : "NÃO"
    );

    if (!token) {
      console.error("❌ Token vazio ou undefined");
      toast.error("Token do Google inválido.");
      return;
    }

    try {
      console.log("📡 Iniciando login com Google...");
      const result = await loginWithGoogle(token as string);

      if (result.name && result.telefone) {
        navigate("/home");
      } else {
        toast.success("Login realizado! Complete seu perfil.");
        navigate("/insertEmailAndPhoneNumber");
      }
    } catch (err: any) {
      console.error("❌ Erro no login:", err);
      console.error("❌ Erro response:", err?.response?.data);
      console.error("❌ Erro message:", err?.message);
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
    handleGoogleLoginSuccess,
    goToCadastro,
  };
}
