// ============================================================================
// 카드뉴스 빌더 (800x800 HTML 생성 -> render.js로 PNG 렌더링)
//
// 이 파일은 cardnews_maker 스킬의 "레이아웃 엔진 + 예시 카드"입니다.
// 매 주제마다: (1) 아래 THEME 색상을 주제/브랜드에 맞게 바꾸고,
//             (2) "카드 정의" 섹션의 cards.push(...) 들을 새 내용으로 교체하세요.
// 레이아웃/컴포넌트(baseCSS, kicker, headline, divider, body, footer, riverWave)는
// 그대로 두는 것이 시리즈 일관성을 유지하는 핵심입니다.
//
// 아래 예시 색상은 "Shopify/그린" 주제용입니다. 색 선택 가이드는
// references/design-system.md 참고.
// ============================================================================
const fs = require('fs');
const path = require('path');

const OUT_HTML = path.join(__dirname, 'cards');

// ===== THEME (주제마다 교체) =====
const BRAND   = '#5E8E3E';    // 메인 컬러 (kicker chip, 헤드라인 강조, divider)
const BRAND_DK = '#3D6B26';   // 메인의 어두운 톤 (소제목, 다크카드 배경)
const INK     = '#16241B';    // 본문 텍스트 (메인 계열의 거의 검정)
const SUB     = '#54695C';    // 보조 텍스트 (회색-메인 혼합)
const PAPER   = '#F4F1E9';    // 카드 배경 (밝은 종이톤; 채도 낮게)
const ACCENT  = '#1F6FEB';    // 보조 강조색 (포인트 박스, 장식 — 메인과 대비)
const LINE    = '#DcD7C9';    // 구분선/테두리

// 공통 스타일 (모든 카드 head에 주입)
const baseCSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
* { margin:0; padding:0; box-sizing:border-box; -webkit-font-smoothing:antialiased; }
html,body { width:800px; height:800px; }
body {
  font-family:'Noto Sans KR', sans-serif;
  background:${PAPER};
  color:${INK};
  position:relative;
  overflow:hidden;
}
.card { width:800px; height:800px; position:relative; padding:64px 60px 100px; display:flex; flex-direction:column; }
.kicker { display:inline-flex; align-items:center; gap:8px; font-size:18px; font-weight:700; letter-spacing:.5px; color:${BRAND_DK}; }
.kicker .chip { background:${BRAND}; color:#fff; padding:4px 12px; border-radius:999px; font-size:15px; font-weight:900; letter-spacing:1px; }
.headline { font-size:46px; font-weight:900; line-height:1.18; letter-spacing:-1px; margin-top:22px; color:${INK}; }
.subhead { font-size:25px; font-weight:700; color:${BRAND_DK}; margin-top:16px; line-height:1.35; }
.body { font-size:23px; font-weight:400; line-height:1.62; color:${INK}; margin-top:30px; }
.spacer { flex:1 1 auto; min-height:14px; }
.body p { margin-bottom:14px; }
.hl { color:${BRAND_DK}; font-weight:700; }
.hlb { background:linear-gradient(transparent 58%, rgba(94,142,62,.28) 58%); font-weight:700; }
.footer { position:absolute; left:60px; right:60px; bottom:34px; display:flex; justify-content:space-between; align-items:center; font-size:15px; color:${SUB}; font-weight:500; }
.footer .src { letter-spacing:.3px; }
.pageno { font-weight:700; color:${BRAND}; }
.river { position:absolute; left:0; right:0; bottom:0; height:90px; opacity:.9; }
.divider { width:54px; height:5px; background:${BRAND}; border-radius:3px; margin:20px 0; }
`;

// 강물 SVG (하단 장식)
function riverWave(opacity=0.16, color=ACCENT){
  return `<svg class="river" viewBox="0 0 800 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,40 C150,10 250,70 400,45 C550,20 650,75 800,42 L800,90 L0,90 Z" fill="${color}" opacity="${opacity}"/>
    <path d="M0,55 C160,30 260,82 400,58 C560,32 660,85 800,55 L800,90 L0,90 Z" fill="${color}" opacity="${opacity*0.6}"/>
  </svg>`;
}

function footer(no, total=15){
  return `<div class="footer">
    <span class="src">Shopify Engineering · "Under the River"</span>
    <span class="pageno">${String(no).padStart(2,'0')} / ${total}</span>
  </div>`;
}

function wrap(inner, extraStyle=''){
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
  <style>${baseCSS}${extraStyle}</style></head>
  <body>${inner}</body></html>`;
}

