# Wire — Trending Topics

A live "trending topics" dashboard that is **just three static files** — `index.html`, `style.css`, `script.js`. No `npm install`, no build step, no backend, no API keys, no third-party proxy.

## How it gets data without an API key or a backend

Regular news-site RSS feeds can't be fetched straight from a browser — publishers don't send the CORS header that allows it, and that's a browser security rule nothing on the frontend can get around without a server or a proxy in between.

So instead this reads three sources that **do** publish a free, public, keyless endpoint with CORS explicitly turned on, so a plain `fetch()` in the browser talks to them directly:

| Tab | Source | Endpoint |
|---|---|---|
| Wikipedia | Most-read articles on English Wikipedia | `wikimedia.org/api/rest_v1/metrics/pageviews/top/...` |
| Hacker News | Top stories right now | `hacker-news.firebaseio.com/v0/...` |
| GitHub | Repos gaining stars fastest this week | `api.github.com/search/repositories` |

Every one of those is documented by its own publisher for direct client-side use — they are not proxy/aggregator services, they're the primary source's own public API, and none of them need a key or sign-up. Open `script.js` — each fetch call is a plain, readable `fetch(url)` to that publisher's own domain.

## Run it

There's nothing to install. Either:

- Just double-click `index.html` to open it in a browser, **or**
- Run any static file server, e.g. `python3 -m http.server 8000`, then visit `http://localhost:8000`

## Host it on GitHub Pages

1. Create a new GitHub repo and push these three files (plus this README) to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick your default branch (e.g. `main`) and folder `/ (root)`, then **Save**.
5. GitHub gives you a live URL (`https://<your-username>.github.io/<repo-name>/`) within a minute or two — no Actions, no workflows, no build required.

That's it — every time someone visits the page, their own browser fetches the live data at that moment.

## Customizing

- **Add/remove a source:** each entry in the `SOURCES` array in `script.js` has a `label`, `description`, and a `fetchItems()` function that returns a plain array of `{ rank, title, url, stat, time }`. Add a new one the same way, as long as the endpoint you point it at sends CORS headers.
- **Change the refresh rate:** edit `REFRESH_INTERVAL_MS` at the top of `script.js` (currently 5 minutes).
- **Restyle it:** all colors and spacing are CSS custom properties at the top of `style.css`.

## A note on scope

These three sources lean tech/general-interest rather than sports/entertainment specifically, because those are the categories with genuinely open, keyless, CORS-enabled endpoints today. If you specifically need sports/entertainment RSS headlines with zero backend, that combination isn't possible purely from a browser — those publishers don't allow direct cross-origin requests, so *any* client-only approach to them needs some interposing proxy. This dashboard trades that off by only using sources that don't have that problem.
