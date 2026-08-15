# Wire — Top 10 Trending: Sports & Entertainment

**Top 10 Sports** and **Top 10 Movies & Entertainment**, refreshed every hour, for picking your next blog topic. Every headline links straight to the original article.

The site itself is **three static files** — `index.html`, `style.css`, `script.js`. No `npm install`, no build step, no framework.

## How it reads other websites without an API or a backend server

Both halves of this use plain `fetch()` — nothing else:

1. **`scripts/fetch-feeds.mjs`** — a Node script with **zero npm dependencies** — calls `fetch()` on each RSS feed in `data/sources.json`, directly, once an hour. Node has no browser CORS restriction, so this reaches every source with no proxy and no key.
2. **`.github/workflows/update-feeds.yml`** runs that script for free, once an hour, on GitHub's own servers, and commits the result to `data/trending.json`. This isn't a backend you run or pay for — it's a scheduled job, built into GitHub, that starts, runs for a couple of seconds, and stops.
3. **`script.js`**, in the browser, also just calls `fetch()` — on `data/trending.json`, a plain file sitting in the same repo as the page. Same-origin, so there's no CORS issue there at all.

```
publisher's RSS feed → fetch() in scripts/fetch-feeds.mjs (GitHub Action, hourly) → data/trending.json → fetch() in script.js (browser)
```

Browsers can't skip step 1 and `fetch()` a news site's RSS feed directly from the page itself — that's blocked by the publisher not sending a CORS permission header, which is true of virtually every news site and isn't something any particular way of calling `fetch()` gets around. Splitting the read into "Node fetches it once an hour" + "browser reads the saved result" is what makes that work with zero backend and zero API key.

## Sources

Defined in `data/sources.json` — ESPNcricinfo, Cricbuzz, BBC Sport, Sky Sports, NDTV Sports, Motorsport.com for Sports (Cricket, Football, Tennis, Kabaddi, Basketball, Badminton, Hockey, Formula 1); Variety, Deadline, The Hollywood Reporter, Bollywood Hungama, Indian Express for Entertainment (Hollywood, Bollywood, South Cinema, Web Series/OTT). A couple of the harder-to-source categories (Kabaddi, South Cinema) also use a Google News topic-search feed as backup — that still redirects to the original outlet, Google News is just aggregating, not proxying.

The Top 10 for each group is built by round-robining across its categories (one cricket story, one football story, one kabaddi story, etc.) so it isn't dominated by whichever source happens to publish the most.

## Host it on GitHub Pages (free, no build)

1. Push this folder to a new GitHub repo.
2. **Settings → Pages → Build and deployment → Source → Deploy from a branch.** Pick your branch, `/ (root)`, save.
3. **Settings → Actions → General → Workflow permissions →** set to **Read and write permissions** (so the hourly job can commit `data/trending.json`).
4. **Actions** tab → **Update Trending Topics** → **Run workflow**, to fetch immediately instead of waiting for the next hour.
5. Your Pages URL is live within a minute or two, and updates itself every hour from then on.

## Run it locally

```bash
node scripts/fetch-feeds.mjs   # fetches everything once, writes data/trending.json
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Customizing

- **Add/remove a source:** edit `data/sources.json` (`id`, `name`, `category`, `group`: `"Sports"` or `"Entertainment"`, `feed`, `website`).
- **Change refresh frequency:** edit the `cron` line in `.github/workflows/update-feeds.yml` (currently `0 * * * *`, once an hour).
- **Show more/fewer than 10:** change the `limit` passed to `topForGroup()` near the bottom of `scripts/fetch-feeds.mjs`.
- **Restyle:** all colors/spacing are CSS custom properties at the top of `style.css`.
