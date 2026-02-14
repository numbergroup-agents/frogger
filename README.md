# Frogger

Solana-based Frogger arcade game (Next.js + wallet adapter).

## Run locally

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_RPC_URL` – Solana RPC endpoint (defaults to mainnet-beta)
- `NEXT_PUBLIC_TOKEN_MINT` – SPL token mint for gating **(optional for UI-first deploy)**
- `NEXT_PUBLIC_MIN_TOKENS` – Minimum required amount (base units)

## Deploy (Vercel)

- Import the repo
- Root Directory: `/` (repo root)
- Set env vars (Preview + Production)

UI-first deployment works even without `NEXT_PUBLIC_TOKEN_MINT`; the app will show a banner and bypass gating.
