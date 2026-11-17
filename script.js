/**
 * 포트폴리오 화면 로직 — 대표 작업 · 탭 · 행 펼치기 · 해시 딥링크 · 목차 현재 위치 · 테마 · PDF/인쇄.
 *
 * 데이터는 data/projects.js 의 window.PORTFOLIO 만 읽는다. 이 파일에는 사실 문구가 없다.
 * 프로젝트를 추가·수정하려면 data/projects.js 만 고친다. 탭·목차·PDF 목록도 그 데이터에서 그린다.
 *
 * 딥링크
 *   - 행을 열면 pushState("#<id>"), 닫으면 해시 없는 주소로 pushState
 *   - 첫 로드 · popstate / hashchange: 해시가 프로젝트 id 면 그 탭을 고르고 행을 펼친 뒤 그 행으로 가서
 *     행 머리에 포커스를 둔다(첫 로드는 링 없이 — quietFocus). "#work-<카테고리>" 면 그 탭을 고른다. 해시가 비면 열린 행을 닫는다.
 *     섹션 앵커는 브라우저에 맡긴다.
 *   - Escape: 열린 행 안(또는 포커스 없이 그 행이 보일 때)에서 누르면 행을 닫고 행 머리로 포커스를 돌린다.
 *   - 링크 복사: origin + pathname + "#<id>" (검색어는 뺀다). 복사가 막히면 주소를 버튼 옆 글상자에 보여 준다.
 *   - 스크롤 복원: history.scrollRestoration 은 기록마다 따로 저장된다. 기록이 현재가 될 때마다
 *     프로젝트 해시면 "manual"(브라우저 복원 없이 그 행으로), 나머지는 "auto"(떠난 자리로 복원)를 단다.
 *     뒤로/앞으로 이동 중에는 html 의 smooth 를 잠시 꺼서 복원이 미끄러지지 않게 한다.
 *
 * PDF (index.html?pdf=1, scripts/generate-pdfs.mjs)
 *   - <head> 의 부트스트랩이 html[data-pdf="1"] · data-theme="light" 를 단다.
 *   - 모든 카테고리의 모든 작업을 펼친 목록(#pdf-doc)을 그리고, 상대 링크를 공개 사이트 절대 주소로 바꾼 뒤
 *     html[data-pdf-ready="1"] 을 단다. 화면용 탭·행·목차는 그리지 않는다.
 *   - 브라우저 인쇄(@media print)도 beforeprint 에서 같은 목록을 그려 쓴다.
 */
