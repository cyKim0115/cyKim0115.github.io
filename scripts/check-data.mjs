/**
 * 데이터 정합성 검사 — data/projects.js · index.html 을 고친 뒤 이것만 통과하면 화면이 깨지지 않는다.
 *   npm run check
 *
 * 문제(problem)는 실패(exit 1), 경고(warning)는 출력만 한다.
 *
 *  1. id 가 전체에서 유일한가, index.html 의 요소 id 와 겹치지 않는가 (#id 해시 충돌 방지)
 *  2. image / shots / minor 의 파일이 실제로 있는가 (오타는 조용히 깨진다)
 *  3. index.html 의 filter 버튼과 CATEGORIES 의 key 가 일치하는가
 *  4. 배지 색이 필요한 카테고리에 .badge-<key> 가 style.css 에 있는가
 *  5. 필수 필드(id/title/blurb/summary)가 비어 있지 않은가
 *  6. 대표 작업(featured): 정확히 3개, 중복 없음, 실재하는 id, role·headline 필수
 *  7. role·headline: company·대표 작업은 필수, personal·ai 는 없으면 경고
 *  8. results[].scope 는 "team" | "personal", proof·stores·repo·docs·codeLink 는 https URL
 *  9. codeTopics 는 {label, id}. ../code_portfolio/topics.json 이 있으면 id 와 codeLink #앵커가 실재하는가
 * 10. index.html · 404.html 의 로컬 href/src (favicon.svg · assets/ · pdf/ · Resource/ …)가 디스크에 있는가
 * 11. 확인되지 않은 순위·수상 표기(앱스토어 순위 · 양대 마켓 1위 · 비주얼 부문 수상 등)가 없는가
 *     — 화면·문서·OG 템플릿·404 를 모두 검사하고, 걸리면 실패로 본다
 * 12. 공유 이미지 크기(assets/og-image.png 1200x630 · apple-touch-icon 180x180)
 */
import { readFile, access, open } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_ORIGIN = "https://cykim0115.github.io";
const CODE_PORTFOLIO_PREFIX = `${SITE_ORIGIN}/code_portfolio/`;
const TOPICS_JSON = path.join(ROOT, "..", "code_portfolio", "topics.json");

const problems = [];
const warnings = [];

// data/projects.js 는 브라우저용 전역 스크립트라 window 를 흉내내어 읽는다
globalThis.window = {};
await import(pathToFileURL(path.join(ROOT, "data", "projects.js")).href);
const PORTFOLIO = globalThis.window.PORTFOLIO || {};
const { categories, codeTopics } = PORTFOLIO;

if (!categories) {
  console.error("data/projects.js 가 window.PORTFOLIO 를 세우지 않았습니다.");
  process.exit(1);
}

const dataSrc = await readFile(path.join(ROOT, "data", "projects.js"), "utf8");
const html = await readFile(path.join(ROOT, "index.html"), "utf8");
const css = await readFile(path.join(ROOT, "style.css"), "utf8");

async function exists(rel) {
  try {
    await access(path.join(ROOT, rel));
    return true;
  } catch {
    return false;
  }
}

function isHttps(href) {
  if (typeof href !== "string" || !href) return false;
  try {
    return new URL(href).protocol === "https:";
  } catch {
    return false;
  }
}

const filled = (v) => typeof v === "string" && v.trim().length > 0;

// ---------------------------------------------------------------- 1–5, 7, 8
const seen = new Map();
const byId = new Map();
const htmlIds = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

