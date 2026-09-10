/**
 * Portfolio UI — 렌더링 · 필터 · 상세 패널 · PDF 모드.
 *
 * 데이터는 이 파일에 없다. data/projects.js 가 window.PORTFOLIO 로 넘겨준다.
 * 프로젝트를 추가·수정하려면 data/projects.js 만 고친다.
 */

const { categories: CATEGORIES, codeTopics: CODE_TOPICS } = window.PORTFOLIO;

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
    category === "company" ? "badge" : `badge badge-${category}`;

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
  return CATEGORIES[activeCategory].list;
}

/** id로 프로젝트와 소속 카테고리 키를 함께 찾는다. */
function findEntry(id) {
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const project = cat.list.find((p) => p.id === id);
    if (project) return { project, category: key };
  }
  return null;
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
      document.getElementById("work-hint").textContent = CATEGORIES[cat].hint;
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
  const entry = findEntry(hash);
  if (!entry) return;
  if (entry.category !== activeCategory) {
    document.querySelector(`[data-filter="${entry.category}"]`)?.click();
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

/** PDF/print: 모든 카테고리를 펼쳐 렌더 (필터·접힘 없음) */
function renderPdfDocument() {
  const root = document.getElementById("pdf-doc");
  if (!root) return;
  root.innerHTML = "";
  root.setAttribute("aria-hidden", "false");

  Object.values(CATEGORIES).forEach((cat) => {
    root.appendChild(
      el("h3", { className: "pdf-section-title", text: cat.label })
    );
    cat.list.forEach((p) => root.appendChild(renderPdfProjectBlock(p)));
  });
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
