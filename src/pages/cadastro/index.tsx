import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import useCadastro from "../../hooks/useCadastro";

function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { createUser, googleAuth } = useCadastro();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await createUser(email, password);
      if (!data.id) throw new Error(data.message || "Erro ao cadastrar");
      navigate("/insertEmailAndPhoneNumber");
    } catch (err: any) {
      setError(err?.message || "Erro na conexão com o servidor!");
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    const token = credentialResponse.credential;
    if (!token) {
      setError("Token do Google inválido.");
      return;
    }

    try {
      const { data } = await googleAuth(token as string);
      if (!data.id)
        throw new Error(data.message || "Erro ao autenticar com Google.");

      if (data.existingUser && data.name !== null && data.telefone !== null) {
        navigate("/home");
      } else {
        navigate("/insertEmailAndPhoneNumber");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/teste2.png')] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-85 p-3 md:flex-row gap-8 md:p-4 max-w-screen-lg md:w-180 md:h-100 rounded-4xl backdrop-blur-xl bg-white/10 border-2 border-white/30"
      >
        <div className="flex items-center justify-center flex-col p-3">
          <div className="bg-[url('/logo2.png')] bg-no-repeat bg-contain bg-center w-70 h-70 rounded-2xl" />
        </div>

        <div className="w-full md:w-70 flex flex-col justify-center items-center gap-3 text-white">
          <input
            type="email"
            placeholder="Email"
            className="border rounded-sm text-center w-60 h-12 bg-black/70 backdrop-blur-sm placeholder-white/100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border rounded-sm text-center w-60 h-12 bg-black/70 backdrop-blur-sm placeholder-white/100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="border-sm w-60 h-12 rounded-md bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Cadastrar
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex items-center my-4 w-70">
            <div className="flex-grow h-px bg-white"></div>
            <span className="px-2 text-white text-sm">ou</span>
            <div className="flex-grow h-px bg-white"></div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setError("Erro ao autenticar com Google.")}
            useOneTap
            theme="filled_black"
            text="continue_with"
            shape="rectangular"
            width="240"
          />

          <button
            type="button"
            className="bg-black/30 w-30 mt-4 text-white rounded-sm"
            onClick={() => navigate("/login")}
          >
            Fazer Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Cadastro;
