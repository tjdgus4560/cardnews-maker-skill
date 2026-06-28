# 카드 변형 패턴 (Card Patterns)

`build.js`의 헬퍼(`wrap`, `footer`, `riverWave`)와 baseCSS를 전제로 한, 복붙용
카드 변형들입니다. 색상 변수(`${BRAND}` 등)는 build.js 상단 THEME를 그대로 씁니다.
`footer(no)`의 두 번째 인자 total은 `function footer(no, total=15)`처럼 전체 장수에
맞춰 한 번만 바꾸면 전 카드에 반영됩니다.

## 목차
1. 표지 (다크 그라데이션 + 웨이브)
2. 표준 본문 카드
3. 포인트 박스 본문 카드
4. 스탯 카드 (다크, 큰 숫자)
5. 구조도 카드 (레이어/스택)
6. 2단 비교 카드
7. 체크리스트/원칙 카드
8. 마무리 카드 (+ 출처 링크)

---

## 1. 표지
```js
cards.push(wrap(`
<div class="card" style="padding:0;background:linear-gradient(160deg,${BRAND_DK} 0%, #2C4F1C 55%, #18301B 100%);color:#fff;justify-content:center;">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.55" viewBox="0 0 800 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-50,520 C180,440 280,640 460,540 C620,452 720,600 880,520 L880,860 L-50,860 Z" fill="${ACCENT}" opacity="0.35"/>
    <path d="M-50,640 C200,560 300,740 500,650 C660,575 760,690 880,640 L880,860 L-50,860 Z" fill="#0B1F3A" opacity="0.55"/>
  </svg>
  <div style="position:relative;padding:0 64px;">
    <div style="display:inline-flex;align-items:center;gap:10px;font-size:18px;font-weight:700;letter-spacing:1px;color:#CFE3BE;">
      <span style="width:10px;height:10px;background:#9BD66E;border-radius:50%;"></span> KICKER · 분류
    </div>
    <div style="font-size:56px;font-weight:900;line-height:1.18;letter-spacing:-2px;margin-top:26px;">
      메인 타이틀<br><span style="color:#A7E07A;">강조어</span>는 어떻게<br>이어지나
    </div>
    <div style="width:70px;height:6px;background:#A7E07A;border-radius:4px;margin:30px 0 24px;"></div>
    <div style="font-size:24px;font-weight:500;line-height:1.5;color:#E6EFDD;">부제 한두 줄</div>
  </div>
  <div style="position:absolute;bottom:36px;left:64px;right:64px;display:flex;justify-content:space-between;font-size:15px;color:#A9C496;font-weight:500;">
    <span>분석 · 카드뉴스</span><span>출처명</span>
  </div>
</div>`));
```
- 헤드라인 56~60px. 핵심어 1개만 밝은 틴트로.
- 표지엔 페이지 번호를 넣지 않음(자체 푸터 사용).

## 2. 표준 본문 카드
```js
cards.push(wrap(`
<div class="card">
  <div class="kicker"><span class="chip">01</span> 카드 라벨</div>
  <div class="headline">핵심 메시지<br>한 문장</div>
  <div class="divider"></div>
  <div class="body">
    <p>도입 문장.</p>
    <p>핵심을 <span class="hlb">형광펜으로 한 번</span>, 키워드는 <span class="hl">메인색 강조</span>.</p>
    <p>마무리 문장.</p>
  </div>
  ${footer(2)}
</div>`));
```
하단 웨이브 장식을 넣고 싶으면 `${footer(2)}` 앞에 `${riverWave()}` 추가(색은
`riverWave(0.14, BRAND)`처럼 조절).

## 3. 포인트 박스 본문 카드
결론 한 줄을 박스로 강조. `${BRAND}` 대신 `${ACCENT}`로 바꾸면 두 번째 톤.
```js
  <div class="body">
    <p>맥락 문장.</p>
    <p style="background:#fff;border-left:5px solid ${BRAND};border-radius:0 12px 12px 0;
       padding:18px 20px;margin-top:18px;font-weight:700;color:${BRAND_DK};">
      강조할 결론 문장.
    </p>
  </div>
```

## 4. 스탯 카드 (다크 · 큰 숫자)
규모/임팩트를 숫자로. 2~3개 박스.
```js
cards.push(wrap(`
<div class="card" style="background:${INK};color:#fff;">
  <div class="kicker" style="color:#A7E07A;"><span class="chip" style="background:#A7E07A;color:${INK};">02</span> 숫자로 보기</div>
  <div class="headline" style="color:#fff;">한 줄 요지</div>
  <div style="display:flex;gap:24px;margin-top:auto;margin-bottom:30px;">
    <div style="flex:1;background:rgba(167,224,122,.12);border:1px solid rgba(167,224,122,.3);border-radius:18px;padding:26px 22px;">
      <div style="font-size:62px;font-weight:900;color:#A7E07A;line-height:1;">1/8</div>
      <div style="font-size:18px;color:#D6E5C8;margin-top:12px;line-height:1.4;">설명</div>
    </div>
    <div style="flex:1;background:rgba(31,111,235,.14);border:1px solid rgba(110,170,255,.35);border-radius:18px;padding:26px 22px;">
      <div style="font-size:62px;font-weight:900;color:#7FB2FF;line-height:1;">59,918</div>
      <div style="font-size:18px;color:#CFE0F5;margin-top:12px;line-height:1.4;">설명</div>
    </div>
  </div>
  <div style="font-size:19px;color:#9FB0A4;border-top:1px solid rgba(255,255,255,.1);padding-top:18px;">맺음 한 줄</div>
  ${footer(3)}
