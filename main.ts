// NusaStat — entry program for make.fun's "Make the best national statistics
// site" bounty (best-national-statistics-site-20261126-0539).
//
// The site itself is plain static files under app/ (app/index.html plus its
// ES modules, no library, no network request at all), and the screenshots in
// screenshots/ are real renders of that code. This program hands both in: it
// copies app/ and screenshots/ from beside this file into the output
// directory and writes /output/dossier.json with the vendored make.fun
// library, which is the summary the judge reads.
//
// Node 22, standard library only. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program is deterministic: two runs into two fresh directories write
// byte-identical files (no timestamps, no randomness anywhere in it).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Caps the sealed scorer enforces: the dossier text budget, at most four
// screenshots of at most 256 KiB each, and the app/ limits (993 files,
// 16 MiB, paths under 1000 bytes). buildDossier refuses anything over them
// instead of handing in an entry the gate would refuse.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
    app_path_max_bytes: 1000,
  }),
);
