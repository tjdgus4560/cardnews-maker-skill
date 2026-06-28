# 📰 cardnews_maker

> An agent skill that turns a topic, an article URL, or a draft file into a set of **800×800 Korean card-news images (카드뉴스)**. Works with **[Claude Code](https://claude.com/claude-code)** and **[Codex CLI](https://developers.openai.com/codex)**.

Give it a blog post, an article, a report, or just an idea — it builds a cohesive card-news deck: cover, body cards, stat cards, diagrams, and a closing card, with a color theme picked to fit the subject.

🇰🇷 **한국어 설명은 아래로 스크롤하세요 (Korean docs below).**

---

## What it produces

- A set of **800×800 square PNG cards** (typically 8–15: cover → body → closing)
- Each card follows a **kicker → headline → body** structure — one message per card
- Numbers become **stat cards**; steps/relationships become **diagram cards**, automatically
- **Color theme auto-selected** to fit the topic (e.g. health → calm indigo, tech → green/indigo)
- Optional **A4 PDF** (zero side margins, top/bottom margins) on request
- A built-in **self-review-and-fix loop** catches text overflow and spacing issues before finishing

**Where cards are saved:** if you're working inside a project/repo, the deck (and its intermediate HTML, so it's reproducible) lands in `<project-root>/cardnews/<topic>/`. For a one-off request with no project, it goes to a global `<home>/cardnews/<topic>/`. You can always name your own location.

## Install

### Requirements

