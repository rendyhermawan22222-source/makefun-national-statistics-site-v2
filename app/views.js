// views.js — HTML for each of the seven pages, built from data.js. Every
// value shown is escaped before it reaches the page. Pages re-render from a
// small state object held by main.js (selected year, economy tab, region
// filters, comparison picks, calculator inputs), so every control on a page
// actually changes what the page shows.

import { AGE_GROUPS, CPI_GROUPS, EMPLOYMENT_SECTORS, ISLANDS, LABOUR_FACTS, META, POPULATION_FACTS, PROVINCES, SECTORS, SERIES, TRADE, ABOUT_FACTS, YEARS, headline } from './data.js';
import { barChart, donutChart, hbarChart, lineChart } from './charts.js';
import { compareCard, density, filterProvinces, provinceRow, sortProvinces } from './tables.js';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const fmt1 = (n) => Number(n).toFixed(1);
const fmt2 = (n) => Number(n).toFixed(2);

function seriesPoints(key) {
  return YEARS.map((y) => ({ label: String(y), value: SERIES[key].values[y] }));
}

function yearSelect(year) {
  return `<label class="year-picker">Year
    <select id="year-select" aria-label="Select year">${YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('')}</select>
  </label>`;
}

function sourceNote(text) {
  return `<p class="source-note">Source: ${esc(text)}</p>`;
}

function sectionHead(title, blurb) {
  return `<div class="section-head"><h2>${esc(title)}</h2><p>${esc(blurb)}</p></div>`;
}

