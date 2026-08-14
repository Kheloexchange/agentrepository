# Wire — Sports & Entertainment Trending Topics

A trending-topics dashboard for picking blog subjects — **Cricket, Football, Tennis, Kabaddi, Basketball, Badminton, Hockey, Formula 1** and **Hollywood, Bollywood, South Cinema, Web Series/OTT** — with every headline linking straight back to the original article on the publisher's own site.

The site itself is **three static files**: `index.html`, `style.css`, `script.js`. No `npm install`, no build step, no framework, no backend server.

## Why there's still a tiny script involved

A browser can't fetch most publishers' RSS feeds directly — that's a CORS restriction set by the publisher, not something any client-side JavaScript can opt out of. There is no way around this for real news sites without either (a) a third-party proxy API (what this deliberately avoids), or (b) fetching server-side, where CORS doesn't apply.

So the actual fetching happens in **[`scripts/fetch-feeds.mjs`](scripts/fetch-feeds.mjs)** — a plain Node script with **zero npm dependencies** (it has its own small regex-based RSS/Atom reader, so there's no `package.json` at all). **[`.github/workflows/update-feeds.yml`](.github/workflows/update-feeds.yml)** runs it every 30 minutes on GitHub's own free runners and commits the result to **[`data/trending.json`](data/trending.json)**.

The website (`script.js`) then just does `fetch('data/trending.json')` — a same-origin static file sitting right next to it in the repo. No API key, no proxy, no CORS problem, nothing to run yourself.

```
publisher's RSS feed  →  scripts/fetch-feeds.mjs (GitHub Action, every 30 min)  →  data/trending.json  →  script.js reads it in the browser
```

## Sources

Defined in **[`data/sources.json`](data/sources.json)** — edit this file to add, remove, or re-point any feed. Currently:

- **Cricket:** ESPNcricinfo, Cricbuzz, BBC Sport, NDTV Sports
- **Football:** BBC Sport, Sky Sports, ESPN, NDTV Sports
- **Tennis:** BBC Sport, Sky Sports, NDTV Sports
- **Kabaddi:** NDTV Sports, Google News (topic search)
- **Basketball, Badminton, Hockey, Formula 1, Other Sports:** BBC Sport / Motorsport.com / Google News
- **Hollywood:** Variety, Deadline, The Hollywood Reporter
- **Bollywood:** Indian Express, Bollywood Hungama, Google News
- **South Cinema:** Indian Express Regional, Google News (Tollywood/Kollywood search)
- **Web Series / OTT:** ScreenRant, Google News

A couple of niche categories (Kabaddi, Badminton, South Cinema, OTT) lean on a Google News topic-search RSS feed as a supplement, since there isn't always one dominant dedicated publisher feed for them — those links still redirect to the original outlet, Google News is just the aggregator, not a proxy.

## Host it on GitHub Pages (no build)

1. Push this whole folder to a new GitHub repo.
2. **Settings → Pages → Build and deployment → Source → Deploy from a branch.** Pick your branch and `/ (root)`, save.
3. **Settings → Actions → General → Workflow permissions →** set to **Read and write permissions** (needed so the scheduled job can commit `data/trending.json` back).
4. Either wait for the first scheduled run, or go to the **Actions** tab → **Update Trending Topics** → **Run workflow** to fetch immediately.
5. Your Pages URL (`https://<username>.github.io/<repo>/`) is live within a minute or two, and refreshes automatically as the workflow keeps committing fresh data.

## Run it locally

```bash
node scripts/fetch-feeds.mjs   # fetches everything once, writes data/trending.json
python3 -m http.server 8000    # or any static file server
```

Then open `http://localhost:8000`.

## Customizing

- **Add a source or category:** add an entry to `data/sources.json` with `id`, `name`, `category`, `group` (`"Sports"` or `"Entertainment"`), `feed`, `website`. Also add the category to `CATEGORY_META` in `script.js` so it gets a tab.
- **Change refresh frequency:** edit the `cron` line in `.github/workflows/update-feeds.yml`.
- **Restyle:** all colors/spacing are CSS custom properties at the top of `style.css`.