// ============================================================================
// ====== 카드 정의 (이 아래를 새 주제 내용으로 교체) ======
// 아래는 "Shopify River" 예시 15장입니다. 패턴(표지/본문/스탯/구조도/체크리스트/
// 마무리)을 참고하되, 새 주제에서는 cards 배열을 새로 구성하세요.
// 카드 변형 예시는 references/card-patterns.md 에 정리돼 있습니다.
// ============================================================================
const cards = [];

// --- 01 표지 ---
cards.push(wrap(`
<div class="card" style="padding:0;background:linear-gradient(160deg,${BRAND_DK} 0%, #2C4F1C 55%, #18301B 100%);color:#fff;justify-content:center;">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.55" viewBox="0 0 800 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-50,520 C180,440 280,640 460,540 C620,452 720,600 880,520 L880,860 L-50,860 Z" fill="${ACCENT}" opacity="0.35"/>
    <path d="M-50,580 C180,500 300,700 480,600 C640,512 720,650 880,580 L880,860 L-50,860 Z" fill="${ACCENT}" opacity="0.5"/>
    <path d="M-50,640 C200,560 300,740 500,650 C660,575 760,690 880,640 L880,860 L-50,860 Z" fill="#0B1F3A" opacity="0.55"/>
  </svg>
  <div style="position:relative;padding:0 64px;">
    <div style="display:inline-flex;align-items:center;gap:10px;font-size:18px;font-weight:700;letter-spacing:1px;color:#CFE3BE;">
      <span style="width:10px;height:10px;background:#9BD66E;border-radius:50%;display:inline-block;"></span>
      SHOPIFY ENGINEERING · 사내 AI 에이전트 'River'
    </div>
    <div style="font-size:56px;font-weight:900;line-height:1.18;letter-spacing:-2px;margin-top:26px;">
      쇼피파이의 AI Agent<br><span style="color:#A7E07A;">"River"</span>는 어떻게<br>진화하고 있나
    </div>
    <div style="width:70px;height:6px;background:#A7E07A;border-radius:4px;margin:30px 0 24px;"></div>
    <div style="font-size:24px;font-weight:500;line-height:1.5;color:#E6EFDD;">
      코드를 짜주는 챗봇이 아니라,<br>
      <b style="color:#fff;">River</b>를 굴리기 위해 쇼피파이가 만든 <b style="color:#fff;">'일하는 구조'</b> 이야기
    </div>
  </div>
  <div style="position:absolute;bottom:36px;left:64px;right:64px;display:flex;justify-content:space-between;font-size:15px;color:#A9C496;font-weight:500;">
    <span>원문 분석 · 카드뉴스</span><span>Under the River</span>
  </div>
</div>`));

// --- 02 들어가며: River란? ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">01</span> RIVER란 무엇인가</div>
  <div class="headline">코드를 짜주는<br>챗봇이 아닙니다</div>
  <div class="divider"></div>
  <div class="body">
    <p>River는 <span class="hlb">Slack 안에서 사람들과 함께 일하는</span> 쇼피파이의 사내 AI 에이전트입니다.</p>
    <p>코드베이스를 읽고, 테스트를 돌리고, 로그를 확인하고, 필요하면 <span class="hl">PR까지 직접 만듭니다.</span></p>
    <p>하지만 더 중요한 건 River 자체가 아니라, River를 굴리기 위해 쇼피파이가 만든 <span class="hl">'일하는 구조'</span>입니다.</p>
  </div>
  ${riverWave()}
  ${footer(2)}
