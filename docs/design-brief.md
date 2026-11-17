# 디자인 브리프 — 세이지 차콜 문서 (시안 B)

작성 2026-11-17. 모든 저장소를 읽기만 했다. 색·수치는 아래 「출처」 파일에서 그대로 옮겼다.

> **이 문서의 위치.** 포트폴리오 사이트를 시안 B로 바꿀 때(2026-11-17 채택) 쓴 디자인 브리프를 옮겨 둔 것이다.
> 색 토큰·타이포·모티프·하지 말 것(2~6장, 7-8)은 지금 사이트의 근거다.
> 7장의 일부 제안은 슬롭 검토 뒤 구현에서 뺐다 — 대문자 캡션(`FEATURED`·`WORK`)과 회사 묶음 라벨의 대문자(회사 이름 표기를 지킨다),
> 줄마다 붙는 `팀` 알약, 사용률 바 모양의 막대, 소개의 라벨/값 표 등. 좁은 화면 머리 띠에는 A처럼 늘 보이는 `이력서` 링크를 더했다.
> 지금 화면의 규칙은 저장소 루트 `AGENTS.md`의 「디자인 규칙」이 우선하고, 실제 값은 `style.css`가 정본이다.

## 0. 한 줄 요약

김찬영의 소프트웨어는 **세이지 차콜**(흰 바탕·차콜 글자·세이지 초록 강조) 한 벌을 Frond·VS Code 테마·README 배지·cyKimScroller 샘플에서 같이 쓴다.
모양은 **왼쪽 목차 + 가운데 읽기 판 + 얇은 상태 줄**, 그리고 위젯의 **대문자 캡션 + 카드 행 + 펼치면 나오는 라벨/값 표**다.
문구는 **짧은 사실 문장 + 가운뎃점(·) 구분**이다. 시안 B는 이 세 가지를 포트폴리오 문서 구조로 옮긴다. 가짜 창이나 가짜 앱을 만들지 않는다.

## 1. 출처 (본 것)

| 저장소 | 본 파일 |
|---|---|
| Frond | `src/style.css`(셸 토큰·탭·목차·상태바), `src/theme/palette.ts`(세이지 차콜 원본 팔레트), `src/theme/tokens.css`·`fonts.css`·`ko.css`·`base.css`, `README.md`, `CHANGELOG.md`, `docs/site/images/*.png`, `docs/screenshots/*.png` |
| sage-charcoal-theme | `build.mjs`의 `BASE`(라이트·다크 전체 팔레트), `README.md`, `app-icon/preview.png` |
| unity-slot-widget | `src/styles.css`(맨 위 주석이 위젯 계열 디자인 규칙을 요약), `docs/assets/widget-{en,ko,light,details}.png`, `README.md` |
| claude·cursor·gpt·flex·DuckDNS·repo-multi-check 위젯 | 각 `src/styles.css` 토큰, `docs/**/widget*.png`, README 첫머리 |
| cyKimScroller-public | `README.md`, `SUMMARY.md`, `docs/images/overview.png`, `.gitbook/assets/cover-*.png` |
| rag | `knowledge/inbox/2026-11-17-github-profile-readme-drafts.md`, 같은 폴더 `README.{A,B}.md`·`mockups/profile-B-light.png`·`assets/unity-slot.png` |
| 포트폴리오(시안 A) | `index.html`, `style.css` 토큰, `data/projects.js` |

## 2. 색 토큰

### 2-1. 세이지 차콜 — 주 팔레트 (B는 이것만 쓴다)

정본은 `sage-charcoal-theme/build.mjs` `BASE`와 `Frond/src/style.css` `:root`. 두 곳 값이 같다. Frond는 `themes.test.ts`로 CSS 값과 JS 테마 값이 같도록 지킨다.

| 역할 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| `--bg` 본문 바탕 | `#fcfdfc` | `#1b2221` | 읽기 판 |
| `--surface` 보조 면 (Frond `--sidebar-bg`) | `#f0f3f0` | `#262e2c` | 목차 열·상태바·코드 블록 |
| `--fg` 글자 | `#2c3333` | `#e4eae4` | 본문 |
| `--muted` 흐린 글자 | `#515b56` | `#949a96` | 메타·캡션·상태바 |
| `--line` 경계선 | `#dae1da` | `#474e4c` | 제목 밑줄·행 구분 (장식용, 대비 낮음) |
| `--accent` 강조 | `#567e65` | `#96bea1` | 링크·현재 목차·포커스 링·채움 |
| `--on-accent` 강조 위 글자 | `#ffffff` | `#1b2221` | 강조 바탕 버튼 |
| `--danger` | `#cf222e` | `#f85149` (테마는 `#f4736b`) | B에서는 거의 안 씀 |

