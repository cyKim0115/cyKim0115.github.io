# 사이트 도구 (PDF · 이미지 · 공유 이미지 · 스크린샷 · 검사)

저장소 루트에서 실행합니다. 경로는 어느 PC든 같습니다.

```powershell
cd <저장소 루트>   # 예: %USERPROFILE%\repo\cyKim0115.github.io
npm install
```

## 브라우저

PDF·공유 이미지·스크린샷은 Playwright 로 브라우저를 띄웁니다. `scripts/browser.mjs` 의
`launchBrowser()` 가 아래 순서로 시도하므로, **Chrome 이나 Edge 가 깔려 있으면 따로 설치할 것이 없습니다.**

1. Playwright 번들 Chromium (`npx playwright install chromium` 을 했을 때)
2. 시스템 Google Chrome (`channel: "chrome"`)
3. 시스템 Microsoft Edge (`channel: "msedge"`)

셋 다 없으면 무엇을 설치하면 되는지 오류로 알려 줍니다. 정적 서버(`startStaticServer`)도 같은 파일에 있으며,
한글 파일명(퍼센트 인코딩)을 풀고 저장소 밖 경로는 막습니다.

## 명령

| 명령 | 하는 일 | 결과 |
|---|---|---|
| `npm run check` | 데이터·링크·대표 작업·코드 앵커·확인 안 된 표기 검사 | 문제 있으면 exit 1 |
| `npm run images` | `Resource/` 의 png/jpg 옆에 같은 이름의 `.webp` 생성 | `Resource/**/*.webp` |
| `npm run og` | 공유 미리보기 이미지와 홈 화면 아이콘 생성 | `assets/og-image.png` (1200x630), `assets/apple-touch-icon.png` (180x180) |
| `npm run shots` | 데스크톱 라이트·다크, 모바일 스크린샷 | `shots/` (git 에 안 올림) |
| `npm run pdf` | 포트폴리오·이력 문서 PDF | `pdf/*.pdf` |

### `npm run check`

`data/projects.js` · `index.html` 을 고친 뒤 항상 실행합니다. 주요 검사:

- 프로젝트 id 유일 · 페이지 요소 id 와 충돌 없음 · 이미지(`image` · `icon` · `shots` · `minor`) 파일 실재
- 탭·행 구조: 카테고리 key 형식, `script.js` 가 만드는 id(`work-<key>` · `panel-<key>` · `f-`/`head-`/`body-<id>`)와 충돌 없음,
  `script.js` 가 `getElementById` 로 찾는 자리와 목차 섹션(`SECTIONS` · `data-section`)이 `index.html` 에 있음,
  `data-project-link` 가 실재 프로젝트
- `script.js` 의 그림 크기 표(`DIMS`)가 실제 WebP 크기와 같음 (표에 없는 데이터 그림은 경고)
- 대표 작업(`featured`) 정확히 3개 · `role` · `headline` 필수 (company 도 필수, personal·ai 는 경고)
- `results[].scope` 는 `"team"` | `"personal"` · proof/stores/repo/docs/codeLink 는 https
- `codeTopics` 는 `{ label, id }`, `../code_portfolio/topics.json` 이 있으면 id·`codeLink` 앵커 실재
- `index.html` · `404.html` 의 로컬 `href`/`src` (favicon · assets · pdf · Resource) 와 `#id` 링크 실재
- 확인되지 않은 순위·수상 표기 금지(앱스토어 순위 · 양대 마켓/스토어 1위 · "비주얼 부문" 수상 등).
  `index.html` · `data/projects.js` · 이력 문서 3종 · `404.html` · `scripts/og-template.html` 모두 실패로 처리
- `assets/og-image.png` 1200x630, `assets/apple-touch-icon.png` 180x180

### `npm run images`

Python 3.10+ 와 Pillow 가 필요합니다 (`python -m pip install Pillow`). 원본은 그대로 두고 `.webp` 만 만듭니다.

- 배너·스크린샷: 가로 1200px · 세로 1600px 이하로 축소 (확대하지 않음)
- `icon.*`: 256px 이하 · 프로필 `Resource/My/증사.jpg`: 높이 960px 이하
- 품질 80, 실제로 쓰는 알파만 유지. 원본보다 새 `.webp` 는 건너뜀 → 전부 다시: `npm run images -- --force`

새 이미지를 넣었으면 `npm run images` 후 `data/projects.js` 에서 `.webp` 경로를 씁니다.

### `npm run og`

`scripts/og-template.html` 을 1200x630 으로 찍습니다. 문구는 공개 근거로 확인된 표기만 씁니다(팀 성과로 표기).
색·글꼴은 사이트와 같은 세이지 차콜 라이트 토큰과 Pretendard(jsDelivr, 네트워크 필요)입니다.
아이콘은 루트 `favicon.svg` 와 같은 모노그램이고, `apple-touch-icon.png` 는 라이트 타일 색(`#567e65`)으로 꽉 채웁니다. `-- --preview=<폴더>` 를 붙이면 favicon 16/32/64px 라이트·다크 미리보기도 저장합니다.

### `npm run shots`

```powershell
npm run shots                       # ./shots
npm run shots -- --out=D:\tmp\shots  # 저장 위치 지정
npm run shots -- --detail=neko-omakase
```

`desktop-light` · `desktop-dark` (1440x900) · `mobile-light` (390x844, DPR 2) 마다 `-fold.png`(첫 화면)와
`-full.png`(전체)를 만들고, `desktop-light-detail.png`(`#<id>` 로 펼친 작업 행), `desktop-light-featured.png`
(`#featured` 섹션)도 만듭니다. 페이지 오류·404 는 마지막에 경고로 모아 보여 줍니다.
기본으로 `prefers-reduced-motion: reduce` 상태로 찍습니다(`--motion` 으로 끔).

### `npm run pdf`

사이트 HTML 을 고친 뒤 다시 실행해 `pdf/` 를 최신으로 맞춥니다. 포트폴리오 PDF 모드는 상대 링크·`#id` 링크를
`https://cykim0115.github.io/` 기준 절대 주소로 바꿔 찍고, PDF 안에 `127.0.0.1` 이 남으면 실패합니다.
근거·스토어·저장소 링크는 종이에서도 읽히게 주소를 글자로 함께 적습니다. 브라우저 인쇄(Ctrl+P)도 같은 펼친 목록을 씁니다.

| 출력 | 소스 |
|------|------|
| `pdf/portfolio.pdf` | `index.html?pdf=1` — 라이트 고정, 모든 카테고리의 모든 작업 **펼친 목록** (탭·목차·대표 작업 없음) + 경력 표·연락처 |
| `pdf/resume.pdf` | `이력서.html` |
| `pdf/career.pdf` | `경력기술서.html` |
| `pdf/cover-letter.pdf` | `자기소개서.html` |

부분 실행:

```powershell
npm run pdf:portfolio   # = npm run pdf -- --only=portfolio
npm run pdf:docs        # = npm run pdf -- --only=docs
```

PowerShell 한 번에: `powershell -File scripts/update-pdfs.ps1`