</div>`));

// --- 03 데이터 임팩트 (PPT형 스탯 카드) ---
cards.push(wrap(`
<div class="card" style="background:${INK};color:#fff;">
  <div class="kicker" style="color:#A7E07A;"><span class="chip" style="background:#A7E07A;color:${INK};">02</span> 숫자로 보는 River</div>
  <div class="headline" style="color:#fff;">이미 '동료'처럼<br>일하고 있습니다</div>
  <div style="display:flex;gap:24px;margin-top:auto;margin-bottom:30px;">
    <div style="flex:1;background:rgba(167,224,122,.12);border:1px solid rgba(167,224,122,.3);border-radius:18px;padding:26px 22px;">
      <div style="font-size:62px;font-weight:900;color:#A7E07A;line-height:1;">1/8</div>
      <div style="font-size:18px;color:#D6E5C8;margin-top:12px;line-height:1.4;">머지된 PR 8개 중 1개에<br>River가 공동 작성자로 참여</div>
    </div>
    <div style="flex:1;background:rgba(31,111,235,.14);border:1px solid rgba(110,170,255,.35);border-radius:18px;padding:26px 22px;">
      <div style="font-size:62px;font-weight:900;color:#7FB2FF;line-height:1;">59,918</div>
      <div style="font-size:18px;color:#CFE0F5;margin-top:12px;line-height:1.4;">최근 30일간 진행된<br>River 세션 수</div>
    </div>
  </div>
  <div style="font-size:19px;color:#9FB0A4;border-top:1px solid rgba(255,255,255,.1);padding-top:18px;">
    실험이 아니라 <span style="color:#fff;font-weight:700;">실제 개발 흐름에 녹아든 규모</span>입니다.
  </div>
  ${footer(3)}
</div>`));

// --- 04 마주한 현실 ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">03</span> 쇼피파이가 마주한 현실</div>
  <div class="headline">AI보다 먼저,<br>개발 환경이 문제였다</div>
  <div class="divider"></div>
  <div class="body">
    <p>많은 저장소, 제각각인 개발 환경, 느린 피드백 루프.</p>
    <p><span class="hlb">사람도 전체 맥락을 파악하기 어려운 환경</span>에서는 AI 에이전트도 제대로 일할 수 없습니다.</p>
    <p style="background:#fff;border-left:5px solid ${BRAND};border-radius:0 12px 12px 0;padding:18px 20px;margin-top:22px;font-weight:700;color:${BRAND_DK};">
      AI를 잘 쓰려면, 먼저 AI가 읽고·실행하고·검증할 수 있는 작업 환경이 필요하다.
    </p>
  </div>
  ${footer(4)}
</div>`));

// --- 05 모노레포 World ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">04</span> 코드를 한곳으로</div>
  <div class="headline">모노레포 <span style="color:${BRAND}">World</span>는<br>AI를 위한 '공간'이 됐다</div>
  <div class="divider"></div>
  <div class="body">
    <p>쇼피파이는 모든 제품과 시스템을 하나의 거대한 저장소 <span class="hl">World</span>로 모았습니다.</p>
    <p>물리적으로 한 서버에 넣었다기보다, 사람이든 AI든 <span class="hlb">같은 공간에서 회사 전체 코드를 탐색</span>하게 만든 것입니다.</p>
    <p>덕분에 River는 한 서비스에 갇히지 않고, 여러 영역을 넘나들며 원인을 추적합니다.</p>
  </div>
  ${riverWave(0.14, BRAND)}
  ${footer(5)}
</div>`));

// --- 06 지식도 코드 옆에 (AGENTS.md) ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">05</span> 코드 옆에 지식도</div>
  <div class="headline">머릿속 지식을<br>파일로 남기기 시작했다</div>
  <div class="divider"></div>
  <div class="body">
    <p>코드만 모은 게 아닙니다. <span class="hl">AGENTS.md</span>, <span class="hl">skill 파일</span>, 규칙 문서, 운영 가이드, 팀별 관례까지 코드베이스 안에 쌓았습니다.</p>
    <p><span class="hlb">"아는 사람만 아는 방식"</span>으로 남아 있던 해결법을 문서와 파일로 꺼낸 것입니다.</p>
    <p>이제 신규 입사자도, AI 에이전트도 <span class="hl">같은 지식을 읽고 출발</span>합니다.</p>
  </div>
  ${footer(6)}
</div>`));

// --- 07 개인 AI의 한계 ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">06</span> 개인 AI의 한계</div>
  <div class="headline">로컬 에이전트는<br>'개인'만 똑똑하게 만든다</div>
  <div class="divider"></div>
  <div class="body">
    <p>각자 노트북에서 AI를 쓰면 당장은 편합니다.</p>
    <p>하지만 그 안의 좋은 질문, 디버깅 과정, 해결법은 <span class="hlb">대부분 개인 세션 안에서 사라집니다.</span></p>
    <p>어제 누군가 어렵게 푼 문제를, 오늘 다른 사람이 <span class="hl">처음부터 다시 묻는</span> 일이 반복됩니다.</p>
  </div>
  ${footer(7)}
