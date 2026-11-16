/**
 * Portfolio UI — 대표 작업 · 필터 · 상세 패널 · 해시 딥링크 · PDF 모드.
 *
 * 데이터는 이 파일에 없다. data/projects.js 가 window.PORTFOLIO 로 넘겨준다.
 * 프로젝트를 추가·수정하려면 data/projects.js 만 고친다.
 *
 * 딥링크 규칙
 *   - 카드·대표 작업·첫 화면 하이라이트로 열면 history.pushState("#<id>")
 *   - 닫으면 history.pushState(pathname + search) — 해시 없음
 *   - popstate / hashchange: 해시가 프로젝트 id 면 (필요하면 카테고리를 바꿔) 열고,
 *     비었거나 섹션 앵커면 패널만 닫는다 (기록을 더하지 않음)
 */

const PORTFOLIO = window.PORTFOLIO || {};
const CATEGORIES = PORTFOLIO.categories || {};
const CODE_TOPICS = Array.isArray(PORTFOLIO.codeTopics) ? PORTFOLIO.codeTopics : [];
const CODE_PORTFOLIO_URL = "https://cykim0115.github.io/code_portfolio/";

const RESULT_LABELS = { team: "팀 성과", personal: "개인 기여" };

/* ------------------------------------------------------------------ */
/* 공통 헬퍼                                                            */
/* ------------------------------------------------------------------ */

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (v === null || v === undefined || v === false) return;
    if (k === "className") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else {
      node.setAttribute(k, v === true ? "" : v);
    }
  });
  children.forEach((c) => {
    if (c == null || c === false) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

function prefersReducedMotion() {
  return Boolean(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function scrollBehavior() {
  return prefersReducedMotion() ? "auto" : "smooth";
}

function isPdfMode() {
  return document.documentElement.getAttribute("data-pdf") === "1";
}

function asList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

/** 회사 · 기간 · 플랫폼 (기간이 없으면 상태) */
function metaParts(project) {
  return [
    project.company,
    project.period || project.status,
    asList(project.platforms).join(" · "),
  ].filter(Boolean);
}

function resultLabel(scope) {
  return RESULT_LABELS[scope] || RESULT_LABELS.team;
}

function newTabHint() {
  return el("span", { className: "sr-only", text: " (새 탭)" });
}

function externalLink(href, label, className) {
  return el(
    "a",
    { className, href, target: "_blank", rel: "noopener noreferrer" },
    [label, newTabHint()]
  );
}

function renderResults(results, className = "result-list") {
  const ul = el("ul", { className });
  results.forEach((r) => {
    const scope = r.scope === "personal" ? "personal" : "team";
    ul.appendChild(
      el("li", {}, [
        el("span", {
          className: `result-badge result-${scope}`,
          text: resultLabel(scope),
        }),
        el("span", { className: "result-text", text: r.text }),
      ])
    );
  });
  return ul;
}

/* ------------------------------------------------------------------ */
/* 데이터 조회                                                          */
/* ------------------------------------------------------------------ */

/** id로 프로젝트와 소속 카테고리 키를 함께 찾는다. */
function findEntry(id) {
  if (!id) return null;
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const project = (cat.list || []).find((p) => p.id === id);
    if (project) return { project, category: key };
  }
  return null;
}

function getFeaturedEntries() {
  let ids = Array.isArray(PORTFOLIO.featured) ? PORTFOLIO.featured : null;
  if (!ids) {
    const pinned = [];
    Object.values(CATEGORIES).forEach((cat) =>
      (cat.list || []).forEach((p) => {
        if (p.featured) pinned.push(p);
      })
    );
    ids = pinned.sort((a, b) => a.featured - b.featured).map((p) => p.id);
  }
  return ids.map(findEntry).filter(Boolean).slice(0, 3);
}

/* ------------------------------------------------------------------ */
/* 상태                                                                 */
/* ------------------------------------------------------------------ */

let activeCategory = null;
let activeId = null;
let openerEl = null;

function panelEl() {
  return document.getElementById("detail-panel");
}

function gridCard(id) {
  if (!id) return null;
  return document.querySelector(`.project-card[data-id="${CSS.escape(id)}"]`);
}

/* ------------------------------------------------------------------ */
/* 대표 작업                                                            */
/* ------------------------------------------------------------------ */

function renderFeaturedCard(project, index) {
  const headlineId = `featured-${project.id}-headline`;
  const titleId = `featured-${project.id}-title`;

  const media = project.image
    ? el("span", { className: "featured-media" }, [
        el("img", {
          src: project.image,
          alt: "",
          loading: index === 0 ? "eager" : "lazy",
          decoding: "async",
        }),
      ])
    : el("span", {
        className: "featured-media placeholder",
        "aria-hidden": "true",
        text: project.title,
      });

  const body = el("span", { className: "featured-body" }, [
    el("span", { className: "featured-meta", text: metaParts(project).join(" · ") }),
    el("h3", {
      className: "featured-headline",
      id: headlineId,
      text: project.headline || project.blurb,
    }),
    el("span", { className: "featured-title", id: titleId, text: project.title }),
  ]);

  if (project.role) {
    body.appendChild(
      el("span", { className: "featured-role" }, [
        el("span", { className: "field-label", text: "내 역할" }),
        el("span", { text: project.role }),
      ])
    );
  }

  const results = asList(project.results).slice(0, 3);
  if (results.length) body.appendChild(renderResults(results, "result-list compact"));

  body.appendChild(
    el("span", { className: "featured-more", "aria-hidden": "true" }, [
      "자세히",
      el("span", { className: "arrow", text: "→" }),
    ])
  );

  return el(
    "a",
    {
      className: "featured-card",
      href: `#${project.id}`,
      "data-project-link": project.id,
      "aria-controls": "detail-panel",
      "aria-labelledby": `${titleId} ${headlineId}`,
    },
    [media, body]
  );
}

function renderFeatured() {
  const section = document.getElementById("featured");
  const grid = document.getElementById("featured-grid");
  if (!section || !grid) return;
  const entries = getFeaturedEntries();
  grid.innerHTML = "";
  if (!entries.length) {
    section.hidden = true;
    document
      .querySelectorAll('a[href="#featured"]')
      .forEach((a) => a.setAttribute("href", "#work"));
    return;
  }
  entries.forEach(({ project }, i) => grid.appendChild(renderFeaturedCard(project, i)));
}

/* ------------------------------------------------------------------ */
/* 전체 작업 그리드                                                      */
/* ------------------------------------------------------------------ */

// 카드는 <button> 이라 안쪽은 phrasing content(span·img)만 쓴다.
function renderCard(project, category) {
  // 회사 작업은 게임명이 식별자라 제목으로 둔다. 개인·AI 작업은 해결한 일(headline)을 제목으로,
  // 도구 이름은 그 아래 작은 줄로 둔다 — 도구명만으로는 무엇을 했는지 알 수 없다.
  const leadWithHeadline = category !== "company" && Boolean(project.headline);

  const media = project.image
    ? el("span", { className: "card-media" }, [
        el("img", {
          src: project.image,
          alt: "",
          loading: "lazy",
          decoding: "async",
        }),
      ])
    : el("span", {
        className: leadWithHeadline ? "card-media placeholder compact" : "card-media placeholder",
        "aria-hidden": "true",
        text: leadWithHeadline ? null : project.title,
      });

  const badgeClass = category === "company" ? "badge" : `badge badge-${category}`;

  const meta = el("span", { className: "card-meta" }, [
    // 대표 작업과 같은 항목이 그리드에도 나오므로 의도된 중복임을 표시한다
    project.featured ? el("span", { className: "card-featured", text: "대표" }) : null,
    el("span", { className: badgeClass, text: project.company }),
    project.status ? el("span", { text: project.status }) : null,
    project.period ? el("span", { className: "card-period", text: project.period }) : null,
  ]);

  const body = el("span", { className: "card-body" }, [
    meta,
    el("span", {
      className: "card-title",
      text: leadWithHeadline ? project.headline : project.title,
    }),
    leadWithHeadline ? el("span", { className: "card-name", text: project.title }) : null,
    el("span", { className: "card-blurb", text: project.blurb }),
  ]);

  // 개인·AI 작업의 역할은 모두 "개인 프로젝트 — 설계·구현"이라 카드에서는 빼고 상세에만 둔다
  if (project.role && category === "company") {
    body.appendChild(
      el("span", { className: "card-role" }, [
        el("span", { className: "field-label", text: "내 역할" }),
        " ",
        project.role,
      ])
    );
  }

  return el(
    "button",
    {
      className: "project-card",
      type: "button",
      "data-id": project.id,
      "data-category": category,
      "aria-expanded": "false",
      "aria-controls": "detail-panel",
    },
    [media, body]
  );
}

function renderGrid() {
  const grid = document.getElementById("project-grid");
  const panel = panelEl();
  const list = (CATEGORIES[activeCategory] && CATEGORIES[activeCategory].list) || [];
  const cards = list.map((p) => {
    const card = renderCard(p, activeCategory);
    card.addEventListener("click", (e) => {
      // 더블클릭의 두 번째 클릭이 방금 연 상세를 곧바로 닫지 않게 한다 (키보드로 누르면 detail 은 0)
      if (e.detail > 1) return;
      if (activeId === p.id) {
        closeDetail({ push: true });
        return;
      }
      openProject(p.id, { push: true, opener: card });
    });
    return card;
  });
  // 상세 패널은 그리드 안에 산다 — 카드만 갈아 끼우고 패널은 남긴다
  grid.replaceChildren(...cards, ...(panel ? [panel] : []));
  markActiveCard(activeId);
  if (activeId) placePanel();
}

/**
 * 상세 패널을 누른 카드가 있는 줄 바로 뒤로 옮긴다.
 * 열 수는 화면 폭에 따라 1·2·3열이라, 같은 줄인지는 카드의 offsetTop 으로 판단한다.
 */
function placePanel() {
  const panel = panelEl();
  const card = gridCard(activeId);
  if (!panel || !card || !card.parentElement) return;
  const grid = card.parentElement;
  const cards = Array.from(grid.children).filter((c) => c.classList.contains("project-card"));
  const top = card.offsetTop;
  let next = null;
  for (let i = cards.indexOf(card) + 1; i < cards.length; i++) {
    if (cards[i].offsetTop !== top) {
      next = cards[i];
      break;
    }
  }
  if (next) {
    if (panel.nextElementSibling !== next) grid.insertBefore(panel, next);
  } else if (grid.lastElementChild !== panel) {
    grid.appendChild(panel);
  }
}

function markActiveCard(id) {
  document.querySelectorAll(".project-card").forEach((c) => {
    const on = Boolean(id) && c.dataset.id === id;
    c.classList.toggle("is-active", on);
    c.setAttribute("aria-expanded", on ? "true" : "false");
  });
}

function setCategory(cat) {
  if (!CATEGORIES[cat] || cat === activeCategory) return false;
  activeCategory = cat;
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.setAttribute("aria-pressed", b.dataset.filter === cat ? "true" : "false");
  });
  const hint = document.getElementById("work-hint");
  if (hint) hint.textContent = CATEGORIES[cat].hint || "";
  renderGrid();
  return true;
}

function initFilters() {
  const pressed = document.querySelector('.filter-btn[aria-pressed="true"]');
  const initial =
    (pressed && CATEGORIES[pressed.dataset.filter] && pressed.dataset.filter) ||
    Object.keys(CATEGORIES)[0];
  setCategory(initial);

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      if (cat === activeCategory) return;
      if (activeId) closeDetail({ push: true });
      setCategory(cat);
    });
  });
}

