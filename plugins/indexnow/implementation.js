import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const origin = 'https://www.chrisonline.nl';
const key = '1cc5200c00490e2c430f337d635f08fe';
const manifestName = 'indexnow-manifest.json';
const cacheFile = '.netlify/indexnow/accepted.json';
const hash = (value) => createHash('sha256').update(value).digest('hex');
let current;

export function changedUrls(previous, next) {
  return [...new Set([...Object.keys(previous), ...Object.keys(next)])].filter(
    (url) => previous[url] !== next[url],
  );
}

function localPath(publishDir, url) {
  const parsed = new URL(url);
  if (parsed.origin !== origin || parsed.search || parsed.hash) {
    throw new Error(`Unexpected sitemap URL: ${url}`);
  }
  const relative = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');
  const file = path.resolve(publishDir, relative);
  if (file !== path.resolve(publishDir) && !file.startsWith(`${path.resolve(publishDir)}/`)) {
    throw new Error('Sitemap path leaves the publish directory');
  }
  return parsed.pathname.endsWith('/') ? path.join(file, 'index.html') : file;
}

export async function buildManifest(publishDir) {
  const pages = {};
  const visited = new Set();
  async function visit(sitemapUrl) {
    if (visited.has(sitemapUrl)) return;
    visited.add(sitemapUrl);
    const xml = await readFile(localPath(publishDir, sitemapUrl), 'utf8');
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
      match[1].replaceAll('&amp;', '&'),
    );
    if (!urls.length) throw new Error(`Empty or invalid sitemap: ${sitemapUrl}`);
    for (const url of urls) {
      if (xml.includes('<sitemapindex')) {
        await visit(url);
      } else {
        const html = await readFile(localPath(publishDir, url), 'utf8');
        if (/<meta\b[^>]*\bcontent=["'][^"']*noindex/i.test(html)) continue;
        pages[url] = hash(html);
      }
    }
  }
  await visit(`${origin}/sitemap-index.xml`);
  return pages;
}

async function getLive(relative) {
  const response = await fetch(`${origin}/${relative}`, {
    redirect: 'error',
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Live ${relative}: HTTP ${response.status}`);
  return response.text();
}

export async function submitUrls(urlList) {
  if (!urlList.length) return 'No changed URLs';
  for (const url of urlList) localPath('/indexnow', url);
  if ((await getLive(`${key}.txt`)).trim() !== key) {
    throw new Error('The live IndexNow verification key does not match');
  }
  let pending = false;
  for (let offset = 0; offset < urlList.length; offset += 10000) {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(origin).host,
        key,
        keyLocation: `${origin}/${key}.txt`,
        urlList: urlList.slice(offset, offset + 10000),
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`IndexNow submission failed: HTTP ${response.status}`);
    }
    pending ||= response.status === 202;
  }
  return `${urlList.length} URLs received${pending ? '; key validation pending (HTTP 202)' : ' (HTTP 200)'}. Indexing is not guaranteed.`;
}

export async function onPostBuild({ constants }) {
  if (process.env.CONTEXT !== 'production') return;
  const pages = await buildManifest(constants.PUBLISH_DIR);
  current = { version: 1, fingerprint: hash(JSON.stringify(pages)), pages };
  await writeFile(path.join(constants.PUBLISH_DIR, manifestName), JSON.stringify(current));
}

export async function onSuccess({ utils }) {
  if (process.env.CONTEXT !== 'production' || !current) return;
  try {
    // A successful deploy can still be unpublished (for example a locked deploy).
    const live = JSON.parse(await getLive(manifestName));
    if (live.fingerprint !== current.fingerprint) {
      throw new Error('This build is not yet served on the production domain; no URLs submitted');
    }
    await utils.cache.restore(cacheFile);
    let previous = {};
    try {
      previous = JSON.parse(await readFile(cacheFile, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const urls = changedUrls(previous, current.pages);
    const result = await submitUrls(urls);
    // Only remember submissions accepted by IndexNow, so failures retry next deploy.
    await mkdir(path.dirname(cacheFile), { recursive: true });
    await writeFile(cacheFile, JSON.stringify(current.pages));
    await utils.cache.save(cacheFile);
    utils.status.show({ title: 'IndexNow', summary: result });
  } catch (error) {
    utils.build.failPlugin(`IndexNow: ${error.message}. Retry with the next production deploy.`);
  }
}
