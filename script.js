/**
 * WIRE — a zero-backend, zero-build, zero-API-key trending topics dashboard.
 *
 * Every function below calls a source's OWN public, free, CORS-enabled
 * endpoint directly from the browser. Nothing here is a third-party
 * "CORS unblocker" / RSS-to-JSON proxy — these are the same endpoints the
 * publishers document for public, unauthenticated use, and they all send
 * `Access-Control-Allow-Origin: *`, so a plain `fetch()` works with no
 * server of any kind in between.
 *
 * Most ordinary news-site RSS feeds do NOT allow this (publishers don't
 * send CORS headers), which is a browser security restriction, not a
 * choice made by this app — that's why the sources below were chosen.
 */

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // auto-refresh every 5 minutes

const SOURCES = [
  {
    id: 'wiki',
    label: 'Wikipedia',
    description: 'The most-read articles on English Wikipedia, worldwide, right now.',
    fetchItems: fetchWikipediaTrending,
  },
  {
    id: 'hn',
    label: 'Hacker News',
    description: 'Top stories on Hacker News right now.',
    fetchItems: fetchHackerNewsTrending,
  },
  {
    id: 'gh',
    label: 'GitHub',
    description: 'Repositories gaining stars fastest over the last 7 days.',
    fetchItems: fetchGitHubTrending,
  },
];

// ---------------------------------------------------------------------------
// Source 1: Wikipedia — Wikimedia REST API (pageviews/top)
// Docs: https://wikimedia.org/api/rest_v1/  (CORS enabled, no key required)
// ---------------------------------------------------------------------------
async function fetchWikipediaTrending() {
  const EXCLUDED = new Set(['Main_Page', 'Special:Search']);
  const isArticle = (title) =>
    !EXCLUDED.has(title) && !title.startsWith('Special:') && !title.startsWith('Wikipedia:');

  // Pageview stats usually need ~1 day to finalize, so try yesterday first
  // and fall back a day further if that date isn't published yet.
  for (let daysAgo = 1; daysAgo <= 3; daysAgo++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - daysAgo);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');

    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${y}/${m}/${day}`;
    const res = await fetch(url);
    if (!res.ok) continue; // that day's stats aren't published yet — try further back

    const data = await res.json();
    const articles = data?.items?.[0]?.articles ?? [];
    const filtered = articles.filter((a) => isArticle(a.article)).slice(0, 15);

    return filtered.map((a, idx) => ({
      rank: idx + 1,
      title: decodeURIComponent(a.article).replace(/_/g, ' '),
      url: `https://en.wikipedia.org/wiki/${a.article}`,
      stat: `${a.views.toLocaleString()} views`,
      time: `${y}-${m}-${day}`,
    }));
  }

  throw new Error('Wikimedia pageview stats are temporarily unavailable.');
}

// ---------------------------------------------------------------------------
// Source 2: Hacker News — Firebase-backed public API
// Docs: https://github.com/HackerNews/API  (CORS enabled, no key required)
// ---------------------------------------------------------------------------
async function fetchHackerNewsTrending() {
  const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  if (!idsRes.ok) throw new Error(`HTTP ${idsRes.status}`);
  const ids = (await idsRes.json()).slice(0, 15);

  const items = await Promise.all(
    ids.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => (r.ok ? r.json() : null))
    )
  );

  return items
    .filter(Boolean)
    .map((item, idx) => ({
      rank: idx + 1,
      title: item.title || '(untitled)',
      url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
      stat: `${item.score ?? 0} pts · ${item.descendants ?? 0} comments`,
      time: relativeTime(item.time * 1000),
    }));
}