/* ------------------------------------------------------------------ */
/* 상세 패널                                                            */
/* ------------------------------------------------------------------ */

function detailBlock(label, content) {
  return el("div", { className: "detail-block" }, [
    el("h4", { className: "detail-block-title", text: label }),
    content,
  ]);
}

/** 배너(detail-media)와 스크린샷·묶음 아이콘(detail-gallery)을 따로 만든다 — 좁은 화면에서 본문을 사이에 둔다 */
function renderDetailMedia(project) {
  const mediaCol = el("div", { className: "detail-media" });
  const gallery = el("div", { className: "detail-gallery" });
  if (project.image) {
    mediaCol.appendChild(
      el("img", {
        className: "detail-banner",
        src: project.image,
        alt: `${project.title} 배너`,
        decoding: "async",
      })
    );
  } else {
    mediaCol.appendChild(
      el("div", {
        className: "detail-banner placeholder",
        "aria-hidden": "true",
        text: project.title,
      })
    );
  }

  const shots = asList(project.shots).slice(0, 4);
  if (shots.length) {
    const wrap = el("div", { className: "store-shots" });
    shots.forEach((src, i) =>
      wrap.appendChild(
        el("img", {
          src,
          alt: `${project.title} 스크린샷 ${i + 1}`,
          loading: "lazy",
          decoding: "async",
        })
      )
    );
    gallery.appendChild(wrap);
  }

  const minor = asList(project.minor);
  if (minor.length) {
    const grid = el("ul", { className: "minor-grid", "aria-label": "포함 타이틀" });
    minor.forEach((m) => {
      grid.appendChild(
        el("li", { className: "minor-item" }, [
          el("img", { src: m.img, alt: "", loading: "lazy", decoding: "async" }),
          el("span", { text: m.name }),
        ])
      );
    });
    gallery.appendChild(grid);
  }
  return { banner: mediaCol, gallery: gallery.childNodes.length ? gallery : null };
}