for (const [key, cat] of Object.entries(categories)) {
  if (!cat.label) problems.push(`카테고리 ${key}: label 이 없습니다`);
  if (!cat.hint) problems.push(`카테고리 ${key}: hint 가 없습니다`);
  if (!Array.isArray(cat.list) || !cat.list.length) {
    problems.push(`카테고리 ${key}: list 가 비어 있습니다`);
    continue;
  }

  // 3 — 필터 버튼
  if (!html.includes(`data-filter="${key}"`)) {
    problems.push(`index.html 에 data-filter="${key}" 버튼이 없습니다`);
  }
  // 4 — 배지 색 (company 는 기본 .badge 를 쓴다)
  if (key !== "company" && !css.includes(`.badge-${key}`)) {
    problems.push(`style.css 에 .badge-${key} 가 없습니다`);
  }

  for (const p of cat.list) {
    const tag = `${key}/${p.id || "(id 없음)"}`;
    for (const field of ["id", "title", "blurb", "summary"]) {
      if (!p[field]) problems.push(`${tag}: ${field} 가 비어 있습니다`);
    }

    // 1 — id 유일성 · 페이지 요소 id 와 충돌
    if (seen.has(p.id)) {
      problems.push(`id 중복: ${p.id} (${seen.get(p.id)} / ${key})`);
    } else {
      seen.set(p.id, key);
      byId.set(p.id, { project: p, category: key });
    }
    if (htmlIds.has(p.id)) {
      problems.push(`${tag}: index.html 의 요소 id="${p.id}" 와 겹칩니다 (#${p.id} 해시가 충돌)`);
    }

    // 2 — 이미지 경로
    const images = [p.image, ...(p.shots || []), ...(p.minor || []).map((m) => m.img)].filter(
      Boolean
    );
    for (const rel of images) {
      if (!(await exists(rel))) {
        problems.push(`${p.id}: 없는 파일 — ${rel}`);
      } else if (/\.(png|jpe?g)$/i.test(rel)) {
        const webp = rel.replace(/\.(png|jpe?g)$/i, ".webp");
        if (await exists(webp)) warnings.push(`${p.id}: ${rel} 대신 ${webp} 를 쓸 수 있습니다`);
      }
    }

    // 7 — role · headline
    const strict = key === "company" || p.featured;
    for (const field of ["role", "headline"]) {
      if (!filled(p[field])) {
        (strict ? problems : warnings).push(`${tag}: ${field} 가 비어 있습니다`);
      }
    }

    if (p.period && !/^\d{4}\.\d{2}( ~( \d{4}\.\d{2})?)?$/.test(p.period)) {
      warnings.push(`${tag}: period "${p.period}" 가 "YYYY.MM ~ YYYY.MM" 형식이 아닙니다`);
    }
    if (p.platforms !== undefined) {
      if (!Array.isArray(p.platforms) || p.platforms.some((x) => !filled(x))) {
        problems.push(`${tag}: platforms 는 비어 있지 않은 문자열 배열이어야 합니다`);
      }
    }
    if (p.featured !== undefined && ![1, 2, 3].includes(p.featured)) {
      problems.push(`${tag}: featured 는 1 | 2 | 3 이어야 합니다 (받은 값: ${p.featured})`);
    }

    // 8 — results · 링크
    if (p.results !== undefined) {
      if (!Array.isArray(p.results)) {
        problems.push(`${tag}: results 는 배열이어야 합니다`);
      } else {
        p.results.forEach((r, i) => {
          if (!filled(r?.text)) problems.push(`${tag}: results[${i}].text 가 비어 있습니다`);
          if (r?.scope !== "team" && r?.scope !== "personal") {
            problems.push(`${tag}: results[${i}].scope 는 "team" | "personal" 이어야 합니다 (받은 값: ${r?.scope})`);
          }
        });
      }
    }
    for (const [field, items] of [
      ["proof", p.proof],
      ["stores", p.stores],
    ]) {
      if (items === undefined) continue;
      if (!Array.isArray(items)) {
        problems.push(`${tag}: ${field} 는 배열이어야 합니다`);
        continue;
      }
      items.forEach((item, i) => {
        if (!filled(item?.label)) problems.push(`${tag}: ${field}[${i}].label 이 비어 있습니다`);
        if (!isHttps(item?.href)) {
          problems.push(`${tag}: ${field}[${i}].href 가 https URL 이 아닙니다 — ${item?.href}`);
        }
      });
    }
    for (const field of ["repo", "docs", "codeLink"]) {
      if (p[field] && !isHttps(p[field])) {
        problems.push(`${tag}: ${field} 가 https URL 이 아닙니다 — ${p[field]}`);
      }
    }
  }
}

// index.html 에만 있고 데이터에는 없는 필터 버튼
for (const m of html.matchAll(/data-filter="([^"]+)"/g)) {
  if (!categories[m[1]]) {
    problems.push(`index.html 의 data-filter="${m[1]}" 에 대응하는 카테고리가 없습니다`);
  }
}

// ---------------------------------------------------------------- 6 대표 작업
const fromFields = [...byId.values()]
  .filter(({ project }) => project.featured)
  .sort((a, b) => a.project.featured - b.project.featured)
  .map(({ project }) => project.id);
const featured = Array.isArray(PORTFOLIO.featured) ? PORTFOLIO.featured : null;

if (!featured) {
  problems.push("window.PORTFOLIO.featured 가 없습니다 (대표 작업 id 배열)");
} else {
  if (featured.length !== 3) problems.push(`대표 작업은 정확히 3개여야 합니다 (현재 ${featured.length}개)`);
  if (new Set(featured).size !== featured.length) problems.push(`대표 작업 id 가 중복됩니다: ${featured.join(", ")}`);
  for (const id of featured) {
    const entry = byId.get(id);
    if (!entry) {
      problems.push(`대표 작업 id "${id}" 에 해당하는 (숨기지 않은) 프로젝트가 없습니다`);
      continue;
    }
    for (const field of ["role", "headline"]) {
      if (!filled(entry.project[field])) problems.push(`대표 작업 ${id}: ${field} 가 비어 있습니다`);
    }
  }
  if (featured.join("|") !== fromFields.join("|")) {
    problems.push(
      `PORTFOLIO.featured (${featured.join(", ")}) 와 프로젝트의 featured 번호 순서 (${fromFields.join(", ")}) 가 다릅니다`
    );
  }
}
const featuredNumbers = [...byId.values()].map(({ project }) => project.featured).filter(Boolean);
if (new Set(featuredNumbers).size !== featuredNumbers.length) {
  problems.push(`featured 번호가 중복됩니다: ${featuredNumbers.join(", ")}`);
}

