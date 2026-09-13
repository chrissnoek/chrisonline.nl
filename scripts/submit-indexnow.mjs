import process from 'node:process';
import { submitUrls } from '../plugins/indexnow/implementation.js';

const urls = process.argv.slice(2);
if (!urls.length)
  throw new Error('Usage: npm run indexnow -- https://www.chrisonline.nl/page/ ...');
console.log(await submitUrls(urls));
