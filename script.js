/**
 * THE INDEX — a hand-curated directory of the best sites to follow per topic.
 *
 * This is a static list, not live data — nothing here is fetched, scraped,
 * or pulled from an API. Every link just opens that publication's own site
 * in a new tab. To edit the list, edit the SITES array below.
 */

const CATEGORIES = [
  { id: 'cricket', label: 'Cricket', supergroup: 'Sports', icon: '\u{1F3CF}' },
  { id: 'football', label: 'Football', supergroup: 'Sports', icon: '\u26BD' },
  { id: 'other-sports', label: 'Other Sports', supergroup: 'Sports', icon: '\u{1F3C6}' },
  { id: 'hollywood', label: 'Hollywood', supergroup: 'Entertainment', icon: '\u{1F3AC}' },
  { id: 'bollywood', label: 'Bollywood', supergroup: 'Entertainment', icon: '\u{1F3AD}' },
  { id: 'south-cinema', label: 'South Cinema', supergroup: 'Entertainment', icon: '\u{1F3A5}' },
  { id: 'bike-racing', label: 'Bike Racing', supergroup: 'Racing', icon: '\u{1F3CD}\uFE0F' },
  { id: 'f1-racing', label: 'Formula Racing', supergroup: 'Racing', icon: '\u{1F3CE}\uFE0F' },
  { id: 'bike-types', label: 'Bikes & Reviews', supergroup: 'Racing', icon: '\u{1F527}' },
];

const SUPERGROUPS = ['Sports', 'Entertainment', 'Racing'];

