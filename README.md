# 🛒 বাজার দর (BazarDor)

প্রয়োজনীয় পণ্যের দৈনিক বাজারদর এক নজরে — চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম, বাজারভিত্তিক তুলনা এবং দামের ওঠানামা এক জায়গায়।

  **Live:** https://assignment-07-xi.vercel.app · **Repo:** https://github.com/Minhaz-ify/Assignment-07

## Technologies

| Purpose | Tech |
| --- | --- |
| Framework / routing | Next.js 15 (App Router) |
| Styling | Tailwind CSS 3 + DaisyUI (custom `bazar` theme) |
| Auth | BetterAuth (email/password, Google, GitHub) + PostgreSQL |
| Notifications | react-hot-toast |
| Font | Hind Siliguri |
| Data | BazarDor REST API (`/products`, `/categories`) |

## Key features

1. **Live price ticker** — an infinite marquee under the navbar with emoji, name, price per unit and ▲/▼ change.
2. **Top risers & fallers** — the 6 biggest price increases and decreases on the home page, plus the full product grid.
3. **Bengali-first numbers** — prices and percentages are shown in Bengali digits, and sorting always uses the numeric value.
4. **Market-wise comparison** — protected product page with min / average / max price and the price in every market.
5. **Category pages with sorting** — default, low → high, high → low, with skeleton loaders and a friendly empty state.
6. **Authentication** — BetterAuth sign in / sign up, Google & GitHub login, protected routes and toast feedback.
7. **Profile update** — change your display name from the profile page.
8. **Fully responsive** with a custom 404 page.

## Getting started

```bash
npm install
cp .env.example .env.local     # fill in the values
npm run auth:migrate           # creates BetterAuth tables in Postgres
npm run dev
```

### Environment variables

See `.env.example`. You need a Postgres database (Neon / Supabase / Vercel Postgres), a `BETTER_AUTH_SECRET`,
and OAuth credentials for Google and GitHub.

OAuth callback URLs:

- Google: `{BETTER_AUTH_URL}/api/auth/callback/google`
- GitHub: `{BETTER_AUTH_URL}/api/auth/callback/github`

### Deploying to Vercel

1. Push to GitHub and import the repo on Vercel.
2. Add all env vars (set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the Vercel URL).
3. Run `npm run auth:migrate` once against the production `DATABASE_URL`.
4. Add the production callback URLs in the Google and GitHub OAuth apps.

## Project structure

```
app/            routes (home, category/[slug], product/[slug], signin, signup, profile)
app/api/        BetterAuth handler + /api/market proxy for the BazarDor API
components/     Navbar, Ticker, Hero, ProductCard, SortSelect, forms…
lib/            auth, API helpers, Bengali number helpers, data normaliser
middleware.js   protects /product/* and /profile/*
```
