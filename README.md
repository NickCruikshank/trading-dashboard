
# Trading Dash (Next.js + Prisma + SQLite)

A self-hosted trading dashboard with CRUD trades, CSV import/export, and quick calculators.

## Quick start
```bash
npm install
npx prisma migrate dev --name init
npm run dev
# open http://localhost:3000
```

## Deploy
- Push to GitHub and import to Vercel, or run on any Node host.
- SQLite file lives at `prisma/dev.db` (local). For production, switch to Postgres in `schema.prisma` and set `DATABASE_URL`.

## Notes
- UI components are lightweight, Tailwind-styled stand-ins for shadcn/ui.
- Options calculator ignores time/IV for now; we can add Black–Scholes + Greeks next.