</div>`));

// --- 08 공개 Slack에서 일한다 ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">07</span> River는 공개석상에서 일한다</div>
  <div class="headline">AI 세션을<br>'팀의 작업 공간'으로</div>
  <div class="divider"></div>
  <div class="body">
    <p>직원은 Slack <span class="hl">공개 채널</span>에서 <span class="hl">@river</span>를 호출합니다. (DM은 쓰지 않습니다.)</p>
    <p>River는 코드를 읽고, 테스트하고, 로그를 보고, 필요하면 PR을 만듭니다.</p>
    <p style="background:#fff;border-left:5px solid ${ACCENT};border-radius:0 12px 12px 0;padding:18px 20px;margin-top:18px;font-weight:700;color:#15396b;">
      모든 과정이 <span style="color:${ACCENT}">공개 스레드</span>로 남아, 회사 안에서 검색 가능한 기록이 된다.
    </p>
  </div>
  ${footer(8)}
</div>`));

// --- 09 멀티플레이어 협업 ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">08</span> 여러 사람이 한 세션에</div>
  <div class="headline">AI와 사람의 협업이<br>같은 스레드에서 이어진다</div>
  <div class="divider"></div>
  <div class="body" style="font-size:21px;margin-top:18px;">
    <p>① 한 사람이 River에게 문제를 맡깁니다.</p>
    <p>② River가 조사하고 중간 결과를 공유합니다.</p>
    <p>③ 다른 사람이 들어와 <span class="hlb">"그 방향은 위험합니다", "이 조건도 봐야 합니다"</span>라고 알려줍니다.</p>
    <p>④ River는 새 맥락을 반영해 작업을 이어갑니다.</p>
    <p style="margin-top:8px;color:${BRAND_DK};font-weight:700;">→ 개인 채팅이 아니라, 여러 사람이 함께 고치는 작업 기록.</p>
  </div>
  ${footer(9)}
</div>`));

// --- 10 지식 증류 루프 ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">09</span> River가 똑똑해지는 방식</div>
  <div class="headline">모델 재학습이 아니라<br>'지식 증류 루프'</div>
  <div class="divider"></div>
  <div class="body" style="font-size:20px;line-height:1.55;margin-top:20px;">
    <p>한 번 좋은 답을 했다고 바로 시스템 지식이 되진 않습니다. 단일 세션의 발견은 <span class="hl">아직 검증되지 않은 후보</span>입니다.</p>
    <p>여러 세션에서 반복되고 <span class="hlb">테스트 통과·PR 머지 같은 결과</span>가 붙으면 신뢰도가 오릅니다.</p>
    <p>그때 <span class="hl">AGENTS.md 수정, skill 생성/업데이트, 프롬프트 개선</span>으로 이어집니다.</p>
    <p style="margin-top:6px;color:${BRAND_DK};font-weight:700;">→ 모델을 다시 학습시키지 않아도, 검증된 해결법이 시스템 지식으로 축적된다.</p>
  </div>
  ${footer(10)}
</div>`));

// --- 11 Aquifer (PPT형 구조도) ---
cards.push(wrap(`
<div class="card" style="background:${INK};color:#fff;">
  <div class="kicker" style="color:#7FB2FF;"><span class="chip" style="background:#7FB2FF;color:${INK};">10</span> River 아래의 플랫폼</div>
  <div class="headline" style="color:#fff;font-size:42px;">보이는 건 River,<br>받치는 건 <span style="color:#7FB2FF;">Aquifer</span></div>
  <div style="margin-top:34px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#A7E07A;color:${INK};border-radius:14px;padding:18px 22px;font-weight:900;font-size:24px;display:flex;align-items:center;gap:12px;">
      🌊 River <span style="font-weight:500;font-size:18px;opacity:.8;">— Slack에서 보이는 에이전트</span>
    </div>
    <div style="text-align:center;color:#6E8378;font-size:22px;">▲ 떠받친다</div>
    <div style="background:rgba(127,178,255,.14);border:1px solid rgba(127,178,255,.4);border-radius:14px;padding:20px 22px;">
      <div style="font-weight:900;font-size:22px;color:#7FB2FF;margin-bottom:12px;">Aquifer — 내부 플랫폼</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:16px;">
        <span style="background:rgba(255,255,255,.08);padding:7px 13px;border-radius:8px;">세션</span>
        <span style="background:rgba(255,255,255,.08);padding:7px 13px;border-radius:8px;">실행 루프</span>
        <span style="background:rgba(255,255,255,.08);padding:7px 13px;border-radius:8px;">샌드박스</span>
        <span style="background:rgba(255,255,255,.08);padding:7px 13px;border-radius:8px;">인증 프록시</span>
        <span style="background:rgba(255,255,255,.08);padding:7px 13px;border-radius:8px;">이벤트 로그</span>
        <span style="background:rgba(255,255,255,.08);padding:7px 13px;border-radius:8px;">관측성 파이프라인</span>
      </div>
    </div>
  </div>
  <div style="font-size:18px;color:#9FB0A4;margin-top:24px;">쇼피파이가 만든 건 에이전트 하나가 아니라, <span style="color:#fff;font-weight:700;">여러 에이전트를 계속 운영하는 기반</span>입니다.</div>
  ${footer(11)}
</div>`));

