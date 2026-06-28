#!/usr/bin/env node
/**
 * cardnews_maker 스킬 설치 CLI / installer
 *   npx @sunghyun_han/cardnews-maker-skill
 *
 * 지원 대상 (installs into one or more of):
 *   - Claude Code : <home>/.claude/skills/cardnews_maker
 *   - Codex CLI   : <home>/.codex/skills/cardnews_maker
 *
 * 대상 선택 (target selection):
 *   1) --target=claude | codex | both | all   (비대화형/스크립트용 플래그)
 *   2) 플래그가 없고 TTY 면 → 대화형으로 물어봄 (interactive prompt)
 *   3) 플래그도 없고 TTY 도 아니면 → 감지된 도구 전부에 설치, 없으면 Claude 기본
 *
 * 하는 일:
 *   - 패키지의 skill/ 폴더를 각 대상의 skills 디렉터리로 복사
 *   - 렌더링 의존성(Playwright + Chromium)을 첫 대상 폴더에 1회 설치하고
 *     나머지 대상에는 동일 폴더를 공유하도록 안내(중복 다운로드 방지)
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { execSync, spawnSync } = require('child_process');

const C = { reset: '\x1b[0m', green: '\x1b[32m', cyan: '\x1b[36m', yellow: '\x1b[33m', red: '\x1b[31m', dim: '\x1b[2m', bold: '\x1b[1m' };
const log = (m) => process.stdout.write(m + '\n');
const ok = (m) => log(`${C.green}✓${C.reset} ${m}`);
const info = (m) => log(`${C.cyan}›${C.reset} ${m}`);
const warn = (m) => log(`${C.yellow}!${C.reset} ${m}`);
const errl = (m) => log(`${C.red}✗${C.reset} ${m}`);

const PKG_ROOT = path.resolve(__dirname, '..');
const SRC_SKILL = path.join(PKG_ROOT, 'skill');
const HOME = os.homedir();

const TARGETS = {
  claude: { label: 'Claude Code', dir: path.join(HOME, '.claude', 'skills', 'cardnews_maker'), homeDir: path.join(HOME, '.claude') },
  codex:  { label: 'Codex CLI',   dir: path.join(HOME, '.codex',  'skills', 'cardnews_maker'), homeDir: path.join(HOME, '.codex') },
};

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function hasNode() {
  try { execSync('node --version', { stdio: 'ignore' }); return true; } catch { return false; }
}

// 이미 설치 흔적이 있는 도구 감지 (~/.claude, ~/.codex 존재 여부)
function detectInstalled() {
  return Object.entries(TARGETS)
    .filter(([, t]) => fs.existsSync(t.homeDir))
    .map(([k]) => k);
}

function parseTargetFlag(argv) {
  const a = argv.find((x) => x.startsWith('--target'));
  if (!a) return null;
  const v = a.includes('=') ? a.split('=')[1] : argv[argv.indexOf(a) + 1];
  if (!v) return null;
  const val = v.toLowerCase();
  if (val === 'both' || val === 'all') return ['claude', 'codex'];
  if (val === 'claude' || val === 'codex') return [val];
  return null;
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); });
  });
}

async function chooseTargetsInteractive() {
  const detected = detectInstalled();
  log('');
  log(`${C.bold}어디에 설치할까요? / Where to install?${C.reset}`);
  log(`  ${C.cyan}1${C.reset}) Claude Code   ${C.dim}(~/.claude/skills)${detected.includes('claude') ? '  [감지됨]' : ''}${C.reset}`);
  log(`  ${C.cyan}2${C.reset}) Codex CLI     ${C.dim}(~/.codex/skills)${detected.includes('codex') ? '  [감지됨]' : ''}${C.reset}`);
  log(`  ${C.cyan}3${C.reset}) 둘 다 / Both`);
  const def = detected.length === 2 ? '3' : detected.includes('codex') ? '2' : '1';
  const ans = await ask(`선택 [${def}]: `);
  const v = (ans || def);
  if (v === '3') return ['claude', 'codex'];
  if (v === '2') return ['codex'];
  return ['claude'];
}

function installPlaywright(targetDir) {
  const skillPkgJson = path.join(targetDir, 'package.json');
  if (!fs.existsSync(skillPkgJson)) {
    fs.writeFileSync(skillPkgJson, JSON.stringify({
      name: 'cardnews-maker-runtime', private: true,
      description: 'Local render runtime for the cardnews_maker skill',
      dependencies: { playwright: '^1.40.0' },
    }, null, 2) + '\n');
  }
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const r1 = spawnSync(npmCmd, ['install', '--no-audit', '--no-fund'], { cwd: targetDir, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r1.status !== 0) return false;
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const r2 = spawnSync(npxCmd, ['playwright', 'install', 'chromium'], { cwd: targetDir, stdio: 'inherit', shell: process.platform === 'win32' });
  return r2.status === 0;
}

async function resolveTargets() {
  const flag = parseTargetFlag(process.argv.slice(2));
  if (flag) return flag;
  if (process.stdin.isTTY && process.stdout.isTTY) return await chooseTargetsInteractive();
  // 비대화형: 감지된 것 전부, 없으면 Claude 기본
  const detected = detectInstalled();
  return detected.length ? detected : ['claude'];
}

async function main() {
  log('');
  log(`${C.bold}📰 cardnews_maker 스킬 설치 / installer${C.reset}`);
  log(`${C.dim}────────────────────────────────────────${C.reset}`);

  if (!hasNode()) {
    errl('Node.js 를 찾을 수 없습니다 / Node.js not found.');
    info('https://nodejs.org 에서 LTS 설치 후 다시 실행 / install LTS and re-run.');
    process.exit(1);
  }
  ok(`Node.js (${process.version})`);

  const targets = await resolveTargets();
  info(`설치 대상 / targets: ${targets.map((t) => TARGETS[t].label).join(', ')}`);

  // 1) 각 대상에 스킬 복사
  for (const t of targets) {
    const { label, dir } = TARGETS[t];
    if (fs.existsSync(path.join(dir, 'SKILL.md'))) warn(`${label}: 기존 스킬 덮어씀 / overwriting`);
    copyDir(SRC_SKILL, dir);
    ok(`${label}: 스킬 복사 완료 → ${dir}`);
  }

  // 2) 렌더 의존성 설치 (첫 대상에 설치, 나머지는 공유)
  const primary = TARGETS[targets[0]].dir;
  info('렌더링 엔진(Playwright + Chromium) 설치 중… (수 분 / a few min)');
  if (installPlaywright(primary)) {
    ok('렌더링 엔진 설치 완료 / render engine ready');
  } else {
    warn('렌더링 엔진 자동 설치 실패 / auto-install failed.');
    info(`수동 / manual: cd "${primary}" && npm install && npx playwright install chromium`);
  }
  // 추가 대상은 render.js 가 첫 대상의 node_modules 를 fallback 으로 탐색하므로 그대로 동작.
  // (render.js 의 loadChromium 은 ~/.claude/skills/cardnews_maker/node_modules 도 후보로 본다.)
  for (const t of targets.slice(1)) {
    const { label, dir } = TARGETS[t];
    if (!fs.existsSync(path.join(dir, 'node_modules', 'playwright'))) {
      // 같은 머신이면 첫 대상의 엔진을 공유. 안전을 위해 별도 설치도 시도하지 않고 안내만.
      info(`${label}: 렌더 엔진은 ${TARGETS[targets[0]].label} 폴더의 것을 공유합니다.`);
    }
  }

  log('');
  log(`${C.green}${C.bold}설치 완료 / Done!${C.reset}`);
  log(`${C.dim}────────────────────────────────────────${C.reset}`);
  log('이제 Claude Code / Codex 에서 카드뉴스 주제를 주면 동작합니다.');
  log(`예 / e.g.  ${C.cyan}"이 글로 카드뉴스 만들어줘 https://example.com/article"${C.reset}`);
  log(`${C.dim}설치된 도구를 재시작하면 스킬이 인식됩니다 / restart the tool to pick it up.${C.reset}`);
  log('');
}

main().catch((e) => { errl(String(e && e.message || e)); process.exit(1); });