// ---------------------------------------------------------------- 9 코드 토픽 · 앵커
let anchorIds = null;
try {
  const topics = JSON.parse(await readFile(TOPICS_JSON, "utf8"));
  anchorIds = new Set(
    ["topics", "workflows", "tools"].flatMap((k) => (topics[k] || []).map((t) => t.id))
  );
} catch (err) {
  if (err.code !== "ENOENT") warnings.push(`../code_portfolio/topics.json 을 읽지 못했습니다: ${err.message}`);
}

if (!Array.isArray(codeTopics) || !codeTopics.length) {
  problems.push("codeTopics 가 비어 있습니다");
} else {
  codeTopics.forEach((t, i) => {
    if (typeof t === "string") {
      problems.push(`codeTopics[${i}] "${t}" 가 문자열입니다 — { label, id } 형태로 바꿔 주세요`);
      return;
    }
    if (!filled(t?.label)) problems.push(`codeTopics[${i}]: label 이 비어 있습니다`);
    if (!filled(t?.id)) {
      problems.push(`codeTopics[${i}] (${t?.label}): id 가 비어 있습니다`);
    } else if (anchorIds && !anchorIds.has(t.id)) {
      problems.push(`codeTopics[${i}] (${t.label}): code_portfolio 에 "${t.id}" 토픽이 없습니다`);
    }
  });
}

function codeAnchor(href) {
  if (typeof href !== "string" || !href.startsWith(CODE_PORTFOLIO_PREFIX)) return null;
  const hash = new URL(href).hash.replace(/^#/, "");
  return hash ? decodeURIComponent(hash) : null;
}

if (anchorIds) {
  for (const { project } of byId.values()) {
    const anchor = codeAnchor(project.codeLink);
    if (anchor && !anchorIds.has(anchor)) {
      problems.push(`${project.id}: codeLink #${anchor} 가 code_portfolio topics.json 에 없습니다`);
    }
  }
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const anchor = codeAnchor(m[1]);
    if (anchor && !anchorIds.has(anchor)) {
      problems.push(`index.html: ${m[1]} 의 #${anchor} 가 code_portfolio topics.json 에 없습니다`);
    }
  }
} else {
  warnings.push("../code_portfolio/topics.json 이 없어 코드 앵커 검사를 건너뜁니다");
}

// ---------------------------------------------------------------- 10 index.html 로컬 참조
function localPath(ref) {
  let value = ref.trim();
  if (!value || /^(#|mailto:|tel:|data:|javascript:|blob:|\/\/)/i.test(value)) return null;
  if (/^https?:/i.test(value)) {
    // 사이트 자기 주소로 적은 절대 URL (og:image 등) 은 로컬 파일로 확인한다. code_portfolio 는 별도 저장소
    if (!value.startsWith(`${SITE_ORIGIN}/`) || value.startsWith(CODE_PORTFOLIO_PREFIX)) return null;
    value = value.slice(SITE_ORIGIN.length);
  }
  value = value.split("#")[0].split("?")[0];
  if (!value || value === "/" || value.endsWith("/")) return null;
  try {
    value = decodeURIComponent(value);
  } catch {
    return { bad: value };
  }
  return { rel: value.replace(/^\/+/, "") };
}

function collectRefs(text) {
  const refs = new Set();
  for (const m of text.matchAll(/\s(?:href|src|content)="([^"]*)"/g)) {
    const attr = m[0].trim().split("=")[0];
    // content= 는 meta 의 URL 값만 본다 (설명 문구는 건너뛴다)
    if (attr === "content" && !/^https?:\/\//i.test(m[1])) continue;
    refs.add(m[1].replace(/&amp;/g, "&"));
  }
  for (const m of text.matchAll(/\ssrcset="([^"]*)"/g)) {
    m[1].split(",").forEach((part) => refs.add(part.trim().split(/\s+/)[0]));
  }
  return refs;
}

async function checkLocalRefs(file, refs, { rootRelativeOnly = false } = {}) {
  for (const ref of refs) {
    const local = localPath(ref);
    if (!local) continue;
    if (local.bad) {
      problems.push(`${file}: URL 인코딩이 잘못된 경로 — ${ref}`);
    } else if (!(await exists(local.rel))) {
      problems.push(`${file}: 없는 파일 — ${ref}`);
    } else if (rootRelativeOnly && !/^(\/|https?:)/i.test(ref)) {
      // 404.html 은 아무 경로에서나 서빙되므로 상대 경로가 깨진다
      warnings.push(`${file}: "${ref}" 는 "/${local.rel}" 처럼 루트 기준으로 적어야 합니다`);
    }
  }
}

const htmlRefs = collectRefs(html);
// 페이지 안 해시 링크(#id)·aria-controls 는 요소 id 나 프로젝트 id 를 가리켜야 한다
for (const m of html.matchAll(/\shref="#([^"]+)"/g)) {
  const id = decodeURIComponent(m[1]);
  if (!htmlIds.has(id) && !byId.has(id)) {
    problems.push(`index.html: href="#${m[1]}" 가 가리키는 요소·프로젝트 id 가 없습니다`);
  }
}
for (const m of html.matchAll(/\saria-controls="([^"]+)"/g)) {
  for (const id of m[1].split(/\s+/)) {
    if (!htmlIds.has(id)) problems.push(`index.html: aria-controls="${id}" 에 해당하는 요소가 없습니다`);
  }
}