const SITES = [
  // ---- Cricket ----
  { rank: 1, category: 'cricket', name: 'ESPNcricinfo', url: 'https://www.espncricinfo.com', blurb: 'The default reference for cricket — scores, stats, and long-form analysis.' },
  { rank: 2, category: 'cricket', name: 'Cricbuzz', url: 'https://www.cricbuzz.com', blurb: 'Fast live scores and a huge volume of daily news posts.' },
  { rank: 3, category: 'cricket', name: 'ICC Cricket', url: 'https://www.icc-cricket.com', blurb: "The sport's governing body — official rankings, fixtures, tournaments." },
  { rank: 4, category: 'cricket', name: 'Wisden', url: 'https://wisden.com', blurb: 'The historic almanack, now online — sharper, longer-form writing.' },
  { rank: 5, category: 'cricket', name: 'Sportstar Cricket', url: 'https://sportstar.thehindu.com/cricket', blurb: "The Hindu's sports desk — strong Indian domestic and international coverage." },
  { rank: 6, category: 'cricket', name: 'NDTV Sports Cricket', url: 'https://sports.ndtv.com/cricket', blurb: 'Quick-turnaround Indian cricket news and match reports.' },
  { rank: 7, category: 'cricket', name: 'Sky Sports Cricket', url: 'https://www.skysports.com/cricket', blurb: 'UK broadcaster coverage — strong on The Ashes and county cricket.' },
  { rank: 8, category: 'cricket', name: 'BBC Sport Cricket', url: 'https://www.bbc.com/sport/cricket', blurb: 'Concise, reliably-sourced match reports and explainers.' },
  { rank: 9, category: 'cricket', name: 'Cricket.com', url: 'https://www.cricket.com', blurb: 'Modern stats-heavy site with a clean live-score interface.' },
  { rank: 10, category: 'cricket', name: 'The Cricketer', url: 'https://www.thecricketer.com', blurb: "Britain's oldest cricket magazine, online — opinion and long reads." },

  // ---- Football ----
  { rank: 1, category: 'football', name: 'BBC Sport Football', url: 'https://www.bbc.com/sport/football', blurb: 'The broad, reliable default for football news in English.' },
  { rank: 2, category: 'football', name: 'Sky Sports Football', url: 'https://www.skysports.com/football', blurb: 'Deep Premier League coverage, transfer news, and live text commentary.' },
  { rank: 3, category: 'football', name: 'ESPN FC', url: 'https://www.espn.com/soccer', blurb: 'Strong global coverage spanning Europe, the US, and South America.' },
  { rank: 4, category: 'football', name: 'Goal.com', url: 'https://www.goal.com', blurb: 'High-volume news and transfer rumors across every major league.' },
  { rank: 5, category: 'football', name: 'FourFourTwo', url: 'https://www.fourfourtwo.com', blurb: 'Tactics-minded features and long-form football writing.' },
  { rank: 6, category: 'football', name: 'UEFA.com', url: 'https://www.uefa.com', blurb: 'Official European competition news, draws, and fixtures.' },
  { rank: 7, category: 'football', name: 'FIFA.com', url: 'https://www.fifa.com', blurb: "The sport's global governing body — World Cup and international news." },
  { rank: 8, category: 'football', name: 'Football365', url: 'https://www.football365.com', blurb: 'Opinionated, often funny takes on the Premier League news cycle.' },
  { rank: 9, category: 'football', name: 'The Athletic', url: 'https://theathletic.com', blurb: 'Subscription sports journalism known for deep tactical reporting.' },
  { rank: 10, category: 'football', name: 'Bleacher Report', url: 'https://bleacherreport.com', blurb: 'Fan-friendly coverage with a strong social/video presence.' },

  // ---- Other Sports ----
  { rank: 1, category: 'other-sports', name: 'ESPN', url: 'https://www.espn.com', blurb: 'The broadest multi-sport newsroom — NBA, NFL, tennis, golf, and more.' },
  { rank: 2, category: 'other-sports', name: 'BBC Sport', url: 'https://www.bbc.com/sport', blurb: 'UK-anchored, wide-ranging coverage across dozens of sports.' },
  { rank: 3, category: 'other-sports', name: 'Sky Sports', url: 'https://www.skysports.com', blurb: 'Live scores and news across football, cricket, F1, golf, and darts.' },
  { rank: 4, category: 'other-sports', name: 'Sports Illustrated', url: 'https://www.si.com', blurb: 'Long-running US sports magazine with strong feature writing.' },
  { rank: 5, category: 'other-sports', name: 'Yahoo Sports', url: 'https://sports.yahoo.com', blurb: 'High-traffic aggregator with fantasy sports and fast news.' },
  { rank: 6, category: 'other-sports', name: 'CBS Sports', url: 'https://www.cbssports.com', blurb: 'US network coverage — NFL, NBA, college sports especially.' },
  { rank: 7, category: 'other-sports', name: 'NBC Sports', url: 'https://www.nbcsports.com', blurb: 'Olympics, NFL, and Premier League coverage from a US broadcaster.' },
  { rank: 8, category: 'other-sports', name: 'Olympics.com', url: 'https://www.olympics.com', blurb: 'Official Olympic and multi-sport event news year-round.' },
  { rank: 9, category: 'other-sports', name: 'Sportskeeda', url: 'https://www.sportskeeda.com', blurb: 'Fast, listicle-friendly coverage popular with Indian sports readers.' },
  { rank: 10, category: 'other-sports', name: 'The Guardian — Sport', url: 'https://www.theguardian.com/sport', blurb: 'Sharp, well-written sport journalism across many disciplines.' },

  // ---- Hollywood ----
  { rank: 1, category: 'hollywood', name: 'Variety', url: 'https://variety.com', blurb: 'The trade paper of record for film and TV industry news.' },
  { rank: 2, category: 'hollywood', name: 'Deadline', url: 'https://deadline.com', blurb: 'Fast-breaking casting, box office, and deal news.' },
  { rank: 3, category: 'hollywood', name: 'The Hollywood Reporter', url: 'https://www.hollywoodreporter.com', blurb: 'Industry news alongside awards-season analysis.' },
  { rank: 4, category: 'hollywood', name: 'IMDb', url: 'https://www.imdb.com', blurb: 'The reference database — cast, crew, ratings, release dates.' },
  { rank: 5, category: 'hollywood', name: 'Entertainment Weekly', url: 'https://ew.com', blurb: 'Mainstream pop-culture news across film, TV, and music.' },
  { rank: 6, category: 'hollywood', name: 'Rotten Tomatoes', url: 'https://www.rottentomatoes.com', blurb: 'Aggregated critic and audience scores for new releases.' },
  { rank: 7, category: 'hollywood', name: 'Collider', url: 'https://collider.com', blurb: 'Movie and streaming news with a large interview archive.' },
  { rank: 8, category: 'hollywood', name: 'ScreenRant', url: 'https://screenrant.com', blurb: 'High-volume franchise and streaming coverage.' },
  { rank: 9, category: 'hollywood', name: 'IndieWire', url: 'https://www.indiewire.com', blurb: 'Festival coverage and criticism with an indie-film lean.' },
  { rank: 10, category: 'hollywood', name: 'Empire', url: 'https://www.empireonline.com', blurb: 'British film magazine — reviews, features, first-look news.' },

  // ---- Bollywood ----
  { rank: 1, category: 'bollywood', name: 'Bollywood Hungama', url: 'https://www.bollywoodhungama.com', blurb: 'One of the longest-running dedicated Bollywood news sites.' },
  { rank: 2, category: 'bollywood', name: 'Filmfare', url: 'https://www.filmfare.com', blurb: "India's best-known film magazine, online — awards, interviews." },
  { rank: 3, category: 'bollywood', name: 'Pinkvilla', url: 'https://www.pinkvilla.com', blurb: 'Celebrity news and box-office tracking with high update frequency.' },
  { rank: 4, category: 'bollywood', name: 'Koimoi', url: 'https://www.koimoi.com', blurb: 'Box-office numbers and trending Bollywood news.' },
  { rank: 5, category: 'bollywood', name: 'Bollywood Life', url: 'https://www.bollywoodlife.com', blurb: 'Celebrity-focused news with a large daily story volume.' },
  { rank: 6, category: 'bollywood', name: 'Indian Express — Entertainment', url: 'https://indianexpress.com/section/entertainment', blurb: 'National newspaper desk covering Hindi cinema and beyond.' },
  { rank: 7, category: 'bollywood', name: 'Times of India — Entertainment', url: 'https://timesofindia.indiatimes.com/entertainment', blurb: "India's largest English daily, entertainment desk." },
  { rank: 8, category: 'bollywood', name: 'NDTV Movies', url: 'https://movies.ndtv.com', blurb: 'Reviews, news, and celebrity coverage from NDTV.' },
  { rank: 9, category: 'bollywood', name: 'Mid-Day Entertainment', url: 'https://www.mid-day.com/entertainment', blurb: 'Mumbai-based paper with strong Bollywood beat reporting.' },
  { rank: 10, category: 'bollywood', name: 'Bollywood Bubble', url: 'https://bollywoodbubble.com', blurb: 'Celebrity and box-office news with a large video presence.' },

  // ---- South Cinema ----
  { rank: 1, category: 'south-cinema', name: 'Behindwoods', url: 'https://www.behindwoods.com', blurb: 'One of the most established Tamil cinema news sites.' },
  { rank: 2, category: 'south-cinema', name: 'IndiaGlitz', url: 'https://www.indiaglitz.com', blurb: 'Covers Tamil, Telugu, Malayalam, and Kannada cinema together.' },
  { rank: 3, category: 'south-cinema', name: 'Gulte', url: 'https://www.gulte.com', blurb: 'Telugu film industry news and box-office tracking.' },
  { rank: 4, category: 'south-cinema', name: '123Telugu', url: 'https://www.123telugu.com', blurb: 'Reviews and news focused on the Telugu film industry.' },
  { rank: 5, category: 'south-cinema', name: 'Tupaki', url: 'https://www.tupaki.com', blurb: 'Fast-turnaround Telugu cinema and political news.' },
  { rank: 6, category: 'south-cinema', name: 'Cinema Express', url: 'https://www.cinemaexpress.com', blurb: 'The New Indian Express spin-off dedicated to South Indian cinema.' },
  { rank: 7, category: 'south-cinema', name: 'OnManorama — Entertainment', url: 'https://www.onmanorama.com/entertainment.html', blurb: 'Malayalam cinema coverage from a major Kerala publisher.' },
  { rank: 8, category: 'south-cinema', name: 'Sify Movies', url: 'https://www.sify.com/movies', blurb: 'Reviews and news spanning Tamil, Telugu, and Hindi cinema.' },
  { rank: 9, category: 'south-cinema', name: 'Filmibeat', url: 'https://www.filmibeat.com', blurb: 'Multi-language coverage including strong South Indian film sections.' },
  { rank: 10, category: 'south-cinema', name: 'Great Andhra', url: 'https://www.greatandhra.com', blurb: 'Telugu cinema news, gossip, and box-office updates.' },

  // ---- Bike Racing (MotoGP / motorcycle racing) ----
  { rank: 1, category: 'bike-racing', name: 'MotoGP.com', url: 'https://www.motogp.com', blurb: 'The official home of MotoGP — results, standings, race calendar.' },
  { rank: 2, category: 'bike-racing', name: 'Crash.net', url: 'https://www.crash.net', blurb: 'Long-running UK motorsport site with deep MotoGP coverage.' },
  { rank: 3, category: 'bike-racing', name: 'Motorsport.com — MotoGP', url: 'https://www.motorsport.com/motogp', blurb: 'Fast news and technical analysis across bike racing series.' },
  { rank: 4, category: 'bike-racing', name: 'Autosport — MotoGP', url: 'https://www.autosport.com/motogp', blurb: 'Motorsport trade-press coverage of grand prix motorcycle racing.' },
  { rank: 5, category: 'bike-racing', name: 'Cycle News', url: 'https://cyclenews.com', blurb: 'One of the oldest US motorcycle-racing publications.' },
  { rank: 6, category: 'bike-racing', name: 'Road Racing World', url: 'https://www.roadracingworld.com', blurb: 'US road-racing news — MotoAmerica, WorldSBK, and more.' },
  { rank: 7, category: 'bike-racing', name: 'Superbike Planet', url: 'https://www.superbikeplanet.com', blurb: 'Long-established World Superbike and racing news archive.' },
  { rank: 8, category: 'bike-racing', name: 'Motorcycle News (MCN)', url: 'https://www.motorcyclenews.com', blurb: "The UK's biggest motorcycling weekly, with strong racing coverage." },
  { rank: 9, category: 'bike-racing', name: 'Speedweek — MotoGP', url: 'https://speedweek.com/motogp/', blurb: 'German-language site with detailed paddock reporting.' },
  { rank: 10, category: 'bike-racing', name: 'GPOne', url: 'https://www.gpone.com', blurb: 'Italian outlet with deep MotoGP paddock sourcing.' },

  // ---- Formula Racing (F1) ----
  { rank: 1, category: 'f1-racing', name: 'Formula1.com', url: 'https://www.formula1.com', blurb: "F1's official site — results, standings, and race build-up." },
  { rank: 2, category: 'f1-racing', name: 'Motorsport.com — F1', url: 'https://www.motorsport.com/f1', blurb: 'Fast, wire-style F1 news with technical depth.' },
  { rank: 3, category: 'f1-racing', name: 'Autosport — F1', url: 'https://www.autosport.com/f1', blurb: 'The trade-press standard for motorsport journalism.' },
  { rank: 4, category: 'f1-racing', name: 'Crash.net — F1', url: 'https://www.crash.net/f1', blurb: 'UK motorsport outlet with regular F1 breaking news.' },
  { rank: 5, category: 'f1-racing', name: 'Sky Sports F1', url: 'https://www.skysports.com/f1', blurb: "The UK broadcaster's dedicated Formula 1 news hub." },
  { rank: 6, category: 'f1-racing', name: 'BBC Sport — Formula 1', url: 'https://www.bbc.com/sport/formula1', blurb: 'Concise, reliable F1 race reports and analysis.' },
  { rank: 7, category: 'f1-racing', name: 'RaceFans', url: 'https://www.racefans.net', blurb: 'Independent, fan-run F1 site known for data-driven analysis.' },
  { rank: 8, category: 'f1-racing', name: 'The Race', url: 'https://www.the-race.com', blurb: 'Sharp, opinionated motorsport journalism across F1 and beyond.' },
  { rank: 9, category: 'f1-racing', name: 'PlanetF1', url: 'https://www.planetf1.com', blurb: 'High-frequency F1 news and paddock gossip.' },
  { rank: 10, category: 'f1-racing', name: 'GPblog', url: 'https://www.gpblog.com', blurb: 'European F1 outlet with quick rumor-to-confirmation coverage.' },

  // ---- Bikes & Reviews (motorcycle types, specs, reviews) ----
  { rank: 1, category: 'bike-types', name: 'Motorcycle.com', url: 'https://www.motorcycle.com', blurb: 'Long-running US site with reviews across every bike category.' },
  { rank: 2, category: 'bike-types', name: 'Cycle World', url: 'https://www.cycleworld.com', blurb: 'Classic motorcycle magazine — road tests and buying guides.' },
  { rank: 3, category: 'bike-types', name: 'RevZilla — Common Tread', url: 'https://www.revzilla.com/common-tread', blurb: "A gear retailer's editorial arm — reviews, gear, and how-tos." },
  { rank: 4, category: 'bike-types', name: 'Motorcycle News (MCN)', url: 'https://www.motorcyclenews.com', blurb: 'UK reviews and news spanning every motorcycle segment.' },
  { rank: 5, category: 'bike-types', name: 'Visordown', url: 'https://www.visordown.com', blurb: 'UK motorcycle news, reviews, and buying advice.' },
  { rank: 6, category: 'bike-types', name: 'Bike EXIF', url: 'https://www.bikeexif.com', blurb: 'Custom-build culture and design-led motorcycle features.' },
  { rank: 7, category: 'bike-types', name: 'RideApart', url: 'https://www.rideapart.com', blurb: 'US-focused reviews, gear guides, and rider culture stories.' },
  { rank: 8, category: 'bike-types', name: 'Ultimate Motorcycling', url: 'https://ultimatemotorcycling.com', blurb: 'Road tests and first-ride reports across brands and segments.' },
  { rank: 9, category: 'bike-types', name: 'Autocar India — Bikes', url: 'https://www.autocarindia.com/bike-news', blurb: 'Indian market motorcycle launches, reviews, and specs.' },
  { rank: 10, category: 'bike-types', name: 'Total Motorcycle', url: 'https://www.totalmotorcycle.com', blurb: 'A long-running specs and model-year reference archive.' },
];

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

