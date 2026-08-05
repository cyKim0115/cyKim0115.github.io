/**
 * Portfolio data + UI
 * Company / Personal categories; detail panel
 */

const COMPANY_PROJECTS = [
  {
    id: "project-t",
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
    id: "nimu-trpg",
    company: "Personal",
    title: "Nimu-TRPG",
    status: "개인",
    period: "",
    blurb: "LLM GM 에이전트 기반 TRPG 웹앱.",
    summary:
      "파일에 월드·캐릭터 상태를 남기며 턴 단위로 진행하는 LLM GM(니무) TRPG 웹 애플리케이션입니다. 로컬 서버와 Cloudflare Workers를 사용합니다.",
    bullets: [
      "멀티 LLM 프로바이더 GM 에이전트",
      "캠페인·캐릭터 파일 영속화",
      "SSE 턴 진행",
    ],
    tech: ["Node.js", "Cloudflare Workers", "LLM"],
    image: null,
    stores: [],
    shots: [],
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
  {
    id: "system-crew",
    company: "Personal",
    title: "system-crew",
    status: "DX",
    period: "",
    blurb: "참고 → 스펙 → 구현 → 검수 Cursor 에이전트 팩.",
    summary:
      "게임 참고 자료에서 비슷한 시스템을 설계·구현·검증하기 위한 4역할(Producer / Analyst / Implementer / Fidelity QA) Cursor 에이전트 프로토콜 팩입니다.",
    bullets: [
      "4역할 오케스트레이션",
      "참고 자산화 · 아이디어 평가",
      "서브모듈 + sync로 프로젝트 배포",
    ],
    tech: ["Cursor", "Markdown", "GitBook"],
    image: null,
    stores: [],
    shots: [],
    repo: "https://github.com/cyKim0115/system-crew",
    docs: "https://cykim.gitbook.io/system-crew/",
  },
];

const CODE_TOPICS = [
  "튜토리얼 시스템",
  "섬 노이즈 생성",
  "메시 결합",
  "콜라이더 최적화",
  "Managers / Event bus",
  "개인 툴 (GSSL · MyUtil)",
];

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "className") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (v !== null && v !== undefined) {
      node.setAttribute(k, v);
    }
  });
  children.forEach((c) => {
    if (c == null) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

function renderCard(project, category) {
  const media = project.image
    ? el("div", { className: "card-media" }, [
        el("img", {
          src: project.image,
          alt: project.title,
          loading: "lazy",
        }),
      ])
    : el("div", { className: "card-media placeholder", text: project.title });

  const badgeClass =
    category === "personal" ? "badge badge-personal" : "badge";

  return el(
    "button",
    {
      className: "project-card",
      type: "button",
      "data-id": project.id,
      "data-category": category,
      "aria-expanded": "false",
    },
    [
      media,
      el("div", { className: "card-body" }, [
        el("div", { className: "card-meta" }, [
          el("span", { className: badgeClass, text: project.company }),
          el("span", { text: project.status }),
        ]),
        el("h3", { className: "card-title", text: project.title }),
        el("p", { className: "card-blurb", text: project.blurb }),
      ]),
    ]
  );
}

function renderDetail(project) {
  const panel = document.getElementById("detail-panel");
  panel.classList.add("is-open");
  panel.innerHTML = "";

  const hasMedia = Boolean(project.image) || (project.shots && project.shots.length);

  const mediaCol = el("div", { className: "detail-media" });
  if (project.image) {
    mediaCol.appendChild(
      el("img", {
        className: "detail-banner",
        src: project.image,
        alt: project.title,
      })
    );
  } else {
    mediaCol.appendChild(
      el("div", {
        className: "detail-banner placeholder",
        text: project.title,
      })
    );
  }

  if (project.shots && project.shots.length) {
    const shots = el("div", { className: "store-shots" });
    project.shots.slice(0, 4).forEach((src) => {
      shots.appendChild(el("img", { src, alt: "", loading: "lazy" }));
    });
    mediaCol.appendChild(shots);
  }

  if (project.minor) {
    const minor = el("div", { className: "minor-grid" });
    project.minor.forEach((m) => {
      minor.appendChild(
        el("div", { className: "minor-item" }, [
          el("img", { src: m.img, alt: m.name, loading: "lazy" }),
          el("span", { text: m.name }),
        ])
      );
    });
    mediaCol.appendChild(minor);
  }

  const copy = el("div", { className: "detail-copy" });
  const metaLine = [project.company, project.period || project.status]
    .filter(Boolean)
    .join(" · ");
  copy.appendChild(el("p", { html: `<strong>${metaLine}</strong>` }));
  copy.appendChild(el("p", { text: project.summary }));

  if (project.bullets && project.bullets.length) {
    const ul = el("ul");
    project.bullets.forEach((b) => ul.appendChild(el("li", { text: b })));
    copy.appendChild(ul);
  }

  if (project.tech && project.tech.length) {
    const tech = el("div", { className: "detail-tech" });
    project.tech.forEach((t) => tech.appendChild(el("span", { text: t })));
    copy.appendChild(tech);
  }

  const links = el("div", { className: "detail-links" });
  (project.stores || []).forEach((s) => {
    links.appendChild(
      el("a", {
        className: "btn btn-ghost",
        href: s.href,
        target: "_blank",
        rel: "noopener noreferrer",
        text: s.label,
      })
    );
  });
  if (project.repo) {
    links.appendChild(
      el("a", {
        className: "btn btn-ghost",
        href: project.repo,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "GitHub",
      })
    );
  }
  if (project.docs) {
    links.appendChild(
      el("a", {
        className: "btn btn-ghost",
        href: project.docs,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "GitBook",
      })
    );
  }
  if (project.codeLink) {
    links.appendChild(
      el("a", {
        className: "btn btn-primary",
        href: project.codeLink,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "Code Portfolio",
      })
    );
  }
  if (links.childNodes.length) copy.appendChild(links);

  const layout = el("div", {
    className: hasMedia ? "detail-layout has-media" : "detail-layout",
  });
  layout.appendChild(mediaCol);
  layout.appendChild(copy);

  panel.appendChild(
    el("div", { className: "detail-top" }, [
      el("h3", { text: project.title }),
      el(
        "button",
        {
          className: "detail-close",
          type: "button",
          text: "닫기",
          onClick: () => closeDetail(),
        }
      ),
    ])
  );
  panel.appendChild(layout);

  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

let activeCategory = "company";
let activeId = null;

function getList() {
  return activeCategory === "company" ? COMPANY_PROJECTS : PERSONAL_PROJECTS;
}

function findProject(id) {
  return (
    COMPANY_PROJECTS.find((p) => p.id === id) ||
    PERSONAL_PROJECTS.find((p) => p.id === id)
  );
}

function closeDetail() {
  activeId = null;
  const panel = document.getElementById("detail-panel");
  panel.classList.remove("is-open");
  panel.innerHTML = "";
  document.querySelectorAll(".project-card.is-active").forEach((c) => {
    c.classList.remove("is-active");
    c.setAttribute("aria-expanded", "false");
  });
}

function renderGrid() {
  const grid = document.getElementById("project-grid");
  grid.innerHTML = "";
  getList().forEach((p) => {
    const card = renderCard(p, activeCategory);
    card.addEventListener("click", () => {
      if (activeId === p.id) {
        closeDetail();
        return;
      }
      activeId = p.id;
      document.querySelectorAll(".project-card").forEach((c) => {
        const on = c.dataset.id === p.id;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-expanded", on ? "true" : "false");
      });
      renderDetail(p);
    });
    grid.appendChild(card);
  });
}

function initFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      if (cat === activeCategory) return;
      activeCategory = cat;
      document.querySelectorAll(".filter-btn").forEach((b) => {
        b.setAttribute("aria-pressed", b.dataset.filter === cat ? "true" : "false");
      });
      closeDetail();
      renderGrid();
      const hint = document.getElementById("work-hint");
      hint.textContent =
        cat === "company"
          ? "회사에서 참여·리드한 출시/진행 프로젝트입니다."
          : "개인 실험·툴·에이전트 팩입니다. 스크린샷은 추후 보강합니다.";
    });
  });
}

