/**
 * 포트폴리오 데이터 — 화면 로직(script.js)과 분리된 파일.
 *
 * 항목을 추가·수정할 때는 이 파일만 고치면 된다. 렌더링·탭·목차·대표 작업·PDF 는
 * 아래 CATEGORIES 를 그대로 따라가므로 script.js 를 건드릴 필요가 없다.
 *
 * 프로젝트 한 항목의 형태:
 *   {
 *     id,                       // 필수 · 해시 링크(#id)로 쓰인다. 전체에서 유일 · 바꾸지 않는다
 *     company,                  // 회사명 또는 유형 라벨 (회사 탭은 이 값으로 묶는다)
 *     title, status,
 *     period,                   // "YYYY.MM ~ YYYY.MM" (진행 중이면 "YYYY.MM ~"). 경력기술서 기준, 모르면 ""
 *     headline,                 // 역량 중심 사례 제목 한 문장 (게임명은 title, 이건 무엇을 했는지)
 *     role,                     // "내 역할" 한 문장 — 경력기술서 "주요 담당 업무"에서만
 *     platforms: [],            // 선택 · "Android" / "iOS" / "Steam" / "Windows" … 모르면 생략
 *     blurb,                    // 접힌 행에 보이는 한 줄 (" · "로 구간을 나눈다)
 *     blurbTeam: [],            // 선택 · blurb 구간 중 팀 성과(순위·수상·리텐션·팀 런칭 일정 등)인 것 — 끝 마침표 없이
 *                               //   blurb 구간과 똑같이 적는다. 이 구간에만 "팀" 표시가 붙는다 (npm run check 가 대조)
 *     summary,                  // 펼친 행 첫 문단
 *     bullets: [],              // 펼친 행 "주요 작업" (본인 작업만)
 *     results: [{text, scope}], // 선택 · 성과. scope 는 "team"(순위·수상·리텐션 등) | "personal"
 *     proof: [{label, href}],   // 선택 · 순위·수상 근거 링크. 순위·수상 result 에는 반드시 단다
 *     tech: [],                 // 스택 (가운뎃점으로 이은 한 줄로 보인다)
 *     image: null,              // 배너 .webp (없으면 그림 없이 글만)
 *     icon,                     // 선택 · 행 머리의 타이틀 아이콘 .webp (없고 minor 아이콘이 넷 이상이면 2×2 로 묶어 쓴다)
 *     stores: [{label, href}],  // 스토어 링크
 *     shots: [],                // 상세 스크린샷 .webp (최대 4장 표시)
 *     repo, docs, codeLink,     // 선택 링크 (비공개 저장소에는 repo 를 달지 않는다)
 *     minor: [{name, img}],     // 선택 · 묶음 프로젝트 아이콘 목록
 *     featured: 1 | 2 | 3,      // 선택 · 첫 화면 "대표 작업" 고정 순서. 전체에서 세 개만
 *     hidden: true,             // 선택 · 데이터는 남기고 화면·PDF 에서만 뺀다
 *   }
 *
 * 이미지는 Resource/ 원본(.png/.jpg) 옆의 같은 이름 .webp 를 가리킨다.
 * 새 이미지를 넣으면 `npm run images` 로 .webp 를 만든 뒤 경로를 적는다.
 *
 * 순위·수상·리텐션은 팀 성과다. 공개 근거로 확인된 표기만 쓰고(차트·부문·시점까지),
 * results 에 scope: "team" 으로 두고 proof 에 출처를 단다. 확인 안 된 표기는 쓰지 않는다.
 *
 * 카테고리를 새로 만들려면 배열 하나와 CATEGORIES 항목 하나(label · hint · list)만 추가한다.
 * 전체 작업의 탭(#work-<key>)과 목차 항목은 script.js 가 이 맵에서 그린다.
 * key 는 소문자·숫자·하이픈만 쓴다 (요소 id 에 들어간다).
 *
 * 클래식 스크립트라 전역 스코프를 script.js 와 공유한다. 아래 상수들이 이름 충돌을
 * 일으키지 않도록 IIFE 로 감싸고, window.PORTFOLIO 하나만 밖으로 내보낸다.
 */