// --- 12 세션은 살아남아야 한다 ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">11</span> 가장 중요한 원칙</div>
  <div class="headline">세션은 반드시<br>살아남아야 한다</div>
  <div class="divider"></div>
  <div class="body" style="font-size:21px;">
    <p style="color:${SUB};">에이전트 프로세스는 죽을 수 있고, 샌드박스는 새로 만들어질 수 있고, 실행 서버도 바뀔 수 있습니다.</p>
    <p style="background:#fff;border-radius:14px;padding:20px 22px;font-weight:700;color:${INK};border:2px solid ${BRAND};">
      하지만 <span class="hl">대화 기록 · 도구 실행 기록 · 판단 흐름</span>은<br>사라지면 안 됩니다.
      <span style="display:block;font-weight:500;color:${SUB};font-size:18px;margin-top:10px;">(쇼피파이는 세션을 Postgres 기반 append-only 이벤트 로그로 보존합니다.)</span>
    </p>
    <p style="margin-top:8px;">그래야 다음 작업자가 들어와도, 에이전트가 다시 시작돼도 <span class="hlb">같은 맥락에서 이어갈 수 있습니다.</span></p>
  </div>
  ${footer(12)}
</div>`));

// --- 13 Brain & Hands 분리 ---
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">12</span> 생각하는 곳 ≠ 실행하는 곳</div>
  <div class="headline">Brain과 Hands를<br>분리했다</div>
  <div style="display:flex;gap:18px;margin-top:26px;">
    <div style="flex:1;background:#fff;border-radius:16px;padding:22px;border-top:6px solid ${BRAND};">
      <div style="font-size:34px;">🧠</div>
      <div style="font-size:22px;font-weight:900;color:${BRAND_DK};margin-top:8px;">Harness</div>
      <div style="font-size:17px;color:${SUB};margin-top:8px;line-height:1.5;">대화를 읽고 모델을 호출해 <b style="color:${INK}">다음 행동을 결정</b></div>
    </div>
    <div style="flex:1;background:#fff;border-radius:16px;padding:22px;border-top:6px solid ${ACCENT};">
      <div style="font-size:34px;">🤚</div>
      <div style="font-size:22px;font-weight:900;color:#15396b;margin-top:8px;">Sandbox</div>
      <div style="font-size:17px;color:${SUB};margin-top:8px;line-height:1.5;">실제 코드를 수정하고 <b style="color:${INK}">명령어를 실행</b></div>
    </div>
  </div>
  <div class="body" style="margin-top:24px;font-size:20px;">
    <p>판단 루프와 실행 환경을 나누니 <span class="hlb">더 안전하고, 모델·런타임 교체가 쉽고, 판단 과정을 추적</span>할 수 있게 됐습니다.</p>
  </div>
  ${footer(13)}
</div>`));

