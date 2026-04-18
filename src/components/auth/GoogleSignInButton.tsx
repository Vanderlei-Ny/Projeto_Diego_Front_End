import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";

type GoogleSignInButtonProps = {
  onCredential: (credential: string) => void | Promise<void>;
  disabled?: boolean;
};

const BUTTON_WIDTH = 320;

/**
 * Botão oficial (GIS) via @react-oauth/google — retorna apenas o ID token no callback.
 */
export function GoogleSignInButton({
  onCredential,
  disabled,
}: GoogleSignInButtonProps) {
  return (
    <GoogleLogin
      onSuccess={async (res: CredentialResponse) => {
        const credential = res.credential;
        if (!credential) {
          toast.error("Resposta do Google sem credential.");
          return;
        }
        await onCredential(credential);
      }}
      onError={() => toast.error("Não foi possível iniciar o login com Google.")}
      useOneTap={false}
      theme="filled_black"
      text="continue_with"
      shape="rectangular"
      locale="pt-BR"
      width={BUTTON_WIDTH}
      containerProps={{
        className: disabled ? "pointer-events-none opacity-50" : undefined,
      }}
    />
  );
}
