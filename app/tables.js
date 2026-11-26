// tables.js — the Regions page's province table (sortable columns, text
// search, island-group filter) and the two-province comparison tool. All
// state lives in the page's own render call; sorting re-renders the table
// body only, so the controls never lose focus.

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export const density = (p) => (p.pop * 1e6) / (p.area * 1e3);

// One province as a table row. Density is computed from population and area.
export function provinceRow(p) {
  return `<tr><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${esc(p.island)}</td><td class="num">${p.pop.toFixed(1)}</td><td class="num">${p.area.toFixed(1)}</td><td class="num">${Math.round(density(p)).toLocaleString('en-US')}</td></tr>`;
}

// Sort a copy of the provinces by key, then direction ('asc' | 'desc').
export function sortProvinces(list, key, dir) {
  const mult = dir === 'desc' ? -1 : 1;
  const by = {
    name: (a, b) => a.name.localeCompare(b.name),
    capital: (a, b) => a.capital.localeCompare(b.capital),
    island: (a, b) => a.island.localeCompare(b.island),
    pop: (a, b) => a.pop - b.pop,
    area: (a, b) => a.area - b.area,
    density: (a, b) => density(a) - density(b),
  }[key] ?? ((a, b) => a.name.localeCompare(b.name));
  return [...list].sort((a, b) => by(a, b) * mult);
}

// Filter by island group and a free-text search over name and capital.
export function filterProvinces(list, island, query) {
  const q = query.trim().toLowerCase();
  return list.filter(
    (p) =>
      (island === 'All' || p.island === island) &&
      (q === '' || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q)),
  );
}

// Side-by-side comparison of two provinces: big numbers plus two bars that
// show each province's population against the larger of the two.
export function compareCard(a, b) {
  const rows = [
    { label: 'Population (2024)', av: a.pop.toFixed(1) + ' million', bv: b.pop.toFixed(1) + ' million' },
    { label: 'Capital', av: a.capital, bv: b.capital },
    { label: 'Island group', av: a.island, bv: b.island },
    { label: 'Land area', av: a.area.toFixed(1) + ' thousand km²', bv: b.area.toFixed(1) + ' thousand km²' },
    { label: 'Density', av: Math.round(density(a)).toLocaleString('en-US') + ' / km²', bv: Math.round(density(b)).toLocaleString('en-US') + ' / km²' },
    { label: 'Share of Indonesia', av: ((a.pop / 281.6) * 100).toFixed(1) + '%', bv: ((b.pop / 281.6) * 100).toFixed(1) + '%' },
  ];
  const maxPop = Math.max(a.pop, b.pop);
  const bar = (p, col) =>
    `<div class="compare-bar"><span class="compare-bar-label">${esc(p.name)}</span><span class="compare-bar-track"><span class="compare-bar-fill" style="width:${((p.pop / maxPop) * 100).toFixed(1)}%;background:${col}"></span></span><span class="compare-bar-value">${p.pop.toFixed(1)} jt</span></div>`;
  return `<div class="compare-grid">
    <div class="compare-col"><h3>${esc(a.name)}</h3>${rows.map((r) => `<p><span class="compare-label">${esc(r.label)}</span><strong>${esc(r.av)}</strong></p>`).join('')}</div>
    <div class="compare-col"><h3>${esc(b.name)}</h3>${rows.map((r) => `<p><span class="compare-label">${esc(r.label)}</span><strong>${esc(r.bv)}</strong></p>`).join('')}</div>
  </div>
  <div class="compare-bars">${bar(a, '#1e3a5f')}${bar(b, '#c2410c')}</div>
  <p class="source-note">Population 2024, approx. (BPS projections); area approx. (BPS). Density is population ÷ area.</p>`;
}
