# DAVAR Finances

Personal finance management system built with Next.js, Supabase, Tailwind CSS and Chart.js.

## Features

- Login and signup with Supabase Auth
- Dashboard with total balance
- Income and expense transactions
- Category management
- Monthly filter
- Financial chart (income vs expenses)
- Mark transaction as paid
- Modern UI (glass style + dark mode support)
- Responsive for mobile and desktop

## Stack

- Next.js (App Router)
- Supabase
- Tailwind CSS
- Chart.js + react-chartjs-2

## Setup

1. Install Node.js 20+.
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. In Supabase SQL Editor, run:

- `supabase/schema.sql`

5. Run locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/login`
- `/signup`
- `/dashboard`
- `/transactions`
- `/categories`
- `/settings`