// ---------------------------------------------------------------- Overview
export function overview(state) {
  const year = state.year;
  const cards = headline(year)
    .map(
      (c) => `<article class="stat-card"><div class="stat-value">${esc(c.value)}</div><div class="stat-label">${esc(c.label)}</div><div class="stat-sub">${esc(c.sub)}</div><div class="stat-source">${esc(c.source)}</div></article>`,
    )
    .join('');
  const biggest = [...PROVINCES]
    .sort((a, b) => b.pop - a.pop)
    .slice(0, 8)
    .map((p) => ({ label: p.name, value: p.pop }));
  return `
  <section class="hero">
    <p class="hero-kicker">Indonesia in numbers · ${esc(META.updated)}</p>
    <h1>One country, 281.6 million people, <em>counted properly.</em></h1>
    <p class="hero-intro">NusaStat gathers Indonesia's published national statistics in one place — population, the economy, prices, work and all 38 provinces — with the source and the year printed on every figure, so you can check anything here against the release it came from.</p>
    <div class="hero-actions">${yearSelect(year)}<a class="button" href="#/regions">Explore all 38 provinces →</a></div>
  </section>
  <section>
    ${sectionHead('The headlines, ' + year, 'The eight numbers that sum up Indonesia in ' + year + '. Change the year above and the whole page moves with it.')}
    <div class="card-grid">${cards}</div>
    ${sourceNote('BPS (Statistics Indonesia), ' + year + '. See the About page for the full source list.')}
  </section>
  <section class="chart-duo">
    <article class="panel">
      <h2>Population keeps growing</h2>
      <p>From the 2020 census count of 270.2 million to 281.6 million in 2024 — about 2.8 million more people every year.</p>
      ${lineChart(seriesPoints('population'), { format: (v) => fmt1(v), color: '#1e3a5f' })}
      ${sourceNote(SERIES.population.source + '.')}
    </article>
    <article class="panel">
      <h2>Growth, after the pandemic dip</h2>
      <p>Real GDP fell 2.07% in 2020, then grew about 5% a year in 2022, 2023 and 2024 — steady, not spectacular.</p>
      ${barChart(seriesPoints('gdpGrowth'), { format: (v) => fmt2(v) + '%', unit: '%' })}
      ${sourceNote(SERIES.gdpGrowth.source + '.')}
    </article>
  </section>
  <section class="panel">
    <h2>Where the people are</h2>
    <p>Java holds more than half of Indonesia on less than 7% of its land. The eight largest provinces, by 2024 population (millions):</p>
    ${hbarChart(biggest, { format: (v) => fmt1(v) + ' jt' })}
    ${sourceNote('BPS population projections, 2024.')}
  </section>
  <section>
    ${sectionHead('At a glance', 'Six facts that frame the rest of the site.')}
    <dl class="fact-list">${POPULATION_FACTS.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)} <span class="fact-source">(${esc(f.source)})</span></dd></div>`).join('')}</dl>
  </section>`;
}

// -------------------------------------------------------------- Population
export function population(state) {
  const year = state.year;
  return `
  <section class="page-head">
    <p class="hero-kicker">People · ${esc(META.updated)}</p>
    <h1>Population &amp; demographics</h1>
    <p class="page-intro">Indonesia is the world's fourth most populous country — and a young one, with a median age near 30. This page shows who lives here, how old they are, and how long and how well they live.</p>
    <div class="hero-actions">${yearSelect(year)}</div>
  </section>
  <section class="chart-duo">
    <article class="panel">
      <h2>How old is Indonesia?</h2>
      <p>Age structure in 2024. Two in five Indonesians are between 25 and 54 — the working-age core of the country.</p>
      ${donutChart(AGE_GROUPS.map((g) => ({ label: g.group, value: g.share, note: g.note })), { centre: '281.6 jt' })}
      ${sourceNote('BPS population projections, 2024. Shares are approximate.')}
    </article>
    <article class="panel">
      <h2>People are living longer, better lives</h2>
      <p>The Human Development Index rose every year from 2020 to 2024, from 71.94 to 75.02 — firmly in the "high human development" band.</p>
      ${lineChart(seriesPoints('hdi'), { format: (v) => fmt2(v), color: '#166534' })}
      ${sourceNote(SERIES.hdi.source + '.')}
    </article>
  </section>
  <section class="panel">
    <h2>Population, 2020–2024</h2>
    <p>Growth of about 1% a year. The 2020 figure is the census count; the later years are BPS projections.</p>
    ${lineChart(seriesPoints('population'), { format: (v) => fmt1(v) + ' jt', color: '#c2410c' })}
    ${sourceNote(SERIES.population.source + '. ' + SERIES.population.note)}
  </section>
  <section>
    ${sectionHead('Six facts about the people', 'The context behind the charts.')}
    <dl class="fact-list">${POPULATION_FACTS.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)} <span class="fact-source">(${esc(f.source)})</span></dd></div>`).join('')}</dl>
  </section>
  <p class="page-nav">Next: <a href="#/economy">the economy →</a></p>`;
}

