# Configuração de Autenticação Google

## Problemas Identificados e Soluções

### ✅ Problemas Corrigidos no Código

1. **Erro na validação de resposta** - Corrigido em `useCadastro.ts`
   - A condição `if (!data.id)` estava lançando erro mesmo em caso de sucesso
   - Ajustado para somente lançar erro quando realmente necessário

2. **Desestruturação incorreta** - Corrigido em `cadastro/index.tsx`
   - Mudado de `const { data } = await googleAuth(token)` para `const data = await googleAuth(token)`
   - O `googleAuth` já retorna os dados diretamente, não um objeto com propriedade `data`

### 🔧 Configurações Necessárias no Google Cloud Console

Para resolver os erros de CORS e origin:

1. **Acesse o Google Cloud Console**
   - Vá para: https://console.cloud.google.com/
   - Selecione seu projeto

2. **Configure as URIs autorizadas**
   - Navegue até: `APIs & Services` > `Credentials`
   - Clique no seu Client ID OAuth 2.0
   - Em **Authorized JavaScript origins**, adicione:
     ```
     http://localhost:5173
     http://localhost:3000
     http://127.0.0.1:5173
     http://127.0.0.1:3000
     ```
   - Em **Authorized redirect URIs**, adicione:
     ```
     http://localhost:5173
     http://localhost:3000
     http://127.0.0.1:5173
     http://127.0.0.1:3000
     ```

3. **Para Produção**
   - Adicione também o domínio de produção:
     ```
     https://seu-dominio.com
     https://www.seu-dominio.com
     ```

### 🛡️ Configuração de Headers COOP (opcional)

Se estiver usando um servidor de desenvolvimento personalizado ou backend, você pode adicionar headers para resolver o COOP:

**vite.config.ts:**
```typescript
export default defineConfig({
  // ... outras configurações
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
```

**Para o backend (exemplo Node.js/Express):**
```javascript
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});
```

### 📋 Checklist de Verificação

- [ ] Client ID configurado corretamente no `.env` (`VITE_GOOGLE_CLIENT_ID`)
- [ ] Origins autorizadas no Google Cloud Console
- [ ] Redirect URIs configuradas
- [ ] Backend retornando os dados corretos (`id`, `name`, `telefone`, `token`, `existingUser`)
- [ ] Headers COOP configurados (se necessário)

### 🧪 Testando

1. Limpe o cache do navegador
2. Recarregue a aplicação (Ctrl+F5)
3. Tente fazer login com Google
4. Verifique o console para mensagens de erro

### 🔍 Debugging

Se ainda houver problemas:

1. **Verifique o console do navegador** para mensagens de erro específicas
2. **Verifique a resposta da API** no Network tab do DevTools
3. **Confirme o Client ID** está correto e ativo no Google Cloud Console
4. **Teste em modo incógnito** para evitar problemas de cache

### 📞 API Endpoints Esperados

**Backend deve retornar:**

```typescript
// POST /login/authWithGoogle
{
  id: number,
  name: string | null,
  telefone: string | null,
  token: string,
  existingUser: boolean,
  roles?: string[]
}
```