(function () {

const COMPANY_PROJECTS = [
  {
    id: "project-t",
    hidden: true,
    company: "BlackStorm",
    title: "프로젝트 T",
    status: "진행중",
    period: "2026.06 ~",
    headline: "프로시저럴 섬 생성과 메시 결합·콜라이더 최적화를 포함한 Idle/Tycoon 클라이언트",
    role: "아일랜드·생산·성장 루프 클라이언트, 섬 노이즈 생성·메시 결합·콜라이더 최적화, 월드 스페이스 UI·캐릭터/건물 배치 구현 담당",
    blurb: "Unity idle/tycoon — 아일랜드·생산·성장 루프 클라이언트.",
    summary:
      "BlackStorm에서 진행 중인 Unity idle/tycoon 클라이언트입니다. 섬·생산 건물·캐릭터 배치와 월드 UI를 중심으로 구현하고 있으며, 섬 노이즈 생성·메시 결합·콜라이더 최적화 등 런타임 퍼포먼스 작업도 포함합니다.",
    bullets: [
      "아일랜드 기반 생산·성장 루프 클라이언트",
      "월드 스페이스 UI · 캐릭터/건물 배치",
      "섬 노이즈 생성 · 메시 결합 · 콜라이더 최적화",
    ],
    results: [],
    proof: [],
    tech: ["Unity 6", "C#", "UniTask"],
    image: null,
    stores: [],
    shots: [],
  },
  {
    id: "maximizer-mvp",
    company: "MAXIMIZER",
    title: "MAXIMIZER MVP",
    status: "MVP",
    period: "2026.02 ~ 2026.05",
    headline: "신규 팀의 개발 환경·아키텍처와 MVP 빌드·배포 파이프라인 구축",
    role: "신규 개발팀의 초기 개발 환경·아키텍처 설계, 빌드·배포 파이프라인 구축, 프로토타입·클라이언트 구현, 기술 가이드라인 수립 담당",
    blurb: "신규팀 개발 환경·아키텍처·MVP 파이프라인 구축.",
    summary:
      "MAXIMIZER 합류 후 신규 개발팀의 초기 개발 환경과 아키텍처를 설계하고, MVP 방식에 맞춘 빌드/배포 파이프라인과 핵심 기능 중심 프로토타이핑을 담당했습니다.",
    bullets: [
      "초기 개발 환경 및 아키텍처 설계",
      "MVP 방식 개발 프로세스 · 빌드/배포 파이프라인 구축",
      "핵심 기능 중심 빠른 프로토타입·클라이언트 구현",
      "팀 기술 가이드라인 수립 · 기술 이슈 대응",
    ],
    results: [{ text: "MVP 기간 완료", scope: "team" }],
    proof: [],
    tech: [
      "URP",
      "Shader",
      "LevelPlay",
      "Firebase",
      "UniTask",
      "LitMotion",
      "R3",
      "ZString",
      "PrimeTween",
    ],
    image: "Resource/MAXIMIZER_MVP/banner.webp",
    stores: [],
    shots: [],
  },
  {
    id: "neko-omakase",
    featured: 1,
    company: "Nine Digits",
    title: "고양이 오마카세",
    status: "출시",
    period: "2024.02 ~ 2024.11",
    headline: "URP·Shader 비주얼 개선과 Node.js 인게임 서버 유지보수·운영툴 서버 개발을 맡은 상용 출시작",
    role: "URP 적용·Shader 개발, 광고·분석 SDK 연동, AWS Node.js 인게임 서버 유지보수·기능 개발과 운영툴 서버 개발·유지보수, 딥링크 구현 담당",
    platforms: ["Android", "iOS"],
    blurb: "Idle tycoon · 미국 Google Play 게임 1위 (2024.07) · Unity Awards Best 2D Visual.",
    blurbTeam: ["미국 Google Play 게임 1위 (2024.07)", "Unity Awards Best 2D Visual"],
    summary:
      "구글 플레이·앱스토어에 출시한 idle tycoon입니다. 팀 성과로 미국 Google Play 게임 카테고리 1위(2024.07)를 기록했고, 제16회 Unity Awards Best 2D Visual 수상작입니다. URP/Shader 비주얼, 광고·분석 SDK, AWS에 배포된 Node.js 인게임 서버와 운영툴 서버 유지보수를 담당했습니다.",
    bullets: [
      "URP 적용 · Shader 개발로 비주얼 품질 개선",
      "Google Mobile Mediation 광고 · Sentry/Firebase/AppsFlyer 분석 SDK 통합",
      "AWS Node.js 인게임 서버 유지보수·기능 개발 · 운영툴 서버 개발·유지보수",
      "딥링크 시스템 구현 · Docker/Nginx, MongoDB/Redis 관리",
    ],
    results: [
      { text: "미국 Google Play 게임 카테고리 1위 (2024.07)", scope: "team" },
      { text: "제16회 Unity Awards Best 2D Visual 수상작", scope: "team" },
      { text: "Google Play · App Store 출시", scope: "team" },
    ],
    proof: [
      {
        label: "Google Play 미국 1위 보도 (마이데일리, 2024.07)",
        href: "https://mydaily.co.kr/page/view/2024072308054084793",
      },
      { label: "Unity Awards 수상 언급 (게임동아, 2025.08)", href: "https://game.donga.com/118732/" },
    ],
    tech: [
      "URP",
      "Shader",
      "Google Mobile Mediation",
      "Firebase",
      "AppsFlyer",
      "Sentry",
      "UniTask",
      "PrimeTween",
      "Node.js",
      "AWS",
      "Docker",
      "MongoDB",
      "Redis",
    ],
    image: "Resource/Neko Omakase/banner.webp",
    icon: "Resource/Neko Omakase/icon.webp",
    stores: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.daerigame.nekomakase&hl=ko",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/kr/app/%EA%B3%A0%EC%96%91%EC%9D%B4-%EC%98%A4%EB%A7%88%EC%B9%B4%EC%84%B8/id6474983122",
      },
    ],
    shots: [
      "Resource/Neko Omakase/store_picture_1.webp",
      "Resource/Neko Omakase/store_picture_2.webp",
    ],
  },
  {
    id: "neko-restaurant",
    featured: 2,
    company: "Nine Digits",
    title: "네코 식당",
    status: "출시",
    period: "2024.11 ~ 2025.04",
    headline: "기존 코드베이스를 유지보수·확장 가능한 구조로 전면 재구성",
    role: "기존 소스 코드 구조 전면 재구성·아키텍처 개선, 로직 재구현·성능 최적화, SDK 통합, Shader 효과 구현 담당",
    platforms: ["Android", "iOS"],
    blurb: "Tycoon/sim · 기존 코드베이스 전면 재구성.",
    summary:
      "구글 플레이·앱스토어에 출시한 타이쿤/시뮬레이션입니다. 기존 코드베이스를 유지보수·확장·성능 관점에서 전면 재구성하고, 요구사항에 맞게 로직을 재구현·리팩터링했습니다.",
    bullets: [
      "기존 코드 구조 전면 재구성 · 아키텍처 개선",
      "요구사항에 맞춘 로직 재구현 · 리팩터링 · 성능 최적화",
      "AppLovin Max · PlayNANOO · Firebase 등 SDK 통합",
      "Shader 기반 비주얼 효과",
    ],
    results: [
      { text: "기존 코드 구조 재구성 완료 — 유지보수성·성능 개선", scope: "personal" },
      { text: "Google Play · App Store 출시", scope: "team" },
    ],
    proof: [],
    tech: [
      "AppLovin Max",
      "PlayNANOO",
      "Firebase",
      "AppsFlyer",
      "ByteBrew",
      "Tapjoy",
      "Shader",
    ],
    image: "Resource/Neko Restaurant/banner.webp",
    icon: "Resource/Neko Restaurant/icon.webp",
    stores: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.buffstudio.aos.neko.restaurant&hl=ko",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/kr/app/%EB%84%A4%EC%BD%94%EC%8B%9D%EB%8B%B9-%EA%B3%A0%EC%96%91%EC%9D%B4-%EC%9A%94%EB%A6%AC-%ED%83%80%EC%9D%B4%EC%BF%A4/id6737997970",
      },
    ],
    shots: [
      "Resource/Neko Restaurant/store_picture_1.webp",
      "Resource/Neko Restaurant/store_picture_2.webp",
    ],
  },
  {
    id: "hero-craft-town",
    featured: 3,
    company: "Nine Digits",
    title: "용사마을 타이쿤",
    status: "출시",
    period: "2025.05 ~ 2026.01",
    headline: "Google Sheets·Cloud API 테이블 파이프라인과 AI 에디터 툴로 게임 데이터 제작 자동화",
    role: "Google Spreadsheet·Cloud API 기반 데이터 테이블 관리 시스템과 AI 에디터 툴 개발, 분석·광고 SDK 연동 담당",
    platforms: ["Android"],
    blurb: "Sheets/Cloud 테이블 파이프라인 · AI 에디터 툴.",
    summary:
      "구글 플레이에 출시한 타이쿤 시뮬레이션입니다. Google Spreadsheet API·Google Cloud API 연동으로 게임 데이터 테이블 관리 시스템을 만들고, AI 기반 에디터 툴로 게임 데이터 생성·수정 과정을 자동화했습니다.",
    bullets: [
      "Google Spreadsheet · Cloud API 기반 데이터 테이블 관리 시스템",
      "AI 기반 에디터 툴로 데이터 생성·수정 자동화",
      "Firebase · AppsFlyer · ByteBrew 분석, AppLovin MAX 광고 수익화",
      "UniTask · PrimeTween 비동기 로직·연출 구조",
    ],
    results: [
      { text: "데이터 관리·에디터 자동화 체계 구축", scope: "personal" },
      { text: "Google Play 출시", scope: "team" },
    ],
    proof: [],
    tech: [
      "Google Sheets API",
      "Google Cloud API",
      "Firebase",
      "AppsFlyer",
      "ByteBrew",
      "AppLovin MAX",
      "UniTask",
      "PrimeTween",
    ],
    image: "Resource/Hero Craft Town/banner.webp",
    icon: "Resource/Hero Craft Town/icon.webp",
    stores: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=kr.co.niedigits.herotown&hl=ko",
      },
    ],
    shots: [
      "Resource/Hero Craft Town/store_picture_1.webp",
      "Resource/Hero Craft Town/store_picture_2.webp",
    ],
  },
  {
    id: "tailed-demon",
    company: "CookApps",
    title: "테일드 데몬 슬레이어 : 라이즈",
    status: "출시",
    period: "2023.02 ~ 2023.10",
    headline: "gRPC 서버 통신 구현과 Spine·보안·광고 SDK 유지보수",
    role: "gRPC 서버 통신 구현, Spine·LIAPP·AppLovin 등 외부 SDK 유지보수, UniTask 비동기 로직 개발 담당",
    platforms: ["Android", "iOS"],
    blurb: "Idle RPG · 구글 플레이 인기 1위 (2023.07) · gRPC / Spine.",
    blurbTeam: ["구글 플레이 인기 1위 (2023.07)"],
    summary:
      "테일드 데몬 슬레이어 후속작으로 구글 플레이·앱스토어에 출시한 idle RPG입니다. 팀 성과로 구글 플레이 인기 순위 1위(2023.07)를 기록했습니다. gRPC 서버 통신, Spine, 보안·광고 SDK, UniTask 비동기를 담당했습니다.",
    bullets: [
      "gRPC 프로토콜 기반 서버 통신 시스템 구현",
      "Spine 2D 애니메이션 · LIAPP 보안 · AppLovin 광고 유지보수",
      "UniTask 비동기 로직 · DOTween 애니메이션",
      "Adjust · OneSignal · HelpShift · Facebook SDK 유지보수",
    ],
    results: [
      { text: "구글 플레이 인기 순위 1위 (2023.07)", scope: "team" },
      { text: "Google Play · App Store 출시", scope: "team" },
    ],
    proof: [
      {
        label: "구글 플레이 인기 1위 보도 (전자신문, 2023.07)",
        href: "https://www.etnews.com/20230704000185",
      },
    ],
    tech: [
      "gRPC",
      "Spine",
      "LIAPP",
      "AppLovin",
      "UniTask",
      "DOTween",
      "Adjust",
      "OneSignal",
    ],
    image: "Resource/Tailed Demon Slayer Rise/banner.webp",
    icon: "Resource/Tailed Demon Slayer Rise/icon.webp",
    stores: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.cookapps.newdemonslayer&hl=ko",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/kr/app/%ED%85%8C%EC%9D%BC%EB%93%9C-%EB%8D%B0%EB%AA%AC-%EC%8A%AC%EB%A0%88%EC%9D%B4%EC%96%B4-%EB%9D%BC%EC%9D%B4%EC%A6%88/id6446585105",
      },
    ],
    shots: [
      "Resource/Tailed Demon Slayer Rise/store_picture_1.webp",
      "Resource/Tailed Demon Slayer Rise/store_picture_2.webp",
    ],
  },
  {
    id: "rumble-squad",
    company: "CookApps",
    title: "우당탕탕 탐험대",
    status: "출시",
    period: "2023.10 ~ 2023.11",
    headline: "MVP의 시스템 데이터 처리·상태 관리 로직과 UI 구현",
    role: "게임 시스템 데이터 처리·시스템 간 연동·상태 관리 로직과 게임플레이·시스템 UI 개발 담당",
    platforms: ["Android", "iOS"],
    blurb: "미국 소프트런칭 MVP · 약 1개월 런칭 · D1 약 60%.",
    blurbTeam: ["약 1개월 런칭", "D1 약 60%"],
    summary:
      "방치형 RPG MVP입니다. 팀이 약 1개월 만에 미국 소프트런칭(Google Play·App Store)을 마쳤고 D1 리텐션 약 60%를 기록했습니다. 게임 시스템 데이터 처리·상태 관리와 UI를 담당했습니다.",
    bullets: [
      "게임 시스템 데이터 처리 로직 개발",
      "시스템 간 데이터 연동 · 상태 관리",
      "게임플레이 · 시스템 UI 개발",
      "UniTask 비동기 처리",
    ],
    results: [
      { text: "약 1개월 내 미국 소프트런칭", scope: "team" },
      { text: "D1 리텐션 약 60%", scope: "team" },
    ],
    proof: [],
    tech: ["Unity", "UniTask"],
    image: "Resource/Rumble Squad/banner.webp",
    icon: "Resource/Rumble Squad/icon.webp",
    stores: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.cookapps.hustle&hl=ko",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/kr/app/%EC%9A%B0%EB%8B%B9%ED%83%95%ED%83%95-%ED%83%90%ED%97%98%EB%8C%80-%EB%B0%A9%EC%B9%98%ED%98%95-rpg/id6479223917",
      },
    ],
    shots: [
      "Resource/Rumble Squad/store_picture_1.webp",
      "Resource/Rumble Squad/store_picture_2.webp",
    ],
  },
  {
    id: "soul-dimension",
    company: "Preflow",
    title: "소울 디멘션",
    status: "미출시",
    period: "2020.09 ~ 2023.01",
    headline: "SG Patcher·AWS CDN 패치와 Asset Bundle 기반 리소스 관리 시스템 구축",
    role: "SG Patcher·AWS CDN 패치 시스템, Asset Bundle 개발·관리, Shader·UniRx 기반 클라이언트 핵심 기능 개발 담당",
    platforms: ["Mobile"],
    blurb: "첫 상업 프로젝트 · CDN / AssetBundle / UniRx.",
    summary:
      "첫 상업 게임 프로젝트(모바일, 미출시)입니다. SG Patcher와 AWS CDN을 연동한 패치 시스템, Asset Bundle 관리, Shader·UniRx 기반 클라이언트 핵심 기능을 개발했습니다.",
    bullets: [
      "SG Patcher 패치 시스템 · AWS CDN 연동",
      "Asset Bundle 시스템 개발·관리",
      "Shader 비주얼 효과 · UniRx 반응형 패턴",
      "게임 클라이언트 핵심 기능 개발",
    ],
    results: [
      { text: "Asset Bundle·CDN 기반 리소스 관리 시스템 구축", scope: "personal" },
    ],
    proof: [],
    tech: ["SG Patcher", "AWS CDN", "Asset Bundle", "UniRx", "Shader"],
    image: "Resource/Soul Dimension/Power_saving_1.webp",
    icon: "Resource/Soul Dimension/Power_saving_1.webp",
    stores: [],
    shots: [
      "Resource/Soul Dimension/Power_saving_1.webp",
      "Resource/Soul Dimension/Power_saving_2.webp",
    ],
  },
  {
    id: "ninedigits-minor",
    company: "Nine Digits",
    title: "기타 참여 프로젝트",
    status: "참여",
    period: "2024.07 ~ 2024.09",
    headline: "참여 타이틀의 SDK·플러그인 통합과 업데이트, 스토어 정책 대응, 콘텐츠 업데이트 지원",
    role: "SDK·플러그인 통합과 버전 업데이트, 스토어 정책 대응, 콘텐츠 업데이트 담당",
    platforms: ["Mobile", "Steam"],
    blurb: "SDK·스토어 정책·콘텐츠 업데이트 지원.",
    summary:
      "고요의 정원, 천년의 소녀(스팀/모바일), 로스트 파라다이스, 미라클 초이스 등에서 SDK·플러그인, 스토어 정책, 콘텐츠 업데이트를 지원했습니다.",
    bullets: [
      "고요의 정원 (2024.07 ~ 2024.08) — SDK·플러그인 통합, 일부 게임 시스템",
      "미라클 초이스 · 로스트 파라다이스 · 천년의 소녀 Steam/Mobile (2024.08 ~ 2024.09) — SDK 버전 업데이트",
      "스토어 정책 대응 · 게임 콘텐츠 업데이트",
    ],
    results: [],
    proof: [],
    tech: ["Unity", "SDK·플러그인", "스토어 정책"],
    image: "Resource/Koyo Town/banner.webp",
    stores: [],
    shots: [],
    minor: [
      { name: "고요의 정원", img: "Resource/Koyo Town/icon.webp" },
      {
        name: "천년의 소녀 Steam",
        img: "Resource/Memories Millennium Girl Steam/icon.webp",
      },
      {
        name: "천년의 소녀 Mobile",
        img: "Resource/Memories Millennium Girl Mobile/icon.webp",
      },
      { name: "로스트 파라다이스", img: "Resource/Lost Paradise/icon.webp" },
      { name: "미라클 초이스", img: "Resource/Miracle Choice/icon.webp" },
    ],
  },
];