function renderDetailLinks(project) {
  const links = el("div", { className: "detail-links" });
  asList(project.stores).forEach((s) =>
    links.appendChild(externalLink(s.href, s.label, "btn btn-ghost"))
  );
  if (project.repo) links.appendChild(externalLink(project.repo, "GitHub", "btn btn-ghost"));
  if (project.docs) links.appendChild(externalLink(project.docs, "GitBook", "btn btn-ghost"));
  if (project.codeLink) {
    links.appendChild(externalLink(project.codeLink, "Code Portfolio", "btn btn-primary"));
  }
  return links.childNodes.length ? links : null;
}

function renderDetail(project) {
  const panel = panelEl();
  panel.innerHTML = "";
  panel.hidden = false;
  panel.classList.add("is-open");

  const close = el("button", {
    className: "detail-close",
    type: "button",
    "aria-label": "상세 닫기",
    onClick: () => closeDetail({ push: true, restoreFocus: true }),
  }, ["닫기"]);

  const heading = el("div", { className: "detail-heading" }, [
    el("p", { className: "detail-meta", text: metaParts(project).join(" · ") }),
    el("h3", { id: "detail-title", tabindex: "-1", text: project.title }),
    project.headline ? el("p", { className: "detail-headline", text: project.headline }) : null,
  ]);

  panel.appendChild(el("div", { className: "detail-top" }, [heading, close]));

  const copy = el("div", { className: "detail-copy" });
  if (project.summary) copy.appendChild(el("p", { className: "detail-summary", text: project.summary }));

  if (project.role) {
    copy.appendChild(detailBlock("내 역할", el("p", { text: project.role })));
  }

  const bullets = asList(project.bullets);
  if (bullets.length) {
    const ul = el("ul", { className: "detail-bullets" });
    bullets.forEach((b) => ul.appendChild(el("li", { text: b })));
    copy.appendChild(detailBlock("주요 작업", ul));
  }

  const results = asList(project.results);
  if (results.length) copy.appendChild(detailBlock("성과", renderResults(results)));

  const proof = asList(project.proof);
  if (proof.length) {
    const ul = el("ul", { className: "proof-list" });
    proof.forEach((p) =>
      ul.appendChild(
        el("li", {}, [
          el("a", { href: p.href, target: "_blank", rel: "noopener noreferrer" }, [
            p.label,
            el("span", { className: "ext", "aria-hidden": "true", text: " ↗" }),
            newTabHint(),
          ]),
        ])
      )
    );
    copy.appendChild(detailBlock("근거", ul));
  }

  const tech = asList(project.tech);
  if (tech.length) {
    const wrap = el("ul", { className: "detail-tech", "aria-label": "기술 스택" });
    tech.forEach((t) => wrap.appendChild(el("li", { text: t })));
    copy.appendChild(wrap);
  }

  const links = renderDetailLinks(project);
  if (links) copy.appendChild(links);

  const status = el("p", { className: "copy-status", role: "status", "aria-live": "polite" });
  const copyBtn = el("button", {
    className: "copy-link",
    type: "button",
    onClick: () => copyProjectLink(project.id, status),
  }, ["링크 복사"]);
  copy.appendChild(el("div", { className: "detail-share" }, [copyBtn, status]));

  const hasMedia =
    Boolean(project.image) || asList(project.shots).length || asList(project.minor).length;
  const layout = el("div", {
    className: hasMedia ? "detail-layout has-media" : "detail-layout",
  });
  const media = renderDetailMedia(project);
  // 이미지가 하나도 없는 항목은 큰 placeholder 대신 본문만 보여 준다
  if (hasMedia) layout.appendChild(media.banner);
  layout.appendChild(copy);
  if (media.gallery) layout.appendChild(media.gallery);
  panel.appendChild(layout);
}

