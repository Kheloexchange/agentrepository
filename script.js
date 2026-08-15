/**
 * WIRE — Top 10 Sports + Top 10 Movies & Entertainment.
 *
 * This file does NOT fetch RSS feeds itself — browsers can't do that for
 * most publishers (they don't send the CORS header required to allow it).
 * Instead it reads `data/trending.json`, a same-origin static file that a
 * scheduled GitHub Action keeps fresh once an hour by running
 * scripts/fetch-feeds.mjs — the exact same `fetch()` function, just running
 * in Node instead of the browser, where that restriction doesn't apply.
 */

const DATA_URL = 'data/trending.json';

const sportsListEl = document.getElementById('sportsList');
const entListEl = document.getElementById('entList');
const sportsStatusEl = document.getElementById('sportsStatus');
const entStatusEl = document.getElementById('entStatus');
const updatedAtEl = document.getElementById('updatedAt');
const refreshBtn = document.getElementById('refreshBtn');
const cardTemplate = document.getElementById('cardTemplate');

function relativeTime(pubDateStr) {
  const ts = new Date(pubDateStr).getTime();
  if (!ts) return '';
  const diffMin = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function renderSkeleton(listEl) {
  listEl.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('div');
    row.className = 'skeleton-row';
    row.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    listEl.appendChild(row);
  }
}

function renderList(listEl, items) {
  listEl.innerHTML = '';
  if (!items || items.length === 0) {
    listEl.innerHTML =
      '<div class="state-msg">No headlines yet &mdash; the hourly fetch job may not have run yet. See the footer for how to trigger it.</div>';
    return;
  }
  items.forEach((item) => {
    const node = cardTemplate.content.cloneNode(true);
    const titleLink = node.querySelector('.card-title');
    titleLink.textContent = item.headline;
    titleLink.href = item.link;
    node.querySelector('.card-summary').textContent = item.summary || '';
    node.querySelector('.card-tag').textContent = item.category;
    node.querySelector('.card-source').textContent = item.sourceName;
    node.querySelector('.card-time').textContent = relativeTime(item.pubDate);
    listEl.appendChild(node);
  });
}

function renderSectionStatus(statusEl, items, failedCount) {
  if (!items || items.length === 0) {
    statusEl.textContent = 'no data yet';
    statusEl.className = 'section-status is-error';
  } else if (failedCount > 0) {
    statusEl.textContent = `${items.length} shown · ${failedCount} source(s) failed`;
    statusEl.className = 'section-status';
  } else {
    statusEl.textContent = `${items.length} shown · live`;
    statusEl.className = 'section-status is-live';
  }
}

async function loadData() {
  refreshBtn.classList.add('spinning');
  renderSkeleton(sportsListEl);
  renderSkeleton(entListEl);

  let data;
  try {
    const res = await fetch(`${DATA_URL}?_=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.warn('Could not load data/trending.json', err);
    data = { generatedAt: null, top: { Sports: [], Entertainment: [] }, failedSourcesCount: 0 };
  }

  updatedAtEl.textContent = data.generatedAt
    ? `data refreshed ${new Date(data.generatedAt).toLocaleString()}`
    : 'not fetched yet';

  renderList(sportsListEl, data.top?.Sports);
  renderList(entListEl, data.top?.Entertainment);
  renderSectionStatus(sportsStatusEl, data.top?.Sports, data.failedSourcesCount);
  renderSectionStatus(entStatusEl, data.top?.Entertainment, data.failedSourcesCount);

  refreshBtn.classList.remove('spinning');
}

loadData();
refreshBtn.addEventListener('click', loadData);