- **[Claude Code](https://claude.com/claude-code)** and/or **[Codex CLI](https://developers.openai.com/codex)** — the skill runs inside either
- **[Node.js](https://nodejs.org) 18+** — needed to render the card images

> The render engine (Playwright + Chromium) is installed **automatically** by the command below — no manual setup.

### One line in your terminal

```bash
npx @sunghyun_han/cardnews-maker-skill
```

The installer **asks where to install** — Claude Code, Codex CLI, or both — and then:
1. Copies the skill to the chosen tool(s):
   - Claude Code → `~/.claude/skills/cardnews_maker/`
   - Codex CLI → `~/.codex/skills/cardnews_maker/`
2. Auto-installs the render engine (Playwright + Chromium) once and shares it. Takes a few minutes.

Restart the tool afterward (if it was running) so the skill is picked up.

<details>
<summary>Non-interactive / scripted install</summary>

Pass a target to skip the prompt (useful in CI or piped installs):

```bash
npx @sunghyun_han/cardnews-maker-skill --target=claude   # Claude Code only
npx @sunghyun_han/cardnews-maker-skill --target=codex    # Codex CLI only
npx @sunghyun_han/cardnews-maker-skill --target=both      # both
```

With no flag and no interactive terminal, it installs into whichever tools it detects (`~/.claude`, `~/.codex`), defaulting to Claude Code.
</details>

<details>
<summary>Install straight from GitHub (no npm publish needed)</summary>

```bash
npx github:tjdgus4560/cardnews-maker-skill
```
</details>

<details>
<summary>Global install</summary>

```bash
npm install -g @sunghyun_han/cardnews-maker-skill
cardnews-maker-install
```
</details>

## Usage

Just hand Claude Code something to turn into card news. You don't have to say the word "card news" — any "summarize this article into cards" intent triggers the skill.

```
이 글로 카드뉴스 만들어줘 https://example.com/article
```
```
"수면 부족이 뇌에 미치는 영향" 주제로 카드뉴스 만들어줘
```
```
Make a card-news deck from the attached draft.txt
```

The skill **asks you** about things that would meaningfully change the result (cover title options, what to do when there's no source) and **decides the rest** (color theme, card count, layout) on its own. Default output is PNG; ask for a PDF and it bundles an A4 PDF too.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Node.js not found` | Install LTS from https://nodejs.org and re-run |
| `playwright not found` (at render time) | Run the re-install below |
| Skill not visible | Restart the tool; confirm `SKILL.md` exists under `~/.claude/skills/cardnews_maker/` (Claude) or `~/.codex/skills/cardnews_maker/` (Codex) |
| Korean font looks broken | Check your internet connection (it loads the Noto Sans KR web font) |

**Re-install the render engine** (into whichever tool you installed):
```bash
cd ~/.claude/skills/cardnews_maker   # or ~/.codex/skills/cardnews_maker
npm install && npx playwright install chromium
```

## Layout

```
~/.claude/skills/cardnews_maker/
  SKILL.md              skill body (workflow + design house style)
  references/
    design-system.md    color themes, CSS tokens, component specs
    card-patterns.md     8 card variants (cover/body/stat/diagram/compare/checklist/closing)
    review-checklist.md  self-review items + common fixes
  scripts/
    build.js             layout engine + card definitions (swap theme & content per topic)
    render.js            HTML → 800×800 PNG (Playwright)
    make_pdf.py          A4 PDF assembler (zero side margin, top/bottom margin)
```

## License

MIT

---

## 🇰🇷 한국어

주제 한 줄, 기사 URL, 또는 초안 파일만 주면 **800×800 한국어 카드뉴스 이미지 세트**를 만들어 주는 에이전트 스킬입니다. **[Claude Code](https://claude.com/claude-code)** 와 **[Codex CLI](https://developers.openai.com/codex)** 양쪽에서 동작합니다.

### 무엇을 만들어 주나요?

- **800×800 정사각 PNG 카드** 한 세트 (보통 8~15장: 표지 → 본문 → 마무리)
- 각 카드는 **킥커(주제 라벨) → 헤드라인 → 본문** 구조로, 한 카드에 한 메시지
- 통계가 있으면 **숫자 강조 카드**, 단계·관계가 있으면 **구조도 카드**로 자동 변환
- 주제에 맞는 **색 테마 자동 선정** (예: 헬스 → 차분한 인디고, 테크 → 그린/인디고)
- 요청하면 **A4 PDF**(좌우 여백 0, 상하 여백)로도 묶어 줍니다
- **스스로 검토·수정**하는 루프가 글자 잘림·여백 문제를 잡고 마무리합니다

**저장 위치**: 프로젝트/레포 안에서 쓰면 결과물(+중간 산출물 HTML)이 `<프로젝트 루트>/cardnews/<주제>/` 에 저장돼 재현·버전관리가 됩니다. 프로젝트 맥락이 없는 일회성 요청이면 전역 위치 `<home>/cardnews/<주제>/` 로 저장합니다. 원하는 위치를 직접 지정할 수도 있습니다.

### 설치

**준비물**: [Claude Code](https://claude.com/claude-code) 또는 [Codex CLI](https://developers.openai.com/codex), [Node.js](https://nodejs.org) 18+
(렌더링 엔진 Playwright·Chromium 은 아래 명령이 자동으로 설치합니다.)

터미널/cmd 에 한 줄:

```bash
npx @sunghyun_han/cardnews-maker-skill
```

→ **어디에 설치할지(Claude Code / Codex / 둘 다) 물어본 뒤**, 선택한 도구에 스킬을 복사하고 렌더링 엔진을 자동 설치합니다(수 분 소요). 끝나면 해당 도구를 재시작하세요.
프롬프트 없이 바로 지정하려면: `--target=claude` / `--target=codex` / `--target=both`.

### 사용법

Claude Code 대화창에 카드뉴스로 만들 거리를 던지면 됩니다. "카드뉴스"라는 단어를 꼭 쓰지 않아도 됩니다.

```
이 글로 카드뉴스 만들어줘 https://example.com/article
"수면 부족이 뇌에 미치는 영향" 주제로 카드뉴스 만들어줘
첨부한 draft.txt 구성대로 카드뉴스 만들어줘
```

스킬은 결과를 크게 바꿀 애매한 부분(표지 제목 후보, 자료 출처가 없을 때 방향)은 **질문해서 확인**하고, 색 테마·장수·카드 구성은 알아서 정합니다. 기본 산출물은 PNG, "PDF로도 묶어줘" 하면 A4 PDF 도 만들어 줍니다.

### 문제 해결

| 증상 | 해결 |
|---|---|
| `Node.js 를 찾을 수 없습니다` | https://nodejs.org 에서 LTS 설치 후 다시 실행 |
| `playwright 를 찾을 수 없습니다` | 아래 "렌더 엔진 재설치" 실행 |
| 스킬이 안 보임 | 도구 재시작. `~/.claude/skills/cardnews_maker/SKILL.md`(Claude) 또는 `~/.codex/skills/cardnews_maker/SKILL.md`(Codex) 존재 확인 |
| 한글 폰트가 깨짐 | 인터넷 연결 확인 (Noto Sans KR 웹폰트 로드) |

**렌더 엔진 재설치:**
```bash
cd ~/.claude/skills/cardnews_maker   # 또는 ~/.codex/skills/cardnews_maker
npm install && npx playwright install chromium
```
