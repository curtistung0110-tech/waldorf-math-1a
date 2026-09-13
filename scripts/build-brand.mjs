// 產生網站圖示（favicon、App 圖示）與社群分享圖（OG image）。
// 需要本機安裝 Chrome 或 Edge；用法：node scripts/build-brand.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = (file) => path.join(root, 'site', file);
const design = (file) => path.join(root, 'design', file);

const browser = [
  process.env.BROWSER_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));

if (!browser) {
  console.error('找不到 Chrome 或 Edge，請用環境變數 BROWSER_PATH 指定瀏覽器路徑。');
  process.exit(1);
}

const tmp = mkdtempSync(path.join(os.tmpdir(), 'waldorf-brand-'));
const baseArgs = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${path.join(tmp, 'profile')}`];

/* ---------- 圖示：橫切蘋果裡的五角星（單元一） ---------- */
function starPath(cx, cy, outer, inner) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? inner : outer;
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return d + 'Z';
}

// rounded：透明圓角（瀏覽器分頁、一般 App 圖示）
// full：滿版底色（iOS 會自己裁圓角）
// maskable：滿版底色並縮小內容，留給 Android 裁切的安全範圍
function iconSvg(mode) {
  const background =
    mode === 'rounded'
      ? '<rect x="16" y="16" width="480" height="480" rx="116" fill="#A4485C"/>'
      : '<rect width="512" height="512" fill="#A4485C"/>';
  const scale = mode === 'maskable' ? 0.72 : 1;
  let seeds = '';
  for (let i = 0; i < 5; i++) {
    const deg = -90 + 72 * i;
    const rad = (deg * Math.PI) / 180;
    const x = (78 * Math.cos(rad)).toFixed(1);
    const y = (78 * Math.sin(rad)).toFixed(1);
    seeds += `<ellipse cx="${x}" cy="${y}" rx="13" ry="28" fill="#6B4226" transform="rotate(${deg + 90} ${x} ${y})"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${background}
  <g transform="translate(256 256) scale(${scale})">
    <circle r="178" fill="#F7E9C0"/>
    <path d="${starPath(0, 0, 150, 60)}" fill="#E9B949"/>
    ${seeds}
  </g>
</svg>
`;
}

// 用瀏覽器的 canvas 把 SVG 轉成指定大小的 PNG
function rasterize(jobs) {
  const page = path.join(tmp, 'rasterize.html');
  writeFileSync(
    page,
    `<!doctype html><meta charset="utf-8"><body><script>
      const jobs = ${JSON.stringify(jobs)};
      (async () => {
        const out = {};
        for (const job of jobs) {
          const img = new Image();
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(job.svg);
          await img.decode();
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = job.size;
          canvas.getContext('2d').drawImage(img, 0, 0, job.size, job.size);
          out[job.name] = canvas.toDataURL('image/png').split(',')[1];
        }
        const pre = document.createElement('pre');
        pre.id = 'out';
        pre.textContent = JSON.stringify(out);
        document.body.append(pre);
      })();
    </script>`
  );
  const dom = execFileSync(browser, [...baseArgs, '--virtual-time-budget=5000', '--dump-dom', pathToFileURL(page).href], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const match = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
  if (!match) throw new Error('圖示轉檔失敗');
  return Object.fromEntries(Object.entries(JSON.parse(match[1])).map(([name, b64]) => [name, Buffer.from(b64, 'base64')]));
}

// 把多個 PNG 包成 .ico
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

const rounded = iconSvg('rounded');
const png = rasterize([
  { name: 'ico16', svg: rounded, size: 16 },
  { name: 'ico32', svg: rounded, size: 32 },
  { name: 'ico48', svg: rounded, size: 48 },
  { name: 'icon192', svg: rounded, size: 192 },
  { name: 'icon512', svg: rounded, size: 512 },
  { name: 'apple', svg: iconSvg('full'), size: 180 },
  { name: 'maskable', svg: iconSvg('maskable'), size: 512 },
]);

writeFileSync(site('favicon.svg'), rounded);
writeFileSync(site('favicon.ico'), toIco([16, 32, 48].map((size) => ({ size, png: png['ico' + size] }))));
writeFileSync(site('icon-192.png'), png.icon192);
writeFileSync(site('icon-512.png'), png.icon512);
writeFileSync(site('icon-maskable-512.png'), png.maskable);
writeFileSync(site('apple-touch-icon.png'), png.apple);

/* ---------- 社群分享圖 ---------- */
const ogOut = site('og-image.png');
rmSync(ogOut, { force: true });
execFileSync(
  browser,
  [...baseArgs, '--allow-file-access-from-files', '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=10000', `--screenshot=${ogOut}`, pathToFileURL(design('og-image.html')).href],
  { stdio: 'ignore' }
);
if (!existsSync(ogOut)) throw new Error('分享圖截圖失敗');

rmSync(tmp, { recursive: true, force: true });
console.log('✓ 已產生 favicon.svg、favicon.ico、icon-192.png、icon-512.png、icon-maskable-512.png、apple-touch-icon.png、og-image.png');