// ----------------------------------------------------------------- Economy
export function economy(state) {
  const tab = state.econTab;
  const tabs = [
    { id: 'growth', label: 'Growth & GDP' },
    { id: 'sectors', label: 'Sectors' },
    { id: 'trade', label: 'Trade' },
  ];
  const tabBar = `<div class="tabs" role="tablist">${tabs.map((t) => `<button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id === tab}" class="${t.id === tab ? 'active' : ''}">${esc(t.label)}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'growth') {
    body = `
    <article class="panel">
      <h2>Real GDP growth, 2020–2024</h2>
      <p>The pandemic year took 2.07% off the economy; since 2022 growth has settled at just above 5% a year.</p>
      ${barChart(seriesPoints('gdpGrowth'), { format: (v) => fmt2(v) + '%', unit: '%' })}
      ${sourceNote(SERIES.gdpGrowth.source + '. ' + SERIES.gdpGrowth.note)}
    </article>
    <article class="panel">
      <h2>Nominal GDP keeps climbing</h2>
      <p>In rupiah terms the economy grew from Rp 15,434 trillion in 2020 to Rp 22,139 trillion in 2024 — about US$1.40 trillion.</p>
      ${lineChart(seriesPoints('gdpNominal'), { format: (v) => fmt1(v / 1000) + ' rb tn', color: '#b45309' })}
      ${sourceNote(SERIES.gdpNominal.source + '. Values in Rp trillion.')}
    </article>
    <article class="panel">
      <h2>GDP per person</h2>
      <p>GDP per capita rose from Rp 57.3 million in 2020 to Rp 78.6 million in 2024 — about US$4,960 per person.</p>
      ${lineChart(seriesPoints('gdpPerCapita'), { format: (v) => 'Rp ' + fmt1(v) + ' jt', color: '#0e7490' })}
      ${sourceNote(SERIES.gdpPerCapita.source + '.')}
    </article>`;
  } else if (tab === 'sectors') {
    body = `
    <article class="panel">
      <h2>What makes up the economy?</h2>
      <p>Share of GDP by sector, 2024. Manufacturing is still the largest single sector at 18.7%; agriculture employs far more people than its GDP share suggests — see the Labour page.</p>
      ${hbarChart(SECTORS.map((s) => ({ label: s.sector, value: s.share })), { format: (v) => fmt1(v) + '%' })}
      ${sourceNote('BPS, National Accounts, 2024. Shares are approximate and sum to 100%.')}
    </article>`;
  } else {
    body = `
    <article class="panel">
      <h2>Trade, 2024</h2>
      <p>Indonesia has run a goods-trade surplus every year since 2020. In 2024 exports were US$264.7 billion against imports of US$233.7 billion.</p>
      <dl class="fact-list">${TRADE.map((t) => `<div><dt>${esc(t.label)}</dt><dd><strong>${esc(t.value)}</strong> — ${esc(t.note)}</dd></div>`).join('')}</dl>
      ${sourceNote('BPS Trade Statistics, 2024. Figures are approximate.')}
    </article>`;
  }
  return `
  <section class="page-head">
    <p class="hero-kicker">The economy · ${esc(META.updated)}</p>
    <h1>Economy</h1>
    <p class="page-intro">A US$1.4 trillion economy growing at about 5% a year, led by manufacturing and trade, with agriculture still employing the most people. Pick a tab to look closer.</p>
    ${tabBar}
  </section>
  <section class="chart-duo">${body}</section>
  <p class="page-nav">Next: <a href="#/prices">prices &amp; inflation →</a></p>`;
}

// ------------------------------------------------------------------ Prices
// What an amount of money from the end of `fromYear` is worth at the end of
// 2024, using the December year-on-year CPI inflation for each year after it.
export function inflate(amount, fromYear) {
  let factor = 1;
  for (let y = fromYear + 1; y <= 2024; y += 1) factor *= 1 + SERIES.inflation.values[y] / 100;
  return Math.round(amount * factor);
}

