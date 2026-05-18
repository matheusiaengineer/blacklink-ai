# BLACKLINK AI

<div align="center">

![BLACKLINK AI](https://img.shields.io/badge/BLACKLINK-AI-000000?style=for-the-badge&labelColor=ffffff)

**Build Authority. Become Visible. Get Hired.**

The cinematic, AI-powered LinkedIn growth platform.  
Black & white by design. Agent-driven by architecture.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square)](https://supabase.com)

</div>

---

## ✨ Features

### 🤖 AI Agents
- **NOVA** — Conversational growth strategist
- **Profile Analyzer** — Score & optimize your LinkedIn profile
- **Content Generator** — Posts, bios, hashtags, 7-day campaigns
- **Image Engine** — Cinematic black & white AI visuals
- **Network Engine** — Smart connection suggestions

### 📊 Dashboard
- Bento grid layout with 15+ pages
- Command Palette (⌘K) for power users
- Real-time analytics & engagement tracking
- Scheduler with anti-ban protection
- Recruiter & talent marketplace

### 🎨 Design
- Monochromatic black & white aesthetic
- Apple + Figma + Linear + Arc Browser inspired
- Framer Motion animations
- Mobile-first responsive
- 7-language support (EN, PT, ES, DE, RU, HI, FR)

### 💰 Monetization
- Stripe billing (Starter $2 / Pro $15 / Elite $25)
- 30% recurring affiliate commissions
- 4-tier referral program

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.6 |
| Styling | TailwindCSS + Framer Motion |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini (text + image) |
| Auth | JWT + OAuth (LinkedIn, Google, GitHub) |
| Payments | Stripe |
| i18n | next-intl |
| Deployment | Vercel |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/blacklink-ai.git
cd blacklink-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your credentials (see DEPLOY.md for details)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (36 endpoints)
│   │   ├── ai/           # AI generation endpoints
│   │   ├── auth/         # Authentication
│   │   ├── stripe/       # Billing
│   │   └── cron/         # Scheduled tasks
│   ├── dashboard/         # Protected app pages
│   ├── login/            # Auth pages
│   └── onboarding/       # User onboarding flow
├── components/            # React components
│   ├── dashboard/        # Dashboard UI
│   ├── landing/          # Landing page sections
│   └── fx/               # Visual effects
├── lib/                   # Core libraries
│   ├── ai/               # AI agents & prompts
│   ├── automation/       # Scheduler & anti-ban
│   ├── stripe/           # Billing logic
│   └── supabase/         # Database clients
└── i18n/                  # Internationalization
messages/                  # 7 locale JSON files
supabase/schema.sql       # Database schema
```

---

## 🤖 AI Agent System

```typescript
// Five focused agents in src/lib/ai/agents.ts

profileAnalyzer   // Reads profile, returns score + rewrite
contentGenerator  // Posts, bios, hashtags, campaigns
schedulerAgent    // Humanized posting windows
engagementAgent   // Viral score & next actions
novaAgent         // Conversational strategist (chat)
```

All agents are model-agnostic via the `LLM` adapter interface.

---

## 🛡 Anti-Ban Engine

The scheduler enforces safe posting limits:

- ≤ 4 posts per 24h per account
- ≥ 90 minutes between posts
- ±18 minutes of random jitter
- Rejects >85% similar content
- Caps repeat hashtags
- Respects 06:00–22:00 local time

---

## 💳 Pricing Tiers

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | $2/mo | 5 posts/day, 2 images, basic analytics |
| **Pro** | $15/mo | Unlimited posts, 30 images, full analytics |
| **Elite** | $25/mo | Everything + 10 accounts, priority support |

---

## 🌍 Internationalization

Supported languages:
- 🇺🇸 English (default)
- 🇧🇷 Portuguese
- 🇪🇸 Spanish
- 🇩🇪 German
- 🇷🇺 Russian
- 🇮🇳 Hindi
- 🇫🇷 French

Live language switching via cookie persistence.

---

## 📦 Deployment

See **[DEPLOY.md](./DEPLOY.md)** for complete deployment guide:

1. Configure Supabase (run `schema.sql`)
2. Get Gemini API key
3. Setup LinkedIn OAuth
4. Configure Stripe products & webhook
5. Push to GitHub
6. Deploy to Vercel

---

## 🔑 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
GEMINI_API_KEY=

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO=
STRIPE_PRICE_ENTERPRISE=

# Security
JWT_SECRET=
CRON_SECRET=
```

---

## 📈 Roadmap

- [x] Landing page with cinematic design
- [x] Auth system (JWT + OAuth)
- [x] Dashboard with 15+ pages
- [x] AI content generation
- [x] AI image generation
- [x] Command Palette (⌘K)
- [x] NOVA conversational AI
- [x] Anti-ban scheduler
- [x] Stripe billing
- [x] Affiliate system
- [ ] Carousel builder
- [ ] World map with live users
- [ ] Recruiter marketplace
- [ ] AI resume generator

---

## 📄 License

MIT © 2024 BLACKLINK AI

---

<div align="center">

**Build Authority. Become Visible. Get Hired.**

[Website](https://blacklink.ai) · [Twitter](https://twitter.com/blacklinkai) · [LinkedIn](https://linkedin.com/company/blacklinkai)

</div>