const supergroupRowEl = document.getElementById('supergroupRow');
const categoryRowEl = document.getElementById('categoryRow');
const gridEl = document.getElementById('grid');
const cardTemplate = document.getElementById('cardTemplate');

let activeSupergroup = 'all';
let activeCategory = 'all';

function toneClass(supergroup) {
  return supergroup.toLowerCase();
}

function makeChip({ label, icon, pressed, tone, onClick }) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip' + (tone ? ` tone-${tone}` : '');
  chip.setAttribute('aria-pressed', String(pressed));
  chip.innerHTML = icon ? `<span class="chip-icon">${icon}</span>${label}` : label;
  chip.addEventListener('click', onClick);
  return chip;
}

function renderSupergroupChips() {
  supergroupRowEl.innerHTML = '';
  supergroupRowEl.appendChild(
    makeChip({
      label: 'All',
      pressed: activeSupergroup === 'all',
      onClick: () => {
        activeSupergroup = 'all';
        activeCategory = 'all';
        renderAll();
      },
    })
  );
  SUPERGROUPS.forEach((sg) => {
    supergroupRowEl.appendChild(
      makeChip({
        label: sg,
        tone: toneClass(sg),
        pressed: activeSupergroup === sg,
        onClick: () => {
          activeSupergroup = sg;
          activeCategory = 'all';
          renderAll();
        },
      })
    );
  });
}

