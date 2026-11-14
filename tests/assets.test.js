import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { mediaSources, portraitSources } from '../scripts/catalogue.js';

const root = new URL('../', import.meta.url);
const catalogue = JSON.parse(await readFile(new URL('data/photographers.json', root), 'utf8'));

async function assertFile(url) {
  const path = fileURLToPath(url);
  const entries = await readdir(dirname(path));
  assert.ok(entries.includes(basename(path)), 'Missing or misnamed file: ' + url.pathname);
  assert.ok((await stat(path)).size > 0, 'Empty file: ' + url.pathname);
}

test('each photographer and gallery item has an image or poster and a full asset', async () => {
  const photographerIds = new Set(catalogue.photographers.map((person) => person.id));
  for (const person of catalogue.photographers) {
    const { full, preview, thumbnail } = portraitSources(person);
    await assertFile(new URL(full, root));
    await assertFile(new URL(preview, root));
    await assertFile(new URL(thumbnail, root));
    if (person.cover) {
      assert.ok(
        catalogue.media.some((item) => item.photographerId === person.id && item.image === person.cover),
        'Cover must belong to ' + person.name,
      );
      await assertFile(new URL('assets/covers/' + person.id + '.webp', root));
    }
  }
  for (const media of catalogue.media) {
    assert.ok(photographerIds.has(media.photographerId), 'Unknown photographer for ' + media.title);
    assert.notEqual(Boolean(media.image), Boolean(media.video), 'Expected one media file for ' + media.title);
    const { full, preview, thumbnail } = mediaSources(media);
    await assertFile(new URL(full, root));
    await assertFile(new URL(preview, root));
    await assertFile(new URL(thumbnail, root));
  }
});

test('both pages reference existing scripts, styles and brand assets', async () => {
  for (const page of ['index.html', 'photographer.html']) {
    const url = new URL(page, root);
    const markup = await readFile(url, 'utf8');
    for (const [, reference] of markup.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      await assertFile(new URL(reference, url));
    }
  }
});
