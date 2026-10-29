# GS TOP DRINKS - Guia de Deploy e Migração

## 📋 Visão Geral

Este documento descreve o processo completo de deploy no Vercel e migração do domínio/hospedagem/banco de dados.

---

## 🚀 Deploy no Vercel (Subdomínio Inicial)

### 1. Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Repositório no GitHub
- Node.js 20+

### 2. Configuração Inicial

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy inicial (subdomínio Vercel)
vercel --prod=false
# Ou usar GitHub Actions (configurado em .github/workflows/deploy.yml)
```

### 3. Variáveis de Ambiente no Vercel

No painel do Vercel → Project Settings → Environment Variables:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_GA_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |
| `VITE_WHATSAPP` | WhatsApp Business number | `5547992791968` |
| `VITE_INSTAGRAM` | Instagram handle | `@gstopdrinks` |

### 4. Secrets do GitHub (para CI/CD)

No GitHub → Settings → Secrets and variables → Actions:

| Secret | Descrição |
|--------|-----------|
| `VERCEL_TOKEN` | Token de acesso do Vercel |
| `VERCEL_ORG_ID` | Organization ID do Vercel |
| `VERCEL_PROJECT_ID` | Project ID do Vercel |
| `VITE_GA_ID` | GA4 Measurement ID |
| `VITE_WHATSAPP` | WhatsApp number |
| `VITE_INSTAGRAM` | Instagram handle |

> **Como obter:** `vercel inspect <deployment-url> --token=<token>` mostra os IDs.

---

## 🌐 Migração de Domínio (gstopdrinks.com.br)

### Fase 1: Preparação (Pode ser feita antes do deploy)

1. **Acesse o provedor de DNS atual** (onde está `gstopdrinks.com.br`)
2. **Reduza TTL** dos registros A/CNAME para 300s (5 min) - facilita rollback
3. **Anote os registros atuais** para rollback se necessário

### Fase 2: Configuração no Vercel

1. No painel Vercel → Project Settings → Domains
2. **Add Domain**: `gstopdrinks.com.br`
3. **Add Domain**: `www.gstopdrinks.com.br`
4. Vercel mostrará os registros necessários:
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`

### Fase 3: Atualização DNS (Momento da migração)

No provedor de DNS atual:

```
TIPO    NOME    VALOR                    TTL
A       @       76.76.21.21              300
CNAME   www     cname.vercel-dns.com     300
```

> ⚠️ **Remova** quaisquer registros A/CNAME antigos para `@` e `www`

### Fase 4: Verificação

1. Aguarde propagação DNS (5-30 min com TTL 300)
2. Vercel emitirá certificado SSL automaticamente (Let's Encrypt)
3. Teste: `https://gstopdrinks.com.br` e `https://www.gstopdrinks.com.br`
4. Verifique: certificado válido, redirecionamento www → non-www (ou vice versa)

### Fase 5: Cleanup

1. Após confirmação, **aumente TTL** para 3600s (1h) ou 86400s (24h)
2. **Desligue hospedagem antiga** (economize custos)
3. Monitore por 24-48h

---

## 🗄️ Preparação para Banco de Dados (Futuro)

### Estrutura Atual (Static/Client-side)
- ✅ Dados em `src/data/` (TypeScript)
- ✅ Imagens otimizadas em `public/gs/images/`
- ✅ PDF gerado client-side (html2canvas + jsPDF)
- ✅ WhatsApp deep-link nativo

### Quando Migrar para Backend

| Gatilho | Solução Recomendada |
|---------|---------------------|
| Preços dinâmicos por cliente | API + Database |
| Gestão de pedidos/leads | CRM (HubSpot/Pipedrive) ou custom |
| Multi-tenant (franquias) | Multi-tenant SaaS |
| Autenticação usuários | NextAuth / Clerk / Supabase Auth |

### Stack Sugerida (Quando Precisar)

```
Frontend (Vercel)          Backend (Vercel Functions / Railway / Supabase)
─────────────────────────────────────────────────────────────────────
React + Vite               Node.js / Edge Functions
TypeScript                 TypeScript
Tailwind CSS               Prisma ORM
GSAP/Framer Motion         PostgreSQL (Supabase/Neon)
html2canvas + jsPDF        Redis (cache/sessions)
GA4 Analytics              Webhooks (WhatsApp/Email)
```

### Migração Gradual (Strangler Fig Pattern)

1. **Fase 1**: Manter frontend estático, adicionar API para:
   - `/api/quote` - receber lead do WhatsApp
   - `/api/prices` - preços dinâmicos (se necessário)

2. **Fase 2**: Migrar catálogo para DB
   - `packages`, `drinks`, `segments` → tabelas
   - Admin panel para editar preços sem deploy

3. **Fase 3**: Autenticação + Dashboard cliente
   - Login cliente → ver histórico de orçamentos
   - Área admin GS → gerenciar eventos

---

## 📦 Checklist de Deploy

### Pré-Deploy
- [ ] `npm run build` passa localmente
- [ ] `npm run typecheck` sem erros
- [ ] `npm run lint` sem erros
- [ ] Testado em mobile (Chrome DevTools device toolbar)
- [ ] Testado WhatsApp deep-link
- [ ] Testado PDF download
- [ ] Imagens otimizadas carregando (WebP/AVIF)

### Pós-Deploy (Subdomínio Vercel)
- [ ] Site carrega em `https://gs-top-drinks.vercel.app`
- [ ] Quiz completo funciona (7 steps)
- [ ] Animações GSAP suaves (60fps)
- [ ] Reduced motion respeitado
- [ ] GA4 eventos disparando (ver DebugView)
- [ ] PDF gera corretamente
- [ ] WhatsApp abre com mensagem pré-preenchida

### Pós-Migração Domínio
- [ ] `https://gstopdrinks.com.br` carrega
- [ ] `https://www.gstopdrinks.com.br` redireciona
- [ ] Certificado SSL válido (🔒)
- [ ] Cache headers funcionando (ver Network tab)
- [ ] Velocidade Lighthouse ≥ 90
- [ ] Antiga hospedagem desligada

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview local do build
npm run preview

# Lint + Typecheck
npm run lint
npm run typecheck

# Otimizar imagens (rodar após adicionar novas)
node scripts/optimize-images.mjs

# Deploy manual Vercel
vercel --prod

# Ver logs Vercel
vercel logs <deployment-url>

# Rollback Vercel
vercel rollback <deployment-url>
```

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| Build falha no Vercel | Verificar `npm run build` local; checar Node version (20) |
| Imagens não carregam | Verificar paths em `public/gs/images/`; `npm run build` |
| GA4 não tracking | Confirmar `VITE_GA_ID` no Vercel; checar DebugView GA4 |
| WhatsApp não abre | Testar `waLink()` no console; verificar encoding URL |
| PDF não gera | Verificar console errors; html2canvas precisa de CORS para imagens externas |
| DNS não propaga | Verificar `dig gstopdrinks.com.br A`; TTL baixo ajuda |
| SSL não emite | Verificar CAA records; aguardar propagação DNS completa |

---

## 📞 Contatos de Emergência

- **Vercel Support**: https://vercel.com/support
- **DNS Provider**: [seu provedor]
- **GA4 Debug**: https://analytics.google.com/analytics/web/#/debugview

---

*Última atualização: $(date +%Y-%m-%d)*
*Versão: 1.0.0*