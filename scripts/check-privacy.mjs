// Prüft, ob in privacy.html noch Platzhalter stehen (gelb markierte Stellen).
// Vor dem Veröffentlichen aufrufen: npm run check:privacy
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'privacy.html');
const html = readFileSync(file, 'utf8');
const open = [...html.matchAll(/<mark class="platzhalter">(.*?)<\/mark>/g)].map((m) => m[1]);
if (open.length > 0) {
  console.error(`privacy.html: ${open.length} Platzhalter offen: ${[...new Set(open)].join(', ')}`);
  process.exit(1);
}
console.log('privacy.html: keine Platzhalter mehr offen');