const PERSONAL_ROLE = "개인 프로젝트 — 설계·구현";

const PERSONAL_PROJECTS = [
  {
    id: "narak",
    hidden: true,
    company: "Personal",
    title: "narak",
    status: "개인",
    period: "",
    headline: "걸을 수 있는 경로를 고려한 수직 동굴 프로시저럴 생성 실험",
    role: PERSONAL_ROLE,
    blurb: "수직 동굴 프로시저럴 생성.",
    summary:
      "수직·레이어드 동굴 탐험을 위한 프로시저럴 생성 실험입니다. 걸을 수 있는 경로, 아트리움, 청크 스트리밍 프로토타입을 다룹니다.",
    bullets: [
      "수직 하강형 동굴 프로시저럴 생성",
      "워크 가능 경로·공간 레이아웃",
      "청크 스트리밍 프로토타입",
    ],
    tech: ["Unity 6", "C#", "Procedural"],
    image: "Resource/Personal/narak/preview.webp",
    stores: [],
    shots: [
      "Resource/Personal/narak/preview.webp",
      "Resource/Personal/narak/angle.webp",
    ],
    repo: null,
  },
  {
    id: "gssl",
    company: "Personal",
    title: "GoogleSpreadSheetLoader",
    status: "툴",
    period: "",
    headline: "비공개 Google Sheets를 Enum·TableData·로컬라이즈 JSON으로 자동 생성하는 에디터 파이프라인",
    role: PERSONAL_ROLE,
    platforms: ["Unity Editor"],
    blurb: "Private Sheets → Enum / TableData / 로컬라이즈.",
    summary:
      "비공개 Google Sheets를 Unity Enum, TableData ScriptableObject, 로컬라이즈 JSON으로 생성하는 에디터 파이프라인입니다.",
    bullets: [
      "Sheets API v4 연동",
      "Enum / SO / JSON 코드젠",
      "Unity 패키지(.unitypackage) 배포",
    ],
    tech: ["Unity", "C#", "Google Sheets API"],
    image: null,
    stores: [],
    shots: [],
    repo: "https://github.com/cyKim0115/GoogleSpreadSheetLoader",
    docs: "https://cykim.gitbook.io/googlespreadsheetloader/",
    codeLink: "https://cykim0115.github.io/code_portfolio/#tools-gssl",
  },
  {
    id: "myutil",
    hidden: true,
    company: "Personal",
    title: "MyUtil",
    status: "툴",
    period: "",
    headline: "반복해서 쓰는 Unity 유틸·어트리뷰트·UI 헬퍼를 재사용 팩으로 정리",
    role: PERSONAL_ROLE,
    blurb: "Unity 일상 유틸·어트리뷰트·UI 헬퍼.",
    summary:
      "ChildUtil, PlatformUtil, SerializableDictionary, LitMotion/UniTask UI 헬퍼 등 재사용 Unity 유틸리티 팩입니다.",
    bullets: [
      "에디터·런타임 헬퍼",
      "Inspector 어트리뷰트",
      "GitBook 문서",
    ],
    tech: ["Unity", "C#", "LitMotion", "UniTask"],
    image: null,
    stores: [],
    shots: [],
    repo: "https://github.com/cyKim0115/MyUtil",
    docs: "https://cykim.gitbook.io/myutil/",
    codeLink: "https://cykim0115.github.io/code_portfolio/#tools-myutil",
  },
  {
    id: "cursor-widget",
    company: "Personal",
    title: "cursor-usage-widget",
    status: "툴",
    period: "",
    headline: "대시보드를 열지 않고 Cursor 사용량을 확인하는 상시 데스크톱 위젯",
    role: PERSONAL_ROLE,
    platforms: ["Windows"],
    blurb: "Cursor 사용량 플로팅 데스크톱 위젯.",
    summary:
      "Cursor Included usage(Cursor / Other 트랙)를 대시보드 없이 확인하는 Windows 플로팅 위젯입니다.",
    bullets: ["Tauri 2 + TypeScript", "사용량 트랙 표시", "상시 데스크톱 위젯"],
    tech: ["Tauri 2", "TypeScript", "Vite"],
    image: null,
    stores: [],
    shots: [],
  },
  {
    id: "flex-widget",
    hidden: true,
    company: "Personal",
    title: "flex-work-widget",
    status: "툴",
    period: "",
    headline: "브라우저 세션으로 Flex 오늘 근무시간을 바로 보여주는 위젯",
    role: PERSONAL_ROLE,
    blurb: "Flex 오늘 누적 근무시간 위젯.",
    summary:
      "브라우저 세션을 활용해 Flex 오늘의 누적 근무·출퇴근 상태를 보여주는 가벼운 데스크톱 위젯입니다.",
    bullets: ["Tauri 2", "브라우저 세션 연동", "오늘 근무 시간 추적"],
    tech: ["Tauri 2", "TypeScript", "Python"],
    image: null,
    stores: [],
    shots: [],
  },
];

