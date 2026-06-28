---
name: cardnews_maker
description: >-
  Build polished 800x800 Korean card-news image sets from a topic, URL, or draft
  file, rendered via HTML→PNG with a consistent layout system (kicker chip →
  headline → divider → body, unified footer). Use this whenever the user wants to
  turn an article, blog post, report, topic, or draft into card news / 카드뉴스 /
  정보전달용 카드 / 인포그래픽 카드 / SNS 슬라이드 — even if they just paste a link or say
  "이걸로 카드뉴스 만들어줘" without naming the format explicitly. Picks a color theme to
  fit the subject, keeps a self-review-and-fix loop, and can export an A4 PDF on
  request.
---

# Card-News Maker (카드뉴스 메이커)

Turn a topic, source article (URL), or draft file into a set of polished
**800×800** card-news images. The user brings a **new subject each time**; you
read/derive the content, structure it into cards, render them, then run a
self-review-and-fix loop before delivering.

The look-and-feel is fixed (so every set feels like a series), but the **color
theme adapts to the subject** each time. Layout, typography, spacing, and the
review loop stay constant.

## When to ask vs. when to decide

The user explicitly wants to be **asked about anything genuinely ambiguous**
rather than have you guess. Use `AskUserQuestion` (offer a recommended option
first) when the answer would meaningfully change the output and isn't inferable.
Otherwise, decide and state your choice briefly.

**Decide yourself (don't ask):**
- Number of cards — fit to content, usually 8–15 (cover + body + closing).
- Color theme — pick one that fits the subject/brand (see references).
- Per-card layout (standard body card vs. stat card vs. diagram/checklist).
- Korean copywriting, emphasis spans, kicker labels.

**Ask the user (when unclear):**
- Source ambiguity: only a one-line topic with no source and the scope is wide →
  ask whether to web-search, or what angle/depth they want.
- The cover title when no strong single title emerges (default: propose one +
  offer a better alternative, let them pick).
- Audience/tone if the subject could go several ways (e.g. executive brief vs.
  beginner explainer) and it materially changes the copy.
- Anything the user flags as "판단 애매" — surface it as a question.

When a recurring preference gets decided, it's fine to note it back so future
runs are smoother — but never block the whole job on a question you can answer
with a sensible default.

## Workflow

### 1. Get the content
- **URL** → fetch it (WebFetch) and extract the thesis, key points, terminology,
  notable numbers/quotes, and the main takeaways.
- **Text / draft file** → read it; treat a provided per-chapter draft as the
  primary skeleton. You may lightly refine it, but keep the user's structure.
- **One-line topic only** → if scope is wide and there's no source, ask whether
  to web-search or what angle they want before inventing content.

Stay **faithful to the source**. Avoid over-interpreting. When you add the
"what we should learn / 시사점" angle, frame it as lessons drawn from the source,
not personal prescriptions. Reframe any "do X / 하라" imperatives into
observations ("X가 중요하다", "X일 때 강해진다").

### 2. Plan the deck
Decide card count and the per-card role. A typical arc:
`cover → hook/intro → context → core concepts (one idea per card) → a stat or
diagram card where it aids transfer → closing message (+ source link)`.

Use **one idea per card**. If a card's body would overflow, split it.

Pick a **color theme** fitting the subject and read
`references/design-system.md` for the exact tokens, card layout, and component
patterns. Read `references/card-patterns.md` for ready-made card variants
(cover, body, stat, diagram, checklist, closing).

### 3. Build the HTML
Use `scripts/build.js` as the starting point — it already encodes the layout
system (base CSS, kicker chip, headline, divider, body with highlight spans,
footer, river-wave decoration) and outputs one HTML file per card to `cards/`.
**Copy it into the working directory and edit the card definitions and theme
colors** for this subject. Don't rewrite the layout engine from scratch.

### 4. Render to PNG
Run `scripts/render.js` (Playwright + Chromium, deviceScaleFactor 2 → crisp
800×800 PNGs in `out/`). One-time setup if Playwright isn't installed:
`npm install playwright && npx playwright install chromium`.

### 5. Self-review and fix loop (always do this)
This is required, not optional — it's what makes the output feel finished.
- **Read the rendered PNGs back** (Read tool) and inspect every card.
- Check for: body text colliding with the footer, empty-space imbalance, text
  overflow / awkward line breaks, contrast/legibility, consistent kicker &
  footer, correct page numbers and total count.
- Fix issues in `build.js`, re-render, and re-check the affected cards.
- Only deliver once the whole set is clean. See
  `references/review-checklist.md` for the full list and common fixes.

### 6. Deliver
**Where to save** — pick the output location by context, so results land where
the user would look for them:

1. **If you're working inside a project/repo** (the session has a project root —
   e.g. a git repo, or the user is clearly operating in a specific working
   directory): save everything **under that project root**, in
   `<project-root>/cardnews/<topic>/`. Put the intermediate artifacts there too
   (the working `build.js`, `cards/*.html`, `out/*.png`) so the deck is
   reproducible and version-controllable alongside the project. This is the
   default whenever a project context exists.
2. **If there's no project context** (a one-off, ad-hoc request with no working
   repo): save to a global, OS-appropriate location —
   `<home>/cardnews/<topic>/` (works on Windows, macOS, Linux alike; avoid
   hardcoding `Downloads`).
3. **If the user names a location**, honor it over the above.

State where you saved the files. Default output is **PNG only** (plus the
intermediate HTML when saving into a project, per rule 1). Build the **A4 PDF
only when asked** (or proactively offer it) using `scripts/make_pdf.py`, which
lays each card on an A4 page with **zero left/right margin** (card fills page
width) and **equal top/bottom margins** — read its header comment for the
behavior.

Keep the working files (`build.js` etc.) in a project folder so the user can
tweak copy and re-run `node build.js && node render.js`.

## Defaults (this skill's house style)
- Size: **800×800** square, 2× render scale.
- Structure per card: kicker chip (number + label) → headline → divider →
  body with selective highlight spans → unified footer (source · NN / total).
- Cover & closing: full-bleed gradient in the theme color, wave motif; closing
  card carries the **source link**.
- Output: PNG by default; A4 PDF on request.
- Language: Korean copy (technical terms / identifiers stay in original form).

## Resources
- `references/design-system.md` — color themes, CSS tokens, component anatomy.
- `references/card-patterns.md` — copy-pasteable card variants with examples.
- `references/review-checklist.md` — what to verify and how to fix each issue.
- `scripts/build.js` — HTML card builder (layout engine + card definitions).
- `scripts/render.js` — Playwright HTML→PNG renderer.
- `scripts/make_pdf.py` — A4 PDF assembler (zero side margin, top/bottom margin).
