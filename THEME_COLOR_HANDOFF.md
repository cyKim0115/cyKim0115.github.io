# 테마/색상 인수인계 문서

## 1) 문서 목적
- 이 프로젝트의 **테마 구조(라이트/다크)** 와 **실사용 색상값**을 다른 포트폴리오 사이트로 그대로 이식하기 위한 기준 문서입니다.
- 기준 소스는 `index.html`, `style.css`, `script.js`, `경력기술서.html` 입니다.

## 2) 테마 시스템 개요
- 메인 포트폴리오(`index.html`)는 `html[data-theme="light|dark"]` 기반의 CSS 변수 테마를 사용합니다.
- 초기 테마는 `<head>` 인라인 스크립트에서 먼저 세팅하여 FOUC(깜빡임)를 방지합니다.
- 우선순위:
  1. `localStorage.theme` 저장값
  2. 없으면 `prefers-color-scheme`
  3. 예외 시 `light`
- 토글 버튼(`theme-toggle`) 클릭 시 `data-theme`와 `localStorage.theme`를 갱신합니다.
- 사용자가 수동 선택을 저장하지 않았다면 OS 테마 변경을 실시간 반영합니다.

## 3) 메인 포트폴리오 디자인 토큰 (`style.css`)

### 3-1. Light 테마 (`:root`)
- `--primary-color`: `#6366f1`
- `--primary-dark`: `#4f46e5`
- `--primary-light`: `#818cf8`
- `--secondary-color`: `#8b5cf6`
- `--accent-color`: `#ec4899`
- `--text-dark`: `#1f2937`
- `--text-light`: `#6b7280`
- `--text-white`: `#ffffff`
- `--bg-white`: `#ffffff`
- `--bg-light`: `#f9fafb`
- `--bg-dark`: `#111827`
- `--bg-card`: `#ffffff`
- `--gradient-primary`: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- `--gradient-secondary`: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`
- `--gradient-accent`: `linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)`
- `--shadow-sm`: `0 2px 4px rgba(0, 0, 0, 0.05)`
- `--shadow-md`: `0 4px 6px rgba(0, 0, 0, 0.1)`
- `--shadow-lg`: `0 10px 25px rgba(0, 0, 0, 0.15)`
- `--shadow-xl`: `0 20px 40px rgba(0, 0, 0, 0.2)`

### 3-2. Dark 테마 (`[data-theme="dark"]`)
- `--primary-color`: `#818cf8`
- `--primary-dark`: `#6366f1`
- `--primary-light`: `#a5b4fc`
- `--secondary-color`: `#a78bfa`
- `--accent-color`: `#f472b6`
- `--text-dark`: `#f1f5f9`
- `--text-light`: `#94a3b8`
- `--text-white`: `#ffffff`
- `--bg-white`: `#1e293b`
- `--bg-light`: `#1e293b`
- `--bg-dark`: `#020617`
- `--bg-card`: `#1e293b`
- `--gradient-primary`: `linear-gradient(135deg, #312e81 0%, #4c1d95 100%)`
- `--gradient-secondary`: `linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)`
- `--gradient-accent`: `linear-gradient(135deg, #be185d 0%, #6d28d9 100%)`
- `--shadow-sm`: `0 2px 4px rgba(0, 0, 0, 0.4)`
- `--shadow-md`: `0 4px 8px rgba(0, 0, 0, 0.5)`
- `--shadow-lg`: `0 10px 25px rgba(0, 0, 0, 0.6)`
- `--shadow-xl`: `0 20px 40px rgba(0, 0, 0, 0.7)`

## 4) 컴포넌트별 핵심 색상 규칙
- **헤더/CTA/대표 배경:** `--gradient-primary`, `--gradient-secondary`, `--gradient-accent` 중심.
- **기본 텍스트/본문:** `--text-dark`, `--text-light`.
- **카드/섹션 배경:** `--bg-white`, `--bg-light`, `--bg-card`.
- **브랜드 포인트:** 보라/인디고 계열(`--primary-color`, `--secondary-color`) + 핑크 포인트(`--accent-color`).
- **다크 대비 텍스트:** `--text-dark` 값 자체를 밝은 색으로 뒤집어서 재사용.

