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
      const { data } = await loginWithEmail(email, password);

      if (!data.user?.userId) {
        navigate("/cadastro");
        return;
      }

      if (data.user.name !== null && data.user.telefone !== null) {
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
    <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-[url('public/teste2.png')] flex items-center justify-center px-4 py-10">
      <div className="flex flex-col w-85 h-182 p-3 md:flex-row gap-10 md:p-4 max-w-screen-lg md:w-180 md:h-100 rounded-4xl backdrop-blur-xl bg-white/10 border-2 border-white/30">
        <div className="flex items-center justify-center flex-col p-3">
          <div className="bg-[url('public/logo2.png')] bg-no-repeat bg-contain bg-center rounded-2xl block w-70 h-70" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-70 flex flex-col justify-center items-center gap-3 text-white"
        >
          <input
            type="text"
            placeholder="Email"
            className="border rounded-sm text-center w-60 h-12 bg-black/70 backdrop-blur-sm placeholder-white/100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border rounded-sm text-center w-60 h-12 bg-black/70 backdrop-blur-sm placeholder-white/70"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="border-sm w-60 h-12 rounded-md bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Login
          </button>

          <a
            href="#"
            className="mt-2 text-sm text-blue-600/70 hover:text-white underline transition-colors duration-200"
          >
            Esqueceu sua senha? Clique para alterar
          </a>

          <div className="flex items-center my-2 w-70">
            <div className="flex-grow h-px bg-white"></div>
            <span className="px-3 text-white text-sm">ou</span>
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