export function prices(state) {
  const cpi = state.cpiSort.key === 'inflation'
    ? [...CPI_GROUPS].sort((a, b) => (state.cpiSort.dir === 'desc' ? b.inflation - a.inflation : a.inflation - b.inflation))
    : [...CPI_GROUPS].sort((a, b) => (state.cpiSort.dir === 'desc' ? b.group.localeCompare(a.group) : a.group.localeCompare(b.group)));
  const arrow = (key) => (state.cpiSort.key === key ? (state.cpiSort.dir === 'asc' ? ' ↑' : ' ↓') : '');
  const calc = inflate(state.calcAmount, state.calcYear);
  return `
  <section class="page-head">
    <p class="hero-kicker">Prices · ${esc(META.updated)}</p>
    <h1>Prices &amp; inflation</h1>
    <p class="page-intro">Inflation spiked to 5.51% at the end of 2022, then fell back inside Bank Indonesia's 1.5–3.5% target range. Below: the five-year trend, every spending group, and a calculator that turns past rupiah into today's.</p>
  </section>
  <section class="chart-duo">
    <article class="panel">
      <h2>Inflation, December year-on-year</h2>
      <p>The 2022 spike came from the fuel-price rise that September; by December 2024 inflation was 1.57%.</p>
      ${lineChart(seriesPoints('inflation'), { format: (v) => fmt2(v) + '%', color: '#c2410c' })}
      ${sourceNote(SERIES.inflation.source + '. ' + SERIES.inflation.note)}
    </article>
    <article class="panel">
      <h2>What does Rp 100,000 buy now?</h2>
      <p>Prices rise a little every year, so the same money buys less. Type an amount and a year, and see what it would take in December 2024 to buy the same basket.</p>
      <div class="calculator">
        <label>Rupiah amount <input id="calc-amount" type="number" min="1000" step="1000" value="${state.calcAmount}"></label>
        <label>From year
          <select id="calc-year">${[2020, 2021, 2022, 2023].map((y) => `<option value="${y}"${y === state.calcYear ? ' selected' : ''}>${y}</option>`).join('')}</select>
        </label>
        <p class="calc-result" id="calc-result">Rp ${state.calcAmount.toLocaleString('en-US')} in ${state.calcYear} ≈ <strong>Rp ${calc.toLocaleString('en-US')}</strong> in December 2024</p>
        <p class="source-note">Uses the December year-on-year CPI for each year after ${state.calcYear} (BPS). Cumulative inflation ${state.calcYear}→2024: ${(((calc / state.calcAmount) - 1) * 100).toFixed(1)}%.</p>
      </div>
    </article>
  </section>
  <section class="panel">
    <h2>Inflation by spending group, December 2024</h2>
    <p>Personal care rose fastest (5.6%), while information and communication got cheaper (−0.3%). Click a column heading to sort.</p>
    <table class="data-table">
      <thead><tr><th><button type="button" class="sort-btn" data-sort="group">Spending group${arrow('group')}</button></th><th class="num"><button type="button" class="sort-btn" data-sort="inflation">Dec 2024 inflation${arrow('inflation')}</button></th></tr></thead>
      <tbody>${cpi.map((g) => `<tr><td>${esc(g.group)}</td><td class="num">${g.inflation.toFixed(1)}%</td></tr>`).join('')}</tbody>
    </table>
    ${sourceNote('BPS, Consumer Price Index, December 2024. Figures are approximate.')}
  </section>
  <p class="page-nav">Next: <a href="#/labour">labour &amp; unemployment →</a></p>`;
}