테마 쪽 보조 색(문법 색, 필요할 때만): 라이트 string `#6f7675`·constant `#637a6d`·entity `#585f5e`·warning `#8c630e`·blue `#3f6d87`, 다크 string `#89948d`·constant `#90a997`·entity `#a9b2ab`·warning `#d6a756`·blue `#8cb3cc`.

원본 팔레트(`Frond/src/theme/palette.ts` `SAGE_CHARCOAL`, media.io 「미니멀 화이트 세이지 차콜」): `#ffffff` `#a6b8a6` `#2f3235` `#e6e2dc` `#6b6f74`. 위 토큰은 이 다섯 색을 섞어 WCAG 대비(본문 7:1, 흐린 글자·강조 4.5:1)를 맞춘 결과다.

### 2-2. 섞어 만드는 색 (Frond 공식 그대로, 계산한 hex 병기)

| 토큰 | 공식 | 라이트 | 다크 |
|---|---|---|---|
| `--hover` | `color-mix(in srgb, var(--fg) 7%, transparent)` | bg 위 ≈ `#edefee` | ≈ `#29302f` |
| `--pressed` | fg 12% | | |
| 목차 hover | `color-mix(in srgb, var(--accent) 12%, transparent)` | surface 위 ≈ `#dee5df` | ≈ `#333f3a` |
| `--tab-bg` 안 고른 탭 | 라이트 `color-mix(var(--line), var(--sidebar-bg) 35%)` / 다크 `color-mix(var(--bg), #000 32%)` | `#e2e7e2` | `#121716` |
| `--tab-line` | `color-mix(var(--line), var(--fg) 18%)` | `#bbc2bc` | `#636a67` |
| 카드 행 면 (위젯 `--surface` 대응) | fg 4%~4.5% | ≈ `#f4f5f4` | ≈ `#242b2a` |
| 인라인 코드 바탕 | fg 8% / 16% | ≈ `#ebedec` | ≈ `#3b4240` |
| 선택 영역 | accent 24% / 36% | `rgba(86,126,101,.24)` | `rgba(150,190,161,.36)` |

### 2-3. README 배지 문법 (모든 공개 저장소 공통)

shields.io 배지 색이 역할별로 고정돼 있다 (Frond·unity-slot·unity-slot-widget·cyKimScroller·위젯 5종 README).

| 색 | 의미 | 예 |
|---|---|---|
| `#567e65` (accent) | 라이선스·버전 | `license-MIT`, `version` |
| `#3f6150` (짙은 세이지) | 환경·스택·데이터 출처 | `Windows-10 · 11`, `Tauri-2`, `Unity-6000.0+`, `data-Cursor` |
| `#96bea1` (다크 accent) | 상태·모드 | `mode-view`, `stage-V2 in progress`, `MCP-stdio`, `openupm` |

대비: 흰 글자/`#567e65` 4.60, 흰 글자/`#3f6150` 6.91, `#1b2221`/`#96bea1` 7.84. 예외 하나: Perplexity-MCP만 `#20808d`(제품 색).

### 2-4. 위젯 계열 팔레트 (참고만, B 주 팔레트로 쓰지 않음)

Tauri 위젯은 세이지가 아니라 **그래파이트 카드 + 파랑 채움**이다 (`unity-slot-widget/src/styles.css` 주석이 규칙을 적어 둠).
다크 카드 `rgba(22,24,28,.92)`, 글자 `#e8eaed`, 흐림 `#9aa0a6`, 테두리 `rgba(255,255,255,.08)`, 채움 파랑 `#5b9fd4`, 주의 `#e0a95b`, 위험 `#e0524a`(채움)·`#f87171`(글자), 정상 `#7dd3a0`, 정보 글자 `#9fd0ff`.
라이트(시스템 라이트일 때): 카드 `rgba(248,250,252,.95)`, 글자 `#0f172a`, 흐림 `#485262`, 강조 `#2b6496`. Flex Work만 청록(`#0d9488`/`#2dd4bf`).
B에 가져올 것은 색이 아니라 **규칙**이다: 숫자는 바탕 없이 색 글자로, 경고만 옅은 색 상자, 사용률 바는 8px 둥근 트랙.

### 2-5. 대비 확인 (계산값)

