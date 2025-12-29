import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { CredentialResponse } from "@react-oauth/google";
import useCadastro from "../useCadastro";

export default function useCadastroPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { createUser, googleAuth, isLoadingCreate, isLoadingGoogle } =
    useCadastro();

  const isBusy = isLoadingCreate || isLoadingGoogle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const created = await createUser(email, password);
      if (!created?.id)
        throw new Error(created?.message || "Erro ao cadastrar");
      // After auth context sets userId, go to extra info page
      navigate("/insertEmailAndPhoneNumber");
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
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
      console.log("📡 Iniciando autenticação com Google...");
      const data = await googleAuth(token as string);

      if (data.name && data.telefone) {
        toast.success("Autenticado com sucesso!");
        navigate("/home");
      } else {
        toast.success("Autenticado! Complete seu perfil.");
        navigate("/insertEmailAndPhoneNumber");
      }
    } catch (err: any) {
      console.error("❌ Erro na autenticação:", err);
      console.error("❌ Erro response:", err?.response?.data);
      console.error("❌ Erro message:", err?.message);
      toast.error("Erro ao autenticar com Google.");
    }
  };

  const goToLogin = () => navigate("/login");

  return {
    email,
    setEmail,
    password,
    setPassword,
    isBusy,
    isLoadingCreate,
    isLoadingGoogle,
    handleSubmit,
    handleGoogleLoginSuccess,
    goToLogin,
  };
}
