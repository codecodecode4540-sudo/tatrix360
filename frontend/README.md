# Tatrix360

A modern tech news magazine built with Next.js 14 (App Router) and Strapi 5.

## Frontend

```bash
npm install
npm run dev      # http://localhost:3000
```

The frontend reads from Strapi at `STRAPI_URL` (default `http://localhost:1337`). If Strapi is unreachable, it falls back to built-in demo data so the site always renders.

## Backend (Strapi)

```bash
cd backend
cp .env.example .env    # fill in the salts/secrets
npm install
npm run develop         # http://localhost:1337/admin
```

Create an admin user in the browser, then generate a full-access API token in **Settings > API Tokens**. Seed the content:

```bash
STRAPI_API_TOKEN=<your-token> node seed.js
```

## Environment

Frontend `.env`:

```
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<your-api-token>
```

## Features

- Dark/light theme with toggle (defaults to dark)
- Homepage with hero, latest posts, trending sidebar, newsletter signup
- Article pages with structured data (JSON-LD), related posts, author bylines
- Category pages, live search, contact form, about page
- Contact submissions and newsletter subscribers stored in Strapi
- Cloudinary media uploads
- Fully responsive
