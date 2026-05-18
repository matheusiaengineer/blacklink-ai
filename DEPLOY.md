# 🚀 BLACKLINK AI — Guia de Deploy Completo

> Deploy para produção: Vercel + GitHub + Supabase + Stripe

---

## 📋 Checklist de Credenciais Necessárias

Antes de começar, você precisa ter:

### 1. Supabase (Banco de Dados)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Chave pública (anon)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — Chave de serviço (secreta)

### 2. Google Gemini (IA)
- [ ] `GEMINI_API_KEY` — Chave da API Gemini

### 3. LinkedIn OAuth (Login + Publicação)
- [ ] `LINKEDIN_CLIENT_ID` — Client ID do app LinkedIn
- [ ] `LINKEDIN_CLIENT_SECRET` — Client Secret
- [ ] `LINKEDIN_REDIRECT_URI` — URL de callback (será configurada depois)

### 4. Stripe (Pagamentos)
- [ ] `STRIPE_SECRET_KEY` — Chave secreta (sk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` — Secret do webhook (whsec_...)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Chave pública (pk_live_...)
- [ ] `STRIPE_PRICE_PRO` — Price ID do plano Pro ($15)
- [ ] `STRIPE_PRICE_ENTERPRISE` — Price ID do plano Elite ($25)

### 5. Segurança
- [ ] `JWT_SECRET` — String aleatória forte (mínimo 32 caracteres)
- [ ] `CRON_SECRET` — String aleatória para proteger o cron

---

## 🔧 Passo 1: Configurar Supabase

### 1.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em **New Project**
3. Escolha um nome: `blacklink-ai`
4. Defina uma senha forte para o banco
5. Selecione a região mais próxima (São Paulo: `sa-east-1`)

### 1.2 Copiar Credenciais
1. Vá em **Settings → API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 Executar Schema
1. Vá em **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo de `supabase/schema.sql`
4. Clique em **Run**

---

## 🤖 Passo 2: Configurar Google Gemini

### 2.1 Obter API Key
1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Clique em **Get API Key**
3. Crie uma nova chave ou use existente
4. Copie → `GEMINI_API_KEY`

---

## 💼 Passo 3: Configurar LinkedIn OAuth

### 3.1 Criar App no LinkedIn
1. Acesse [linkedin.com/developers](https://www.linkedin.com/developers/)
2. Clique em **Create App**
3. Preencha:
   - **App name**: BLACKLINK AI
   - **LinkedIn Page**: Sua página de empresa
   - **Logo**: Upload do logo
4. Aceite os termos

### 3.2 Configurar Produtos
1. Na aba **Products**, solicite:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn** (para publicar posts)

### 3.3 Copiar Credenciais
1. Na aba **Auth**:
   - **Client ID** → `LINKEDIN_CLIENT_ID`
   - **Client Secret** → `LINKEDIN_CLIENT_SECRET`

### 3.4 Configurar Redirect URI
Após deploy no Vercel, adicione:
```
https://seu-dominio.vercel.app/api/auth/linkedin/callback
```

---

## 💳 Passo 4: Configurar Stripe

### 4.1 Criar Conta
1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta ou faça login
3. Complete a verificação do negócio

### 4.2 Copiar Chaves
1. Vá em **Developers → API Keys**
2. Copie:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### 4.3 Criar Produtos e Preços
1. Vá em **Products → Add Product**

**Produto 1: Pro Plan**
- Nome: `BLACKLINK AI Pro`
- Preço: $15/mês (recorrente)
- Copie o **Price ID** (price_...) → `STRIPE_PRICE_PRO`

**Produto 2: Elite Plan**
- Nome: `BLACKLINK AI Elite`
- Preço: $25/mês (recorrente)
- Copie o **Price ID** (price_...) → `STRIPE_PRICE_ENTERPRISE`

### 4.4 Configurar Webhook (após deploy)
1. Vá em **Developers → Webhooks**
2. Clique em **Add Endpoint**
3. URL: `https://seu-dominio.vercel.app/api/stripe/webhook`
4. Eventos para escutar:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copie o **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 🔐 Passo 5: Gerar Secrets

### JWT_SECRET
Gere uma string aleatória forte:
```bash
openssl rand -base64 32
```
Ou use: https://generate-secret.vercel.app/32

### CRON_SECRET
Gere outra string aleatória:
```bash
openssl rand -base64 16
```

---

## 🐙 Passo 6: Push para GitHub

### 6.1 Criar Repositório
1. Acesse [github.com/new](https://github.com/new)
2. Nome: `blacklink-ai`
3. Privado ou Público
4. **NÃO** inicialize com README

### 6.2 Push do Código
```bash
cd C:\Users\awqy\Desktop\Linkedinnn
git init
git add .
git commit -m "🚀 BLACKLINK AI - Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/blacklink-ai.git
git push -u origin main
```

---

## ▲ Passo 7: Deploy no Vercel

### 7.1 Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Add New → Project**
3. Importe o repositório `blacklink-ai`

### 7.2 Configurar Environment Variables
Na tela de deploy, adicione TODAS as variáveis:

```env
# App
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NEXT_PUBLIC_APP_NAME=BLACKLINK AI

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI
GEMINI_API_KEY=AIzaSy...

# LinkedIn
LINKEDIN_CLIENT_ID=77xxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxx
LINKEDIN_REDIRECT_URI=https://seu-dominio.vercel.app/api/auth/linkedin/callback

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...

# Security
JWT_SECRET=sua-string-super-secreta-aqui
CRON_SECRET=outra-string-secreta
```

### 7.3 Deploy
1. Clique em **Deploy**
2. Aguarde o build completar
3. Acesse a URL gerada

---

## ✅ Passo 8: Configurações Pós-Deploy

### 8.1 Atualizar LinkedIn Redirect URI
1. Volte ao LinkedIn Developers
2. Na aba **Auth**, adicione o Redirect URI:
   ```
   https://seu-dominio.vercel.app/api/auth/linkedin/callback
   ```

### 8.2 Configurar Stripe Webhook
1. Volte ao Stripe Dashboard
2. Crie o webhook com a URL de produção
3. Copie o signing secret e atualize no Vercel

### 8.3 Configurar Domínio Customizado (Opcional)
1. No Vercel, vá em **Settings → Domains**
2. Adicione seu domínio: `blacklink.ai`
3. Configure os DNS conforme instruções

---

## 🔄 Passo 9: Configurar Cron Jobs

O arquivo `vercel.json` já está configurado para executar o scheduler:

```json
{
  "crons": [
    {
      "path": "/api/cron/scheduler",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Isso executa o scheduler a cada 5 minutos para publicar posts agendados.

---

## 🧪 Testar Tudo

### Checklist de Testes
- [ ] Landing page carrega corretamente
- [ ] Login/Register funcionam
- [ ] LinkedIn OAuth conecta
- [ ] Dashboard carrega
- [ ] Nova AI responde no chat
- [ ] Gerador de posts funciona
- [ ] Gerador de imagens funciona
- [ ] Checkout do Stripe abre
- [ ] Webhook do Stripe processa

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel (Functions tab)
2. Verifique os logs no Supabase (Logs tab)
3. Verifique os eventos no Stripe (Developers → Events)

---

## 🎉 Pronto!

Seu BLACKLINK AI está no ar! 

**URLs importantes:**
- App: `https://seu-dominio.vercel.app`
- Dashboard: `https://seu-dominio.vercel.app/dashboard`
- API Health: `https://seu-dominio.vercel.app/api/health`

---

*Build Authority. Become Visible. Get Hired.*