| 조합 | 대비 | 판정 |
|---|---|---|
| fg/bg 라이트 | 12.65 | 본문 OK |
| muted/surface 라이트 | 6.30 | OK |
| accent `#567e65`/bg | 4.51 | 작은 글자 간신히 OK |
| **accent `#567e65`/surface `#f0f3f0`** | **4.11** | **작은 글자 미달.** Frond 목차의 현재 항목이 이 조합이다. B에서는 surface 위 강조 **글자**에 `--accent-text: #3f6150`(6.18)을 쓴다. 채움·포커스 링은 `#567e65` 유지 |
| muted/surface 다크 | 4.85 | OK |
| accent/surface 다크 | 6.74 | OK |
| line/bg | 1.31 (라이트), 1.90 (다크) | 장식 구분선 전용. 입력 칸·버튼 테두리로 쓰지 않는다 |

### 2-6. 라이트·다크 셀렉터 계약 (Frond `style.css`와 같게)

```css
:root { /* 라이트 기본 */ color-scheme: light; --bg:#fcfdfc; --surface:#f0f3f0; --fg:#2c3333; --muted:#515b56;
  --line:#dae1da; --accent:#567e65; --accent-text:#3f6150; --on-accent:#ffffff; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { color-scheme: dark; --bg:#1b2221; --surface:#262e2c; --fg:#e4eae4;
    --muted:#949a96; --line:#474e4c; --accent:#96bea1; --accent-text:#96bea1; --on-accent:#1b2221; }
}
:root[data-theme="dark"] { /* 위 다크 블록과 같은 값 */ }
body { background: var(--bg); color: var(--fg); }
```

## 3. 타이포그래피

- **본문·UI**: `"Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", system-ui, -apple-system, "Segoe UI", sans-serif` (Frond `tokens.css --font-body`·`style.css --font-ui`). Frond는 Pretendard를 번들하지 않고 설치돼 있으면 쓴다. 웹에서는 시안 A가 이미 쓰는 `pretendard@1.3.9` variable dynamic-subset(jsDelivr)을 그대로 쓴다.
- **코드·숫자·브랜치**: `"D2Coding", "Cascadia Code", Consolas, "Courier New", monospace, "Malgun Gothic"`. Malgun Gothic은 **반드시 monospace 뒤**(앞에 두면 ASCII 칸 폭이 벌어진다, Frond `tokens.css` 주석). 위젯은 브랜치·경로에 `"Cascadia Code", Consolas, monospace`.
  - 웹 폰트: Frond 번들 `D2Coding.woff2`는 1.49 MB(한글 전체)라 포트폴리오에 싣지 않는다. `@font-face { src: local("D2Coding"); }`만 두고 없으면 Cascadia/Consolas로 떨어지게 한다. 싣고 싶으면 Latin·숫자만 남긴 부분 집합을 만들어 크기를 실측하고 `D2Coding-OFL.txt`(OFL 1.1)를 같이 둔다.
  - mono는 짧은 ASCII에만: 기간 `2024.02 ~ 2024.11`, 앵커 `#tutorial`, 플랫폼 약어. 한글 문장에는 쓰지 않는다.
- **디스플레이 폰트 없음.** 시안 A의 Syne는 B에서 뺀다. 제목은 Pretendard 600~700.
- **크기** (Frond): 본문 16px / 1.6, 본문 최대 폭 860px, 좌우 여백 `clamp(16px, 5vw, 40px)`, 위 32px·아래 80px. 제목 배율은 GitHub 그대로 h1 2em·h2 1.5em·h3 1.25em, h1·h2는 아래 1px 선. UI 글자: 목차 13px, 탭 12px, 상태바 12px.
  위젯 캡션: 제목 11px 600 대문자 `letter-spacing .02em`, 구획 라벨 10px 600 대문자 `.06em`, 플랫폼 태그 9.5px 700 `.06em`. 웹에서는 최소 11px로 올린다.
- **한국어 줄바꿈** (Frond `ko.css`, `:lang(ko)`에만):
  - 본문 `word-break: keep-all; overflow-wrap: break-word; line-break: auto;` — 단어 중간에서 끊지 않는다
  - 표 칸 `overflow-wrap: anywhere` (긴 토큰이 표를 밀지 않게), 코드 블록 `word-break: normal`(블록 안 가로 스크롤), 인라인 코드 `word-break: normal`
  - 자동 링크 `a[href^="http"] { overflow-wrap: anywhere; }` — 좁은 창에서 가로 스크롤 방지
  - 문단 `text-wrap: pretty`, h1~h3 `text-wrap: balance`
  - 시안 A의 `.nw`(white-space: nowrap 묶음)는 짧은 구절에만 유지

## 4. 반복 모티프

### 4-1. 레이아웃