// ---------------------------------------------------------------------------
// Source 3: GitHub — public Search API
// Docs: https://docs.github.com/en/rest/search  (CORS enabled, no key required
// for the low-volume unauthenticated rate limit)
// ---------------------------------------------------------------------------
async function fetchGitHubTrending() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 7);
  const sinceStr = since.toISOString().slice(0, 10);

  const url = `https://api.github.com/search/repositories?q=created:>${sinceStr}&sort=stars&order=desc&per_page=15`;
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  return (data.items ?? []).map((repo, idx) => ({
    rank: idx + 1,
    title: repo.full_name,
    url: repo.html_url,
    stat: `★ ${repo.stargazers_count.toLocaleString()}${repo.language ? ' · ' + repo.language : ''}`,
    time: relativeTime(new Date(repo.created_at).getTime()),
  }));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function relativeTime(timestampMs) {
  const diffMin = Math.max(0, Math.floor((Date.now() - timestampMs) / 60000));
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function formatClock() {
  return new Date().toLocaleTimeString([], { hour12: false });
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
const tabsEl = document.getElementById('tabs');
const mainEl = document.getElementById('main');
const clockEl = document.getElementById('clock');
const refreshBtn = document.getElementById('refreshBtn');
const cardTemplate = document.getElementById('cardTemplate');

let activeSourceId = SOURCES[0].id;

function buildLayout() {
  SOURCES.forEach((source) => {
    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.type = 'button';
    tab.role = 'tab';
    tab.dataset.sourceId = source.id;
    tab.setAttribute('aria-selected', String(source.id === activeSourceId));
    tab.textContent = source.label;
    tab.addEventListener('click', () => switchTab(source.id));
    tabsEl.appendChild(tab);

    const section = document.createElement('section');
    section.className = 'section' + (source.id === activeSourceId ? ' active' : '');
    section.id = `section-${source.id}`;
    section.innerHTML = `
      <div class="section-head">
        <div>
          <div class="section-title">${source.label}</div>
          <div class="section-desc">${source.description}</div>
        </div>
        <div class="section-status" data-status></div>
      </div>
      <div class="card-list" data-list></div>
    `;
    mainEl.appendChild(section);
  });
}

function switchTab(sourceId) {
  activeSourceId = sourceId;
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.setAttribute('aria-selected', String(tab.dataset.sourceId === sourceId));
  });
  document.querySelectorAll('.section').forEach((section) => {
    section.classList.toggle('active', section.id === `section-${sourceId}`);
  });
}

function renderSkeleton(listEl) {
  listEl.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('div');
    row.className = 'skeleton-row';
    row.innerHTML = `
      <div class="skeleton"></div>
      <div class="skeleton-body">
        <div class="skeleton"></div>
        <div class="skeleton"></div>
      </div>
    `;
    listEl.appendChild(row);
  }
}

function renderError(listEl, message) {
  listEl.innerHTML = `<div class="state-msg is-error">Couldn't load this source: ${escapeHtml(message)}</div>`;
}

function renderItems(listEl, items) {
  listEl.innerHTML = '';
  if (items.length === 0) {
    listEl.innerHTML = '<div class="state-msg">No items right now.</div>';
    return;
  }
  items.forEach((item) => {
    const node = cardTemplate.content.cloneNode(true);
    node.querySelector('.card-rank').textContent = String(item.rank).padStart(2, '0');
    const titleEl = node.querySelector('.card-title');
    titleEl.textContent = item.title;
    titleEl.href = item.url;
    node.querySelector('.card-stat').textContent = item.stat;
    node.querySelector('.card-time').textContent = item.time;
    listEl.appendChild(node);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadSource(source) {
  const section = document.getElementById(`section-${source.id}`);
  const listEl = section.querySelector('[data-list]');
  const statusEl = section.querySelector('[data-status]');

  renderSkeleton(listEl);
  statusEl.textContent = 'loading…';
  statusEl.className = 'section-status';

  try {
    const items = await source.fetchItems();
    renderItems(listEl, items);
    statusEl.textContent = `live · ${formatClock()}`;
    statusEl.className = 'section-status is-live';
  } catch (err) {
    console.warn(`[${source.label}] fetch failed:`, err);
    renderError(listEl, err.message || 'network error');
    statusEl.textContent = 'error';
    statusEl.className = 'section-status is-error';
  }
}

async function loadAll() {
  refreshBtn.classList.add('spinning');
  await Promise.all(SOURCES.map(loadSource));
  refreshBtn.classList.remove('spinning');
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
buildLayout();
loadAll();
refreshBtn.addEventListener('click', loadAll);
setInterval(loadAll, REFRESH_INTERVAL_MS);
setInterval(() => (clockEl.textContent = formatClock()), 1000);
clockEl.textContent = formatClock();