/**
 * AI Workflow — 에이전트에게 일을 시키는 방식 자체를 설계한 작업.
 * 산출물이 코드가 아니라 프로토콜·룰·파이프라인인 항목을 모은다.
 * 측정 수치가 없으면 "생산성 향상"을 results 에 쓰지 않는다.
 */
const AI_PROJECTS = [
  {
    id: "system-crew",
    company: "Agent Protocol",
    title: "system-crew",
    status: "공개 팩",
    period: "",
    headline: "추측 코딩을 막는 승인 게이트형 4역할 에이전트 프로토콜",
    role: PERSONAL_ROLE,
    blurb: "참고 → 스펙 → 구현 → 검수, 4역할 에이전트 프로토콜.",
    summary:
      "참고 자료에서 비슷한 게임 시스템을 설계·구현·검증하기 위한 4역할 에이전트 프로토콜 팩입니다. Producer가 오케스트레이터로 접수·범위 확정·라우팅만 맡고, Systems Analyst·Implementer·Fidelity QA가 각 단계를 이어받습니다. 추측으로 바로 코딩하지 않도록 승인 게이트를 강제하고, 룰 자체를 버전 관리해 서브모듈로 여러 게임 프로젝트에 배포합니다.",
    bullets: [
      "Orchestrator–Workers — Producer가 유사도(faithful/inspired)·범위를 고정하고 역할로 라우팅",
      "승인 게이트 파이프라인 — 스펙 승인 전 구현 금지, QA가 NEEDS_FIX면 구현으로 역류",
      "루브릭 판정 — 실현성·방향성·효율 3축으로 아이디어를 ADOPT / DEFER / REJECT",
      "룰을 코드처럼 관리 — VERSION·CHANGELOG + submodule sync로 프로젝트에 배포",
    ],
    tech: ["Cursor", "Claude Code", "Markdown", "Git submodule", "GitBook"],
    image: null,
    stores: [],
    shots: [],
    repo: "https://github.com/cyKim0115/system-crew",
    docs: "https://cykim.gitbook.io/system-crew/",
    codeLink: "https://cykim0115.github.io/code_portfolio/#agent-protocol",
  },
  {
    id: "better-plan",
    company: "Agent App",
    title: "Better Plan Mode",
    status: "공개",
    period: "",
    headline: "에이전트 계획을 웹 보드에서 검토·수정하고 골라서 실행시키는 도구",
    role: PERSONAL_ROLE,
    blurb: "계획을 웹 보드에서 검토·수정하고 부분 착수시키는 Claude 루프.",
    summary:
      "에이전트의 계획 수립을 채팅 밖 웹 보드로 꺼낸 도구입니다. Agent SDK가 코드베이스를 읽기 전용으로 탐색해 실행 계획을 세우면, 계획표에 코멘트를 달아 수정시키고 원하는 태스크만 골라 실행시킵니다. MCP로 필요할 때만 보드를 띄우고, 원격 워커 모드로 다른 PC의 Claude가 이 PC에 작업을 제출합니다.",
    bullets: [
      "계획 생성 → 코멘트 → revision 루프 (Human-in-the-loop 게이트)",
      "선택한 태스크만 부분 착수 — 전량 실행 강요 없음",
      "MCP 연동 · 원격 접근 · 원격 워커(작업 제출 · PR · 웹훅)",
    ],
    tech: ["Node.js", "Claude Agent SDK", "MCP", "REST API"],
    image: null,
    stores: [],
    shots: [],
    repo: "https://github.com/cyKim0115/claude-better-plan-mode",
    docs: "https://cykim.gitbook.io/claude-better-plan/",
  },
  {
    id: "rag-pipeline",
    company: "Knowledge",
    title: "지식 RAG 파이프라인",
    status: "개인",
    period: "",
    headline: "작업에서 나온 결론을 정제·색인해 다음 작업에서 다시 찾게 하는 개인 RAG",
    role: PERSONAL_ROLE,
    blurb: "작업에서 얻은 지식을 정제·색인해 에디터에서 검색.",
    summary:
      "세션에서 나온 결론·리서치를 그때만 쓰고 버리지 않도록, 정제본으로 적재하고 검색까지 붙인 개인 RAG 파이프라인입니다. 색인을 쓰는 기기(Canon)와 검색만 하는 기기(Thin)를 분리하고, 에디터에서는 MCP 서버로 붙습니다. 에이전트가 작업 마무리에 캡처 여부를 판단해 정제본을 남기고 Discord로 보고합니다.",
    bullets: [
      "청킹 → BGE 임베딩 → 리랭킹 검색 파이프라인",
      "Canon(색인 전용) / Thin(검색 전용) 2기기 · 인덱스는 패키징해 배포",
      "capture-to-rag — 대화 산출물을 정제본으로 적재 + Discord 보고",
      "팩 릴리스를 자동 캡처해 다른 기기가 '적용할 업데이트'를 조회",
    ],
    tech: ["Python", "MCP", "BGE embedding", "Reranker", "PowerShell"],
    image: null,
    stores: [],
    shots: [],
  },
  {
    id: "cursor-bootstrap",
    hidden: true,
    company: "Dev Env",
    title: "cursor-bootstrap",
    status: "개인",
    period: "",
    headline: "AI 작업 환경(스킬·룰·MCP)을 새 장치에 그대로 재현하는 부트스트랩",
    role: PERSONAL_ROLE,
    blurb: "AI 작업 환경(스킬·룰·MCP)을 새 장치에 그대로 재현.",
    summary:
      "장치를 옮길 때마다 AI 설정을 다시 맞추는 문제를 없앤 부트스트랩 저장소입니다. 스킬·룰·훅의 정본을 플러그인 번들 하나로 유지해 복제 트리가 갈라지지 않게 하고, 설치·진단 스크립트와 네트워크 없는 통합 테스트로 장치 간 차이를 검증합니다. 비밀값·인증 파일은 저장하지 않습니다.",
    bullets: [
      "스킬 · 룰 · 훅의 정본을 단일 플러그인 번들로 유지",
      "MCP · 스킬 · IDE 프로필 카탈로그와 프로젝트 유형별 템플릿",
      "install / doctor 스크립트 + 오프라인 통합 테스트",
    ],
    tech: ["PowerShell", "Cursor", "Claude Code", "MCP"],
    image: null,
    stores: [],
    shots: [],
  },
  {
    id: "nim-chat",
    hidden: true,
    company: "Agent App",
    title: "NIM Chat",
    status: "개인",
    period: "",
    headline: "정적 호스팅의 CORS 한계를 Worker 프록시로 풀고 tool-calling 루프를 직접 구현",
    role: PERSONAL_ROLE,
    platforms: ["Web"],
    blurb: "Cloudflare Worker 안에서 도는 tool-calling 에이전트 웹앱.",
    summary:
      "NVIDIA NIM 모델을 쓰는 모바일 우선 채팅 웹앱입니다. 브라우저 CORS 때문에 정적 호스팅만으로는 불가능한 구조를, Workers로 UI와 API 프록시를 함께 배포해 풀었습니다. 채팅 모드 외에 에이전트 모드를 두어 Worker 안에서 tool-calling 루프를 직접 돌리고, 규칙·스킬·웹검색·원격 MCP를 도구로 붙였습니다.",
    bullets: [
      "Worker 런타임에서 tool-calling 루프 직접 구현",
      "규칙 · 스킬 · 웹검색 · 원격 MCP를 도구로 등록",
      "정적 자산 + API 프록시 동시 배포로 CORS 우회",
    ],
    tech: ["Cloudflare Workers", "NVIDIA NIM", "MCP", "JavaScript"],
    image: null,
    stores: [],
    shots: [],
  },
  {
    id: "nimu-trpg",
    hidden: true,
    company: "Agent App",
    title: "Nimu-TRPG",
    status: "개인",
    period: "",
    headline: "세션이 끊겨도 맥락이 이어지도록 상태를 파일로 영속화한 LLM GM TRPG",
    role: PERSONAL_ROLE,
    platforms: ["Web"],
    blurb: "LLM을 GM으로 두고 턴 단위로 진행하는 TRPG 웹앱.",
    summary:
      "LLM GM(니무)이 진행하는 TRPG 웹 애플리케이션입니다. 월드·캐릭터 상태를 파일로 영속화해 세션이 끊겨도 맥락이 이어지도록 했고, GM 프로바이더를 교체할 수 있게 추상화했습니다.",
    bullets: [
      "멀티 LLM 프로바이더 GM 에이전트",
      "캠페인 · 캐릭터 파일 영속화로 장기 컨텍스트 유지",
      "SSE 턴 스트리밍",
    ],
    tech: ["Node.js", "Cloudflare Workers", "LLM"],
    image: null,
    stores: [],
    shots: [],
  },
];