## 5) 예외(하드코딩) 색상 - 이식 시 주의
다음 값들은 변수 대신 특정 컴포넌트에 직접 들어가 있습니다. 새 사이트로 옮길 때 토큰화 권장:

- 토글 버튼 유리질감:
  - `rgba(15, 23, 42, 0.35)`, `rgba(15, 23, 42, 0.55)`,
  - `rgba(241, 245, 249, 0.12)`, `rgba(241, 245, 249, 0.22)`,
  - `#fde68a`
- 사이드바/네비:
  - `rgba(255, 255, 255, 0.55)`, `rgba(255, 255, 255, 0.35)`,
  - `rgba(148, 163, 184, 0.18)`, `rgba(148, 163, 184, 0.25)`, `rgba(148, 163, 184, 0.3)`,
  - 호버 배경 `rgba(99, 102, 241, 0.05)`, 활성 `rgba(99, 102, 241, 0.1)`
- 태그/칩:
  - 태그 배경 그라데이션 `rgba(99, 102, 241, 0.08~0.18)` + `rgba(139, 92, 246, 0.08~0.18)`
  - 테두리 `rgba(99, 102, 241, 0.2~0.35)`
- Contact 다크 고정 배경:
  - `linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)`
  - 오버레이 `rgba(129, 140, 248, 0.12)`, `rgba(167, 139, 250, 0.12)`

## 6) 독립 문서 테마 (`경력기술서.html`)
- `경력기술서.html`은 메인 테마 시스템과 별개로, 라이트 단일 팔레트를 인라인 스타일로 사용합니다.
- 주요 색:
  - 포인트: `#6366f1`, `#4f46e5`
  - 텍스트: `#1f2937`, `#374151`, `#4b5563`, `#6b7280`, `#333`
  - 배경/구분: `#fff`, `#f9fafb`, `#f3f4f6`, `#e5e7eb`, `#9ca3af`
- 이 문서를 메인 사이트와 동일한 다크/라이트 체계로 통합하려면, 위 색을 CSS 변수로 치환하고 `data-theme` 스위칭을 연결해야 합니다.

## 7) 다른 포트폴리오 사이트로 이식 절차 (AI 작업 지시용)
아래 순서대로 적용하면 됩니다.

1. `:root`와 `[data-theme="dark"]`에 3장 토큰을 그대로 복사.
2. `html`에 `data-theme`를 부여하고, 초기화 스크립트(저장값 > OS > light)를 `<head>`에 삽입.
3. 토글 버튼 이벤트로 `data-theme` + `localStorage.theme` 동기화.
4. 기존 CSS 색상값을 우선 `var(--...)`로 대체.
5. 5장 하드코딩 RGBA/HEX는 의미별 토큰(overlay, glass, chip-bg 등)로 추가 분리.
6. 다크 모드에서 텍스트 대비(본문/보조/버튼)와 카드 경계선 가독성 확인.

## 8) 권장 토큰 확장안 (하드코딩 정리용)
- `--overlay-glass-light`
- `--overlay-glass-dark`
- `--chip-bg-start`, `--chip-bg-end`
- `--chip-border`
- `--contact-dark-start`, `--contact-dark-mid`, `--contact-dark-end`

## 9) 빠른 결론
- 메인 포트폴리오는 이미 **재사용 가능한 토큰형 테마 구조**를 갖추고 있습니다.
- 재사용 품질을 더 높이려면 5장의 하드코딩 색상만 추가 토큰화하면 됩니다.
- `경력기술서.html`은 별도 체계이므로, 필요 시 메인 토큰으로 통합하는 리팩터링이 필요합니다.
