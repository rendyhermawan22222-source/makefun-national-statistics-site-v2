// charts.js — inline-SVG charts drawn from data.js. No library, no network:
// every chart is an SVG string with axes, gridlines and readable values, so
// it is legible in a screenshot as well as on screen.

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Deep navy, terracotta, amber, pine, plum, teal, rust, slate.
const PALETTE = ['#1e3a5f', '#c2410c', '#b45309', '#166534', '#7c2d12', '#0e7490', '#9d174d', '#475569'];

const fmt = (n, d = 1) => Number(n).toFixed(d);

// Vertical bars. Values may be negative (GDP growth 2020); negatives are
// drawn below the zero line in a warning red.
export function barChart(values, { height = 230, unit = '', format = (v) => fmt(v) } = {}) {
  const w = 720;
  const h = height;
  const padL = 52;
  const padB = 36;
  const padT = 16;
  const max = Math.max(...values.map((v) => Math.abs(v.value)), 1);
  const min = Math.min(0, ...values.map((v) => v.value));
  const range = max - min;
  const plotH = h - padT - padB;
  const plotW = w - padL - 16;
  const step = plotW / values.length;
  const bw = Math.min(72, step * 0.6);
  const y = (v) => padT + plotH - ((v - min) / range) * plotH;
  const zeroY = y(0);
  const grid = [0, 0.5, 1]
    .map((f) => {
      const gv = min + range * f;
      return `<line x1="${padL}" y1="${y(gv)}" x2="${w - 16}" y2="${y(gv)}" stroke="#e7ddcd" stroke-width="1"/><text x="${padL - 8}" y="${y(gv) + 4}" text-anchor="end" font-size="11" fill="#6b6257">${esc(format(gv))}</text>`;
    })
    .join('');
  const bars = values
    .map((v, i) => {
      const x = padL + i * step + (step - bw) / 2;
      const top = Math.min(y(v.value), zeroY);
      const bh = Math.max(Math.abs(y(v.value) - zeroY), 1);
      const col = v.value < 0 ? '#b91c1c' : PALETTE[i % PALETTE.length];
      return `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${col}"><title>${esc(v.label)}: ${esc(format(v.value))} ${esc(unit)}</title></rect><text x="${(x + bw / 2).toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#1b2a4a">${esc(format(v.value))}</text><text x="${(x + bw / 2).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="12" fill="#57534e">${esc(v.label)}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Bar chart">${grid}<line x1="${padL}" y1="${zeroY}" x2="${w - 16}" y2="${zeroY}" stroke="#a8a29e" stroke-width="1"/>${bars}</svg>`;
}

// Line chart with a soft area fill under the line. points: [{label, value}].
export function lineChart(points, { height = 230, format = (v) => fmt(v), color = '#1e3a5f' } = {}) {
  const w = 720;
  const h = height;
  const padL = 56;
  const padB = 32;
  const padT = 20;
  const vals = points.map((p) => p.value);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (max - min < 1e-9) { max += 1; min -= 1; }
  const pad = (max - min) * 0.14;
  min -= pad;
  max += pad;
  const plotW = w - padL - 20;
  const plotH = h - padT - padB;
  const x = (i) => padL + (i / (points.length - 1)) * plotW;
  const y = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;
  const grid = [0, 0.5, 1]
    .map((f) => {
      const gv = min + (max - min) * f;
      return `<line x1="${padL}" y1="${y(gv)}" x2="${w - 20}" y2="${y(gv)}" stroke="#e7ddcd" stroke-width="1"/><text x="${padL - 8}" y="${y(gv) + 4}" text-anchor="end" font-size="11" fill="#6b6257">${esc(format(gv))}</text>`;
    })
    .join('');
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)},${(padT + plotH).toFixed(1)} L${x(0).toFixed(1)},${(padT + plotH).toFixed(1)} Z`;
  const dots = points
    .map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="5" fill="${color}" stroke="#fffdf8" stroke-width="2"><title>${esc(p.label)}: ${esc(format(p.value))}</title></circle><text x="${x(i).toFixed(1)}" y="${(y(p.value) - 11).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#1b2a4a">${esc(format(p.value))}</text><text x="${x(i).toFixed(1)}" y="${h - 10}" text-anchor="middle" font-size="12" fill="#57534e">${esc(p.label)}</text>`)
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Line chart">${grid}<path d="${area}" fill="${color}" opacity="0.08"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>`;
}

// Ranked horizontal bars (sectors, CPI groups, provinces).
export function hbarChart(values, { format = (v) => fmt(v) + '%', maxLabel = 36 } = {}) {
  const rowH = 32;
  const w = 720;
  const h = values.length * rowH + 14;
  const padL = 210;
  const max = Math.max(...values.map((v) => v.value), 1);
  const rows = values
    .map((v, i) => {
      const y = 8 + i * rowH;
      const bw = ((w - padL - 72) * v.value) / max;
      const label = v.label.length > maxLabel ? v.label.slice(0, maxLabel - 1) + '…' : v.label;
      return `<text x="${padL - 10}" y="${y + 16}" text-anchor="end" font-size="13" fill="#292524">${esc(label)}</text><rect x="${padL}" y="${y + 4}" width="${Math.max(bw, 2).toFixed(1)}" height="17" rx="3" fill="${PALETTE[i % PALETTE.length]}"><title>${esc(v.label)}: ${esc(format(v.value))}</title></rect><text x="${(padL + bw + 8).toFixed(1)}" y="${y + 16}" font-size="13" font-weight="700" fill="#1b2a4a">${esc(format(v.value))}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Horizontal bar chart">${rows}</svg>`;
}

// Donut with a centre label and a legend list beside it.
export function donutChart(values, { size = 230, centre = '' } = {}) {
  const r = 88;
  const cx = 115;
  const cy = 115;
  const total = values.reduce((s, v) => s + v.value, 0) || 1;
  let angle = -Math.PI / 2;
  const slices = values
    .map((v, i) => {
      const frac = v.value / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const col = PALETTE[i % PALETTE.length];
      if (frac >= 0.999) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;
      return `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${col}"><title>${esc(v.label)}: ${esc(v.value)}%</title></path>`;
    })
    .join('');
  const legend = values
    .map((v, i) => `<li><span class="swatch" style="background:${PALETTE[i % PALETTE.length]}"></span>${esc(v.label)} — <strong>${esc(v.value)}%</strong><br><span class="legend-note">${esc(v.note ?? '')}</span></li>`)
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 230 230" width="${size}" height="${size}" role="img" aria-label="Donut chart">${slices}<circle cx="${cx}" cy="${cy}" r="54" fill="#fffdf8"/><text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="16" font-weight="700" fill="#1b2a4a">${esc(centre)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="#6b6257">of population</text></svg><ul class="legend">${legend}</ul></div>`;
}
