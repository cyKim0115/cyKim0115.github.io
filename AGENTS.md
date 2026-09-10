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
| 카테고리 추가 | `data/projects.js` + `index.html`(필터 버튼) + `style.css`(`.badge-<key>`) |
| 화면 동작 (필터·상세 패널·PDF 렌더) | `script.js` |
| 섹션 문구·About·연락처 | `index.html` |
| 색·레이아웃 | `style.css` (색은 `:root` / `[data-theme="dark"]` 양쪽 모두) |
| 이력서·경력기술서·자기소개서 | 각 `*.html` (독립 문서) |

`data/projects.js` 상단 주석에 프로젝트 항목의 필드 형태가 적혀 있습니다.

## 고친 뒤 반드시

```bash
npm run check
```

id 중복, 없는 이미지 경로, 필터 버튼과 카테고리 키 불일치, 빠진 배지 스타일을 잡아냅니다.
**이미지 경로 오타는 화면에서 조용히 깨지므로 눈으로 확인할 수 없습니다.**

PDF를 다시 뽑을 때만:

```bash
npm run pdf
```

## 규칙

- **데이터와 로직을 다시 섞지 않는다.** `script.js`에 프로젝트 배열을 되돌리지 마세요.
  `script.js`는 `window.PORTFOLIO`만 읽습니다.
- **없는 사실을 쓰지 않는다.** 경력·성과·스택은 실제 저장소나 스토어에서 확인된 것만 씁니다.
  비공개 저장소에는 `repo` 링크를 달지 않습니다.
- **이미지는 `Resource/<프로젝트>/`** 아래에 둡니다. 없으면 `image: null`로 두면
  placeholder가 나옵니다 — 깨진 링크보다 낫습니다.
- 색을 추가할 때는 라이트/다크 **양쪽** `:root` 블록에 넣습니다.
- 코드 포트폴리오는 별도 저장소(`../code_portfolio`)입니다. `codeLink`로 연결하며,
  앵커 id는 그쪽 `topics.json`에 실재해야 합니다.

## 구조

```
index.html          진입 · 섹션 마크업
data/projects.js    프로젝트 데이터 (window.PORTFOLIO)
script.js           렌더링 · 필터 · 상세 패널 · PDF 모드
style.css           테마 변수 + 전체 스타일
scripts/            check-data.mjs (정합성) · generate-pdfs.mjs (PDF)
Resource/           프로젝트별 배너 · 스크린샷
pdf/                생성된 PDF (산출물)
```
