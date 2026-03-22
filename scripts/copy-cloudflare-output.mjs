/**
 * next-on-pages derlemesinden sonra çıktıyı tek bir klasöre toplar.
 * Böylece deploy komutlarında tek isim kullanılır (cloudflare-pages-dist).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, '.vercel', 'output', 'static');
const dest = path.join(root, 'cloudflare-pages-dist');

if (!fs.existsSync(src)) {
  console.error(
    'Derleme çıktısı bulunamadı. Önce şunu çalıştır: npx @cloudflare/next-on-pages@1'
  );
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log('Tamam → cloudflare-pages-dist/ (Wrangler ile bunu deploy et)');
