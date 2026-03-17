# Configuração de Autenticação Google

## Fluxo Atual (Oficial GIS)

1. O frontend usa `@react-oauth/google` (`GoogleLogin`) e envia `credential` para o backend.
2. O backend valida o ID token com `google-auth-library` (`verifyIdToken`) usando audience configurada.
3. O backend aplica validações de segurança (`iss`, `aud`, `email_verified`) e cria sessão local.

## Configuração no Google Cloud Console

1. Acesse https://console.cloud.google.com e selecione o projeto.
2. Vá em `APIs & Services` > `Credentials` > seu OAuth 2.0 Client ID.
3. Em **Authorized JavaScript origins**, adicione os domínios do frontend:

```txt
http://localhost:5173
http://127.0.0.1:5173
https://seu-frontend.onrender.com
```

Observação: para GIS Web no modo callback de `credential`, o ponto principal é configurar corretamente as origens JavaScript.

## Variáveis de Ambiente

### Frontend

```txt
VITE_GOOGLE_CLIENT_ID=seu-client-id-web.apps.googleusercontent.com
VITE_API_URL=http://localhost:3000
```

### Backend

```txt
GOOGLE_CLIENT_ID=seu-client-id-web.apps.googleusercontent.com
GOOGLE_CLIENT_IDS=outro-client-id-opcional.apps.googleusercontent.com
```

`GOOGLE_CLIENT_IDS` e opcional e pode conter varios IDs separados por virgula.

## Headers de Compatibilidade Popup (Opcional)

Se houver warning de popup/COOP no navegador, mantenha:

```ts
Cross-Origin-Opener-Policy: same-origin-allow-popups
Cross-Origin-Embedder-Policy: unsafe-none
```

## Checklist

- [ ] `VITE_GOOGLE_CLIENT_ID` configurado no frontend
- [ ] `GOOGLE_CLIENT_ID` configurado no backend
- [ ] Origem local (`localhost:5173` e/ou `127.0.0.1:5173`) autorizada no Google Console
- [ ] Domínio de produção autorizado no Google Console
- [ ] Frontend enviando `{ credential }` para `POST /login/authWithGoogle`

## Troubleshooting Rápido

- `origin_not_allowed`: origem do frontend nao cadastrada no Google Console.
- `Token used too early`: relogio do servidor/maquina fora de sincronia.
- `403` de CORS no backend: origem nao liberada na configuracao CORS da API.
- `400` no `/login/authWithGoogle`: payload invalido (deve enviar `credential`).

## Resposta Esperada do Backend

```ts
// POST /login/authWithGoogle
{
  id: number,
  name: string | null,
  telefone: string | null,
  token: string,
  existingUser: boolean,
  avatarUrl?: string,
  roles?: string[]
}
```
