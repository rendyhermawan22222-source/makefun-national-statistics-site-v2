// main.js — NusaStat's router and controls. Hash routes, one page per route:
//
//   #/              Overview dashboard
//   #/population    Population & demographics
//   #/economy       Economy (tabs: growth, sectors, trade)
//   #/prices        Prices & inflation (incl. the rupiah calculator)
//   #/labour        Labour & unemployment
//   #/regions       All 38 provinces (search, filter, sort, compare)
//   #/about         About & sources
//
// State lives here (selected year, economy tab, region controls, comparison
// picks, calculator inputs) and every page re-renders from it, so a control
// always changes what the page shows. window.__shotReady is false while a
// page renders and true once it is on screen, so a screenshot script knows
// when to capture. ?shot=overview|economy|regions|population stages a view
// for screenshots.

import { about, economy, labour, missing, overview, population, prices, regions } from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('main-nav');

const state = {
  year: 2024,
  econTab: 'growth',
  regionIsland: 'All',
  regionQuery: '',
  regionSort: { key: 'pop', dir: 'desc' },
  cpiSort: { key: 'inflation', dir: 'desc' },
  compareA: 'Jawa Barat',
  compareB: 'DKI Jakarta',
  calcAmount: 100000,
  calcYear: 2020,
};

const ROUTES = {
  '': overview,
  population,
  economy,
  prices,
  labour,
  regions,
  about,
};

function route() {
  const hash = (location.hash || '#/').replace(/^#\//, '').split('?')[0];
  return ROUTES[hash] ? hash : null;
}

function render() {
  window.__shotReady = false;
  const r = route();
  const view = r === null ? missing : ROUTES[r];
  document.title = r === '' ? 'NusaStat — Statistik Indonesia' : `${r[0].toUpperCase() + r.slice(1)} | NusaStat — Statistik Indonesia`;
  app.innerHTML = view(state);
  nav.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#/' + r || (r === '' && href === '#/'));
    if (a.classList.contains('active')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  wireControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function rerender() {
  render();
}

function wireControls() {
  const yearSelect = document.getElementById('year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      state.year = Number(yearSelect.value);
      rerender();
    });
  }
  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.econTab = btn.dataset.tab;
      rerender();
    });
  });
  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      const inPrices = !!document.querySelector('.calculator');
      const sort = inPrices ? state.cpiSort : state.regionSort;
      if (sort.key === key) sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
      else { sort.key = key; sort.dir = key === 'group' || key === 'name' || key === 'capital' || key === 'island' ? 'asc' : 'desc'; }
      rerender();
    });
  });
  const search = document.getElementById('region-search');
  if (search) {
    search.addEventListener('input', () => {
      state.regionQuery = search.value;
      rerender();
      const again = document.getElementById('region-search');
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    });
  }
  document.querySelectorAll('[data-island]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.regionIsland = btn.dataset.island;
      rerender();
    });
  });
  const ca = document.getElementById('compare-a');
  if (ca) ca.addEventListener('change', () => { state.compareA = ca.value; rerender(); });
  const cb = document.getElementById('compare-b');
  if (cb) cb.addEventListener('change', () => { state.compareB = cb.value; rerender(); });
  const amount = document.getElementById('calc-amount');
  if (amount) {
    amount.addEventListener('input', () => {
      const n = Number(amount.value);
      if (Number.isFinite(n) && n > 0) { state.calcAmount = Math.round(n); rerender(); }
    });
  }
  const cyear = document.getElementById('calc-year');
  if (cyear) cyear.addEventListener('change', () => { state.calcYear = Number(cyear.value); rerender(); });
}

// Screenshot staging: ?shot=economy shows the Sectors tab, ?shot=regions
// the province table, ?shot=population the population page; the default
// overview shot needs nothing extra.
function stageShot() {
  const shot = new URLSearchParams(location.search).get('shot');
  if (shot === 'economy') { state.econTab = 'sectors'; location.hash = '#/economy'; }
  else if (shot === 'regions') { location.hash = '#/regions'; }
  else if (shot === 'population') { location.hash = '#/population'; }
  else { location.hash = '#/'; }
}

window.addEventListener('hashchange', render);
stageShot();
render();