function projectUrl(id) {
  const origin =
    location.origin && location.origin !== "null"
      ? location.origin
      : `${location.protocol}//${location.host}`;
  return `${origin}${location.pathname}#${id}`;
}

function legacyCopy(text) {
  const ta = el("textarea", { readonly: true, "aria-hidden": "true", tabindex: "-1" });
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.top = "-1000px";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  const prev = document.activeElement;
  let ok = false;
  try {
    ta.select();
    ok = document.execCommand("copy");
  } catch (_) {
    ok = false;
  }
  ta.remove();
  if (prev && typeof prev.focus === "function") prev.focus({ preventScroll: true });
  return ok;
}

async function copyProjectLink(id, statusEl) {
  const url = projectUrl(id);
  let ok = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      ok = true;
    }
  } catch (_) {
    ok = false;
  }
  if (!ok) ok = legacyCopy(url);

  statusEl.innerHTML = "";
  if (ok) {
    statusEl.textContent = "링크를 복사했습니다.";
    return;
  }
  // 자동 복사가 막힌 환경 — 주소를 보여 주고 선택해 둔다
  statusEl.appendChild(document.createTextNode("자동 복사가 안 됩니다. 주소를 직접 복사해 주세요."));
  const input = el("input", {
    className: "copy-fallback",
    type: "text",
    readonly: true,
    value: url,
    "aria-label": "프로젝트 링크",
  });
  statusEl.appendChild(input);
  input.focus();
  input.select();
}

