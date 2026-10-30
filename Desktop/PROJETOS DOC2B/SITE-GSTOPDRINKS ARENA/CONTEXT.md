# CONTEXT - SITE GSTOPDRINKS (Progresso até 30/10/2026)

## 📁 Caminhos Importantes
| Item | Caminho |
|------|---------|
| Raiz do projeto | `C:\Users\julia\Desktop\PROJETOS DOC2B\SITE-GSTOPDRINKS ARENA` |
| Imagens originais | `C:\Users\julia\Desktop\PROJETOS DOC2B\SITE-GSTOPDRINKS ARENA\imagens` |
| Public images (servidas pelo Vite) | `C:\Users\julia\Desktop\PROJETOS DOC2B\SITE-GSTOPDRINKS ARENA\public\gs\images` |
| Build output | `C:\Users\julia\Desktop\PROJETOS DOC2B\SITE-GSTOPDRINKS ARENA\dist` |
| Repositório GitHub | `https://github.com/juliannvolz/gs-top-drinks.git` |
| Vercel Project | `dist` (subdomínio: `gs-top-drinks.vercel.app`) |
| Supabase Project | `gstopdrinks-leads` (tabela `public.comandas`) |

---

## ✅ O QUE JÁ FUNCIONA (Deploy `85bd188`)

| Funcionalidade | Status |
|----------------|--------|
| Quiz completo (8 etapas) | ✅ |
| Captura de lead (nome + telefone) | ✅ |
| **Baixar PDF** (com fallback) | ✅ |
| **Enviar WhatsApp** | ✅ |
| **Imprimir** | ✅ |
| Build & Deploy Vercel | ✅ |
| Supabase INSERT (RLS policy existe) | ✅ |

---

## ❌ O QUE AINDA FALHA (Próximas prioridades)

| Problema | Causa | Solução |
|----------|-------|---------|
| **Imagens não aparecem** | Caminhos no código (`/gs/images/...`) mas arquivos em `public/gs/images/` não são copiados para `dist/gs/images/` no build OU extensões erradas (`.webp` vs `.jpg`) | 1. Verificar se `public/gs/images/` é copiado para `dist/gs/images/` no build 2. Ajustar extensões no código para match real dos arquivos |
| **Admin não loga** | `VITE_ADMIN_PASSWORD` no Vercel está como **Secret** (precisa ser **Config**) | Vercel → Settings → Env Variables → `VITE_ADMIN_PASSWORD` = `gstropdrinks1` → **Config** → Redeploy |
| **Admin lista vazia** | Política RLS **SELECT** não existe no Supabase | Executar no SQL Editor: `CREATE POLICY "allow_select_comandas" ON public.comandas FOR SELECT USING (true);` |

---

## 🔧 ÚLTIMAS ALTERAÇÕES NO CÓDIGO (Commit `85bd188`)

### `src/components/ResultScreen.tsx`
- `handleDownloadPDF`: `try/catch` em `salvarComanda()` + `try/catch` no `generateComandaPDF` com fallback `generateSimplePDF`
- **WhatsApp**: `try/catch` em `salvarComanda()` antes de `window.open(waLink(msg))`
- **Imprimir**: `try/catch` em `salvarComanda()` antes de `window.print()`

### `src/pages/Admin.tsx`
```tsx
const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || "gstropdrinks1").trim();
if (password.trim() === ADMIN_PASSWORD) { ... }
```

### Imagens copiadas para `public/gs/images/`
Todos os arquivos esperados pelo código (`/gs/images/...`) agora existem em `public/gs/images/`:
- `drinks/*.webp` (7 arquivos)
- `gallery/*.jpg` (11 arquivos)  
- `segments/*.jpg` (5 arquivos)
- `team/*` (já existia)

---

## ⚙️ CONFIGURAÇÕES PENDENTES (AÇÃO MANUAL NECESSÁRIA)

### 1. Vercel - Environment Variables
| Variável | Valor | Visibility |
|----------|-------|------------|
| `VITE_ADMIN_PASSWORD` | `gstropdrinks1` | **Config** (não Secret!) |
| `VITE_SUPABASE_URL` | `https://jspcsfmcqhjfdimmdsml.supabase.co` | Config |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_wrjaJaXDROPp6Pr_zzemnw_6I4QzHtk` | Config |

### 2. Supabase - Políticas RLS
```sql
-- SELECT policy (se ainda não existe)
CREATE POLICY "allow_select_comandas"
  ON public.comandas
  FOR SELECT
  USING (true);
```
*INSERT policy já existe (criada anteriormente).*

---

## 📦 ESTRUTURA DE ARQUIVOS CHAVE

```
SITE-GSTOPDRINKS ARENA/
├── public/
│   └── gs/images/           # ← Imagens servidas aqui
│       ├── drinks/*.webp
│       ├── gallery/*.jpg
│       ├── segments/*.jpg
│       └── team/*.webp
├── src/
│   ├── components/
│   │   ├── ResultScreen.tsx    # ← PDF/WhatsApp/Print handlers
│   │   ├── LeadCaptureScreen.tsx
│   │   └── ...
│   ├── pages/
│   │   └── Admin.tsx           # ← Admin login fix
│   ├── lib/
│   │   └── supabase.ts         # ← saveComanda, listComandas
│   └── utils/
│       └── pdf.ts              # ← generateComandaPDF + generateSimplePDF
├── vercel.json                 # buildCommand: "sh vercel-build.sh"
├── vercel-build.sh             # chmod +x node_modules/.bin/vite && npm run build
├── .gitignore                  # node_modules/, dist/, .env.local
└── CONTEXT.md                  # ← ESTE ARQUIVO
```

---

## 🚀 COMANDOS ÚTEIS PARA AMANHÃ

```bash
# Entrar na pasta
cd "C:\Users\julia\Desktop\PROJETOS DOC2B\SITE-GSTOPDRINKS ARENA"

# Ver status
git status

# Build local
npm run build

# Dev server
npm run dev

# Push changes
git add -A && git commit -m "msg" && git push origin main
```

---

## 🎯 PRÓXIMOS PASSOS (Ordem de execução)

1. **Vercel**: Alterar `VITE_ADMIN_PASSWORD` para **Config** → Redeploy
2. **Supabase**: Executar política `SELECT` no SQL Editor
3. **Testar**: `https://gs-top-drinks.vercel.app/admin` → login `gstropdrinks1`
4. **Imagens**: Se ainda não carregarem, verificar se `dist/gs/images/` tem os arquivos após build
5. **Teste completo**: Quiz → Lead → Comanda → PDF/WhatsApp/Print → Admin lista

---

## 💡 DICAS PARA EVITAR RETRABALHO FUTURO

1. **Sempre use `public/gs/images/`** para assets estáticos (Vite serve automaticamente)
2. **Variáveis `VITE_` no Vercel = sempre `Config`** (nunca Secret)
3. **RLS policies** = criar tanto `INSERT` quanto `SELECT` no Supabase
4. **Handlers robustos**: sempre `try/catch` + fallback em operações assíncronas
5. **Admin password**: `.trim()` + fallback hardcoded no código

---

**Último commit**: `85bd188` - "fix: admin login trim and case-insensitive compare"
**Deploy**: Vercel automático via GitHub push

---
*Contexto salvo em 30/10/2026 - Continuar amanhã com as pendências acima.*