function initNavScroll() {
  const nav = document.getElementById("site-nav");
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initCodeTopics() {
  const list = document.getElementById("code-topics");
  if (!list) return;
  CODE_TOPICS.forEach((t) => list.appendChild(el("li", { text: t })));
}

function initHash() {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) return;
  const project = findProject(hash);
  if (!project) return;
  const isPersonal = PERSONAL_PROJECTS.some((p) => p.id === hash);
  if (isPersonal) {
    document.querySelector('[data-filter="personal"]')?.click();
  }
  requestAnimationFrame(() => {
    document.querySelector(`.project-card[data-id="${hash}"]`)?.click();
  });
}

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn || document.documentElement.getAttribute("data-pdf") === "1") return;
  btn.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (_) {}
  });
}

function renderPdfProjectBlock(project) {
  const block = el("article", { className: "pdf-project" });
  block.appendChild(el("h4", { text: project.title }));
  const meta = [project.company, project.period || project.status]
    .filter(Boolean)
    .join(" · ");
  block.appendChild(el("p", { className: "pdf-meta", text: meta }));
  block.appendChild(el("p", { text: project.summary }));
  if (project.bullets && project.bullets.length) {
    const ul = el("ul");
    project.bullets.forEach((b) => ul.appendChild(el("li", { text: b })));
    block.appendChild(ul);
  }
  if (project.tech && project.tech.length) {
    const tech = el("div", { className: "pdf-tech" });
    project.tech.forEach((t) => tech.appendChild(el("span", { text: t })));
    block.appendChild(tech);
  }
  const linkParts = [];
  (project.stores || []).forEach((s) => linkParts.push(`${s.label}: ${s.href}`));
  if (project.repo) linkParts.push(`GitHub: ${project.repo}`);
  if (project.docs) linkParts.push(`GitBook: ${project.docs}`);
  if (project.codeLink) linkParts.push(`Code: ${project.codeLink}`);
  if (linkParts.length) {
    block.appendChild(el("p", { className: "pdf-links", text: linkParts.join("\n") }));
  }
  if (project.minor && project.minor.length) {
    block.appendChild(
      el("p", {
        text: "포함: " + project.minor.map((m) => m.name).join(", "),
      })
    );
  }
  return block;
}

/** PDF/print: Company + Personal 전부 펼쳐 렌더 (필터·접힘 없음) */
function renderPdfDocument() {
  const root = document.getElementById("pdf-doc");
  if (!root) return;
  root.innerHTML = "";
  root.setAttribute("aria-hidden", "false");

  root.appendChild(el("h3", { className: "pdf-section-title", text: "Company" }));
  COMPANY_PROJECTS.forEach((p) => root.appendChild(renderPdfProjectBlock(p)));

  root.appendChild(el("h3", { className: "pdf-section-title", text: "Personal" }));
  PERSONAL_PROJECTS.forEach((p) => root.appendChild(renderPdfProjectBlock(p)));
}

function isPdfMode() {
  return document.documentElement.getAttribute("data-pdf") === "1";
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initCodeTopics();

  if (isPdfMode()) {
    renderPdfDocument();
    document.documentElement.setAttribute("data-pdf-ready", "1");
    return;
  }

  initNavScroll();
  initFilters();
  renderGrid();
  initHash();
});
