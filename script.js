/**
 * WIRE — Sports & Entertainment trending topics.
 *
 * This file does NOT fetch RSS feeds itself — browsers can't reliably do
 * that for most publishers (CORS). Instead it reads `data/trending.json`,
 * a same-origin static file kept fresh by a scheduled GitHub Action that
 * runs scripts/fetch-feeds.mjs directly against each publisher's own feed.
 * See the README for how that pipeline works.
 */

const DATA_URL = 'data/trending.json';

// Order + light metadata for every category we expect to see.
const CATEGORY_META = {
  Cricket: { group: 'Sports', desc: 'Latest cricket headlines, newest first.' },
  Football: { group: 'Sports', desc: 'Latest football headlines, newest first.' },
  Tennis: { group: 'Sports', desc: 'Latest tennis headlines, newest first.' },
  Kabaddi: { group: 'Sports', desc: 'Latest kabaddi headlines, newest first.' },
  Basketball: { group: 'Sports', desc: 'Latest basketball headlines, newest first.' },
  Badminton: { group: 'Sports', desc: 'Latest badminton headlines, newest first.' },
  Hockey: { group: 'Sports', desc: 'Latest hockey headlines, newest first.' },
  'Formula 1': { group: 'Sports', desc: 'Latest Formula 1 headlines, newest first.' },
  'Other Sports': { group: 'Sports', desc: 'Other sports headlines, newest first.' },
  Hollywood: { group: 'Entertainment', desc: 'Latest Hollywood headlines, newest first.' },
  Bollywood: { group: 'Entertainment', desc: 'Latest Bollywood headlines, newest first.' },
  'South Cinema': { group: 'Entertainment', desc: 'Tollywood, Kollywood & South Indian cinema, newest first.' },
  'Web Series / OTT': { group: 'Entertainment', desc: 'Latest streaming / OTT headlines, newest first.' },
};

const CATEGORY_ORDER = Object.keys(CATEGORY_META);

const tabsEl = document.getElementById('tabs');
const groupRowEl = document.getElementById('groupRow');
const cardListEl = document.getElementById('cardList');
const titleEl = document.getElementById('activeCategoryTitle');
const descEl = document.getElementById('activeCategoryDesc');
const statusEl = document.getElementById('sectionStatus');
const updatedAtEl = document.getElementById('updatedAt');
const refreshBtn = document.getElementById('refreshBtn');
const cardTemplate = document.getElementById('cardTemplate');

let activeGroup = 'Sports';
let activeCategory = 'Cricket';
let data = null;

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

function renderGroupButtons() {
  groupRowEl.querySelectorAll('.group-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.group === activeGroup));
    btn.addEventListener('click', () => {
      activeGroup = btn.dataset.group;
      const firstInGroup = CATEGORY_ORDER.find((c) => CATEGORY_META[c].group === activeGroup);
      activeCategory = firstInGroup;
      renderAll();
    });
  });
}

function renderTabs() {
  tabsEl.innerHTML = '';
  CATEGORY_ORDER.filter((c) => CATEGORY_META[c].group === activeGroup).forEach((category) => {
    const count = data?.categories?.[category]?.length ?? 0;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tab';
    tab.role = 'tab';
    tab.setAttribute('aria-selected', String(category === activeCategory));
    tab.innerHTML = `${category}${count ? `<span class="tab-count">${count}</span>` : ''}`;
    tab.addEventListener('click', () => {
      activeCategory = category;
      renderTabs();
      renderCards();
    });
    tabsEl.appendChild(tab);
  });
  groupRowEl.querySelectorAll('.group-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.group === activeGroup));
  });
}

function renderSkeleton() {
  cardListEl.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('div');
    row.className = 'skeleton-row';
    row.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    cardListEl.appendChild(row);
  }
}

function renderCards() {
  titleEl.textContent = activeCategory;
  descEl.textContent = CATEGORY_META[activeCategory]?.desc ?? '';

  const items = data?.categories?.[activeCategory] ?? [];
  cardListEl.innerHTML = '';

  if (items.length === 0) {
    cardListEl.innerHTML =
      '<div class="state-msg">No headlines fetched for this category yet — the scheduled fetch job may not have run, or every source for it failed. See the status footer for details.</div>';
    return;
  }

  items.forEach((item) => {
    const node = cardTemplate.content.cloneNode(true);
    const titleLink = node.querySelector('.card-title');
    titleLink.textContent = item.headline;
    titleLink.href = item.link;
    node.querySelector('.card-summary').textContent = item.summary || '';
    node.querySelector('.card-source').textContent = item.sourceName;
    node.querySelector('.card-time').textContent = relativeTime(item.pubDate);
    cardListEl.appendChild(node);
  });
}

function renderStatus() {
  if (!data) return;
  if (data.generatedAt) {
    const d = new Date(data.generatedAt);
    updatedAtEl.textContent = `data refreshed ${d.toLocaleString()}`;
  } else {
    updatedAtEl.textContent = 'not fetched yet';
  }

  const total = Object.values(data.categories || {}).reduce((sum, arr) => sum + arr.length, 0);
  const failed = data.failedSourcesCount ?? 0;
  if (total === 0) {
    statusEl.textContent = 'no data yet';
    statusEl.className = 'section-status is-error';
  } else if (failed > 0) {
    statusEl.textContent = `${total} headlines · ${failed} source(s) failed last run`;
    statusEl.className = 'section-status';
  } else {
    statusEl.textContent = `${total} headlines live`;
    statusEl.className = 'section-status is-live';
  }
}

function renderAll() {
  renderTabs();
  renderCards();
  renderStatus();
}

async function loadData() {
  refreshBtn.classList.add('spinning');
  renderSkeleton();
  try {
    const res = await fetch(`${DATA_URL}?_=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.warn('Could not load data/trending.json', err);
    data = { generatedAt: null, categories: {}, failedSourcesCount: 0 };
  }
  renderAll();
  refreshBtn.classList.remove('spinning');
}

renderGroupButtons();
loadData();
refreshBtn.addEventListener('click', loadData);
