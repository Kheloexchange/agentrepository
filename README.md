# Trending Topics Agent

Discover recent and emerging trending topics across **Sports** and **Entertainment**, clustered from multiple news sources and ranked by recency, coverage, and source diversity — built for content & SEO research.

> This app was originally scaffolded in [Google AI Studio](https://ai.studio). It has since been de-coupled from AI Studio's runtime (no Gemini API key, no server) so it can run as a fully static site on GitHub Pages, with no third-party service dependency for fetching data.

## How the data pipeline works

The original version fetched RSS feeds **from the browser** at runtime, which required routing every request through third-party CORS-unblocking services (`rss2json.com`, `api.allorigins.win`) because most news publishers don't send CORS headers. That made the app dependent on those services being up, and subject to their rate limits.

This version removes that dependency entirely:

1. **[`scripts/fetch-feeds.mjs`](scripts/fetch-feeds.mjs)** — a plain Node.js script that fetches every feed in [`src/data/sources.json`](src/data/sources.json) **directly from its publisher**. Node has no browser CORS restriction, so this works with zero external "proxy" API.
2. **[`.github/workflows/update-feeds.yml`](.github/workflows/update-feeds.yml)** — runs that script every 30 minutes on GitHub's own runners and commits the result to [`public/data/trending.json`](public/data/trending.json).
3. **[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)** — builds the site and publishes it to GitHub Pages whenever `main` changes (including the automatic data-refresh commits).
4. The frontend ([`src/utils/feedFetcher.ts`](src/utils/feedFetcher.ts)) just does `fetch('/data/trending.json')` — a same-origin static file, no proxy, no API key, no CORS problem.

User-added **custom sources** (added via the Sources page) are still attempted as a best-effort *direct* fetch from the browser — no proxy is used for those either, so a custom feed will only load if its publisher happens to allow cross-origin requests. If it doesn't, the source is reported as unavailable rather than silently routed through a third party.

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run fetch-feeds   # fetches all sources once and writes public/data/trending.json
npm run dev           # starts the app at http://localhost:3000
```

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint       # type-check with tsc
```

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflows manually via the **Actions** tab):
   - `Update Trending Feeds` fetches live data and commits `public/data/trending.json`.
   - `Deploy to GitHub Pages` builds and publishes the site.
4. On first deploy, before `Update Trending Feeds` has run, the app will show a small bundled sample dataset ([`src/data/fallbackTopics.ts`](src/data/fallbackTopics.ts)) so the UI is never empty.

No secrets or API keys are required for any of this.

## Adding or editing sources

Edit [`src/data/sources.json`](src/data/sources.json) — it's the single source of truth used by both the frontend and `scripts/fetch-feeds.mjs`. Each entry needs `id`, `name`, `category`, `superCategory`, `feed` (the RSS/Atom URL), `website`, and `enabled`.

## Project structure

```
src/
  data/sources.json     curated RSS/Atom feed list (source of truth)
  data/fallbackTopics.ts bundled sample data shown before the first live fetch
  utils/feedFetcher.ts   loads public/data/trending.json + custom sources
  utils/deduplication.ts clusters articles into topics (headline similarity)
  utils/ranking.ts       trending score (recency / coverage / diversity)
  pages/                 Dashboard, Sports, Entertainment, Saved, Workflow, Sources, Settings
scripts/fetch-feeds.mjs  Node script: fetch all feeds directly, write public/data/trending.json
.github/workflows/       scheduled fetch + GitHub Pages deploy
```