// ------------------------------------------------------------------ Labour
export function labour(state) {
  const year = state.year;
  return `
  <section class="page-head">
    <p class="hero-kicker">Work · ${esc(META.updated)}</p>
    <h1>Labour &amp; unemployment</h1>
    <p class="page-intro">About 152 million Indonesians are in the labour force. Unemployment fell every year from its 2020 pandemic peak of 7.07% to 4.91% in August 2024 — but most work is still informal.</p>
    <div class="hero-actions">${yearSelect(year)}</div>
  </section>
  <section class="chart-duo">
    <article class="panel">
      <h2>Unemployment is falling</h2>
      <p>Open unemployment rate, August round each year. The 2020 peak of 7.07% was the pandemic; 2024's 4.91% is the lowest August reading since 2019.</p>
      ${lineChart(seriesPoints('unemployment'), { format: (v) => fmt2(v) + '%', color: '#166534' })}
      ${sourceNote(SERIES.unemployment.source + '. ' + SERIES.unemployment.note)}
    </article>
    <article class="panel">
      <h2>Where Indonesians work</h2>
      <p>Share of employment by sector, August 2024. Agriculture still employs 28.2% of workers — more than twice its share of GDP.</p>
      ${hbarChart(EMPLOYMENT_SECTORS.map((s) => ({ label: s.sector, value: s.share })), { format: (v) => fmt1(v) + '%' })}
      ${sourceNote('BPS Sakernas, August 2024. Shares are approximate.')}
    </article>
  </section>
  <section class="panel">
    <h2>Unemployment by year</h2>
    <table class="data-table">
      <thead><tr><th>Year</th><th class="num">Unemployment rate</th><th class="num">Poverty rate</th><th>Note</th></tr></thead>
      <tbody>${YEARS.map((y) => `<tr><td>${y}</td><td class="num">${fmt2(SERIES.unemployment.values[y])}%</td><td class="num">${fmt2(SERIES.poverty.values[y])}%</td><td>${y === 2020 ? 'Pandemic peak' : y === 2024 ? 'Lowest since 2019' : 'Falling steadily'}</td></tr>`).join('')}</tbody>
    </table>
    ${sourceNote('BPS Sakernas (August) and BPS Poverty Statistics (September).')}
  </section>
  <section>
    ${sectionHead('The labour market in six numbers', 'August 2024, unless stated otherwise.')}
    <dl class="fact-list">${LABOUR_FACTS.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)} <span class="fact-source">(${esc(f.source)})</span></dd></div>`).join('')}</dl>
  </section>
  <p class="page-nav">Next: <a href="#/regions">the 38 provinces →</a></p>`;
}

// ----------------------------------------------------------------- Regions
export function regions(state) {
  const filtered = filterProvinces(PROVINCES, state.regionIsland, state.regionQuery);
  const sorted = sortProvinces(filtered, state.regionSort.key, state.regionSort.dir);
  const arrow = (key) => (state.regionSort.key === key ? (state.regionSort.dir === 'asc' ? ' ↑' : ' ↓') : '');
  const th = (key, label, cls = '') => `<th class="${cls}"><button type="button" class="sort-btn" data-sort="${key}">${label}${arrow(key)}</button></th>`;
  const a = PROVINCES.find((p) => p.name === state.compareA) ?? PROVINCES[0];
  const b = PROVINCES.find((p) => p.name === state.compareB) ?? PROVINCES[1];
  const opt = (sel) => PROVINCES.map((p) => `<option value="${esc(p.name)}"${p.name === sel ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  const biggest = [...PROVINCES]
    .sort((x, y) => y.pop - x.pop)
    .slice(0, 8)
    .map((p) => ({ label: p.name, value: p.pop }));
  return `
  <section class="page-head">
    <p class="hero-kicker">38 provinces · ${esc(META.updated)}</p>
    <h1>Regions</h1>
    <p class="page-intro">Indonesia's 38 provinces range from Jawa Barat's 49.9 million people to Papua Barat Daya's 0.6 million, and from DKI Jakarta's 0.7 thousand km² to Kalimantan Tengah's 153.6 thousand. Search, filter, sort — or compare any two provinces head to head.</p>
  </section>
  <section class="panel">
    <h2>Compare two provinces</h2>
    <p>Pick any two provinces and see them side by side — population, area, density and share of the country.</p>
    <div class="compare-pickers">
      <label>First province <select id="compare-a">${opt(a.name)}</select></label>
      <label>Second province <select id="compare-b">${opt(b.name)}</select></label>
    </div>
    <div id="compare-out">${compareCard(a, b)}</div>
  </section>
  <section class="panel">
    <h2>All 38 provinces</h2>
    <p>Population 2024 (millions, approx.), land area (thousand km², approx.) and density (people per km², computed). Click a column heading to sort; type to search by province or capital.</p>
    <div class="region-controls">
      <label>Search <input id="region-search" type="search" placeholder="Province or capital…" value="${esc(state.regionQuery)}"></label>
      <div class="island-filter" role="group" aria-label="Island group">${ISLANDS.map((isl) => `<button type="button" data-island="${esc(isl)}" class="${isl === state.regionIsland ? 'active' : ''}">${esc(isl)}</button>`).join('')}</div>
    </div>
    <p class="result-count" id="result-count">Showing ${sorted.length} of 38 provinces${state.regionIsland !== 'All' ? ' in ' + esc(state.regionIsland) : ''}${state.regionQuery ? ' matching “' + esc(state.regionQuery) + '”' : ''}.</p>
    <div class="table-wrap">
    <table class="data-table">
      <thead><tr>${th('name', 'Province')}${th('capital', 'Capital')}${th('island', 'Island group')}${th('pop', 'Population (jt)', 'num')}${th('area', 'Area (thousand km²)', 'num')}${th('density', 'Density / km²', 'num')}</tr></thead>
      <tbody id="province-rows">${sorted.map(provinceRow).join('') || '<tr><td colspan="6">No provinces match. Try another search.</td></tr>'}</tbody>
    </table>
    </div>
    ${sourceNote('BPS population projections and area figures, 2024. Population and area are approximate; density is computed.')}
  </section>
  <section class="panel">
    <h2>The largest provinces</h2>
    <p>Population in millions, 2024. The top three are all on Java.</p>
    ${hbarChart(biggest, { format: (v) => fmt1(v) + ' jt' })}
    ${sourceNote('BPS population projections, 2024.')}
  </section>
  <p class="page-nav">Next: <a href="#/about">about &amp; sources →</a></p>`;
}