1. **문서 창 = 왼쪽 목차 + 가운데 읽기 판** (Frond, ref 01·02). 목차 열 248~260px, 보조 면 바탕, 13px, 들여쓰기 레벨마다 12px(18/30/42/54px), 현재 제목은 강조색 600. 읽기 판은 860px 가운데.
2. **열마다 머리 띠가 창 맨 위까지** (Frond 경계 없는 제목 표시줄 36px). 위에 따로 떨어진 띠가 없다. 각 열이 제 바탕색으로 맨 위까지 올라간다.
3. **면으로만 나눈다** (sage-charcoal-theme README). 경계선 대신 bg/surface 차이로 영역을 나눈다. Frond는 목차 오른쪽·상태바 위에만 1px 선.
4. **상태바 24px** (Frond): 왼쪽 경로, 오른쪽 `235단어 · 보기 · UTF-8 · LF · 100%`. 12px 흐린 글자, 누를 수 있는 항목은 흐린 색 그대로 두고 올리면 밑줄.
5. **탭** (Frond): 갈피처럼 위만 둥근 `7px 7px 0 0`, 안 고른 탭은 본문보다 어두운 `--tab-bg`, 고른 탭은 본문 바탕과 이어진다. 12px, 끌면 160ms로 미끄러짐.
6. **위젯 카드** (ref 03·04): 12px squircle 카드, 맨 위 대문자 제목 + 오른쪽 요약 수치(`5/6 open · Commit 81%`), 대문자 구획 라벨 + 오른쪽 개수(`MYGAME 3/5`) + 그 아래 1px 선, 카드 행 2줄(1줄: 상태 점·이름·플랫폼 태그·흐린 메타, 오른쪽 수치 / 2줄: mono 브랜치 · 상태 · 시간). 맨 아래 흐린 갱신 줄.
7. **펼친 행 = 라벨/값 표** (unity-slot-widget `widget-details.png`): 행 안에 한 단계 다른 면, 왼쪽 흐린 라벨 열(Path·Unity·Ready·Memory·Lease·git), 오른쪽 값. 포트폴리오 상세 패널에 그대로 맞는 모양.
8. **사용률 바**: 8px 높이, `border-radius: 999px`, 트랙은 옅은 면, 채움 너비 0.35s. 70%↑ 주황, 90%↑ 빨강 (claude-usage-widget).
9. **알약(pill)**: `border-radius: 999px`, 10~11px 700, 옅은 색 바탕 + 같은 계열 글자 (repo-multi-check `● 2`, `↓ 4`).
10. **캡션 문법** (cyKimScroller 샘플, ref 05): `VERTICAL LIST · 500 items, variable heights` — 대문자 라벨 · 사실 설명.

### 4-2. 상호작용

- hover 면 = fg 7%, 누름 = fg 12%. 목차 hover만 accent 12%.
- 포커스: `outline: 2px solid var(--accent)`, 버튼·탭·행은 `outline-offset: -2px`(안쪽), 인라인 링크는 `2px`(바깥) + `border-radius: 2px`.
- 아이콘 버튼 28px 정사각, radius 6px(작은 것 22px·4px), 아이콘 16px 선 아이콘 `stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; fill: none`(Lucide 결). 아이콘은 기능 버튼에만, 상표 로고는 아이콘 테마에서도 일부러 뺐다.
- 움직임: 패널 `240ms cubic-bezier(0.2, 0, 0, 1)`, hover 색 0.15s, 테마 전환은 View Transition 크로스페이드 250ms. `prefers-reduced-motion: reduce`면 0ms.
- radius 표: 아이콘 버튼 6, 목차 항목 4, 탭 7 7 0 0, 팝업 10, 위젯 카드 12(squircle), 배지 3(shields), 알약 999.
- 그림자는 거의 없다. 끄는 탭(`0 2px 10px rgb(0 0 0 / .18)`)·떠 있는 위젯 창에만.

## 5. 문구 톤

- 존댓말 평서문 `~합니다/~입니다`, 짧게. 형용사·감탄 없이 **무엇을 · 어떻게**만. 예: 「Markdown 파일을 보고 편집하는 개인용 Windows 데스크톱 앱입니다.」 「바 한 줄이 한도 하나입니다.」
- **안 하는 것을 적는다**: 「위젯은 슬롯을 닫거나 임대하지 않습니다.」 포트폴리오의 「순위·수상·리텐션은 팀 성과입니다」와 같은 결.
- 수치에 단위·조건을 붙인다: 「약 5 MB」, 「0.1초 안팎」, 「70%부터 주황, 90%부터 빨강」.
- 구분은 가운뎃점 `·`, 설명은 줄표 `—` (「Frond 기본 화면 — 왼쪽 목차, 오른쪽 본문」), 기능 목록은 `**이름** — 설명`.
- UI 이름은 굵게(**Unity로 열기**), 변경 기록은 **새 기능 / 개선 / 고침** 세 칸.
- 이미지 대체 텍스트는 화면을 문장으로 묘사한다(unity-slot-widget README의 `alt`).
- 영어 섞기는 고유명사·API·약어만. 한국어 문장에 영어 라벨을 섞을 때는 Latin 캡션(`FEATURED`)과 한국어 제목(`대표 작업`)을 나눈다.

