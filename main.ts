/**
 * NusaStat — Statistik Indonesia
 * ------------------------------
 * Entry program for a static, 7-page Indonesia statistics website built for
 * make.fun's "Make the best national statistics site" bounty.
 *
 * What it does:
 *   1. copies the finished site from ./app into <output>/app
 *   2. copies any prepared screenshots from ./screenshots into <output>/screenshots
 *   3. writes <output>/dossier.json, the entry dossier produced by the vendored
 *      make.fun frontend helper
 *
 * The output is fully deterministic: no timestamps, no randomness, so two runs
 * produce byte-identical files.
 *
 * Run locally (Node 22, standard library only):
 *   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
 */
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

/** Size and count limits handed to the dossier builder. */
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
};

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/**
 * Copy the folder `name` from beside this file into the output folder.
 * A required folder must exist; an optional one is skipped when absent.
 */
function copyTree(name: string, required: boolean): void {
  const from = join(here, name);
  if (!required && !existsSync(from)) return;
  cpSync(from, join(outDir, name), { recursive: true });
}

mkdirSync(outDir, { recursive: true });
copyTree('app', true);
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
copyTree('screenshots', false);

const dossier: string = await buildDossier(outDir, DOSSIER_CAPS);
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log(
  `NusaStat: ${readdirSync(join(outDir, 'screenshots')).length} screenshot(s) copied, ` +
    `dossier.json ${Buffer.byteLength(dossier)} bytes`,
);