(function () {
  "use strict";

  const P = window.PORTFOLIO || {};
  const CATS = P.categories || {};
  const KEYS = Object.keys(CATS);
  const FEATURED = Array.isArray(P.featured) ? P.featured : [];
  const TOPICS = Array.isArray(P.codeTopics) ? P.codeTopics : [];
  const SITE_URL = "https://cykim0115.github.io/";
  const CODE_URL = SITE_URL + "code_portfolio/";
  const SECTIONS = ["top", "featured", "work", "code", "about", "contact"];
  const PDF = document.documentElement.getAttribute("data-pdf") === "1";

  /**
   * 그림의 실제 픽셀 크기 — width/height 를 달아 자리 밀림을 막는다. 없는 경로는 크기 없이 그린다.
   * 그림을 바꾸거나 더하면 맞춰 고친다 (npm run check 가 파일 크기와 대조한다).
   */
  const DIMS = {
    "Resource/Hero Craft Town/banner.webp": [416, 203],
    "Resource/Hero Craft Town/icon.webp": [240, 240],
    "Resource/Koyo Town/banner.webp": [416, 203],
    "Resource/Koyo Town/icon.webp": [240, 240],
    "Resource/Lost Paradise/icon.webp": [256, 256],
    "Resource/MAXIMIZER_MVP/banner.webp": [838, 240],
    "Resource/Memories Millennium Girl Mobile/icon.webp": [256, 256],
    "Resource/Memories Millennium Girl Steam/icon.webp": [256, 256],
    "Resource/Miracle Choice/icon.webp": [256, 256],
    "Resource/Neko Omakase/banner.webp": [1200, 675],
    "Resource/Neko Omakase/icon.webp": [256, 256],
    "Resource/Neko Restaurant/banner.webp": [1200, 675],
    "Resource/Neko Restaurant/icon.webp": [240, 240],
    "Resource/Rumble Squad/banner.webp": [655, 320],
    "Resource/Rumble Squad/icon.webp": [256, 256],
    "Resource/Soul Dimension/Power_saving_1.webp": [235, 239],
    "Resource/Soul Dimension/Power_saving_2.webp": [228, 234],
    "Resource/Tailed Demon Slayer Rise/banner.webp": [1200, 675],
    "Resource/Tailed Demon Slayer Rise/icon.webp": [225, 225],
  };
  /** 스토어 스크린샷(store_picture_N.webp)은 모두 같은 세로 크기다 */
  const STORE_SHOT = [810, 1440];

  /**
   * 접힌 행 설명에서 구간 하나를 통째로 한 줄에 묶는 최대 글자 수. 가장 좁은 행(320px 화면, 글 폭 264px)에
   * 14px 한글이 들어가는 길이다 — 늘리면 좁은 화면에서 긴 구간이 줄을 못 바꿔 페이지가 옆으로 넘친다.
   */
  const BLURB_KEEP = 16;

  const INDEX = new Map();
  KEYS.forEach((key) => (CATS[key].list || []).forEach((p) => INDEX.set(p.id, { p, key })));

  /* ---------------------------------------------------------------- */
  /* 도우미                                                             */
  /* ---------------------------------------------------------------- */

  /**
   * 가운뎃점 줄바꿈 묶음 — 줄이 "·"로 시작하거나 "광고·분석" 같은 낱말 묶음이 가운데서 갈리지 않게.
   *   "앞말 ·"   (띄어 쓴 가운뎃점과 바로 앞 낱말)
   *   "광고·분석" (붙여 쓴 낱말 묶음 전체)
   * 를 <span class="nw">(white-space: nowrap) 로 감싼다. 줄은 그 밖의 띄어쓰기에서 바뀐다.
   * 보이지 않는 글자(단어 결합자 등)를 넣지 않으므로 복사한 글에 군더더기가 남지 않는다.
   */
  const DOT_GROUP = /\S+[ \t]+·\S*|\S*·\S*/g;

  function textNodes(value) {
    const s = String(value);
    if (s.indexOf("·") === -1) return [document.createTextNode(s)];
    const out = [];
    let last = 0;
    s.replace(DOT_GROUP, (m, at) => {
      if (at > last) out.push(document.createTextNode(s.slice(last, at)));
      const nw = document.createElement("span");
      nw.className = "nw";
      nw.textContent = m;
      out.push(nw);
      last = at + m.length;
      return m;
    });
    if (last < s.length) out.push(document.createTextNode(s.slice(last)));
    return out;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === "text") node.append(...textNodes(v));
      else node.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach((c) => {
      if (c === null || c === undefined || c === false) return;
      if (typeof c === "string") node.append(...textNodes(c));
      else node.append(c);
    });
    return node;
  }

  const list = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /** 데이터의 그림 경로(저장소 루트 기준, 한글·공백 포함)를 URL 로 */
  const asset = (path) => path.split("/").map(encodeURIComponent).join("/");

  function dimsOf(path) {
    if (DIMS[path]) return DIMS[path];
    if (/\/store_picture_\d\.webp$/.test(path)) return STORE_SHOT;
    return null;
  }

  function img(path, opts) {
    const o = opts || {};
    const node = el("img", { src: asset(path), alt: o.alt || "", class: o.cls, decoding: "async" });
    if (o.lazy !== false) node.loading = "lazy";
    const d = dimsOf(path);
    if (d) {
      node.width = d[0];
      node.height = d[1];
    }
    return node;
  }

  const newTab = () => el("span", { class: "sr-only", text: " (새 탭)" });

  function ext(href, text, cls) {
    return el("a", { href, target: "_blank", rel: "noopener noreferrer", class: cls }, [text, newTab()]);
  }

  const sep = () => el("span", { class: "sep", "aria-hidden": "true", text: "·" });

  function dotLinks(pairs) {
    const span = el("span");
    pairs.forEach(([label, href], i) => {
      if (i) span.append(sep());
      span.append(ext(href, label));
    });
    return span;
  }

  /** "A · B · C" — 각 항목에 뒤 가운뎃점을 붙여 묶으므로 줄이 "·"로 시작하지 않는다. */
  function dotText(items) {
    const span = el("span", { class: "dot-list" });
    items.forEach((t, i) => {
      if (i) span.append(" ");
      span.append(el("span", { class: "nw", text: i < items.length - 1 ? t + " ·" : t }));
    });
    return span;
  }

  function kvRow(dl, label, value) {
    if (value === null || value === undefined || value === "") return;
    const dd = el("dd");
    if (typeof value === "string") dd.append(...textNodes(value));
    else dd.append(value);
    dl.append(el("div", {}, [el("dt", { text: label }), dd]));
  }

  function ulOf(items, plain) {
    const ul = el("ul", { class: plain ? "plain" : null });
    items.forEach((it) => ul.append(el("li", {}, [it])));
    return ul;
  }

  /** 성과는 scope 로 나눠 라벨 열에 적는다 — 배지 상자 없이 "개인 기여" / "팀 성과". */
  function appendResults(dl, p) {
    const results = list(p.results);
    const mine = results.filter((r) => r.scope === "personal").map((r) => r.text);
    const team = results.filter((r) => r.scope !== "personal").map((r) => r.text);
    if (mine.length) kvRow(dl, "개인 기여", ulOf(mine, true));
    if (team.length) kvRow(dl, "팀 성과", ulOf(team, true));
  }

  function svgIcon(cls, paths) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", cls);
    svg.setAttribute("aria-hidden", "true");
    paths.forEach((d) => {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", d);
      svg.append(path);
    });
    return svg;
  }

  const chevron = () => svgIcon("i row-chev", ["m6 9 6 6 6-6"]);
  const linkIcon = () =>
    svgIcon("i", ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"]);

  let live;
  function announce(text) {
    if (!live) {
      live = el("p", { class: "sr-only", "aria-live": "polite" });
      document.body.append(live);
    }
    live.textContent = "";
    window.setTimeout(() => (live.textContent = text), 30);
  }

  /** "YYYY.MM ~ YYYY.MM" → 시작·끝 달 번호 (진행 중이면 끝 = Infinity) */
  function spanOf(period) {
    const m = String(period || "").match(/\d{4}\.\d{2}/g) || [];
    const n = (s) => Number(s.slice(0, 4)) * 12 + Number(s.slice(5, 7)) - 1;
    if (!m.length) return [0, 0];
    return [n(m[0]), m[1] ? n(m[1]) : /~\s*$/.test(period) ? Infinity : n(m[0])];
  }

  /** 링크 목록 — 스토어 · GitHub · 문서 · 코드 */
  function linkPairs(p) {
    const links = list(p.stores).map((s) => [s.label, s.href]);
    if (p.repo) links.push(["GitHub", p.repo]);
    if (p.docs) links.push(["문서", p.docs]);
    if (p.codeLink) links.push(["코드", p.codeLink]);
    return links;
  }

  /* ---------------------------------------------------------------- */
  /* 대표 작업 — 첫 항목은 크게, 나머지 둘은 짧게                           */
  /* ---------------------------------------------------------------- */

  function renderFeatured() {
    const host = document.getElementById("featured-list");
    const toc = document.getElementById("toc-featured");
    if (!host) return;
    const entries = FEATURED.map((id) => INDEX.get(id)).filter(Boolean);
    if (!entries.length) {
      // 대표 작업이 없으면 섹션과 목차 항목을 숨긴다
      const section = document.getElementById("featured");
      if (section) section.hidden = true;
      document.querySelectorAll('.toc a[data-section="featured"]').forEach((a) => (a.parentElement.hidden = true));
      return;
    }
    entries.forEach((entry, i) => {
      const p = entry.p;
      const id = p.id;
      const lead = i === 0;
      const art = el("article", { class: lead ? "feat feat-lead" : "feat feat-compact", id: "f-" + id, "aria-labelledby": "f-" + id + "-title" });

      if (p.image) {
        const fig = el("figure", { class: "feat-fig" }, [img(p.image, { alt: p.title + " 배너", lazy: !lead })]);
        const stores = list(p.stores);
        if (lead && stores.length) fig.append(el("figcaption", {}, [dotLinks(stores.map((s) => [s.label, s.href]))]));
        art.append(fig);
      }

      const body = el("div", { class: "feat-body" });
      body.append(
        el("div", { class: "feat-head" }, [
          el("h3", { id: "f-" + id + "-title", text: p.title }),
          p.period ? el("span", { class: "mono feat-period", text: p.period }) : null,
        ])
      );
      if (p.headline) body.append(el("p", { class: "feat-headline", text: p.headline }));

      if (lead) {
        const dl = el("dl", { class: "kv" });
        if (entry.key === "company") kvRow(dl, "역할", p.role);
        if (list(p.platforms).length) kvRow(dl, "플랫폼", dotText(list(p.platforms)));
        appendResults(dl, p);
        body.append(dl);
      } else if (entry.key === "company" && p.role) {
        body.append(el("p", { class: "feat-role" }, [el("span", { class: "feat-role-label", text: "역할" }), " ", p.role]));
      }

      body.append(el("p", { class: "feat-more" }, [el("a", { href: "#" + id, "data-project-link": id, text: "상세 열기" })]));
      art.append(body);
      host.append(art);

      if (toc) toc.append(el("li", {}, [el("a", { href: "#f-" + id, "data-sub": "f-" + id, text: p.title })]));
    });
  }

  /* ---------------------------------------------------------------- */
  /* 전체 작업: 탭 + (회사별 묶음) + 행                                    */
  /* ---------------------------------------------------------------- */

  let currentTab = null;
  let openId = null;

  const tabEl = (key) => document.getElementById("work-" + key);
  const panelEl = (key) => document.getElementById("panel-" + key);

  /** 행 아이콘 — 데이터의 icon, 없으면 묶음 항목의 포함 타이틀 아이콘 넷을 2×2 로, 둘 다 없으면 아이콘 칸 없이 */
  function rowIcon(p) {
    if (p.icon) return img(p.icon, { cls: "app-icon row-icon" });
    const minor = list(p.minor).filter((m) => m.img);
    if (minor.length >= 4) {
      const grid = el("span", { class: "app-icon row-icon icon-grid", "aria-hidden": "true" });
      minor.slice(0, 4).forEach((m) => grid.append(img(m.img)));
      return grid;
    }
    return null;
  }

  /** 상태 배지는 예외일 때만 — "출시", 제목에 이미 있는 말, 탭 안 모두 같은 값은 정보가 없다 */
  function badgeText(p, cat) {
    const s = p.status;
    if (!s || s === "출시" || String(p.title || "").indexOf(s) !== -1) return null;
    if (list(cat.list).every((x) => x.status === s)) return null;
    return s;
  }

  function teamTag() {
    return el("span", { class: "team-tag" }, [el("span", { "aria-hidden": "true", text: "팀" }), el("span", { class: "sr-only", text: "(팀 성과)" })]);
  }

  /**
   * 접힌 행 한 줄 설명 — " · " 구간마다 묶고, 데이터 blurbTeam 에 적힌 구간(팀 성과)에는 "팀" 표시.
   * 짧은 구간(BLURB_KEEP 이하)은 통째로, 긴 구간은 마지막 두 낱말부터 뒤따르는 표시·가운뎃점까지만 묶는다.
   * "팀" 표시가 붙는 구간은 끝 마침표를 뺀다 (표시 상자 뒤에 점만 떨어져 보이지 않게).
   */
  function blurbEl(p) {
    const team = new Set(list(p.blurbTeam));
    const span = el("span", { class: "row-blurb" });
    const parts = String(p.blurb).split(" · ");
    parts.forEach((part, i) => {
      if (i) span.append(" ");
      const m = /^(.*?)(\.?)$/.exec(part);
      const isTeam = team.has(m[1]);
      const tail = [isTeam ? teamTag() : null, isTeam ? null : m[2] || null, i < parts.length - 1 ? " ·" : null];
      if (part.length <= BLURB_KEEP) {
        span.append(el("span", { class: "nw" }, [m[1]].concat(tail)));
        return;
      }
      // 마지막 두 낱말을 묶는다 — "1위 (2024.07)"·"파이프라인 구축."이 갈려 날짜나 끝말만 다음 줄로 떨어지지 않게.
      // 사이의 기호 낱말("AssetBundle / UniRx"의 "/")은 앞뒤와 함께 묶어 줄이 "/"로 시작하지 않게 한다.
      const w =
        /^([\s\S]*\s)?(\S*[\p{L}\p{N}]\S*(?:\s+[^\p{L}\p{N}\s]+)*\s+\S+)$/u.exec(m[1]) ||
        /^([\s\S]*\s)?(\S+)$/.exec(m[1]) ||
        [null, "", m[1]];
      if (w[1]) span.append(...textNodes(w[1]));
      span.append(el("span", { class: "nw" }, [w[2]].concat(tail)));
    });
    return span;
  }

  function renderRow(p, key) {
    const cat = CATS[key];
    const icon = rowIcon(p);
    const row = el("li", { class: icon ? "row" : "row plain", id: p.id });
    const head = el("button", {
      type: "button",
      class: "row-head",
      id: "head-" + p.id,
      "aria-expanded": "false",
      "aria-controls": "body-" + p.id,
    });
    if (icon) head.append(icon);
    const badge = badgeText(p, cat);
    head.append(
      el("span", { class: "row-title" }, [el("span", { class: "row-name", text: p.title }), badge ? el("span", { class: "badge", text: badge }) : null])
    );
    // 회사 탭은 회사별로 묶여 있고, Personal 탭의 "Personal" 은 탭 이름과 같다 — 둘 다 메타에서 뺀다
    const showCompany = key !== "company" && p.company && p.company !== cat.label;
    const meta = [showCompany ? p.company : null].concat(list(p.platforms)).filter(Boolean);
    const metaEl = meta.length ? dotText(meta) : null;
    if (metaEl) metaEl.className = "row-meta";
    head.append(el("span", { class: "row-sub" }, [p.period ? el("span", { class: "row-period mono", text: p.period }) : null, metaEl]));
    if (p.blurb) head.append(blurbEl(p));
    head.append(chevron());

    const body = el("div", { class: "row-body", id: "body-" + p.id, role: "region", "aria-labelledby": "head-" + p.id, hidden: true }, [
      el("div", { class: "row-inner" }),
    ]);
    head.addEventListener("click", (e) => {
      // 더블클릭의 두 번째 클릭이 방금 연 행을 곧바로 닫지 않게 한다 (키보드 Enter·Space 는 detail 이 0)
      if (e.detail > 1) return;
      toggleRow(p.id);
    });
    row.append(head, body);
    return row;
  }

  function buildDetail(p, key) {
    const d = el("div", { class: "detail" });
    if (p.headline) d.append(el("p", { class: "detail-headline", text: p.headline }));
    if (p.summary) d.append(el("p", { class: "detail-summary", text: p.summary }));

    // 그림은 설명 바로 아래 — 대표 작업은 배너가 위에 있으니 스크린샷만, 나머지는 배너 + 스크린샷. 누르면 원본을 새 탭에서
    const shots = list(p.shots).slice(0, 4);
    const media = [];
    if (p.image && !FEATURED.includes(p.id) && !shots.includes(p.image) && !list(p.minor).length) media.push([p.image, p.title + " 배너"]);
    shots.forEach((s, i) => media.push([s, p.title + " 화면 " + (i + 1)]));
    if (media.length) {
      const strip = el("div", { class: "media", role: "group", "aria-label": p.title + " 그림" });
      media.forEach(([src, alt]) =>
        strip.append(el("a", { class: "shot", href: asset(src), target: "_blank", rel: "noopener noreferrer" }, [img(src, { alt }), newTab()]))
      );
      d.append(strip);
    }

    const minor = list(p.minor);
    if (minor.length) {
      const ul = el("ul", { class: "minor", "aria-label": "포함 타이틀" });
      minor.forEach((m) => ul.append(el("li", {}, [m.img ? img(m.img) : null, m.name])));
      d.append(ul);
    }

    const dl = el("dl", { class: "kv" });
    if (key === "company") kvRow(dl, "역할", p.role);
    if (list(p.bullets).length) kvRow(dl, "주요 작업", ulOf(list(p.bullets)));
    appendResults(dl, p);
    if (list(p.proof).length) kvRow(dl, "근거", ulOf(list(p.proof).map((x) => ext(x.href, x.label)), true));
    if (list(p.tech).length) kvRow(dl, "스택", dotText(list(p.tech)));
    const links = linkPairs(p);
    if (links.length) kvRow(dl, "링크", dotLinks(links));
    d.append(dl);

    const label = el("span", { text: "링크 복사" });
    const copy = el("button", { type: "button", class: "icon-btn copy-btn" }, [linkIcon(), label]);
    copy.addEventListener("click", () => copyLink(p.id, copy, label));
    d.append(el("div", { class: "detail-foot" }, [copy]));
    return d;
  }

  /** 공유 주소 — 검색어(?utm= 같은 추적 값)는 빼고 #id 만 붙인다 */
  function projectUrl(id) {
    const origin = location.origin && location.origin !== "null" ? location.origin : location.protocol + "//" + location.host;
    return origin + location.pathname + "#" + id;
  }

  /** 클립보드 API 가 없거나 막혔을 때 — 숨긴 글상자를 골라 복사하고 포커스를 버튼으로 돌린다 */
  function legacyCopy(text, back) {
    const ta = el("textarea", { class: "sr-only", readonly: true, "aria-hidden": "true", tabindex: "-1" });
    ta.value = text;
    document.body.append(ta);
    let ok = false;
    try {
      ta.select();
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    ta.remove();
    if (back) back.focus({ preventScroll: true });
    return ok;
  }

  async function copyLink(id, btn, label) {
    const url = projectUrl(id);
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        ok = true;
      }
    } catch (e) {
      ok = false;
    }
    if (!ok) ok = legacyCopy(url, btn);

    const foot = btn.parentElement;
    let field = foot.querySelector(".copy-fallback");
    if (ok) {
      if (field) field.remove();
    } else {
      // 자동 복사가 막힌 환경 — 주소를 버튼 옆에 보여 주고 골라 둔다 (직접 복사)
      if (!field) {
        field = el("input", { class: "copy-fallback", type: "text", readonly: true, "aria-label": "프로젝트 링크" });
        foot.prepend(field);
      }
      field.value = url;
      field.focus();
      field.select();
    }
    const msg = ok ? "링크를 복사했습니다" : "주소를 직접 복사해 주세요";
    label.textContent = msg;
    announce(msg);
    window.setTimeout(() => (label.textContent = "링크 복사"), 1800);
  }

  /** 회사 탭: 회사별 묶음(위젯 구획 라벨 + 개수), 묶음 안은 기간이 늦게 끝난 순 */
  function companyGroups(items) {
    const sorted = items.slice().sort((a, b) => {
      const [as, ae] = spanOf(a.period);
      const [bs, be] = spanOf(b.period);
      return be - ae || bs - as;
    });
    const groups = new Map();
    sorted.forEach((p) => {
      const name = p.company || "";
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(p);
    });
    return groups;
  }

  function renderWork() {
    const tabs = document.getElementById("work-tabs");
    const panels = document.getElementById("work-panels");
    const toc = document.getElementById("toc-work");
    if (!tabs || !panels) return;
    KEYS.forEach((key) => {
      const cat = CATS[key];
      const items = list(cat.list);
      const tab = el(
        "button",
        { type: "button", role: "tab", class: "tab", id: "work-" + key, "aria-selected": "false", "aria-controls": "panel-" + key, tabindex: "-1" },
        [cat.label + " ", el("span", { class: "count", text: String(items.length) })]
      );
      tab.addEventListener("click", () => selectTab(key));
      tabs.append(tab);

      const panel = el("div", { class: "panel", role: "tabpanel", id: "panel-" + key, "aria-labelledby": "work-" + key, hidden: true });
      if (cat.hint) panel.append(el("p", { class: "panel-hint", text: cat.hint }));
      if (key === "company") {
        let g = 0;
        companyGroups(items).forEach((rows, name) => {
          const gid = "grp-" + key + "-" + ++g;
          const ul = el("ul", { class: "rows", "aria-labelledby": gid });
          rows.forEach((p) => ul.append(renderRow(p, key)));
          panel.append(
            el("div", { class: "group" }, [
              el("p", { class: "group-label", id: gid }, [el("span", { text: name }), el("span", { class: "count", "aria-hidden": "true", text: String(rows.length) })]),
              ul,
            ])
          );
        });
      } else {
        const ul = el("ul", { class: "rows" });
        items.forEach((p) => ul.append(renderRow(p, key)));
        panel.append(ul);
      }
      panels.append(panel);

      if (toc) toc.append(el("li", {}, [el("a", { href: "#work-" + key, "data-sub": "work-" + key, text: cat.label })]));
    });

    tabs.addEventListener("keydown", (e) => {
      const i = KEYS.indexOf(currentTab);
      let next = null;
      if (e.key === "ArrowRight") next = KEYS[(i + 1) % KEYS.length];
      else if (e.key === "ArrowLeft") next = KEYS[(i - 1 + KEYS.length) % KEYS.length];
      else if (e.key === "Home") next = KEYS[0];
      else if (e.key === "End") next = KEYS[KEYS.length - 1];
      if (!next) return;
      e.preventDefault();
      selectTab(next, { focus: true });
    });
  }

  function selectTab(key, opts) {
    const o = opts || {};
    if (!CATS[key]) return;
    // 탭을 바꿔도 다른 탭의 열린 행과 주소 기록은 그대로 둔다 — 뒤로 가기로 그 행에 돌아올 수 있다
    if (currentTab !== key) {
      KEYS.forEach((k) => {
        const on = k === key;
        const t = tabEl(k);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        panelEl(k).hidden = !on;
      });
      currentTab = key;
      updateToc();
    }
    if (o.focus) tabEl(key).focus();
  }

  function setOpen(id, open, animate) {
    const row = document.getElementById(id);
    const entry = INDEX.get(id);
    if (!row || !entry) return;
    const head = row.querySelector(".row-head");
    const body = row.querySelector(".row-body");
    const motion = animate !== false && !reduced();
    if (open) {
      const inner = body.firstElementChild;
      if (!inner.firstChild) inner.append(buildDetail(entry.p, entry.key));
      body.hidden = false;
      head.setAttribute("aria-expanded", "true");
      if (motion) void body.offsetHeight; // 0fr 을 한 번 계산시켜야 1fr 로 넘어가는 전환이 보인다
      row.classList.add("is-open");
      openId = id;
    } else {
      head.setAttribute("aria-expanded", "false");
      row.classList.remove("is-open");
      const finish = () => {
        if (!row.classList.contains("is-open")) body.hidden = true;
      };
      if (motion) {
        body.addEventListener("transitionend", finish, { once: true });
        window.setTimeout(finish, 320);
      } else finish();
      if (openId === id) openId = null;
    }
  }

  function openProject(id, opts) {
    const o = opts || {};
    const entry = INDEX.get(id);
    if (!entry) return;
    selectTab(entry.key);
    const row = document.getElementById(id);
    const before = o.keepPlace ? row.getBoundingClientRect().top : null;
    if (openId && openId !== id) setOpen(openId, false, false);
    if (before !== null) {
      const delta = row.getBoundingClientRect().top - before;
      if (delta) window.scrollBy({ top: delta, behavior: "instant" });
    }
    if (openId !== id) setOpen(id, true, o.animate);
    if (o.push && hashId() !== id) pushHash("#" + id);
    if (o.scroll) row.scrollIntoView({ behavior: o.smooth && !reduced() ? "smooth" : "instant", block: "start" });
    if (o.focus === "quiet") quietFocus(row.querySelector(".row-head"));
    else if (o.focus) row.querySelector(".row-head").focus({ preventScroll: true });
    updateToc();
  }

  /**
   * 첫 로드의 딥링크: 읽는 위치(포커스)는 그 행 머리로 옮기되 링은 그리지 않는다 — 공유 링크로 들어온 화면에
   * 누르지도 않은 링이 보이지 않게. 키를 누르거나 포커스가 떠나면 평소처럼 링이 보인다.
   */
  function quietFocus(head) {
    head.classList.add("quiet-focus");
    const clear = () => head.classList.remove("quiet-focus");
    head.addEventListener("blur", clear, { once: true });
    head.addEventListener("keydown", clear, { once: true });
    head.focus({ preventScroll: true });
  }

  /** 행을 닫고, 주소가 그 행을 가리키면 해시 없는 주소를 기록한다 */
  function closeRow(id) {
    setOpen(id, false, true);
    if (hashId() === id) pushHash(location.pathname + location.search);
  }

  function toggleRow(id) {
    if (openId === id) closeRow(id);
    else openProject(id, { push: true, keepPlace: true });
  }

  /**
   * Escape: 열린 행 안에 포커스가 있으면(또는 포커스가 아무 데도 없고 그 행이 화면에 보이면) 행을 닫고
   * 포커스를 행 머리로 돌린다. 좁은 화면 목차가 열려 있으면 목차 쪽 처리(setupMenu)가 먼저 가져간다.
   */
  function setupEscape() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || e.defaultPrevented || !openId) return;
      const row = document.getElementById(openId);
      if (!row) return;
      const ae = document.activeElement;
      const r = row.getBoundingClientRect();
      const idle = (!ae || ae === document.body) && r.bottom > 0 && r.top < window.innerHeight;
      if (!row.contains(ae) && !idle) return;
      e.preventDefault();
      closeRow(openId);
      row.querySelector(".row-head").focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------------- */
  /* 주소 동기화                                                         */
  /* ---------------------------------------------------------------- */

  function hashId() {
    try {
      return decodeURIComponent(location.hash.slice(1));
    } catch (e) {
      return "";
    }
  }

  /** 현재 기록의 스크롤 복원 방식을 단다 (기록마다 따로 저장된다 — 맨 위 주석) */
  function labelEntry() {
    try {
      if ("scrollRestoration" in history) history.scrollRestoration = INDEX.has(hashId()) ? "manual" : "auto";
    } catch (e) {
      /* 지원하지 않으면 브라우저 기본값 */
    }
  }

  function pushHash(url) {
    history.pushState(null, "", url);
    labelEntry();
  }

  /** 첫 로드·뒤로/앞으로·해시 변경: 프로젝트 해시면 그 행을 펼치고 행 머리로 포커스를 옮긴다 (읽는 위치를 같이 옮긴다) */
  function syncFromLocation(e) {
    const h = hashId();
    if (INDEX.has(h)) {
      openProject(h, { scroll: true, smooth: false, animate: false, focus: e ? true : "quiet" });
    } else {
      const m = /^work-(.+)$/.exec(h);
      if (m && CATS[m[1]]) selectTab(m[1]);
      else if (!h && openId) setOpen(openId, false, false);
    }
    labelEntry();
  }

  /** 뒤로/앞으로: 이번 이동의 스크롤 복원만 smooth 없이 (Navigation API 가 있는 브라우저) */
  function instantTraversal() {
    const nav = window.navigation;
    if (!nav || !nav.addEventListener) return;
    const root = document.documentElement;
    let timer = 0;
    nav.addEventListener("navigate", (e) => {
      if (e.navigationType !== "traverse" || !e.destination || !e.destination.sameDocument) return;
      root.style.scrollBehavior = "auto";
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.style.removeProperty("scroll-behavior"), 200);
    });
  }

  /* ---------------------------------------------------------------- */
  /* 목차: 현재 위치 + 좁은 화면 펼치기 + 머리 띠 이름                        */
  /* ---------------------------------------------------------------- */

  let tocLinks = [];

  function updateToc() {
    if (!tocLinks.length) return;
    const line = window.innerHeight * 0.3;
    let current = SECTIONS[0];
    SECTIONS.forEach((id) => {
      const s = document.getElementById(id);
      if (s && !s.hidden && s.getBoundingClientRect().top <= line) current = id;
    });
    const doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) current = SECTIONS[SECTIONS.length - 1];

    let sub = null;
    if (current === "featured") {
      FEATURED.forEach((id) => {
        const a = document.getElementById("f-" + id);
        if (a && a.getBoundingClientRect().top <= line) sub = "f-" + id;
      });
      if (!sub && FEATURED.length) sub = "f-" + FEATURED[0];
    } else if (current === "work" && currentTab) {
      sub = "work-" + currentTab;
    }

    tocLinks.forEach((a) => {
      const on = a.dataset.section === current || (sub !== null && a.dataset.sub === sub);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  function watchToc() {
    tocLinks = Array.from(document.querySelectorAll(".toc a"));
    const targets = SECTIONS.map((id) => document.getElementById(id))
      .concat(FEATURED.map((id) => document.getElementById("f-" + id)))
      .filter(Boolean);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(updateToc, { rootMargin: "-30% 0px -69% 0px" });
      targets.forEach((t) => io.observe(t));
      const foot = document.querySelector(".status");
      if (foot) new IntersectionObserver(updateToc, { threshold: [0, 1] }).observe(foot);
    }
    updateToc();
  }

  /** 좁은 화면 머리 띠의 이름은 본문 h1 이 보이는 동안 숨긴다 (같은 이름이 두 번 보이지 않게) */
  function watchIntroTitle() {
    const side = document.getElementById("side");
    const title = document.getElementById("intro-title");
    if (!side || !title || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(
      (entries) => entries.forEach((e) => side.classList.toggle("at-intro", e.isIntersecting)),
      { rootMargin: "-48px 0px 0px 0px" }
    ).observe(title);
  }

  function setupMenu() {
    const side = document.getElementById("side");
    const btn = document.getElementById("toc-btn");
    if (!side || !btn) return;
    const isOpen = () => side.classList.contains("is-open");
    const setMenu = (open) => {
      side.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    btn.addEventListener("click", () => setMenu(!isOpen()));
    side.addEventListener("click", (e) => {
      if (e.target.closest(".side-body a")) setMenu(false);
    });
    // 포커스가 목차 밖으로 나가면 닫는다 — 열린 목차가 다음 포커스 대상을 가리지 않게
    side.addEventListener("focusout", (e) => {
      if (isOpen() && e.relatedTarget && !side.contains(e.relatedTarget)) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        e.preventDefault(); // 같은 Escape 로 열린 행까지 닫지 않게 (setupEscape)
        setMenu(false);
        btn.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (isOpen() && !side.contains(e.target)) setMenu(false);
    });
  }

  /* ---------------------------------------------------------------- */
  /* 테마                                                               */
  /* ---------------------------------------------------------------- */

  /** 브라우저 UI 색 — index.html 의 theme-color 와 같은 값 (--surface) */
  const SURFACE = { light: "#f0f3f0", dark: "#262e2c" };

  function setupTheme() {
    const btn = document.getElementById("theme-btn");
    if (!btn) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const resolved = () => document.documentElement.getAttribute("data-theme") || (mq.matches ? "dark" : "light");
    const sync = () => {
      const t = resolved();
      const label = t === "dark" ? "라이트 테마로 전환" : "다크 테마로 전환";
      btn.setAttribute("aria-label", label);
      btn.title = label;
      // 사용자가 직접 고른 테마가 있을 때만 브라우저 UI 색을 고정한다
      if (document.documentElement.hasAttribute("data-theme")) {
        document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", SURFACE[t]));
      }
    };
    btn.addEventListener("click", () => {
      const next = resolved() === "dark" ? "light" : "dark";
      const apply = () => {
        document.documentElement.setAttribute("data-theme", next);
        try {
          localStorage.setItem("theme", next);
        } catch (e) {
          /* 저장 못 해도 이번 화면에는 적용된다 */
        }
        sync();
      };
      if (document.startViewTransition && !reduced()) document.startViewTransition(apply);
      else apply();
    });
    if (mq.addEventListener) mq.addEventListener("change", sync);
    sync();
  }

  /* ---------------------------------------------------------------- */
  /* 코드 토픽 · 경력 시간축 · 갱신일                                        */
  /* ---------------------------------------------------------------- */

  function renderTopics() {
    const ul = document.getElementById("code-topics");
    if (!ul) return;
    TOPICS.forEach((t) => {
      if (!t || !t.label) return;
      const href = t.id ? CODE_URL + "#" + encodeURIComponent(t.id) : CODE_URL;
      ul.append(
        el("li", {}, [
          el("a", { href, target: "_blank", rel: "noopener noreferrer" }, [
            el("span", { class: "topic-name", text: t.label }),
            " ",
            t.id ? el("span", { class: "topic-anchor", text: "#" + t.id }) : null,
            newTab(),
          ]),
        ])
      );
    });
  }

  /** 경력 표 오른쪽 시간축 — 표가 정본이고 시간축은 장식(aria-hidden)이다. 끝은 profile.updated. */
  function renderCareerBars() {
    const rows = Array.from(document.querySelectorAll("#career tbody tr[data-from]"));
    const month = (s) => {
      const m = /^(\d{4})\.(\d{2})$/.exec(s || "");
      return m ? Number(m[1]) * 12 + Number(m[2]) - 1 : null;
    };
    const now = month(P.profile && P.profile.updated);
    if (now === null || !rows.length) return;
    const spans = rows.map((r) => {
      const a = month(r.dataset.from);
      const b = month(r.dataset.to);
      return [a, b === null ? now : b];
    });
    if (spans.some(([a]) => a === null)) return;
    const min = Math.min(...spans.map((s) => s[0]));
    const max = Math.max(...spans.map((s) => s[1]));
    const total = max - min + 1;
    const pct = (v) => ((v / total) * 100).toFixed(2) + "%";
    const years = [];
    for (let y = Math.ceil(min / 12) * 12; y <= max; y += 12) years.push(y);

    const headCell = document.querySelector("#career thead .col-bar");
    if (headCell) {
      const axis = el("span", { class: "axis" });
      years.forEach((y) => {
        const label = el("span", { text: String(y / 12) });
        label.style.left = pct(y - min);
        axis.append(label);
      });
      headCell.append(axis);
    }

    rows.forEach((r, i) => {
      const cell = r.querySelector("td.col-bar");
      if (!cell) return;
      const track = el("span", { class: "track" });
      years.forEach((y) => {
        const tick = el("span", { class: "tick" });
        tick.style.left = pct(y - min);
        track.append(tick);
      });
      const [a, b] = spans[i];
      const fill = el("span", { class: "fill" });
      fill.style.left = pct(a - min);
      fill.style.width = pct(b - a + 1);
      track.append(fill);
      cell.append(track);
    });
  }

  /** 첫 화면 팀 성과의 게임 이름은 데이터 표기를 따른다 */
  function syncTeamNames() {
    document.querySelectorAll(".team-name[data-project-link]").forEach((a) => {
      const entry = INDEX.get(a.getAttribute("data-project-link"));
      if (entry) a.replaceChildren(...textNodes(entry.p.title));
    });
  }

  /* ---------------------------------------------------------------- */
  /* PDF · 인쇄: 모든 작업을 펼친 목록                                     */
  /* ---------------------------------------------------------------- */

  /** 종이에서 읽기 좋게 퍼센트 인코딩을 푼 주소 (href 는 그대로 둔다) */
  function readableUrl(href) {
    try {
      return decodeURI(href);
    } catch (e) {
      return href;
    }
  }

  /** 종이에서도 읽히게 링크 이름 옆에 주소를 같이 적는다 (PDF 안에서는 링크로도 눌린다) */
  function pdfLinkList(pairs) {
    return ulOf(
      pairs.map(([label, href]) =>
        el("span", {}, [label + " — ", el("a", { class: "pdf-url", href, target: "_blank", rel: "noopener noreferrer", text: readableUrl(href) })])
      ),
      true
    );
  }

  function pdfProject(p, key) {
    const art = el("article", { class: "pdf-project" });
    const icon = p.icon ? img(p.icon, { cls: "app-icon pdf-icon", lazy: false }) : null;
    const meta = [FEATURED.includes(p.id) ? "대표 작업" : null, p.company, p.period || p.status].concat(list(p.platforms)).filter(Boolean);
    art.append(
      el("header", { class: icon ? "pdf-head" : "pdf-head plain" }, [
        icon,
        el("div", { class: "pdf-head-text" }, [el("h4", { text: p.title }), meta.length ? el("p", { class: "pdf-meta" }, [dotText(meta)]) : null]),
      ])
    );
    if (p.headline) art.append(el("p", { class: "pdf-headline", text: p.headline }));
    if (p.summary) art.append(el("p", { class: "pdf-summary", text: p.summary }));

    const dl = el("dl", { class: "kv" });
    if (key === "company") kvRow(dl, "역할", p.role);
    if (list(p.bullets).length) kvRow(dl, "주요 작업", ulOf(list(p.bullets)));
    appendResults(dl, p);
    if (list(p.proof).length) kvRow(dl, "근거", pdfLinkList(list(p.proof).map((x) => [x.label, x.href])));
    if (list(p.tech).length) kvRow(dl, "스택", dotText(list(p.tech)));
    const minor = list(p.minor);
    if (minor.length) kvRow(dl, "포함", dotText(minor.map((m) => m.name)));
    const links = linkPairs(p);
    if (links.length) kvRow(dl, "링크", pdfLinkList(links));
    art.append(dl);
    return art;
  }

  /** 카테고리 제목 → 작업 블록 (데이터 순서). 이미 그렸으면 다시 그리지 않는다. */
  function renderPdfDoc() {
    const root = document.getElementById("pdf-doc");
    if (!root || root.childElementCount) return;
    KEYS.forEach((key) => {
      const cat = CATS[key];
      const items = list(cat.list);
      if (!items.length) return;
      const section = el("section", { class: "pdf-cat" }, [
        el("h3", { class: "pdf-cat-title" }, [cat.label + " ", el("span", { class: "count", text: String(items.length) })]),
        cat.hint ? el("p", { class: "pdf-cat-hint", text: cat.hint }) : null,
      ]);
      items.forEach((p) => section.append(pdfProject(p, key)));
      root.append(section);
    });
  }

  /**
   * PDF 는 로컬 서버(127.0.0.1)에서 찍는다. 상대 링크(pdf/resume.pdf)·해시 링크(#neko-omakase)를
   * 그대로 두면 PDF 안 링크에 로컬 주소가 박히므로 공개 사이트 주소로 바꾼다.
   */
  function absolutizeLinksForPdf() {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:)/i.test(href)) return;
      a.setAttribute("href", new URL(href, SITE_URL).href);
    });
  }

  /* ---------------------------------------------------------------- */
  /* 시작                                                               */
  /* ---------------------------------------------------------------- */

  function init() {
    renderTopics();
    renderCareerBars();
    const updated = document.getElementById("profile-updated");
    if (updated && P.profile && P.profile.updated) updated.textContent = P.profile.updated;
    syncTeamNames();

    if (PDF) {
      renderPdfDoc();
      absolutizeLinksForPdf();
      document.documentElement.setAttribute("data-pdf-ready", "1");
      return;
    }

    renderFeatured();
    renderWork();

    selectTab(KEYS[0]);
    setupTheme();
    setupMenu();
    setupEscape();
    watchToc();
    watchIntroTitle();
    instantTraversal();

    // 브라우저 인쇄도 PDF 와 같은 펼친 목록을 쓴다 (@media print 가 탭·행 대신 보여 준다)
    window.addEventListener("beforeprint", renderPdfDoc);

    // 첫 화면·대표 작업의 프로젝트 링크: 그 행을 펼치고 기록을 남긴다
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest("a[data-project-link]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const id = a.getAttribute("data-project-link");
      if (!INDEX.has(id)) return;
      e.preventDefault();
      if (e.detail > 1) return; // 더블클릭은 한 번만 연다
      openProject(id, { push: true, scroll: true, smooth: true, focus: true });
    });

    window.addEventListener("popstate", syncFromLocation);
    window.addEventListener("hashchange", syncFromLocation);

    const first = hashId();
    syncFromLocation();
    if (INDEX.has(first)) {
      // 웹 글꼴이 늦게 들어와 줄 높이가 바뀌면 한 번 더 맞춘다
      const again = () => {
        if (hashId() === first) document.getElementById(first).scrollIntoView({ behavior: "instant", block: "start" });
      };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
      // Chrome 은 로드를 마치며 해시 대상(포커스를 못 받는 li)을 처리할 때 포커스를 비운다 — 그 뒤 행 머리에 다시 둔다.
      // 그사이 사용자가 다른 곳으로 포커스를 옮겼으면 건드리지 않는다.
      const refocus = () =>
        window.setTimeout(() => {
          const ae = document.activeElement;
          if (hashId() !== first || openId !== first || (ae && ae !== document.body)) return;
          quietFocus(document.getElementById(first).querySelector(".row-head"));
        }, 0);
      if (document.readyState === "complete") refocus();
      else window.addEventListener("load", refocus, { once: true });
    }
  }

  init();
})();
