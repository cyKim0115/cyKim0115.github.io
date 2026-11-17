# cyKim0115.github.io — AGENTS

김찬영 개인 포트폴리오 사이트입니다. 빌드 도구 없는 정적 사이트로, GitHub Pages에서 그대로 서빙합니다.
(PDF·공유 이미지·스크린샷은 Node + Playwright, 정합성 검사 `npm run check`는 Node만 씁니다.)

## 이 저장소에서는 system-crew 4역할 루프를 돌리지 않는다

`.cursor/rules/`에 system-crew 팩이 설치되어 있지만, 그 프로토콜은 **참고 자료에서 게임 시스템을
재현하는 작업**을 위한 것입니다. 이 저장소의 작업(콘텐츠 추가, 문구 수정, 스타일 조정)은
`out_of_scope`입니다. Producer/Analyst/스펙 승인 절차를 끼워 맞추지 말고 바로 수정하세요.

## 무엇을 어디서 고치나

| 하려는 일 | 고칠 파일 |
|---|---|
| 프로젝트 추가·수정·삭제 | `data/projects.js` **만** (새 그림을 넣으면 `script.js`의 `DIMS`도) |
| 첫 화면 대표 작업 3개 바꾸기 | `data/projects.js`의 `featured: 1~3` (전체에서 세 개만) |
| 행 머리의 타이틀 아이콘 | `data/projects.js`의 `icon` (없으면 `minor` 아이콘 넷을 2×2로, 그것도 없으면 아이콘 칸 없이) |
| Code 섹션 토픽 | `data/projects.js`의 `CODE_TOPICS` (`{label, id}`, id = code_portfolio 앵커) |
| 카테고리 추가 | `data/projects.js`의 `CATEGORIES`만 (`label` · `hint` · `list`). 전체 작업의 탭(`#work-<key>`)·목차·PDF 목록은 `script.js`가 이 맵에서 그린다. key는 소문자·숫자·하이픈 |
| 화면 동작 (탭·행 펼치기·딥링크·목차·테마·PDF/인쇄 목록) | `script.js` |
| 그림 크기 (자리 밀림 방지 `width`/`height`) | `script.js`의 `DIMS` — 그림을 바꾸거나 더하면 맞춘다 (`npm run check`가 파일과 대조) |
| 소개·첫 화면 팀 성과 3줄·코드 문단·경력 표·연락처 | `index.html` (팀 성과의 게임 이름은 데이터 `title`로 바뀐다. `data-project-link`는 실재 id) |
| 색·레이아웃 | `style.css` (색은 세 블록 + 인쇄 블록 — 아래 「디자인 규칙」) |
| 공유 미리보기·홈 화면 아이콘 | `scripts/og-template.html` · `favicon.svg` → `npm run og` |
| 404 페이지 | `404.html` (인라인 CSS, 같은 토큰. 로컬 경로는 `/` 기준) |
| 이력서·경력기술서·자기소개서 | 각 `*.html` (독립 문서) |

`data/projects.js` 상단 주석에 프로젝트 항목의 필드 형태가 적혀 있습니다. 기본 필드 외에
`headline`(역량 중심 사례 제목) · `role`(내 역할 한 문장) · `platforms` · `results[{text, scope}]` ·
`proof[{label, href}]` · `blurbTeam`(접힌 행 설명에서 팀 성과인 구간) · `icon` · `featured`를 씁니다. `period`는 `"YYYY.MM ~ YYYY.MM"`, 경력기술서 기준입니다.

## 고친 뒤 반드시

```bash
npm run check
```

id 중복, 없는 이미지 경로, 카테고리 탭 id(`work-<key>`)와 페이지·프로젝트 id 충돌, `script.js`가
`getElementById("…")`·`querySelector("#…")`로 찾는 자리(id)·목차 섹션의 누락, `data-project-link` 오타,
`DIMS`와 실제 그림 크기 불일치, `blurbTeam`이 빠진 순위·수상·리텐션 구간을 잡아냅니다.
**이미지 경로 오타는 화면에서 조용히 깨지므로 눈으로 확인할 수 없습니다.**

그 밖의 스크립트:

```bash
npm run images   # python scripts/optimize-images.py — Resource/ 원본 옆에 .webp 생성
npm run og       # assets/og-image.png (1200×630) · assets/apple-touch-icon.png 다시 생성
npm run shots    # 데스크톱 라이트/다크 · 모바일 스크린샷 + #<id> 펼친 행 (-- --out=<dir> --detail=<id>)
npm run pdf      # PDF 재생성 (pdf/portfolio.pdf = index.html?pdf=1 · resume · career · cover-letter)
```

