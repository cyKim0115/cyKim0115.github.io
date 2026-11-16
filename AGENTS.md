# cyKim0115.github.io — AGENTS

김찬영 개인 포트폴리오 사이트입니다. 빌드 도구 없는 정적 사이트로, GitHub Pages에서 그대로 서빙합니다.
(PDF 생성만 Node + Playwright를 씁니다.)

## 이 저장소에서는 system-crew 4역할 루프를 돌리지 않는다

`.cursor/rules/`에 system-crew 팩이 설치되어 있지만, 그 프로토콜은 **참고 자료에서 게임 시스템을
재현하는 작업**을 위한 것입니다. 이 저장소의 작업(콘텐츠 추가, 문구 수정, 스타일 조정)은
`out_of_scope`입니다. Producer/Analyst/스펙 승인 절차를 끼워 맞추지 말고 바로 수정하세요.

## 무엇을 어디서 고치나

| 하려는 일 | 고칠 파일 |
|---|---|
| 프로젝트 추가·수정·삭제 | `data/projects.js` **만** |
| 첫 화면 대표 작업 3개 바꾸기 | `data/projects.js`의 `featured: 1~3` (전체에서 세 개만) |
| Code 섹션 토픽 | `data/projects.js`의 `CODE_TOPICS` (`{label, id}`, id = code_portfolio 앵커) |
| 카테고리 추가 | `data/projects.js` + `index.html`(필터 버튼) + `style.css`(`.badge-<key>`) |
| 화면 동작 (필터·상세 패널·PDF 렌더) | `script.js` |
| 섹션 문구·About·연락처 | `index.html` |
| 색·레이아웃 | `style.css` (색은 `:root` / `[data-theme="dark"]` 양쪽 모두) |
| 이력서·경력기술서·자기소개서 | 각 `*.html` (독립 문서) |

`data/projects.js` 상단 주석에 프로젝트 항목의 필드 형태가 적혀 있습니다. 기본 필드 외에
`headline`(역량 중심 사례 제목) · `role`(내 역할 한 문장) · `platforms` · `results[{text, scope}]` ·
`proof[{label, href}]` · `featured`를 씁니다. `period`는 `"YYYY.MM ~ YYYY.MM"`, 경력기술서 기준입니다.

## 고친 뒤 반드시

```bash
npm run check
```

id 중복, 없는 이미지 경로, 필터 버튼과 카테고리 키 불일치, 빠진 배지 스타일을 잡아냅니다.
**이미지 경로 오타는 화면에서 조용히 깨지므로 눈으로 확인할 수 없습니다.**

그 밖의 스크립트:

```bash
npm run images   # python scripts/optimize-images.py — Resource/ 원본 옆에 .webp 생성
npm run og       # assets/og-image.png (1200×630) 다시 생성
npm run shots    # 데스크톱 라이트/다크 · 모바일 스크린샷
npm run pdf      # PDF 재생성 (pdf/resume.pdf · pdf/career.pdf 등)
```

Playwright 번들 브라우저는 받지 않습니다. 시스템 Chrome(`channel: 'chrome'`, 없으면 `msedge`)을 씁니다.

## 규칙

- **데이터와 로직을 다시 섞지 않는다.** `script.js`에 프로젝트 배열을 되돌리지 마세요.
  `script.js`는 `window.PORTFOLIO`만 읽습니다.
- **없는 사실을 쓰지 않는다.** 경력·성과·스택은 경력기술서·이력서·실제 저장소·스토어에서 확인된 것만
  씁니다. 비공개 저장소에는 `repo` 링크를 달지 않습니다.
- **순위·수상·리텐션은 팀 성과다.** `results`에 `scope: "team"`으로 두고, 순위·수상은 공개 근거를
  `proof`에 링크합니다. 차트·부문·시점까지 근거와 같게 씁니다(예: "미국 Google Play 게임 카테고리 1위
  (2024.07)"). 근거를 못 찾은 표기("App Store 미국 1위", "양대 마켓 1위" 등)는 쓰지 않습니다.
  `bullets`·`role`에는 본인 작업만 씁니다.
- **이미지는 `Resource/<프로젝트>/`** 아래에 원본을 두고 `npm run images`로 만든 같은 이름의
  `.webp`를 데이터에서 가리킵니다. 없으면 `image: null` — placeholder가 깨진 링크보다 낫습니다.
- `id`는 바꾸지 않습니다(딥링크 `#id`가 걸려 있습니다). 숨길 때는 `hidden: true`.
- 색을 추가할 때는 라이트/다크 **양쪽** `:root` 블록에 넣습니다.
- 코드 포트폴리오는 별도 저장소(`../code_portfolio`)입니다. `codeLink`로 연결하며,
  앵커 id는 그쪽 `topics.json`에 실재해야 합니다.

## 구조

```
index.html          진입 · 섹션 마크업
data/projects.js    프로젝트 데이터 (window.PORTFOLIO)
script.js           렌더링 · 필터 · 상세 패널 · PDF 모드
style.css           테마 변수 + 전체 스타일
scripts/            check-data.mjs (정합성) · generate-pdfs.mjs (PDF) · optimize-images.py (WebP) · OG·스크린샷
Resource/           프로젝트별 배너 · 스크린샷 (원본 + .webp)
assets/             og-image.png · apple-touch-icon.png  (favicon.svg 는 루트)
pdf/                생성된 PDF (산출물)
```
