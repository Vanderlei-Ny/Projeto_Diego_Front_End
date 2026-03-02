import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { CredentialResponse } from "@react-oauth/google";
import useRegistration from "./useRegistration";

export default function useRegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { createUser, googleAuth, isLoadingCreate, isLoadingGoogle } =
    useRegistration();

  const isBusy = isLoadingCreate || isLoadingGoogle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const created = await createUser(email, password);
      if (!created?.id)
        throw new Error(created?.message || "Erro ao cadastrar");
      // After auth context sets userId, go to extra info page
      navigate("/insertEmailAndPhoneNumber");
    } catch (err) {
      // Error handled silently
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    const token = credentialResponse.credential;

    if (!token) {
      toast.error("Token do Google inválido.");
      return;
    }

    try {
      const data = await googleAuth(token as string);

      if (data.name && data.telefone) {
        toast.success("Autenticado com sucesso!");
        navigate("/home");
      } else {
        toast.success("Autenticado! Complete seu perfil.");
        navigate("/insertEmailAndPhoneNumber");
      }
    } catch (err) {
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
