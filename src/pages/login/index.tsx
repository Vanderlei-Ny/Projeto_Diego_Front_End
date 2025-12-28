import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import useLogin from "../../hooks/useLogin";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { loginWithEmail, loginWithGoogle } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await loginWithEmail(email, password);

      if (!result?.user?.userId) {
        navigate("/cadastro");
        return;
      }

      if (result.user.name !== null && result.user.telefone !== null) {
        navigate("/home");
      } else {
        navigate("/insertEmailAndPhoneNumber");
      }
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
      const { data } = await loginWithGoogle(token as string);
      if (!data.id) throw new Error("Erro ao autenticar com Google.");

      if (data.existingUser && data.name !== null && data.telefone !== null) {
        navigate("/home");
      } else {
        navigate("/insertEmailAndPhoneNumber");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-[url('public/teste2.png')] flex items-center justify-center px-2 sm:px-4 py-6 sm:py-10">
      <div className="flex flex-col w-full sm:w-96 md:flex-row gap-4 sm:gap-6 md:gap-10 p-3 sm:p-4 md:p-6 max-w-screen-lg md:w-full md:max-w-3xl md:h-auto rounded-2xl sm:rounded-3xl md:rounded-4xl backdrop-blur-xl bg-white/10 border-2 border-white/30">
        <div className="flex items-center justify-center flex-col p-2 sm:p-3 w-full md:w-auto md:min-w-[200px] lg:min-w-[280px]">
          <div className="bg-[url('public/logo2.png')] bg-no-repeat bg-contain bg-center rounded-xl sm:rounded-2xl w-48 sm:w-60 md:w-64 h-48 sm:h-60 md:h-64" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-auto md:flex-1 flex flex-col justify-center items-center gap-2 sm:gap-3 text-white py-2 sm:py-4"
        >
          <input
            type="text"
            placeholder="Email"
            className="border rounded-sm text-center w-full sm:w-72 md:w-64 h-10 sm:h-12 bg-black/70 backdrop-blur-sm placeholder-white/100 text-sm sm:text-base px-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            className="border rounded-sm text-center w-full sm:w-72 md:w-64 h-10 sm:h-12 bg-black/70 backdrop-blur-sm placeholder-white/70 text-sm sm:text-base px-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-xs sm:text-sm w-full">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="border-sm w-full sm:w-72 md:w-64 h-10 sm:h-12 rounded-md bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base font-medium"
          >
            Login
          </button>

          <a
            href="#"
            className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-400/90 hover:text-white underline transition-colors duration-200"
          >
            Esqueceu sua senha? Clique para alterar
          </a>

          <div className="flex items-center my-2 sm:my-3 w-full md:w-64">
            <div className="flex-grow h-px bg-white"></div>
            <span className="px-2 sm:px-3 text-white text-xs sm:text-sm">
              ou
            </span>
            <div className="flex-grow h-px bg-white"></div>
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError("Erro ao autenticar com Google.")}
              useOneTap={false}
              theme="filled_black"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          <button
            type="button"
            className="bg-black/30 w-full sm:w-44 md:w-64 mt-3 sm:mt-4 text-white rounded-sm py-2 sm:py-2.5 text-sm sm:text-base hover:bg-black/50 transition-colors"
            onClick={() => navigate("/cadastro")}
          >
            Cadastre-se
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