// --- 14 쇼피파이가 제안한 3가지 원칙 ---
cards.push(wrap(`
<div class="card" style="background:linear-gradient(165deg,${BRAND_DK},#23411A);color:#fff;">
  <div class="kicker" style="color:#A7E07A;"><span class="chip" style="background:#A7E07A;color:${INK};">13</span> 이 설계에서 우리가 배울 것</div>
  <div class="headline" style="color:#fff;font-size:38px;">쇼피파이의 설계는<br>우리에게 무엇을 알려주나</div>
  <div style="margin-top:26px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:rgba(255,255,255,.08);border-left:5px solid #A7E07A;border-radius:0 12px 12px 0;padding:16px 20px;">
      <div style="font-size:21px;font-weight:900;color:#A7E07A;">① 두뇌와 손은 나눠야 한다</div>
      <div style="font-size:18px;color:#E6EFDD;margin-top:6px;line-height:1.45;">판단(Harness)을 실행(Sandbox) 밖에 두면, 안전성과 추적성이 '덤'이 아니라 기본이 됩니다.</div>
    </div>
    <div style="background:rgba(255,255,255,.08);border-left:5px solid #7FB2FF;border-radius:0 12px 12px 0;padding:16px 20px;">
      <div style="font-size:21px;font-weight:900;color:#7FB2FF;">② AI는 '여럿이 함께' 쓸 때 강해진다</div>
      <div style="font-size:18px;color:#E6EFDD;margin-top:6px;line-height:1.45;">개인용 에이전트의 천장은 키보드 앞 한 사람. 공개 세션은 그 뒤의 모든 사람을 가르칩니다.</div>
    </div>
    <div style="background:rgba(255,255,255,.08);border-left:5px solid #F4C95D;border-radius:0 12px 12px 0;padding:16px 20px;">
      <div style="font-size:21px;font-weight:900;color:#F4C95D;">③ 다음 에이전트는 '플랫폼'이 아닌 '프로필'</div>
      <div style="font-size:18px;color:#E6EFDD;margin-top:6px;line-height:1.45;">새 에이전트마다 새 플랫폼이 필요하다면, 아직 기반이 무르익지 않은 것입니다.</div>
    </div>
  </div>
  ${footer(14)}
</div>`));

// --- 15 마무리 + 원문 링크 ---
cards.push(wrap(`
<div class="card" style="padding:0;background:linear-gradient(160deg,#16301B 0%, #1E3D17 50%, #2C4F1C 100%);color:#fff;justify-content:center;">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.5" viewBox="0 0 800 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-50,540 C180,460 300,660 480,560 C640,472 740,610 880,540 L880,860 L-50,860 Z" fill="${ACCENT}" opacity="0.32"/>
    <path d="M-50,600 C200,520 300,720 500,620 C660,545 760,680 880,600 L880,860 L-50,860 Z" fill="#0B1F3A" opacity="0.5"/>
  </svg>
  <div style="position:relative;padding:0 64px;">
    <div style="display:inline-flex;align-items:center;gap:10px;font-size:17px;font-weight:700;letter-spacing:1px;color:#A7E07A;">
      <span style="width:9px;height:9px;background:#A7E07A;border-radius:50%;display:inline-block;"></span> 마치며
    </div>
    <div style="font-size:38px;font-weight:900;line-height:1.25;letter-spacing:-1px;margin-top:22px;">
      AI를 잘 쓰는 회사는<br><span style="color:#A7E07A;">기록을 잘 남깁니다</span>
    </div>
    <div style="font-size:20px;font-weight:400;line-height:1.6;color:#E6EFDD;margin-top:20px;">
      핵심은 '좋은 프롬프트'가 아니라, AI가 일할 수 있는 코드베이스를 만들고
      AI·사람이 함께 남긴 해결 과정을 <b style="color:#fff;">조직의 지식으로 바꾸는 것</b>입니다.
    </div>
    <div style="margin-top:34px;background:rgba(255,255,255,.1);border:1px solid rgba(167,224,122,.35);border-radius:16px;padding:22px 24px;">
      <div style="font-size:15px;color:#A9C496;font-weight:700;letter-spacing:.5px;">📄 원문에서 더 자세히</div>
      <div style="font-size:19px;font-weight:700;color:#fff;margin-top:8px;">Shopify Engineering — "Under the River"</div>
      <div style="font-size:18px;color:#9BD66E;margin-top:8px;word-break:break-all;font-family:monospace;">shopify.engineering/under-the-river</div>
    </div>
  </div>
  <div style="position:absolute;bottom:34px;left:64px;right:64px;display:flex;justify-content:space-between;font-size:15px;color:#A9C496;font-weight:500;">
    <span>원문 분석 · 카드뉴스</span><span class="pageno" style="color:#A7E07A;">15 / 15</span>
  </div>
</div>`));

// 파일로 저장
cards.forEach((html, i) => {
  const name = `card_${String(i+1).padStart(2,'0')}.html`;
  fs.writeFileSync(path.join(OUT_HTML, name), html, 'utf8');
});
console.log(`생성 완료: ${cards.length}장`);
