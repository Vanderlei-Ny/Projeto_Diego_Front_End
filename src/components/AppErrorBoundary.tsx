import React from "react";
import type {
  AppErrorBoundaryProps,
  AppErrorBoundaryState,
} from "@/types/components/component-props.types";

export default class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("Erro não tratado na aplicação:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-page-bg min-h-screen w-full text-white flex items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-xl border border-[#B8952E]/40 bg-neutral-900 p-6 text-center">
            <h1 className="text-xl font-bold text-[#B8952E]">
              Ops! Algo deu errado
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Ocorreu um erro ao renderizar a página. Você pode recarregar para
              continuar.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-5 inline-flex items-center justify-center rounded-md bg-[#B8952E] px-4 py-2 text-sm font-semibold text-black hover:bg-[#a38427] transition-colors"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