// ------------------------------------------------------------------- About
export function about() {
  return `
  <section class="page-head">
    <p class="hero-kicker">About NusaStat</p>
    <h1>About &amp; sources</h1>
    <p class="page-intro">NusaStat is an independent statistics portal about Indonesia. It is not affiliated with Badan Pusat Statistik (BPS) — BPS is cited throughout as the source of the figures.</p>
  </section>
  <section class="panel">
    <h2>Indonesia at a glance</h2>
    <dl class="fact-list">${ABOUT_FACTS.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
  </section>
  <section class="panel">
    <h2>How to use this site</h2>
    <ul class="plain-list">
      <li><strong>Overview</strong> is the dashboard: the eight headline numbers for the year you pick, plus the two big trends.</li>
      <li><strong>Population</strong> shows who lives here and how the age structure looks.</li>
      <li><strong>Economy</strong> has three tabs — growth and GDP, the sectors that make up the economy, and trade.</li>
      <li><strong>Prices</strong> tracks inflation, breaks it down by spending group, and converts past rupiah into 2024 rupiah.</li>
      <li><strong>Labour</strong> covers unemployment, where people work, and the informal economy.</li>
      <li><strong>Regions</strong> lists all 38 provinces — searchable, sortable, filterable by island — and compares any two head to head.</li>
      <li>Every figure carries its source and year. Figures marked "about" or "approx." are rounded published values, not exact counts.</li>
    </ul>
  </section>
  <section class="panel">
    <h2>Sources &amp; methods</h2>
    <ul class="plain-list">
      <li><strong>BPS, Population Census 2020 and official projections</strong> — population counts and age structure.</li>
      <li><strong>BPS, National Accounts</strong> — GDP growth, nominal GDP, GDP per capita, sector shares.</li>
      <li><strong>BPS, Consumer Price Index</strong> — inflation and the CPI spending groups.</li>
      <li><strong>BPS, Sakernas (Labour Force Survey)</strong> — unemployment, employment by sector, informal work.</li>
      <li><strong>BPS, Poverty Statistics</strong> — poverty rates (September round).</li>
      <li><strong>BPS, Human Development Index</strong> — HDI and life expectancy.</li>
      <li><strong>BPS, Trade Statistics</strong> — exports, imports and the trade balance.</li>
      <li>US$ conversions use about Rp 15,800 per US$ (2024). Density is population divided by land area. The inflation calculator compounds each year's December year-on-year CPI.</li>
    </ul>
    <p>Figures were last checked against BPS releases on ${esc(META.updated)}. The site runs entirely from its own files — no network request, no tracking, no account.</p>
  </section>
  <p class="page-nav"><a href="#/">← Back to the overview</a></p>`;
}

export function missing() {
  return `<section class="page-head"><h1>Page not found</h1><p class="page-intro">There is no page at this address. Try one of the sections above, or <a href="#/">go back to the overview</a>.</p></section>`;
}
