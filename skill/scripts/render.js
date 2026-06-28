const fs = require('fs');
const os = require('os');
const path = require('path');

// playwright는 보통 이 스크립트 폴더 옆 node_modules 에 있지만,
// 작업 디렉터리로 복사해 쓰는 경우를 위해 스킬 설치 위치도 탐색한다.
function loadChromium() {
  const home = os.homedir();
  const candidates = [
    () => require('playwright'),
    () => require(path.join(__dirname, '..', 'node_modules', 'playwright')),
    () => require(path.join(home, '.claude', 'skills', 'cardnews_maker', 'node_modules', 'playwright')),
    () => require(path.join(home, '.codex', 'skills', 'cardnews_maker', 'node_modules', 'playwright')),
  ];
  for (const get of candidates) {
    try { return get().chromium; } catch { /* try next */ }
  }
  throw new Error(
    'playwright 를 찾을 수 없습니다. 스킬 설치 폴더에서 `npm install` 후 ' +
    '`npx playwright install chromium` 을 실행하거나, 설치 스크립트를 다시 돌리세요.'
  );
}
const chromium = loadChromium();

const CARDS = path.join(__dirname, 'cards');
const OUT = path.join(__dirname, 'out');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 800 }, deviceScaleFactor: 2 });
  const files = fs.readdirSync(CARDS).filter(f => f.endsWith('.html')).sort();
  for (const f of files) {
    const url = 'file:///' + path.join(CARDS, f).replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const outName = f.replace('.html', '.png');
    await page.screenshot({ path: path.join(OUT, outName), clip: { x:0, y:0, width:800, height:800 } });
    console.log('rendered', outName);
  }
  await browser.close();
})();
