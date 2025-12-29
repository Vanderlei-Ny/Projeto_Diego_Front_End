import { GoogleLogin } from "@react-oauth/google";
import useLoginPage from "../hooks/page/useLoginPage";
import LoadingSpinner from "../components/loading-spinner";
import { toast } from "sonner";

function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isBusy,
    handleSubmit,
    handleGoogleLoginSuccess,
    goToCadastro,
  } = useLoginPage();

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-black bg-cover bg-center bg-no-repeat bg-fixed px-2 sm:px-4 md:px-8 py-6 sm:py-10">
      {isBusy && <LoadingSpinner fullScreen message="Entrando..." />}
      <div className="flex w-full h-2/3 flex-col md:flex-row items-stretch justify-center gap-4 sm:gap-6 lg:gap-8 bg-black/90 rounded-[15px] p-4 sm:p-6 md:p-8 max-w-4xl mx-auto border border-white/10">
        {/* Lado esquerdo - branding */}
        <div className="flex flex-col justify-between gap-4 w-full md:w-5/12 bg-neutral-900 rounded-[15px] p-4 sm:p-5">
          <div className="flex items-center justify-center bg-neutral-800 text-[#B8952E] rounded-[12px] p-3 text-sm sm:text-base gap-2">
            <p>Barbearia Diego Bueno</p>
            <img
              src="/scissors.svg"
              className="w-4 h-4 sm:w-5 sm:h-5"
              alt="Tesoura"
            />
          </div>

          <div className="bg-[url('/logo2.png')] bg-no-repeat bg-contain bg-center rounded-[12px] w-full h-48 sm:h-64 md:h-72" />

          <div className="flex flex-col gap-3">
            <p className="text-gray-100 font-medium text-sm sm:text-sm">
              Não tem nenhuma conta? Acesse para criar:
            </p>
            <button
              type="button"
              onClick={goToCadastro}
              disabled={isBusy}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-[#B8952E] rounded-[10px] font-medium hover:bg-yellow-400 transition-colors text-sm sm:text-base"
            >
              Criar conta
            </button>
          </div>
        </div>

        {/* Lado direito - formulário */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-7/12 bg-neutral-800 rounded-[15px] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 text-white"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#B8952E] mb-2">
            Login
          </h2>
          <div className="flex flex-col gap-2 w-full max-w-md">
            <label className="text-sm text-white/80">Email</label>
            <input
              type="text"
              placeholder="Seu email"
              className="border border-white/10 rounded-md w-full h-12 bg-black/70 backdrop-blur-sm placeholder-white/70 text-base px-3 focus:border-[#B8952E] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isBusy}
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-full max-w-md">
            <label className="text-sm text-white/80">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              className="border border-white/10 rounded-md w-full h-12 bg-black/70 backdrop-blur-sm placeholder-white/70 text-base px-3 focus:border-[#B8952E] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isBusy}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full max-w-md h-12 rounded-md bg-[#B8952E] text-black font-semibold hover:bg-yellow-400 transition-colors duration-200"
          >
            Entrar
          </button>

          <div className="flex items-center gap-3 w-full max-w-md">
            <span className="text-xs text-white/70">Esqueceu sua senha?</span>
            <a
              href="#"
              className="text-xs text-[#B8952E] hover:text-yellow-300 underline"
            >
              Recuperar
            </a>
          </div>

          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white text-xs sm:text-sm">ou</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <div className="w-full max-w-md flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => toast.error("Erro ao autenticar com Google.")}
              useOneTap={false}
              theme="filled_black"
              text="continue_with"
              shape="rectangular"
              locale="pt-BR"
              width={320}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