await checkLocalRefs("index.html", htmlRefs);
const notFound = await readFile(path.join(ROOT, "404.html"), "utf8").catch(() => null);
if (notFound !== null) await checkLocalRefs("404.html", collectRefs(notFound), { rootRelativeOnly: true });

// ---------------------------------------------------------------- 11 확인되지 않은 표기
// 공개 근거로 확인된 표기: 미국 Google Play 게임 카테고리 1위(2024.07) · 구글 플레이 인기 순위 1위(2023.07)
// · 제16회 Unity Awards Best 2D Visual. 그 밖의 앱스토어 순위·양대 마켓·"비주얼 부문" 표기는 막는다.
const BANNED = [
  /(App\s*Store|앱\s*스토어)[^\n<]{0,12}(1\s*위|#\s*1)/i, // "App Store 미국 마켓 1위", "앱스토어 미국 1위", "App Store US #1"
  /(1\s*위|#\s*1)[^\n<]{0,8}(App\s*Store|앱\s*스토어)/i, // "1위 (App Store)"
  /양대[^\n<]{0,6}1\s*위/, // "양대 마켓 1위", "양대 스토어 1위"
  /Unity\s*Awards\s*(비주얼|Visual\s*부문)|비주얼\s*부문/i, // "2025 Unity Awards 비주얼 부문 수상"
];
const SCANNED = ["이력서.html", "경력기술서.html", "자기소개서.html", "404.html", "scripts/og-template.html"];
for (const [file, text] of [
  ["data/projects.js", dataSrc],
  ["index.html", html],
  ...(await Promise.all(
    SCANNED.map(async (f) => [f, await readFile(path.join(ROOT, f), "utf8").catch(() => "")])
  )),
]) {
  for (const re of BANNED) {
    const hit = text.match(re);
    if (hit) {
      problems.push(`${file}: 확인되지 않은 표기 "${hit[0]}" — 공개 근거로 확인된 표기로 바꿔 주세요`);
    }
  }
}

// ---------------------------------------------------------------- 12 공유 이미지
async function pngSize(rel) {
  let fh;
  try {
    fh = await open(path.join(ROOT, rel), "r");
    const buf = Buffer.alloc(24);
    await fh.read(buf, 0, 24, 0);
    if (buf.toString("ascii", 12, 16) !== "IHDR") return null;
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  } catch {
    return null;
  } finally {
    await fh?.close();
  }
}
for (const [rel, w, h] of [
  ["assets/og-image.png", 1200, 630],
  ["assets/apple-touch-icon.png", 180, 180],
]) {
  if (!(await exists(rel))) {
    warnings.push(`${rel} 가 없습니다 (npm run og)`);
    continue;
  }
  const size = await pngSize(rel);
  if (!size) problems.push(`${rel}: PNG 가 아닙니다`);
  else if (size.w !== w || size.h !== h) problems.push(`${rel}: ${size.w}x${size.h} — ${w}x${h} 이어야 합니다`);
}

// ---------------------------------------------------------------- 결과
if (warnings.length) {
  console.warn("경고:");
  warnings.forEach((w) => console.warn(`  - ${w}`));
}

if (problems.length) {
  console.error("정합성 문제:");
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

const total = Object.values(categories).reduce((n, c) => n + c.list.length, 0);
console.log(
  `OK — 카테고리 ${Object.keys(categories).length}개, 프로젝트 ${total}개, 대표 작업 ${featured.length}개, ` +
    `코드 토픽 ${codeTopics.length}개, index.html 참조 ${htmlRefs.size}개 확인 완료`
);
