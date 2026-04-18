/**
 * Ruído que não vem do app:
 * - Extensões do Chrome usam chrome.runtime.onMessage, retornam `true` (resposta assíncrona)
 *   e fecham o canal sem responder → promise rejeitada com esta mensagem exata.
 * Não suprimir outras rejeições.
 */
export function suppressKnownBrowserNoise(): void {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message =
      typeof reason === "string"
        ? reason
        : typeof reason?.message === "string"
          ? reason.message
          : String(reason ?? "");
    if (
      message.includes(
        "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received",
      )
    ) {
      event.preventDefault();
    }
  });
}