Playwright 번들 브라우저는 받지 않습니다. 시스템 Chrome(`channel: 'chrome'`, 없으면 `msedge`)을 씁니다.

## 규칙

- **데이터와 로직을 다시 섞지 않는다.** `script.js`에 프로젝트 배열·프로젝트별 값(아이콘 경로 등)을 두지 마세요.
  `script.js`는 `window.PORTFOLIO`만 읽습니다. (`DIMS`는 그림 파일의 픽셀 크기 표라 예외입니다.)
- **없는 사실을 쓰지 않는다.** 경력·성과·스택은 경력기술서·이력서·실제 저장소·스토어에서 확인된 것만
  씁니다. 비공개 저장소에는 `repo` 링크를 달지 않습니다.
- **순위·수상·리텐션은 팀 성과다.** `results`에 `scope: "team"`으로 두고, 순위·수상은 공개 근거를
  `proof`에 링크합니다. 차트·부문·시점까지 근거와 같게 씁니다(예: "미국 Google Play 게임 카테고리 1위
  (2024.07)"). 근거를 못 찾은 표기("App Store 미국 1위", "양대 마켓 1위" 등)는 쓰지 않습니다.
  `bullets`·`role`에는 본인 작업만 씁니다. 접힌 행 설명(`blurb`)에서 팀 성과인 구간은 `blurbTeam`에 같은 글자로 적어
  `팀` 표시를 붙입니다 (구분 규칙을 `script.js`에 두지 않습니다).
- **역할 줄은 회사 작업에만.** Personal·AI Workflow 작업의 `role`(모두 같은 "개인 프로젝트 — 설계·구현")은 화면 상세·PDF에
  그리지 않습니다. 탭 안내문(`hint`)이 같은 말을 하므로 의도한 생략입니다.
- **이미지는 `Resource/<프로젝트>/`** 아래에 원본을 두고 `npm run images`로 만든 같은 이름의
  `.webp`를 데이터에서 가리킵니다. 없으면 `image: null` — 그림 없이 글만 나옵니다.
- `id`는 바꾸지 않습니다(딥링크 `#id`가 걸려 있습니다). 숨길 때는 `hidden: true`.
  `work-` · `panel-` · `grp-` · `f-` · `head-` · `body-`로 시작하는 id는 `script.js`가 만드는 요소 id와 겹치므로 쓰지 않습니다.
- **가운뎃점 줄바꿈.** 줄이 "·"로 시작하거나 "광고·분석"처럼 붙여 쓴 말이 갈리지 않게 `<span class="nw">`로 묶습니다
  (`앞말 ·` 또는 `광고·분석` 단위). `script.js`가 그리는 글자는 `textNodes()`가 자동으로 묶습니다.
  단어 결합자(U+2060) 같은 보이지 않는 글자는 복사한 글을 더럽히므로 쓰지 않습니다.
  접힌 행 설명은 16자 이하 구간만 통째로 묶습니다(`script.js` `BLURB_KEEP`). 늘리면 320px 화면이 옆으로 넘칩니다.
- **PDF.** `index.html?pdf=1`은 라이트로 고정하고, 탭·목차 대신 모든 작업을 펼친 목록을 그린 뒤 상대 링크를
  `https://cykim0115.github.io/` 기준 절대 주소로 바꿉니다. 로컬 주소(127.0.0.1)가 PDF에 남으면 `npm run pdf`가 실패합니다.
  화면에서 숨길 것·종이에만 보일 것은 `style.css`의 `html[data-pdf="1"]`과 `@media print` 두 곳에 같이 적습니다
  (`.on-screen` / `.on-paper`).
- 코드 포트폴리오는 별도 저장소(`../code_portfolio`)입니다. `codeLink`로 연결하며,
  앵커 id는 그쪽 `topics.json`에 실재해야 합니다.

## 디자인 규칙

근거·수치·출처는 [`docs/design-brief.md`](docs/design-brief.md)에 있습니다. 화면을 고칠 때 아래를 지킵니다.

- **팔레트는 세이지 차콜 한 벌.** 정본은 Frond `src/style.css` `:root`와 sage-charcoal-theme `build.mjs` `BASE`(두 곳 값이 같음).
  `style.css`의 `:root`(라이트) · `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` ·
  `:root[data-theme="dark"]` 세 블록에 같은 토큰 이름으로 두고, 인쇄 블록(`@media print`)은 라이트 값으로 고정합니다.

  | 토큰 | 라이트 | 다크 |
  |---|---|---|
  | `--bg` 읽기 판 | `#fcfdfc` | `#1b2221` |
  | `--surface` 목차 열·머리 띠·상태 줄 | `#f0f3f0` | `#262e2c` |
  | `--fg` 글자 | `#2c3333` | `#e4eae4` |
  | `--muted` 흐린 글자 | `#515b56` | `#949a96` |
  | `--line` 구분선 (장식용) | `#dae1da` | `#474e4c` |
  | `--accent` 채움·포커스 링·현재 목차 표시 | `#567e65` | `#96bea1` |
  | `--accent-text` 강조 글자·링크 | `#3f6150` | `#96bea1` |

  `#567e65`는 surface 위 대비가 4.11:1이라 **글자**에는 `--accent-text`를 씁니다. 새 색을 만들기보다 이 토큰을
  `color-mix`로 섞어 씁니다(hover = fg 7%, 누름 = fg 12%). `theme-color` 메타·`script.js` `SURFACE`·`404.html`·OG 템플릿도 같은 값입니다.
- **글꼴은 Pretendard 하나**(jsDelivr `pretendard@1.3.9` variable dynamic-subset). 디스플레이 글꼴은 없습니다.
  mono(`.mono`, D2Coding → Cascadia → Consolas)는 기간·앵커(`#tutorial`)·주소 같은 짧은 ASCII에만 씁니다. 한글 문장에는 쓰지 않습니다.
- **모양**: 왼쪽 목차 열 + 가운데 읽기 판 + 바닥 상태 줄. 전체 작업은 갈피 탭 + 카드 행, 행을 펼치면 라벨/값 표.
  구분은 가운뎃점(·) 텍스트로 하고, 팀 성과/개인 기여는 라벨 열로 나눕니다.
- **넣지 않는 것**:
  - 그라데이션·블롭·노이즈 히어로 배경, 글래스 흐림
  - 섹션 제목 위 영문 대문자 아이브로 라벨(`FEATURED`·`WORK` 같은)
  - 기술 칩 구름 — 스택은 가운뎃점 한 줄 텍스트
  - 줄마다 붙는 알약 배지 — 상태 배지는 예외(미출시·참여 등)일 때만, 접힌 행의 `팀` 표시는 데이터 `blurbTeam` 구간에만
  - hover 때 떠오르는 카드·그림자·이미지 확대, 스크롤 등장 애니메이션
  - 가짜 앱 크롬 — 창 버튼, 가짜 파일 탭, `UTF-8 · LF` 같은 꾸민 상태 값, 타이핑 효과, 터미널 흉내
  - 이모지 제목, 통계·스킬 % 카드, 16px 넘는 radius
- 움직임은 240ms `cubic-bezier(0.2, 0, 0, 1)`(행 펼침), 테마 전환 250ms 크로스페이드(View Transition),
  0.15s 색·투명도 전환(머리 띠 이름 포함)뿐이며, `prefers-reduced-motion: reduce`면 0입니다.
- 포커스 링은 요소 자기 모서리를 따릅니다. `:focus-visible` 규칙에서 `border-radius`를 덮어쓰지 않습니다.
- 고대비(`forced-colors: active`)에서는 바탕·그림자가 사라지므로 고른 탭·카드 행·펼친 표의 경계를 선으로 남깁니다.

## 구조

```
index.html          진입 · 섹션 마크업 (소개 · 대표 작업 · 전체 작업 · 코드 · 경력 · 연락)
data/projects.js    프로젝트 데이터 (window.PORTFOLIO)
script.js           렌더링 · 탭 · 행 펼치기 · 딥링크 · 목차 · 테마 · PDF/인쇄 목록 (window.PORTFOLIO 만 읽음)
style.css           세이지 차콜 토큰 + 전체 스타일 + PDF·인쇄
404.html            없는 주소 (인라인 CSS)
docs/               design-brief.md (디자인 근거)
scripts/            check-data.mjs (정합성) · generate-pdfs.mjs (PDF) · optimize-images.py (WebP) · og-image.mjs (OG·아이콘) · screenshots.mjs
Resource/           프로젝트별 배너 · 아이콘 · 스크린샷 (원본 + .webp)
assets/             og-image.png · apple-touch-icon.png  (favicon.svg 는 루트)
pdf/                생성된 PDF (산출물)
```
