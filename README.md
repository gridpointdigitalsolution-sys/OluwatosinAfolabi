# Pastor Quotes

A faith-filled daily quote generator powered by Claude AI, built for Pastor Mrs. Oluwatosin Afolabi.

## Features

- Generate original spiritual quotes from 24 curated themes (Love, Peace, Hope, Faith, and more)
- Each quote is paired with a matching KJV Bible verse fetched live
- Beautiful shareable quote cards with pastor watermark
- Download quotes as JPEG images
- Copy quotes to clipboard
- Native share sheet support on mobile
- Save favourite quotes locally (persisted in localStorage)
- Saved quotes gallery with individual delete and clear-all
- Fully responsive — mobile-first design

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Claude API** (`claude-opus-4-5`) via `@anthropic-ai/sdk`
- **html2canvas** — quote-card image export
- **lucide-react** — icons
- **bible-api.com** — free KJV verse lookup

## Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd pastor-quotes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

4. **Add the pastor photo**
   Place `pastor.jpg` in the `/public` folder. The image should be a portrait photo — it appears as the profile picture in the header and as a subtle watermark inside each quote card.

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deployment (Hostinger)

> Deployment instructions will be added here once the hosting environment is confirmed.

For a standard Node.js deployment:
- Run `npm run build` to produce the `.next` production build
- Run `npm start` to serve it
- Set `ANTHROPIC_API_KEY` and `NEXT_PUBLIC_SITE_URL` as environment variables in your hosting panel

## License

© 2025 Pastor Mrs. Oluwatosin Afolabi. All rights reserved.