/** Code 섹션 토픽 — id 는 https://cykim0115.github.io/code_portfolio/#<id> 앵커 (그쪽 topics.json 에 실재해야 한다). */
const CODE_TOPICS = [
  { label: "튜토리얼 시스템", id: "tutorial" },
  { label: "섬 노이즈 생성", id: "island-noise" },
  { label: "메시 결합 · 콜라이더 최적화", id: "mesh-collider" },
  { label: "Managers · Event · Pool", id: "architecture" },
  { label: "AI 에이전트 프로토콜 · 룰 원문", id: "agent-protocol" },
  { label: "개인 툴 GSSL", id: "tools-gssl" },
  { label: "MyUtil", id: "tools-myutil" },
];

/** 카테고리 정의 — 탭·목차·PDF·해시 라우팅이 모두 이 맵을 따른다. */
const CATEGORIES = {
  company: {
    label: "Company",
    list: COMPANY_PROJECTS,
    hint: "회사에서 맡은 출시·개발 프로젝트입니다. 순위·수상·리텐션은 팀 성과로 따로 표기합니다.",
  },
  personal: {
    label: "Personal",
    list: PERSONAL_PROJECTS,
    hint: "업무 밖에서 직접 만든 Unity 에디터 툴과 데스크톱 유틸리티입니다.",
  },
  ai: {
    label: "AI Workflow",
    list: AI_PROJECTS,
    hint: "Unity 클라이언트가 주력이고, 반복 작업·검증·지식 탐색을 줄이려고 에이전트 워크플로를 직접 설계해 씁니다. 산출물은 코드보다 프로토콜·룰·파이프라인입니다.",
  },
};

// hidden 항목은 내보내기 전에 걸러서 script.js 가 따로 신경 쓸 필요가 없게 한다
for (const cat of Object.values(CATEGORIES)) {
  cat.list = cat.list.filter((p) => !p.hidden);
}

// 대표 작업 — featured 번호 순으로 id 를 모은다 (hidden 은 위에서 이미 빠졌다)
const FEATURED = Object.values(CATEGORIES)
  .flatMap((cat) => cat.list)
  .filter((p) => p.featured)
  .sort((a, b) => a.featured - b.featured)
  .map((p) => p.id);

/** script.js 가 읽는 유일한 진입점. */
window.PORTFOLIO = {
  categories: CATEGORIES,
  featured: FEATURED,
  codeTopics: CODE_TOPICS,
  profile: { updated: "2026.11" },
};

})();