</div>`));
```

## 5. 구조도 카드 (레이어/스택)
"보이는 것 위 / 받치는 것 아래" 같은 적층 관계.
```js
  <div style="margin-top:34px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:#A7E07A;color:${INK};border-radius:14px;padding:18px 22px;font-weight:900;font-size:24px;">상위 레이어</div>
    <div style="text-align:center;color:#6E8378;font-size:22px;">▲ 떠받친다</div>
    <div style="background:rgba(127,178,255,.14);border:1px solid rgba(127,178,255,.4);border-radius:14px;padding:20px 22px;">
      <div style="font-weight:900;font-size:22px;color:#7FB2FF;margin-bottom:12px;">하위 플랫폼</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:16px;">
        <span style="background:rgba(255,255,255,.08);padding:7px 13px;border-radius:8px;">구성요소</span>
        <!-- 반복 -->
      </div>
    </div>
  </div>
```

## 6. 2단 비교 카드
대비되는 두 개념(메인 보더 vs ACCENT 보더).
```js
  <div style="display:flex;gap:18px;margin-top:26px;">
    <div style="flex:1;background:#fff;border-radius:16px;padding:22px;border-top:6px solid ${BRAND};">
      <div style="font-size:34px;">🧠</div>
      <div style="font-size:22px;font-weight:900;color:${BRAND_DK};margin-top:8px;">개념 A</div>
      <div style="font-size:17px;color:${SUB};margin-top:8px;line-height:1.5;">설명</div>
    </div>
    <div style="flex:1;background:#fff;border-radius:16px;padding:22px;border-top:6px solid ${ACCENT};">
      <div style="font-size:34px;">🤚</div>
      <div style="font-size:22px;font-weight:900;color:#15396b;margin-top:8px;">개념 B</div>
      <div style="font-size:17px;color:${SUB};margin-top:8px;line-height:1.5;">설명</div>
    </div>
  </div>
```

## 7. 체크리스트/원칙 카드 (다크)
항목을 색 보더 박스로 나열. 명령조보다 시사점 톤("~해야 한다", "~할 때 강해진다").
```js
  <div style="margin-top:26px;display:flex;flex-direction:column;gap:14px;">
    <div style="background:rgba(255,255,255,.08);border-left:5px solid #A7E07A;border-radius:0 12px 12px 0;padding:16px 20px;">
      <div style="font-size:21px;font-weight:900;color:#A7E07A;">① 원칙 제목</div>
      <div style="font-size:18px;color:#E6EFDD;margin-top:6px;line-height:1.45;">설명</div>
    </div>
    <!-- ② ③ 색만 바꿔 반복: #7FB2FF, #F4C95D -->
  </div>
```

## 8. 마무리 카드 (+ 출처 링크)
표지와 수미상관. 출처/링크를 강조 박스에.
```js
cards.push(wrap(`
<div class="card" style="padding:0;background:linear-gradient(160deg,#16301B 0%, #1E3D17 50%, #2C4F1C 100%);color:#fff;justify-content:center;">
  <div style="position:relative;padding:0 64px;">
    <div style="font-size:17px;font-weight:700;letter-spacing:1px;color:#A7E07A;">● 마치며</div>
    <div style="font-size:38px;font-weight:900;line-height:1.25;margin-top:22px;">맺음 메시지<br><span style="color:#A7E07A;">한 줄</span></div>
    <div style="font-size:20px;line-height:1.6;color:#E6EFDD;margin-top:20px;">요약 문단</div>
    <div style="margin-top:34px;background:rgba(255,255,255,.1);border:1px solid rgba(167,224,122,.35);border-radius:16px;padding:22px 24px;">
      <div style="font-size:15px;color:#A9C496;font-weight:700;">📄 원문에서 더 자세히</div>
      <div style="font-size:19px;font-weight:700;color:#fff;margin-top:8px;">출처명 — "제목"</div>
      <div style="font-size:18px;color:#9BD66E;margin-top:8px;font-family:monospace;word-break:break-all;">example.com/article</div>
    </div>
  </div>
  <div style="position:absolute;bottom:34px;left:64px;right:64px;display:flex;justify-content:space-between;font-size:15px;color:#A9C496;">
    <span>분석 · 카드뉴스</span><span style="color:#A7E07A;font-weight:700;">15 / 15</span>
  </div>
</div>`));
```

---
**틴트 색 메모**: 다크 카드의 밝은 강조(`#A7E07A` 라임, `#7FB2FF` 블루, `#F4C95D`
골드)는 예시(그린 테마)용입니다. 다른 테마에선 BRAND/ACCENT를 밝게 한 틴트로 바꾸세요.
