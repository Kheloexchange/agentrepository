#!/usr/bin/env node
/**
 * fetch-feeds.mjs
 * ----------------
 * Fetches every feed in data/sources.json directly from its publisher and
 * writes the merged result to data/trending.json.
 *
 * No npm packages are used — only Node's built-in `fetch` and a small
 * hand-written regex-based RSS/Atom reader below — so this repo has no
 * package.json, no node_modules, and nothing to `npm install`. Just:
 *
 *   node scripts/fetch-feeds.mjs
 *
 * Node has no browser CORS restriction, so every feed can be fetched
 * directly — no third-party "CORS unblocker" or RSS-to-JSON proxy is
 * involved anywhere in this file.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCES_PATH = path.join(ROOT, 'data/sources.json');
const OUTPUT_PATH = path.join(ROOT, 'data/trending.json');

const FETCH_TIMEOUT_MS = 12000;
const MAX_ITEMS_PER_FEED = 20;
const USER_AGENT = 'Mozilla/5.0 (compatible; TrendingTopicsFetcher/1.0)';

// ---------------------------------------------------------------------------
// Minimal, dependency-free RSS/Atom reader
// ---------------------------------------------------------------------------

const ENTITY_MAP = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(str) {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => ENTITY_MAP[name]);
}

function stripHtml(html) {
  return decodeEntities(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extracts the text content (or href attribute, for Atom <link>) of the first match of a tag inside a block. */
function extractTag(block, tagName) {
  const textMatch = block.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  if (textMatch) return decodeEntities(textMatch[1]).trim();

  // self-closing / attribute-only tag, e.g. <link href="..." /> (Atom)
  const attrMatch = block.match(new RegExp(`<${tagName}\\b[^>]*\\/?>`, 'i'));
  if (attrMatch) {
    const hrefMatch = attrMatch[0].match(/href="([^"]*)"/i);
    if (hrefMatch) return decodeEntities(hrefMatch[1]).trim();
  }
  return '';
}

/** For Atom <link> which may appear multiple times with rel="alternate". */
function extractAtomLink(block) {
  const links = [...block.matchAll(/<link\b([^>]*)\/?>(?:[\s\S]*?<\/link>)?/gi)];
  for (const m of links) {
    const attrs = m[1];
    const hrefMatch = attrs.match(/href="([^"]*)"/i);
    const relMatch = attrs.match(/rel="([^"]*)"/i);
    if (hrefMatch && (!relMatch || relMatch[1] === 'alternate')) {
      return decodeEntities(hrefMatch[1]).trim();
    }
  }
  return '';
}

/** Google News RSS wraps the real publisher name in <source url="...">Name</source>. */
function extractGoogleNewsSourceName(block) {
  const m = block.match(/<source\b[^>]*>([\s\S]*?)<\/source>/i);
  return m ? decodeEntities(m[1]).trim() : '';
}

function parseFeed(xmlText, source) {
  const isAtom = /<feed\b[^>]*xmlns=["']http:\/\/www\.w3\.org\/2005\/Atom["']/i.test(xmlText);
  const blocks = isAtom
    ? [...xmlText.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((m) => m[1])
    : [...xmlText.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);

  const articles = [];
  blocks.slice(0, MAX_ITEMS_PER_FEED).forEach((block, idx) => {
    const title = extractTag(block, 'title');
    if (!title) return;

    const link = isAtom ? extractAtomLink(block) : extractTag(block, 'link') || source.website;
    const descriptionRaw = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content');
    const pubDateStr =
      extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated') || new Date().toISOString();
    const timestamp = new Date(pubDateStr).getTime() || Date.now() - idx * 1000 * 60 * 15;
    const gnewsSource = extractGoogleNewsSourceName(block);

    articles.push({
      id: `${source.id}-${idx}-${timestamp}`,
      headline: title,
      link: link || source.website,
      summary: stripHtml(descriptionRaw).slice(0, 220),
      sourceId: source.id,
      sourceName: gnewsSource || source.name,
      category: source.category,
      group: source.group,
      pubDate: pubDateStr,
      timestamp,
    });
  });

  return articles;
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
      },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchSource(source) {
  try {
    const res = await fetchWithTimeout(source.feed, FETCH_TIMEOUT_MS);
    if (!res.ok) {
      return { source, articles: [], status: 'error', error: `HTTP ${res.status}` };
    }
    const xmlText = await res.text();
    const articles = parseFeed(xmlText, source);
    if (articles.length === 0) {
      return { source, articles: [], status: 'error', error: 'No items parsed from feed' };
    }
    return { source, articles, status: 'success' };
  } catch (err) {
    return { source, articles: [], status: 'error', error: err instanceof Error ? err.message : String(err) };
  }
}

async function main() {
  const sources = JSON.parse(await readFile(SOURCES_PATH, 'utf-8'));
  console.log(`Fetching ${sources.length} feeds directly from their publishers...`);

  const results = await Promise.all(sources.map(fetchSource));

  const allArticles = [];
  const sourceStatuses = [];
  let failedCount = 0;

  for (const { source, articles, status, error } of results) {
    sourceStatuses.push({
      id: source.id,
      name: source.name,
      category: source.category,
      group: source.group,
      website: source.website,
      feed: source.feed,
      status,
      itemCount: articles.length,
      error,
    });

    if (status === 'success') {
      allArticles.push(...articles);
    } else {
      failedCount++;
      console.warn(`  \u2717 ${source.name} (${source.category}): ${error}`);
    }
  }

  console.log(`Fetched ${allArticles.length} articles from ${sources.length - failedCount}/${sources.length} sources.`);

  // Group into { "Cricket": [...], "Football": [...], ... }, newest first, capped per category.
  const byCategory = {};
  allArticles
    .sort((a, b) => b.timestamp - a.timestamp)
    .forEach((article) => {
      if (!byCategory[article.category]) byCategory[article.category] = [];
      if (byCategory[article.category].length < 30) byCategory[article.category].push(article);
    });

  const output = {
    generatedAt: new Date().toISOString(),
    categories: byCategory,
    sources: sourceStatuses,
    failedSourcesCount: failedCount,
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('fetch-feeds.mjs failed:', err);
  process.exit(1);
});