function renderCategoryChips() {
  categoryRowEl.innerHTML = '';
  const visibleCategories = CATEGORIES.filter(
    (c) => activeSupergroup === 'all' || c.supergroup === activeSupergroup
  );

  categoryRowEl.appendChild(
    makeChip({
      label: 'All',
      pressed: activeCategory === 'all',
      onClick: () => {
        activeCategory = 'all';
        renderCategoryChips();
        renderGrid();
      },
    })
  );

  visibleCategories.forEach((cat) => {
    categoryRowEl.appendChild(
      makeChip({
        label: cat.label,
        icon: cat.icon,
        tone: toneClass(cat.supergroup),
        pressed: activeCategory === cat.id,
        onClick: () => {
          activeCategory = cat.id;
          renderCategoryChips();
          renderGrid();
        },
      })
    );
  });
}

function renderGrid() {
  gridEl.innerHTML = '';

  const visibleCategories = CATEGORIES.filter(
    (c) =>
      (activeSupergroup === 'all' || c.supergroup === activeSupergroup) &&
      (activeCategory === 'all' || c.id === activeCategory)
  );

  if (visibleCategories.length === 0) {
    gridEl.innerHTML = '<div class="empty-msg">No categories match that filter.</div>';
    return;
  }

  let cardIndex = 0;
  visibleCategories.forEach((cat) => {
    const heading = document.createElement('div');
    heading.className = 'shelf-heading';
    heading.innerHTML = `<span class="shelf-dot" style="background:var(--${toneClass(cat.supergroup)})"></span>${cat.icon} ${cat.label}`;
    gridEl.appendChild(heading);

    SITES.filter((s) => s.category === cat.id)
      .sort((a, b) => a.rank - b.rank)
      .forEach((site) => {
        const node = cardTemplate.content.cloneNode(true);
        const cardEl = node.querySelector('.card');
        cardEl.href = site.url;
        cardEl.classList.add(`tone-${toneClass(cat.supergroup)}`);
        cardEl.style.setProperty('--i', cardIndex++);
        node.querySelector('.card-rank').textContent = String(site.rank).padStart(2, '0');
        node.querySelector('.card-name').textContent = site.name;
        try {
          node.querySelector('.card-domain').textContent = new URL(site.url).hostname.replace('www.', '');
        } catch (e) {
          node.querySelector('.card-domain').textContent = '';
        }
        node.querySelector('.card-blurb').textContent = site.blurb;
        gridEl.appendChild(node);
      });
  });
}

function renderAll() {
  renderSupergroupChips();
  renderCategoryChips();
  renderGrid();
}

renderAll();