## 6. 본인이 「슬롭」으로 반려한 것 (rag 노트 2026-11-17)

GitHub 프로필 1차 시안이 반려된 이유 — 다시 하지 않는다.

- Rust/Tauri·TypeScript·Agents **배지 줄**, **이모지 섹션 제목**(🎮 🤖 🖥️ 📈)
- **가짜 상태 카드**가 들어간 SVG 배너(「3 slots · ready」)
- **Tauri 위젯 6종 합성 이미지** — 주 언어(Unity·C#)가 아닌 작업을 전면에 둠
- **통계·언어 카드**, 「GitHub Actions가 매일 갱신」 같은 자동 목록
- (프로필 한정) 한글 소개·한글 제목 — 영문 GitHub 페이지 조건이라 포트폴리오에는 해당 없음

받아들인 방향: 잘 알려진 Unity·C# 개발자처럼 **자기소개 몇 문장 + 작업 목록**. 그림은 실제 화면 2장까지, 끝에 `<samp>portfolio · openupm</samp> 같은 링크 한 줄`. 이모지 제목·배지 줄·통계 카드·타이핑 배너·상태 카드는 쓰지 않는다(반례 baba-s).

B에 그대로 옮기면: 첫 화면은 **Unity 클라이언트 실무**(회사 출시작)가 주인공이다. 위젯·Frond는 디자인 결만 빌리고 내용으로 앞세우지 않는다.

## 7. 시안 B 제안 — 「같은 사람이 만든 문서」

### 7-1. 원칙

1. **진짜 문서처럼 읽히는 페이지.** 목차·탭·상태 줄은 모두 실제로 동작하는 탐색이다. 장식으로 앱 흉내를 내지 않는다.
2. **내용은 A와 같다.** 사실은 `data/projects.js`와 현재 `index.html` 문구만 쓴다. Frond·unity-slot·cyKimScroller·위젯은 `projects.js`에 없으므로 B에 작업 항목으로 넣지 않는다(넣으려면 데이터에 먼저 추가하고 사용자 확인).
3. **세이지 차콜 한 벌.** A의 청록 `#0b6e63`·주황 `#b0501d`·보라 `#6a4fb5`, Syne, 히어로 배경 그림을 뺀다. 카테고리는 색이 아니라 탭으로 구분한다.
4. **정적 HTML/CSS/JS, 프레임워크 없음.** JS는 목차 현재 위치, 탭, 행 펼치기, 테마 전환만.

### 7-2. 페이지 구조

```
≥1024px
┌ 목차 열 260px (surface, sticky 100vh) ┬ 읽기 판 (bg, 본문 max 860px 가운데) ──────────────┐
│ 김찬영                        [◐]    │ # 김찬영                                           │
│ 목차                                 │ Unity 게임 클라이언트 개발자 · Unity Client Developer │
│   소개                               │ (A 리드 문단) (A 보조 문장)                         │
│   대표 작업                          │ ┌ 라벨/값 표 ──────────────────────────────┐        │
│     고양이 오마카세                  │ │ 경력    Unity 클라이언트 6년+             │        │
│     네코 식당                        │ │ 출시작  5종 개발 참여                     │        │
│     용사마을 타이쿤                  │ │ 플랫폼  Android · iOS · Steam             │        │
│   전체 작업                          │ │ 현재    BlackStorm · 2026.06 ~ 재직 중    │        │
│   코드                               │ └──────────────────────────────────────────┘        │
│   경력                               │ 이력서 PDF · 경력기술서 PDF · 이메일 · GitHub        │
│   연락                               │ ## 대표 작업 …                                      │
├──────────────────────────────────────┴───────────────────────────────────────────────────┤
│ 최종 업데이트 2026.11                        이력서 PDF · 경력기술서 · GitHub · 이메일    │ ← 페이지 끝 상태 줄
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**목차 열** (Frond `#sidebar`·`#toc`)
- 머리 띠 36~44px: 왼쪽 「김찬영」(14px 600), 오른쪽 테마 전환 아이콘 버튼(Lucide sun/moon 선 아이콘, A의 ☾☀ 글자 대신).
- 항목: 소개 / 대표 작업(아래 레벨 2로 대표 3개 게임명, `data.featured` 순서) / 전체 작업 / 코드 / 경력 / 연락. 모두 실제 `#앵커`.
- 현재 섹션: IntersectionObserver로 `aria-current="location"` + `color: var(--accent-text); font-weight: 600`.
- 목차 아래쪽에 흐린 12px로 「이력서 PDF · 경력기술서 PDF」 링크 두 줄. 그 밖의 버튼은 없다.

**소개 (#top)** — Frond 문서 첫머리처럼
- h1 「김찬영」 `clamp(28px, 6vw, 36px)` 700, 아래 1px `--line`. 큰 디스플레이 타이포·배경 그림 없음.
- 역할 줄, A의 리드 문단·보조 문장을 그대로.
- **라벨/값 표**(`<dl>`, 위젯 상세 패널 모양): 라벨 열 72px 흐린 13px, 값 15px. 값은 A의 `hero-facts`와 About 경력 목록에서만.
- **참여작 팀 성과**: A의 세 줄을 행으로. 각 행 = 게임명(600) + 성과 문구 + 오른쪽 `팀` 알약, 누르면 해당 작업 행이 펼쳐진다(A의 `data-project-link` 동작 유지). 아래 A의 안내 문장 「순위·수상·리텐션은 팀 성과입니다…」.
- 링크 한 줄(rag 시안 B의 `<samp>` 줄 결): `이력서 PDF · 경력기술서 PDF · 이메일 · GitHub · 코드 포트폴리오`. 버튼 묶음 대신 가운뎃점 링크 줄. 첫 링크만 강조 바탕 버튼으로 둬도 된다.

**대표 작업 (#featured)** — 그림 + 설명 (rag 시안 B 「그림 2장 + 목록」 결)
- 캡션: `FEATURED · 담당 범위와 결과` (11px 600 대문자 `.06em` 흐린 색) + h2 「대표 작업」.
- 세 항목. 각 항목 = 실제 배너(`image`, WebP, `width`/`height` 지정, radius 6px, 1px `--line` 테두리) + h3 제목 + `headline` + 라벨/값(역할·기간 mono·플랫폼) + `results`(scope가 team이면 `팀` 알약) + `상세 보기 →`(전체 작업의 해당 행 펼침).
- ≥720px는 그림 320px 왼쪽·글 오른쪽 2단, 그보다 좁으면 그림 위·글 아래.

**전체 작업 (#work)** — Frond 탭 + 위젯 카드 행
- 캡션 `WORK` + h2 「전체 작업」.
- **탭 줄**: `Company 8 · Personal 2 · AI Workflow 3`처럼 탭 이름 뒤에 흐린 개수(데이터에서 `hidden` 제외하고 센 값). Frond 탭 모양(위만 둥근 7px, 안 고른 탭 `--tab-bg`, 고른 탭은 아래 목록 판과 이어짐). `role="tablist"`/`tab`/`tabpanel`, 좌우 화살표로 이동, 닫기 ×는 없다.
- 탭 아래 데이터의 `hint` 문장(흐린 13px).
- **행 카드**(위젯 행, 면 = fg 4%, radius 8px, 그림자 없음, 행 사이 6px):
  - 1줄: 제목(15px 600) + 상태 배지(`status`, shields 결 3px radius·11px, 바탕 `#96bea1`/글자 `#1b2221`; 다크는 바탕 `#3f6150`/글자 `#ffffff`) …… 오른쪽 `company` 흐린 글자
  - 2줄: mono `period` · `platforms`(가운뎃점) · `blurb`(흐린 글자, 데스크톱 한 줄 말줄임, 모바일 줄바꿈)
  - 행 머리 전체가 `<button aria-expanded>`. 펼치면 행 안에 한 단계 다른 면(라이트 `--surface`, 다크 `#2b3331` = 테마 overlay)의 **라벨/값 표**: 역할 / 기간 / 플랫폼 / 주요 작업(`bullets` 목록) / 성과(`results` + 팀 알약) / 근거(`proof` 링크) / 스택(`tech`를 가운뎃점으로 이은 한 줄, 칩 나열 금지) / 링크(`stores`·`repo`·`docs`·`codeLink`). `shots`는 최대 4장 썸네일 줄, `loading="lazy"`.
  - 딥링크 `#id`로 들어오면 그 탭을 고르고 그 행을 펼친다. `id`는 바꾸지 않는다.

**코드 (#code)** — 어두운 띠 없이 같은 문서 흐름
- A 문단 그대로. 토픽 목록은 Frond 「최근 파일」 행 모양(ref 01): 1줄 토픽 이름, 2줄 흐린 mono `code_portfolio/#tutorial`(실제 앵커). ≥720px 2열.
- 「Code Portfolio 열기」 링크.

**경력 (#about)**
- h2 「클라이언트에 집중하는 개발자」 + A 문단 두 개.
- 경력 표: `회사 | 기간(mono) | 직급` 3열 `<table>`(A의 `career-list` 값). 선택: 표 위에 2020.09~현재 시간축 막대(8px 둥근 트랙, 회사별 구간, `aria-hidden="true"`, 표가 정본). 390px에서 글자가 겹치면 뺀다.
- 스택: A의 15개를 가운뎃점 한 줄 텍스트로. 칩 줄로 만들지 않는다.
- 사진: 실제 사진 유지, ≥720px 오른쪽 200px, 모바일은 제목 위 120px.

**연락 (#contact)** — 라벨/값 표
- 이메일 `cksdud3488@naver.com` / 전화(A처럼 `tel:` 링크, 화면 문구는 「전화」) / GitHub `github.com/cyKim0115` / 문서 이력서 PDF · 경력기술서 PDF / 코드 Code Portfolio.

**페이지 끝 상태 줄** (Frond 상태바 결, `position: static`)
- `border-top: 1px solid var(--line); background: var(--surface); font-size: 12px; color: var(--muted)`, 높이 32px 안팎.
- 왼쪽 「© 김찬영 · 최종 업데이트 2026.11」(`profile.updated`), 오른쪽 링크들. 링크는 흐린 색 그대로, 올리면 `--fg` + 밑줄.
- 경로·인코딩·단어 수 같은 가짜 값은 넣지 않는다.

### 7-3. 반응형

| 폭 | 배치 |
|---|---|
| ≥1024px | 2열 `grid-template-columns: 260px minmax(0, 1fr)`, 목차 sticky |
| 720~1023px | 1열. 위에 sticky 머리 띠 44px: 「김찬영」 · `목차` 버튼(`aria-expanded`, 누르면 같은 목차 목록이 아래로 펼쳐짐, 링크 누르면 닫힘) · 테마 버튼. 대표 작업은 2단 유지 |
| <720px (390px 기준) | 1열, 좌우 16px. 대표 작업 그림 위·글 아래, 행 2줄 메타는 줄바꿈 허용, 라벨/값 표는 라벨 72px 유지(넘치면 라벨 위·값 아래로), 탭 3개는 한 줄에 들어간다(넘치면 탭 줄만 가로 스크롤, 스크롤바 숨김 — Frond `#tabs`) |

- 페이지 가로 스크롤 0: `document.documentElement.scrollWidth <= innerWidth`를 390px에서 확인.
- 터치 대상 44px: 아이콘 버튼은 보이는 28px 그대로 두고 hit 영역을 패딩으로 44px.

### 7-4. 접근성

- 건너뛰기 링크, `<nav aria-label="목차">`, `<main>`, 섹션마다 `aria-labelledby`(A 구조 유지).
- 대비: surface 위 강조 글자는 `--accent-text`(2-5 참고). 흐린 글자는 bg·surface 둘 다 4.5 이상(라이트 6.30·다크 4.85).
- 포커스 링 항상 보이게(4-2). 탭은 화살표·Home·End, 행은 Enter·Space.
- `prefers-reduced-motion`이면 펼침·테마 전환 애니메이션 0ms. `prefers-color-scheme` 따름 + 수동 전환(localStorage는 try/catch, A와 같은 `theme` 키).
- 장식(시간축 막대 등)은 `aria-hidden`, 같은 정보를 표로 둔다.

### 7-5. 성능

- 외부 요청: Pretendard dynamic-subset CSS 하나. Syne(Google Fonts) 삭제. D2Coding은 `local()`만.
- 그림: 기존 `.webp`만, `width`·`height` 지정, 첫 대표 그림만 즉시 로드·나머지 `loading="lazy" decoding="async"`.
- JS는 `data/projects.js` + B 전용 스크립트 하나(목표 15 KB 이하), CSS 하나(목표 25 KB 이하). 스크롤 이벤트 대신 IntersectionObserver.

### 7-6. 파일 배치 (채택 후)

- 시안 폴더 없이 저장소 루트의 `index.html` · `style.css` · `script.js`가 이 디자인이다. 데이터는 `data/projects.js`의 `window.PORTFOLIO`만 읽는다(데이터·로직 분리 규칙).
- 데이터의 이미지 경로(`Resource/...`)는 루트 기준이라 그대로 쓴다(한글·공백은 경로 조각마다 인코딩). **`<base href>`는 쓰지 않는다** — `#featured` 같은 같은 페이지 앵커가 깨진다.
- `npm run check`가 루트 `index.html`·`script.js`·`data/projects.js`를 함께 검사한다(탭 id 충돌, `script.js`가 찾는 자리, 그림 크기 표, 이미지·앵커 실재).
- A의 `?pdf=1` PDF 모드는 채택 때 이 디자인으로 옮겼다 — `script.js` `renderPdfDoc`(모든 카테고리 펼친 목록, 상대 링크 절대 주소화)와 `style.css` 맨 아래 PDF·인쇄 블록.

### 7-7. A와 달라지는 점

| | 시안 A | 시안 B |
|---|---|---|
| 색 | 청록 `#0b6e63` + 주황 + 보라, 바탕 `#e8eeea` | 세이지 차콜 한 벌 (`#567e65`·`#fcfdfc` / `#96bea1`·`#1b2221`) |
| 글꼴 | Syne(라벨) + Pretendard | Pretendard + mono(D2Coding 계열), 디스플레이 폰트 없음 |
| 머리 | 히어로 배경 그림 + 성과 카드 + 사실 칩 + 버튼 4개 | 문서 첫머리(h1 + 밑줄) + 라벨/값 표 + 가운뎃점 링크 줄 |
| 탐색 | 위쪽 가로 메뉴 | 왼쪽 목차 열(넓은 화면), 머리 띠 목차 버튼(좁은 화면) |
| 작업 목록 | 필터 버튼 + 그리드 카드 + 따로 열리는 상세 패널 | Frond 탭 + 위젯 카드 행 + 행 안에서 펼치는 라벨/값 표 |
| 스택 | 칩 태그 | 가운뎃점 한 줄 |
| 코드 | 어두운 띠 | 같은 흐름의 「최근 파일」 행 목록 |
| 바닥 | 일반 푸터 | 상태 줄 모양 푸터 |

### 7-8. B에서 하지 말 것 (장난감 앱 방지)

- 가짜 창 테두리·최소화/최대화/닫기 버튼, `about.md` 같은 가짜 파일 탭, 가짜 경로·`UTF-8 · LF · 100%` 상태 값, 깜박이는 커서·타이핑 효과, 터미널 프롬프트 흉내
- 실데이터가 아닌 미터(스킬 % 바), 통계·잔디·트로피 카드, 「3 slots · ready」 같은 꾸민 상태 값
- 이모지 제목, 기술 배지 줄(`tech` 13개 칩), 그라데이션 블롭, 글래스 흐림(위젯의 흐림은 바탕화면 위 투명 창이라서 쓴 것), 스크롤 등장 애니메이션, 카드마다 그림자, 16px 넘는 radius
- 위젯 6종·Frond 화면을 첫 화면에 크게 두기
- `projects.js`·A 문구에 없는 경력·성과·수치·연도 추가

### 7-9. 확인 목록 (B 완성 판정)

- [ ] 라이트·다크 둘 다에서 본문·흐린 글자·링크 대비 기준 통과 (특히 목차 현재 항목)
- [ ] 390px·768px·1280px 스크린샷, 390px 가로 스크롤 없음
- [ ] 키보드만으로 목차 → 탭(화살표) → 행 펼침 → 근거 링크까지 이동, 포커스 링 보임
- [ ] `#neko-omakase` 같은 딥링크로 들어오면 그 행이 펼쳐짐
- [ ] 모든 사실 문구가 `projects.js`·A `index.html`에 있음
- [ ] 외부 요청이 Pretendard CSS(와 그 subset 폰트)뿐

## 8. 참고 화면 (원본 저장소 파일)

브리프를 쓸 때 잘라 본 화면의 원본이다. 이 저장소에는 복사하지 않았다.

| 원본 | 보는 점 |
|---|---|
| `Frond/docs/site/images/recent-files.png` | 최근 파일(제목 600 + 흐린 경로 줄) · 목차(레벨 들여쓰기, 현재 항목 세이지) · 읽기 판 · 탭 · 상태바 |
| `Frond/docs/site/images/dark.png` | 다크 세이지 차콜, 갈피 탭, h1·h2 밑줄, 세이지 링크 |
| `unity-slot-widget/docs/assets/widget-en.png` | 대문자 제목 + 요약 수치, 경고만 옅은 상자, 구획 라벨 + 개수 + 선, 2줄 카드 행(mono 브랜치) |
| `unity-slot-widget/docs/assets/widget-details.png` | 펼친 행의 라벨/값 표 |
| `claude-usage-widget/docs/images/widget.png` · `repo-multi-check-widget/docs/assets/ui-main-preview.png` | 8px 사용률 바, 알약 배지, 행 카드 색 틴트 |
| `cyKimScroller-public/docs/images/overview.png` | Unity 샘플에서도 같은 세이지, `VERTICAL LIST · 500 items` 캡션 문법 |
| `rag/knowledge/inbox/2026-11-17-github-profile-readme-drafts/mockups/profile-B-light.png` | 받아들인 「그림 2장 + 목록」 방향 |
| `Frond/docs/screenshots/theme.png` | 설정 팝업·테마 칩 |
