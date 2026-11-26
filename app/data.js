// NusaStat data — Indonesia's published national figures, each labelled with
// its source and year in the pages that show it. The numbers are the rounded
// figures Badan Pusat Statistik (BPS) publishes in its releases; anything
// approximate is marked "approx." and rounded, never given a false precise
// decimal. Money is in rupiah unless a figure says otherwise; the US$
// conversions use approx. Rp 15,800 per US$ (2024).

export const META = {
  country: 'Indonesia',
  updated: '26 November 2026',
  currency: 'Rupiah (IDR)',
  note: 'Every figure on this site names its source and year. Figures are published BPS values.',
};

export const YEARS = [2020, 2021, 2022, 2023, 2024];

// Five-year series. Population in millions; growth, inflation, unemployment
// and poverty in percent; nominal GDP in Rp trillion; GDP per capita in
// Rp million; HDI on the 0–100 scale.
export const SERIES = {
  population: {
    label: 'Population', unit: 'million people',
    values: { 2020: 270.2, 2021: 272.7, 2022: 275.8, 2023: 278.7, 2024: 281.6 },
    source: 'BPS, Population Census 2020 and official projections',
    note: '2020 is the census count; later years are BPS projections.',
  },
  gdpGrowth: {
    label: 'Real GDP growth', unit: '% per year',
    values: { 2020: -2.07, 2021: 3.7, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
    source: 'BPS, National Accounts',
    note: 'The 2020 fall is the COVID-19 pandemic year.',
  },
  gdpNominal: {
    label: 'Nominal GDP', unit: 'Rp trillion',
    values: { 2020: 15434, 2021: 16976, 2022: 19588, 2023: 20892, 2024: 22139 },
    source: 'BPS, National Accounts',
    note: 'About US$1.40 trillion in 2024.',
  },
  gdpPerCapita: {
    label: 'GDP per capita', unit: 'Rp million',
    values: { 2020: 57.3, 2021: 62.2, 2022: 71.0, 2023: 75.0, 2024: 78.6 },
    source: 'BPS, National Accounts',
    note: 'About US$4,960 in 2024.',
  },
  inflation: {
    label: 'Inflation (December, year-on-year)', unit: '%',
    values: { 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
    source: 'BPS, Consumer Price Index',
    note: 'December year-on-year CPI inflation.',
  },
  unemployment: {
    label: 'Open unemployment rate', unit: '% of labour force',
    values: { 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.45, 2024: 4.91 },
    source: 'BPS, Sakernas (Labour Force Survey, August)',
    note: 'August round each year.',
  },
  poverty: {
    label: 'Poverty rate', unit: '% of population',
    values: { 2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
    source: 'BPS, Poverty Statistics (September)',
    note: 'September round each year; 2024 is the lowest on record.',
  },
  hdi: {
    label: 'Human Development Index', unit: 'index (0–100)',
    values: { 2020: 71.94, 2021: 72.29, 2022: 73.37, 2023: 74.39, 2024: 75.02 },
    source: 'BPS, Human Development Index',
    note: 'High human development is the 70–80 band.',
  },
};

// The eight headline cards on the Overview page, for one selected year.
export function headline(year) {
  const s = (key) => SERIES[key].values[year];
  return [
    { value: s('population').toFixed(1) + ' jt', label: 'Population', sub: 'The world’s 4th-largest population', source: 'BPS, ' + year },
    { value: (s('gdpGrowth') >= 0 ? '+' : '') + s('gdpGrowth').toFixed(2) + '%', label: 'Real GDP growth', sub: 'Nominal GDP Rp ' + s('gdpNominal').toLocaleString('en-US') + ' trillion', source: 'BPS National Accounts, ' + year },
    { value: 'Rp ' + s('gdpPerCapita').toFixed(1) + ' jt', label: 'GDP per capita', sub: 'About US$4,960 in 2024', source: 'BPS National Accounts, 2024' },
    { value: s('inflation').toFixed(2) + '%', label: 'Inflation (Dec, y-on-y)', sub: 'Inside Bank Indonesia’s 1.5–3.5% target in 2024', source: 'BPS CPI, Dec ' + year },
    { value: s('unemployment').toFixed(2) + '%', label: 'Open unemployment', sub: 'Lowest August reading since 2019', source: 'BPS Sakernas, Aug ' + year },
    { value: s('poverty').toFixed(2) + '%', label: 'Poverty rate', sub: 'About 24.1 million people below the line (Sep 2024)', source: 'BPS, Sep ' + year },
    { value: s('hdi').toFixed(2), label: 'Human Development Index', sub: 'Life expectancy about 74 years', source: 'BPS HDI, ' + year },
    { value: 'US$31 bn', label: 'Trade surplus (2024)', sub: 'Exports US$264.7 bn, imports US$233.7 bn', source: 'BPS Trade Statistics, 2024' },
  ];
}

// Age structure, 2024 (approx. shares of the population, BPS projections).
export const AGE_GROUPS = [
  { group: '0–14 years', share: 24.1, note: 'about 67.9 million children' },
  { group: '15–24 years', share: 16.6, note: 'about 46.7 million young people' },
  { group: '25–54 years', share: 41.6, note: 'the working-age core' },
  { group: '55–64 years', share: 10.2, note: 'about 28.7 million people' },
  { group: '65+ years', share: 7.5, note: 'about 21.1 million older people' },
];

export const POPULATION_FACTS = [
  { label: 'Median age', value: 'about 30 years', source: 'BPS projections, 2024' },
  { label: 'Urban population', value: 'about 58% of Indonesians', source: 'BPS, 2024' },
  { label: 'Life expectancy at birth', value: 'about 74 years', source: 'BPS HDI, 2024' },
  { label: 'Population density', value: 'about 148 people per km²', source: 'BPS, 2024' },
  { label: 'Largest island by people', value: 'Java — about 56% of the population', source: 'BPS, 2024' },
  { label: 'Sex ratio', value: 'about 101 men per 100 women', source: 'BPS, 2024' },
];

// GDP by sector, share of GDP in 2024 (approx., BPS National Accounts).
export const SECTORS = [
  { sector: 'Manufacturing', share: 18.7 },
  { sector: 'Wholesale & retail trade', share: 13.0 },
  { sector: 'Agriculture, forestry & fishing', share: 12.5 },
  { sector: 'Construction', share: 9.9 },
  { sector: 'Mining & quarrying', share: 8.6 },
  { sector: 'Transport & storage', share: 5.9 },
  { sector: 'Information & communication', share: 4.4 },
  { sector: 'Financial & insurance', share: 4.2 },
  { sector: 'Public administration & defence', share: 3.6 },
  { sector: 'Real estate', share: 2.8 },
  { sector: 'Accommodation & food services', share: 2.7 },
  { sector: 'Other services', share: 13.7 },
];

// CPI spending groups, December 2024 year-on-year inflation (approx., BPS).
export const CPI_GROUPS = [
  { group: 'Food, beverages & tobacco', inflation: 1.9 },
  { group: 'Clothing & footwear', inflation: 1.3 },
  { group: 'Housing, water, electricity & fuel', inflation: 0.4 },
  { group: 'Household equipment & maintenance', inflation: 1.0 },
  { group: 'Health', inflation: 1.8 },
  { group: 'Transport', inflation: 0.5 },
  { group: 'Information, communication & finance', inflation: -0.3 },
  { group: 'Recreation, sport & culture', inflation: 1.4 },
  { group: 'Education', inflation: 1.9 },
  { group: 'Restaurants & food services', inflation: 2.2 },
  { group: 'Personal care & other services', inflation: 5.6 },
];

// Employment by sector, August 2024 (approx. shares, BPS Sakernas).
export const EMPLOYMENT_SECTORS = [
  { sector: 'Agriculture, forestry & fishing', share: 28.2 },
  { sector: 'Wholesale & retail trade', share: 18.6 },
  { sector: 'Manufacturing', share: 13.7 },
  { sector: 'Construction', share: 8.0 },
  { sector: 'Accommodation & food services', share: 7.4 },
  { sector: 'Transport & storage', share: 4.4 },
  { sector: 'Other services', share: 19.7 },
];

export const LABOUR_FACTS = [
  { label: 'Labour force (Aug 2024)', value: 'about 152.1 million people', source: 'BPS Sakernas, Aug 2024' },
  { label: 'Employed', value: 'about 144.6 million people', source: 'BPS Sakernas, Aug 2024' },
  { label: 'Unemployed', value: 'about 7.5 million people', source: 'BPS Sakernas, Aug 2024' },
  { label: 'Informal work', value: 'about 59% of all workers', source: 'BPS Sakernas, Aug 2024' },
  { label: 'Youth unemployment (15–24)', value: 'about 17% of the youth labour force', source: 'BPS Sakernas, Aug 2024' },
  { label: 'Provincial minimum wage (2025)', value: 'Rp 2.1 jt – Rp 5.4 jt a month', source: 'Provincial decrees, 2025' },
];

// All 38 provinces, 2024. Population in millions (approx., BPS projections),
// land area in thousand km² (approx.), capital city and island group.
export const PROVINCES = [
  { name: 'Jawa Barat', capital: 'Bandung', island: 'Jawa', pop: 49.9, area: 35.4 },
  { name: 'Jawa Timur', capital: 'Surabaya', island: 'Jawa', pop: 41.8, area: 47.8 },
  { name: 'Jawa Tengah', capital: 'Semarang', island: 'Jawa', pop: 37.9, area: 32.8 },
  { name: 'Sumatera Utara', capital: 'Medan', island: 'Sumatera', pop: 15.6, area: 72.9 },
  { name: 'Banten', capital: 'Serang', island: 'Jawa', pop: 12.4, area: 9.7 },
  { name: 'DKI Jakarta', capital: 'Jakarta', island: 'Jawa', pop: 10.7, area: 0.7 },
  { name: 'Sulawesi Selatan', capital: 'Makassar', island: 'Sulawesi', pop: 9.5, area: 46.7 },
  { name: 'Lampung', capital: 'Bandar Lampung', island: 'Sumatera', pop: 9.3, area: 34.6 },
  { name: 'Sumatera Selatan', capital: 'Palembang', island: 'Sumatera', pop: 9.0, area: 91.6 },
  { name: 'Riau', capital: 'Pekanbaru', island: 'Sumatera', pop: 7.0, area: 87.0 },
  { name: 'Sumatera Barat', capital: 'Padang', island: 'Sumatera', pop: 5.9, area: 42.0 },
  { name: 'Kalimantan Barat', capital: 'Pontianak', island: 'Kalimantan', pop: 5.8, area: 147.3 },
  { name: 'Nusa Tenggara Timur', capital: 'Kupang', island: 'Nusa Tenggara', pop: 5.7, area: 47.9 },
  { name: 'Aceh', capital: 'Banda Aceh', island: 'Sumatera', pop: 5.6, area: 57.9 },
  { name: 'Nusa Tenggara Barat', capital: 'Mataram', island: 'Nusa Tenggara', pop: 5.6, area: 18.6 },
  { name: 'Bali', capital: 'Denpasar', island: 'Bali', pop: 4.4, area: 5.8 },
  { name: 'Kalimantan Selatan', capital: 'Banjarmasin', island: 'Kalimantan', pop: 4.3, area: 38.7 },
  { name: 'Kalimantan Timur', capital: 'Samarinda', island: 'Kalimantan', pop: 4.0, area: 127.3 },
  { name: 'DI Yogyakarta', capital: 'Yogyakarta', island: 'Jawa', pop: 3.9, area: 3.2 },
  { name: 'Jambi', capital: 'Jambi', island: 'Sumatera', pop: 3.7, area: 50.0 },
  { name: 'Sulawesi Tengah', capital: 'Palu', island: 'Sulawesi', pop: 3.2, area: 61.8 },
  { name: 'Kalimantan Tengah', capital: 'Palangka Raya', island: 'Kalimantan', pop: 2.9, area: 153.6 },
  { name: 'Sulawesi Utara', capital: 'Manado', island: 'Sulawesi', pop: 2.8, area: 13.9 },
  { name: 'Sulawesi Tenggara', capital: 'Kendari', island: 'Sulawesi', pop: 2.8, area: 38.1 },
  { name: 'Kepulauan Riau', capital: 'Tanjung Pinang', island: 'Sumatera', pop: 2.3, area: 8.2 },
  { name: 'Bengkulu', capital: 'Bengkulu', island: 'Sumatera', pop: 2.1, area: 20.0 },
  { name: 'Maluku', capital: 'Ambon', island: 'Maluku', pop: 2.0, area: 46.9 },
  { name: 'Sulawesi Barat', capital: 'Mamuju', island: 'Sulawesi', pop: 1.6, area: 16.8 },
  { name: 'Papua Pegunungan', capital: 'Wamena', island: 'Papua', pop: 1.5, area: 51.2 },
  { name: 'Kepulauan Bangka Belitung', capital: 'Pangkal Pinang', island: 'Sumatera', pop: 1.5, area: 16.4 },
  { name: 'Papua Tengah', capital: 'Nabire', island: 'Papua', pop: 1.4, area: 61.1 },
  { name: 'Maluku Utara', capital: 'Sofifi', island: 'Maluku', pop: 1.4, area: 32.0 },
  { name: 'Gorontalo', capital: 'Gorontalo', island: 'Sulawesi', pop: 1.3, area: 11.3 },
  { name: 'Papua', capital: 'Jayapura', island: 'Papua', pop: 1.1, area: 82.7 },
  { name: 'Kalimantan Utara', capital: 'Tanjung Selor', island: 'Kalimantan', pop: 0.7, area: 72.6 },
  { name: 'Papua Selatan', capital: 'Merauke', island: 'Papua', pop: 0.6, area: 117.8 },
  { name: 'Papua Barat', capital: 'Manokwari', island: 'Papua', pop: 0.6, area: 64.5 },
  { name: 'Papua Barat Daya', capital: 'Sorong', island: 'Papua', pop: 0.6, area: 38.1 },
];

// Trade, 2024 (approx., BPS Trade Statistics).
export const TRADE = [
  { label: 'Exports', value: 'US$264.7 bn', note: 'Coal, palm oil, nickel products, electronics and garments lead.' },
  { label: 'Imports', value: 'US$233.7 bn', note: 'Machinery, raw materials and fuel dominate.' },
  { label: 'Trade balance', value: 'US$31.0 bn surplus', note: 'A surplus every year since 2020.' },
  { label: 'Biggest export market', value: 'China (about 22%)', note: 'Followed by the United States and Japan.' },
  { label: 'Biggest import source', value: 'China (about 34%)', note: 'Followed by Singapore and Japan.' },
];

// Country facts for the About page.
export const ABOUT_FACTS = [
  { label: 'Capital', value: 'Jakarta — the new capital Nusantara is being built in East Kalimantan' },
  { label: 'Provinces', value: '38 provinces, 514 regencies and cities' },
  { label: 'Islands', value: 'About 17,500 islands — the world’s largest archipelago' },
  { label: 'Land area', value: 'About 1.9 million km²' },
  { label: 'Official language', value: 'Bahasa Indonesia, alongside more than 700 local languages' },
  { label: 'Time zones', value: 'WIB (UTC+7), WITA (UTC+8), WIT (UTC+9)' },
  { label: 'Currency', value: 'Rupiah (IDR)' },
  { label: 'Independence', value: '17 August 1945' },
];

export const ISLANDS = ['All', 'Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali', 'Nusa Tenggara', 'Maluku', 'Papua'];
