# Vercel Deployment Guide for Kingdom Wealth Summit 2026

This application is built with **Next.js 16 (App Router)** and **`@libsql/client`**, specifically designed to be deployed to **Vercel** with zero native binary compilation issues.

---

## 🚀 Quick Vercel Deployment Steps

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Deploy directly from project directory:
   ```bash
   vercel
   ```

3. To deploy to production:
   ```bash
   vercel --prod
   ```

---

### Option B: Deploy via GitHub / Vercel Dashboard

1. Push this project to your GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **Import Repository** and select `kws2026form`.
4. Leave Framework Preset as **Next.js**.
5. Click **Deploy**.

---

## 🗄️ Database Setup on Vercel (Persistent Storage)

Vercel functions run in serverless environments. To ensure registered user data persists permanently across all user sessions:

### Recommended: Turso (Free Cloud SQLite)

1. Sign up for free at [turso.tech](https://turso.tech).
2. Create a database using the Turso CLI or Web Dashboard:
   ```bash
   turso db create kws2026-db
   turso db show kws2026-db
   turso db tokens create kws2026-db
   ```
3. Add the following **Environment Variables** in your Vercel Project Settings (`Settings -> Environment Variables`):

| Variable Name | Description | Example Value |
|---|---|---|
| `TURSO_DATABASE_URL` | Turso Database Connection URL | `libsql://kws2026-db-username.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso Auth Token | `eyJhbGciOi...` |
| `DEEPSEEK_API_KEY` | DeepSeek API Key (Background AI Decomposition) | `sk-...` |
| `OPENAI_API_KEY` | OpenAI API Key (Alternative AI Provider) | `sk-proj-...` |
| `JOURNAL_JWT_SECRET` | Secret key for signing user auth tokens | `a_secure_random_string` |
| `RESEND_API_KEY` | Resend API Key for live email goal reminders | `re_...` |
| `EMAIL_FROM` | Sender address using your verified custom domain | `E-Journal <journal@finishrichafrica.com>` |
| `NEXT_PUBLIC_APP_URL` | App production base URL | `https://finishrichafrica.com` |

*(If no AI key is provided, the journal uses its built-in smart domain heuristics engine to decompose goals instantly).*

---

## 📋 Available Routes After Deployment

- **Landing Page:** `https://your-domain.vercel.app/`
- **Registration Form:** `https://your-domain.vercel.app/register`
- **Reflective E-Journal Web App:** `https://your-domain.vercel.app/journal`
- **Admin Dashboard & CSV Export:** `https://your-domain.vercel.app/admin`