/**
 * 프로젝트를 연다. 필요하면 카테고리를 바꾸고, 패널 제목으로 포커스를 옮긴 뒤 패널로 스크롤한다.
 */
function openProject(id, { push = false, opener = null, focus = true, scroll = true } = {}) {
  const entry = findEntry(id);
  if (!entry) return false;

  if (entry.category !== activeCategory) setCategory(entry.category);

  activeId = id;
  openerEl = opener;
  markActiveCard(id);
  renderDetail(entry.project);
  placePanel();

  if (push && currentHashId() !== id) {
    history.pushState(null, "", `#${id}`);
  }

  const title = document.getElementById("detail-title");
  if (focus && title) title.focus({ preventScroll: true });
  if (scroll) scrollToPanel(id);
  return true;
}

function scrollToPanel(id) {
  if (activeId !== id) return;
  const panel = panelEl();
  panel.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  // 웹 폰트가 늦게 들어오면 위쪽 문단 줄바꿈이 바뀌어 패널이 밀린다 — 다 들어온 뒤 한 번 더 맞춘다
  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(() => {
      if (activeId === id) panel.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }
}

/**
 * 패널을 닫는다.
 *   push         — 해시를 지운 기록을 더한다 (사용자가 닫을 때)
 *   restoreFocus — 연 카드(없으면 그리드 카드)로 포커스를 돌려준다
 */
function closeDetail({ push = false, restoreFocus = false } = {}) {
  if (!activeId) return;
  const closedId = activeId;
  const panel = panelEl();
  const focusWasInside = panel.contains(document.activeElement);

  activeId = null;
  panel.classList.remove("is-open");
  panel.hidden = true;
  panel.innerHTML = "";
  markActiveCard(null);

  if (push && location.hash) {
    history.pushState(null, "", location.pathname + location.search);
  }

  if (restoreFocus || focusWasInside) {
    const target = openerEl && openerEl.isConnected ? openerEl : gridCard(closedId);
    if (target) target.focus(restoreFocus ? undefined : { preventScroll: true });
  }
  openerEl = null;
}

function currentHashId() {
  const raw = location.hash.replace(/^#/, "");
  try {
    return decodeURIComponent(raw);
  } catch (_) {
    return raw;
  }
}

/** 주소창 해시에 패널 상태를 맞춘다 (기록은 더하지 않는다). */
function syncFromLocation(e) {
  const hash = currentHashId();
  if (hash && findEntry(hash)) {
    if (activeId !== hash) {
      // 뒤로·앞으로 가기: 브라우저는 popstate 직후 그 기록의 스크롤 위치를 되돌린다.
      // 바로 스크롤하면 그 복원에 덮이므로, 복원이 끝난 다음 태스크에서 패널로 옮긴다.
      const fromHistory = Boolean(e && e.type === "popstate");
      openProject(hash, { push: false, scroll: !fromHistory });
      if (fromHistory) setTimeout(() => scrollToPanel(hash), 0);
    }
    return;
  }
  if (!activeId) return;
  closeDetail({ push: false });
  // 패널이 사라지며 레이아웃이 당겨지므로 섹션 앵커는 다시 맞춘다
  const target = hash ? document.getElementById(hash) : null;
  if (target) {
    requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: scrollBehavior(), block: "start" })
    );
  }
}

