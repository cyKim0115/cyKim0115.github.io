/**
 * 포트폴리오 데이터 — 화면 로직(script.js)과 분리된 파일.
 *
 * 항목을 추가·수정할 때는 이 파일만 고치면 된다. 렌더링·필터·PDF 는
 * 아래 CATEGORIES 를 그대로 따라가므로 script.js 를 건드릴 필요가 없다.
 *
 * 프로젝트 한 항목의 형태:
 *   {
 *     id,                       // 필수 · 해시 링크(#id)로 쓰인다. 카테고리 안에서 유일
 *     company,                  // 카드 배지 문구 (회사명 또는 유형 라벨)
 *     title, status, period,
 *     blurb,                    // 카드에 보이는 한 줄
 *     summary,                  // 상세 패널 문단
 *     bullets: [],              // 상세 패널 목록
 *     tech: [],                 // 스택 태그
 *     image: null,              // 배너 (없으면 placeholder)
 *     stores: [{label, href}],  // 스토어 링크
 *     shots: [],                // 상세 스크린샷 (최대 4장 표시)
 *     repo, docs, codeLink,     // 선택 링크 버튼
 *     minor: [{name, img}],     // 선택 · 묶음 프로젝트 아이콘 목록
 *     hidden: true,             // 선택 · 데이터는 남기고 화면·PDF 에서만 뺀다
 *   }
 *
 * 카테고리를 새로 만들려면 배열 하나와 CATEGORIES 항목 하나를 추가하고,
 * index.html 의 filter-group 에 같은 key 로 버튼을 넣는다.
 * 배지 색이 필요하면 style.css 에 `.badge-<key>` 를 더한다.
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
    blurb: "Unity idle/tycoon — 아일랜드·생산·성장 루프 클라이언트.",
    summary:
      "BlackStorm에서 진행 중인 Unity idle/tycoon 클라이언트입니다. 섬·생산 건물·캐릭터 배치와 월드 UI를 중심으로 구현하고 있으며, 섬 노이즈 생성·메시 결합·콜라이더 최적화 등 런타임 퍼포먼스 작업도 포함합니다.",
    bullets: [
      "아일랜드 기반 생산·성장 루프 클라이언트",
      "월드 스페이스 UI · 캐릭터/건물 배치",
      "프로시저럴 섬·메시/콜라이더 최적화 진행",
    ],
    tech: ["Unity 6", "C#", "UniTask"],
    image: null,
    stores: [],
    shots: [],
  },
  {
    id: "maximizer-mvp",
    company: "MAXIMIZER",
    title: "MAXIMIZER MVP",
    status: "2026.02–05",
    period: "2026.02 ~ 2026.05",
    blurb: "신규팀 개발 환경·아키텍처·MVP 파이프라인 구축.",
    summary:
      "MAXIMIZER 합류 후 신규 개발팀의 초기 개발 환경과 아키텍처를 설계하고, MVP 방식에 맞춘 빌드/배포 파이프라인과 핵심 기능 중심 프로토타이핑을 담당했습니다.",
    bullets: [
      "초기 개발 환경 및 아키텍처 설계",
      "MVP 빌드·배포 파이프라인 구축",
      "핵심 기능 중심 빠른 프로토타입·클라이언트 구현",
    ],
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
    image: "Resource/MAXIMIZER_MVP/banner.png",
    stores: [],
    shots: [],
  },
  {
    id: "neko-omakase",
    company: "Nine Digits",
    title: "고양이 오마카세",
    status: "출시",
    period: "",
    blurb: "Idle tycoon · App Store US #1 · Unity Awards Visual.",
    summary:
      "구글 플레이·앱스토어에 출시한 idle tycoon입니다. 미국 앱스토어 1위, 2025 Unity Awards Visual을 기록했으며 URP/Shader 비주얼, 광고·분석 SDK, 서버/운영 도구 유지보수를 담당했습니다.",
    bullets: [
      "App Store 미국 1위 · 2025 Unity Awards Visual",
      "URP/Shader 기반 비주얼 품질",
      "광고·분석 SDK 및 Node.js 운영 도구",
    ],
    tech: [
      "URP",
      "Shader",
      "Google Mobile Mediation",
      "Firebase",
      "AppsFlyer",
      "UniTask",
      "PrimeTween",
      "Node.js",
    ],
    image: "Resource/Neko Omakase/banner.jpg",
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
      "Resource/Neko Omakase/store_picture_1.jpg",
      "Resource/Neko Omakase/store_picture_2.jpg",
    ],
  },
  {
    id: "neko-restaurant",
    company: "Nine Digits",
    title: "네코 식당",
    status: "출시",
    period: "",
    blurb: "Tycoon/sim · 인수 코드베이스 전면 재설계.",
    summary:
      "타이쿤/시뮬레이션 출시작입니다. 인수받은 코드베이스를 유지보수·확장·성능 관점에서 전면 재설계·리팩터링을 주도했습니다.",
    bullets: [
      "출시 타이쿤/시뮬레이션 클라이언트",
      "레거시 코드 전면 재아키텍처",
      "광고·분석·계정 SDK 통합",
    ],
    tech: [
      "AppLovin Max",
      "PlayNANOO",
      "Firebase",
      "AppsFlyer",
      "ByteBrew",
      "Shader",
    ],
    image: "Resource/Neko Restaurant/banner.png",
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
      "Resource/Neko Restaurant/store_picture_1.png",
      "Resource/Neko Restaurant/store_picture_2.png",
    ],
  },
  {
    id: "hero-craft-town",
    company: "Nine Digits",
    title: "용사마을 타이쿤",
    status: "출시",
    period: "",
    blurb: "Sheets/Cloud 테이블 파이프라인 · AI 에디터 툴.",
    summary:
      "구글 플레이 타이쿤 시뮬레이션입니다. 스프레드시트·클라우드 API 기반 테이블 파이프라인과 에디터 AI 툴링으로 제작 효율을 높였습니다.",
    bullets: [
      "Google Spreadsheet / Cloud 테이블 파이프라인",
      "에디터 AI 툴로 콘텐츠 제작 효율화",
      "광고·분석 SDK 연동",
    ],
    tech: [
      "Firebase",
      "AppsFlyer",
      "ByteBrew",
      "AppLovin MAX",
      "UniTask",
      "PrimeTween",
    ],
    image: "Resource/Hero Craft Town/banner.png",
    stores: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=kr.co.niedigits.herotown&hl=ko",
      },
    ],
    shots: [
      "Resource/Hero Craft Town/store_picture_1.png",
      "Resource/Hero Craft Town/store_picture_2.png",
    ],
  },
  {
    id: "tailed-demon",
    company: "CookApps",
    title: "테일드 데몬 슬레이어 : 라이즈",
    status: "출시",
    period: "",
    blurb: "Idle RPG · 양대 스토어 1위 · gRPC / Spine.",
    summary:
      "시퀄 idle RPG로 구글 플레이·앱스토어 출시 후 양대 스토어 1위를 기록했습니다. gRPC, Spine, 보안·광고 SDK, UniTask 비동기를 담당했습니다.",
    bullets: [
      "양대 스토어 1위",
      "gRPC · Spine · LIAPP · AppLovin",
      "UniTask 기반 비동기 클라이언트",
    ],
    tech: [
      "gRPC",
      "Spine",
      "LIAPP",
      "AppLovin",
      "UniTask",
      "DOTween",
      "OneSignal",
    ],
    image: "Resource/Tailed Demon Slayer Rise/banner.png",
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
      "Resource/Tailed Demon Slayer Rise/store_picture_1.jpg",
      "Resource/Tailed Demon Slayer Rise/store_picture_2.jpg",
    ],
  },
  {
    id: "rumble-squad",
    company: "CookApps",
    title: "우당탕탕 탐험대",
    status: "출시",
    period: "",
    blurb: "미국 소프트런칭 MVP · 1개월 런칭 · D1 60%.",
    summary:
      "수집형 idle RPG MVP로 약 1개월 만에 미국 소프트런칭을 완료했고 D1 리텐션 약 60%를 기록했습니다. 성장·가챠 데이터와 UI를 담당했습니다.",
    bullets: [
      "약 1개월 내 미국 소프트런칭",
      "D1 리텐션 약 60%",
      "성장·가챠 데이터 및 UI",
    ],
    tech: ["UniTask", "Unity"],
    image: "Resource/Rumble Squad/banner.png",
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
      "Resource/Rumble Squad/store_picture_1.jpg",
      "Resource/Rumble Squad/store_picture_2.jpg",
    ],
  },
  {
    id: "soul-dimension",
    company: "Preflow",
    title: "소울 디멘션",
    status: "미출시",
    period: "",
    blurb: "첫 상업 프로젝트 · CDN / AssetBundle / UniRx.",
    summary:
      "첫 상업 게임 프로젝트(미출시)입니다. AWS CDN, Asset Bundle, UniRx, Shader 작업을 하며 UX와 협업의 중요성을 체득한 시작점이 되었습니다.",
    bullets: [
      "AWS CDN · Asset Bundle 파이프라인",
      "UniRx · Shader",
      "클라이언트 UX·협업 관점의 출발점",
    ],
    tech: ["AWS CDN", "Asset Bundle", "UniRx", "Shader"],
    image: "Resource/Soul Dimension/Power_saving_1.png",
    stores: [],
    shots: [
      "Resource/Soul Dimension/Power_saving_1.png",
      "Resource/Soul Dimension/Power_saving_2.png",
    ],
  },
  {
    id: "ninedigits-minor",
    company: "Nine Digits",
    title: "기타 참여 프로젝트",
    status: "참여",
    period: "",
    blurb: "SDK·스토어 정책·콘텐츠 업데이트 지원.",
    summary:
      "고요의 정원, 천년의 소녀(스팀/모바일), 로스트 파라다이스, 미라클 초이스 등에서 SDK·플러그인, 스토어 정책, 콘텐츠 업데이트를 지원했습니다.",
    bullets: [
      "고요의 정원 — SDK/플러그인·일부 시스템",
      "천년의 소녀 Steam — 콘텐츠 업데이트",
      "모바일·기타 타이틀 — SDK·스토어 정책",
    ],
    tech: ["Unity", "Firebase", "Store policy"],
    image: "Resource/Koyo Town/banner.png",
    stores: [],
    shots: [],
    minor: [
      { name: "고요의 정원", img: "Resource/Koyo Town/icon.png" },
      {
        name: "천년의 소녀 Steam",
        img: "Resource/Memories Millennium Girl Steam/icon.png",
      },
      {
        name: "천년의 소녀 Mobile",
        img: "Resource/Memories Millennium Girl Mobile/icon.png",
      },
      { name: "로스트 파라다이스", img: "Resource/Lost Paradise/icon.png" },
      { name: "미라클 초이스", img: "Resource/Miracle Choice/icon.png" },
    ],
  },
];

const PERSONAL_PROJECTS = [
  {
    id: "narak",
    hidden: true,
    company: "Personal",
    title: "narak",
    status: "개인",
    period: "",
    blurb: "수직 동굴 프로시저럴 생성.",
    summary:
      "수직·레이어드 동굴 탐험을 위한 프로시저럴 생성 실험입니다. 걸을 수 있는 경로, 아트리움, 청크 스트리밍 프로토타입을 다룹니다.",
    bullets: [
      "수직 하강형 동굴 프로시저럴 생성",
      "워크 가능 경로·공간 레이아웃",
      "청크 스트리밍 프로토타입",
    ],
    tech: ["Unity 6", "C#", "Procedural"],
    image: "Resource/Personal/narak/preview.png",
    stores: [],
    shots: [
      "Resource/Personal/narak/preview.png",
      "Resource/Personal/narak/angle.png",
    ],
    repo: null,
  },
  {
    id: "gssl",
    company: "Personal",
    title: "GoogleSpreadSheetLoader",
    status: "툴",
    period: "",
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
 */
