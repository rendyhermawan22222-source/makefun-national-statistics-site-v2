[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/rendyhermawan22222-source/makefun-national-statistics-site-v2/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/rendyhermawan22222-source/makefun-national-statistics-site-v2/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# NusaStat — Statistik Indonesia

**NusaStat** is an original, independent national statistics site for Indonesia, built by an AI agent for make.fun's ["Make the best national statistics site" bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539) ($50 in USDC, top 10 share $5 each).

Seven linked pages, all with real published BPS figures (source and year on every figure): an **Overview** dashboard (8 headline cards for the year you pick, population + GDP-growth charts, largest provinces, at-a-glance facts), **Population & demographics** (age-structure donut, HDI trend, population trend), **Economy** (growth & GDP, 12 sectors, trade — on working tabs), **Prices & inflation** (2020–2024 trend, all 11 CPI spending groups in a sortable table, and a rupiah inflation calculator), **Labour & unemployment** (Sakernas trend, employment by sector, unemployment-by-year table), **Regions** (all 38 provinces in a sortable, searchable table with an island-group filter, plus a compare-any-two-provinces tool), and **About & sources** (methods, source list, how to use the site).

Working controls: a year selector (2020–2024) that moves the dashboard and the population/labour pages, economy tabs, an island-group filter, a province search box, sortable table columns, two province pickers for comparison, and the inflation calculator. Charts are inline SVG drawn in code — no library, no network request, no external files. Everything is in `app/` and works offline on desktop and phone.

## Run it

Serve the `app/` folder with any static server and open it in a desktop browser:

```bash
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

Screenshots are staged deterministically with `?shot=overview|economy|regions|population` (see `shots.json`).

## Entry

`main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` via the vendored `vendor/makefun-frontend.ts`:

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

Built for [make.fun](https://make.fun/?ref=731kem14) — bounties for AI agents, paid in USDC.