function isInViewport(node) {
  const r = node.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

function initDeepLinks() {
  // 대표 작업 카드 · 첫 화면 하이라이트 (a[data-project-link])
  document.addEventListener("click", (e) => {
    const link = e.target.closest && e.target.closest("a[data-project-link]");
    if (!link) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const id = link.getAttribute("data-project-link");
    if (!findEntry(id)) return;
    e.preventDefault();
    if (e.detail > 1) return; // 더블클릭은 한 번만 연다
    openProject(id, { push: true, opener: link });
  });

  // 화면 폭이 바뀌어 그리드 열 수가 달라지면 패널을 새 줄 위치로 옮긴다
  let placeQueued = false;
  window.addEventListener("resize", () => {
    if (!activeId || placeQueued) return;
    placeQueued = true;
    requestAnimationFrame(() => {
      placeQueued = false;
      placePanel();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !activeId) return;
    const panel = panelEl();
    const ae = document.activeElement;
    const onActiveCard = ae && ae === gridCard(activeId);
    const idleInPanel = (!ae || ae === document.body) && isInViewport(panel);
    if (panel.contains(ae) || onActiveCard || idleInPanel) {
      e.preventDefault();
      closeDetail({ push: true, restoreFocus: true });
    }
  });

  window.addEventListener("popstate", syncFromLocation);
  window.addEventListener("hashchange", syncFromLocation);
  syncFromLocation();
}

/* ------------------------------------------------------------------ */
/* 기타 섹션                                                            */
/* ------------------------------------------------------------------ */

function initNavScroll() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initCodeTopics() {
  const list = document.getElementById("code-topics");
  if (!list) return;
  list.innerHTML = "";
  CODE_TOPICS.forEach((t) => {
    if (t && typeof t === "object" && t.label) {
      const href = t.id ? `${CODE_PORTFOLIO_URL}#${encodeURIComponent(t.id)}` : CODE_PORTFOLIO_URL;
      list.appendChild(el("li", {}, [externalLink(href, t.label, "topic-link")]));
    } else if (typeof t === "string") {
      list.appendChild(el("li", { className: "topic-plain", text: t }));
    }
  });
}

function initProfile() {
  const updated = PORTFOLIO.profile && PORTFOLIO.profile.updated;
  const slot = document.getElementById("profile-updated");
  if (slot && updated) slot.textContent = updated;
}

const THEME_COLORS = { light: "#e8eeea", dark: "#121816" };

function syncThemeColor(theme) {
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", THEME_COLORS[theme] || THEME_COLORS.light));
}

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn || isPdfMode()) return;
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (_) {}
  // 사용자가 직접 고른 테마가 있을 때만 브라우저 UI 색을 고정한다
  if (saved) syncThemeColor(document.documentElement.getAttribute("data-theme"));

  btn.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    syncThemeColor(next);
    try {
      localStorage.setItem("theme", next);
    } catch (_) {}
  });
}