const AI_PROJECTS = [
  {
    id: "system-crew",
    company: "Agent Protocol",
    title: "system-crew",
    status: "공개 팩",
    period: "",
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

const CODE_TOPICS = [
  "튜토리얼 시스템",
  "섬 노이즈 생성",
  "메시 결합",
  "콜라이더 최적화",
  "Managers / Event bus",
  "AI 에이전트 프로토콜 (룰 원문)",
  "개인 툴 (GSSL)",
];

/** 카테고리 정의 — 필터·PDF·해시 라우팅이 모두 이 맵을 따른다. */
const CATEGORIES = {
  company: {
    label: "Company",
    list: COMPANY_PROJECTS,
    hint: "회사에서 참여·리드한 출시/진행 프로젝트입니다.",
  },
  personal: {
    label: "Personal",
    list: PERSONAL_PROJECTS,
    hint: "개인 실험·툴입니다. 스크린샷은 추후 보강합니다.",
  },
  ai: {
    label: "AI Workflow",
    list: AI_PROJECTS,
    hint: "에이전트에게 일을 시키는 방식 자체를 설계한 작업입니다. 산출물이 코드가 아니라 프로토콜·룰·파이프라인입니다.",
  },
};

// hidden 항목은 내보내기 전에 걸러서 script.js 가 따로 신경 쓸 필요가 없게 한다
for (const cat of Object.values(CATEGORIES)) {
  cat.list = cat.list.filter((p) => !p.hidden);
}

/** script.js 가 읽는 유일한 진입점. */
window.PORTFOLIO = {
  categories: CATEGORIES,
  codeTopics: CODE_TOPICS,
};

})();
