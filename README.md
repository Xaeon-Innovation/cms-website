# CMS Website

Next.js app for the CMS website.

## Prerequisites

- Node.js (LTS recommended)

## Setup

Install deps:

```bash
npm install
```

Create your local env file:

```bash
copy .env.example .env.local
```

Fill in the required values in `.env.local`. Do **not** commit secrets.

## Run locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run start`: run production server