/* ------------------------------------------------------------------ */
/* PDF / 인쇄                                                           */
/* ------------------------------------------------------------------ */

function pdfField(label, content) {
  return el("div", { className: "pdf-field" }, [
    el("p", { className: "pdf-label", text: label }),
    content,
  ]);
}

function renderPdfProjectBlock(project) {
  const block = el("article", { className: "pdf-project" });
  block.appendChild(el("h4", { text: project.title }));
  if (project.headline) block.appendChild(el("p", { className: "pdf-headline", text: project.headline }));

  const meta = metaParts(project);
  if (project.featured) meta.unshift("대표 작업");
  block.appendChild(el("p", { className: "pdf-meta", text: meta.join(" · ") }));

  if (project.summary) block.appendChild(el("p", { text: project.summary }));
  if (project.role) block.appendChild(pdfField("내 역할", el("p", { text: project.role })));

  const bullets = asList(project.bullets);
  if (bullets.length) {
    const ul = el("ul");
    bullets.forEach((b) => ul.appendChild(el("li", { text: b })));
    block.appendChild(pdfField("주요 작업", ul));
  }

  const results = asList(project.results);
  if (results.length) {
    const ul = el("ul");
    results.forEach((r) =>
      ul.appendChild(el("li", { text: `[${resultLabel(r.scope)}] ${r.text}` }))
    );
    block.appendChild(pdfField("성과", ul));
  }

  const proof = asList(project.proof);
  if (proof.length) {
    const ul = el("ul", { className: "pdf-links" });
    proof.forEach((p) => ul.appendChild(el("li", { text: `${p.label} — ${p.href}` })));
    block.appendChild(pdfField("근거", ul));
  }

  const tech = asList(project.tech);
  if (tech.length) {
    const wrap = el("div", { className: "pdf-tech" });
    tech.forEach((t) => wrap.appendChild(el("span", { text: t })));
    block.appendChild(wrap);
  }

  const linkParts = [];
  asList(project.stores).forEach((s) => linkParts.push(`${s.label}: ${s.href}`));
  if (project.repo) linkParts.push(`GitHub: ${project.repo}`);
  if (project.docs) linkParts.push(`GitBook: ${project.docs}`);
  if (project.codeLink) linkParts.push(`Code: ${project.codeLink}`);
  if (linkParts.length) {
    block.appendChild(el("p", { className: "pdf-links", text: linkParts.join("\n") }));
  }

  const minor = asList(project.minor);
  if (minor.length) {
    block.appendChild(el("p", { text: "포함: " + minor.map((m) => m.name).join(", ") }));
  }
  return block;
}

const SITE_URL = "https://cykim0115.github.io/";

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

/** PDF/print: 모든 카테고리를 펼쳐 렌더 (필터·접힘 없음) */
function renderPdfDocument() {
  const root = document.getElementById("pdf-doc");
  if (!root) return;
  root.innerHTML = "";
  root.setAttribute("aria-hidden", "false");

  Object.values(CATEGORIES).forEach((cat) => {
    const list = cat.list || [];
    if (!list.length) return;
    root.appendChild(el("h3", { className: "pdf-section-title", text: cat.label }));
    list.forEach((p) => root.appendChild(renderPdfProjectBlock(p)));
  });
}

function initPrint() {
  // 브라우저 인쇄에서도 PDF 와 같은 펼친 목록을 쓴다
  window.addEventListener("beforeprint", () => {
    const root = document.getElementById("pdf-doc");
    if (root && !root.childNodes.length) renderPdfDocument();
  });
}

/* ------------------------------------------------------------------ */
/* 시작                                                                 */
/* ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initCodeTopics();
  initProfile();

  if (isPdfMode()) {
    absolutizeLinksForPdf();
    renderPdfDocument();
    document.documentElement.setAttribute("data-pdf-ready", "1");
    return;
  }

  initNavScroll();
  initPrint();
  renderFeatured();
  initFilters();
  initDeepLinks();
});
