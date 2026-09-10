/**
 * 데이터 정합성 검사 — data/projects.js 를 고친 뒤 이것만 통과하면 화면이 깨지지 않는다.
 *   npm run check
 *
 * 1. id 가 전체에서 유일한가 (해시 링크 #id 가 충돌하면 엉뚱한 카드가 열린다)
 * 2. image / shots / minor 의 파일이 실제로 있는가 (오타는 조용히 깨진다)
 * 3. index.html 의 filter 버튼과 CATEGORIES 의 key 가 일치하는가
 * 4. 배지 색이 필요한 카테고리에 .badge-<key> 가 style.css 에 있는가
 * 5. 필수 필드(id/title/blurb/summary)가 비어 있지 않은가
 */
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];

// data/projects.js 는 브라우저용 전역 스크립트라 window 를 흉내내어 읽는다
globalThis.window = {};
await import(pathToFileURL(path.join(ROOT, "data", "projects.js")).href);
const { categories, codeTopics } = globalThis.window.PORTFOLIO || {};

if (!categories) {
  console.error("data/projects.js 가 window.PORTFOLIO 를 세우지 않았습니다.");
  process.exit(1);
}

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

const seen = new Map();

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
    for (const field of ["id", "title", "blurb", "summary"]) {
      if (!p[field]) problems.push(`${key}/${p.id || "(id 없음)"}: ${field} 가 비어 있습니다`);
    }

    // 1 — id 유일성
    if (seen.has(p.id)) {
      problems.push(`id 중복: ${p.id} (${seen.get(p.id)} / ${key})`);
    } else {
      seen.set(p.id, key);
    }

    // 2 — 이미지 경로
    const images = [
      p.image,
      ...(p.shots || []),
      ...(p.minor || []).map((m) => m.img),
    ].filter(Boolean);
    for (const rel of images) {
      if (!(await exists(rel))) problems.push(`${p.id}: 없는 파일 — ${rel}`);
    }
  }
}

// index.html 에만 있고 데이터에는 없는 필터 버튼
for (const m of html.matchAll(/data-filter="([^"]+)"/g)) {
  if (!categories[m[1]]) {
    problems.push(`index.html 의 data-filter="${m[1]}" 에 대응하는 카테고리가 없습니다`);
  }
}

if (!codeTopics?.length) problems.push("codeTopics 가 비어 있습니다");

if (problems.length) {
  console.error("정합성 문제:");
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

const total = Object.values(categories).reduce((n, c) => n + c.list.length, 0);
console.log(
  `OK — 카테고리 ${Object.keys(categories).length}개, 프로젝트 ${total}개, 이미지 경로 확인 완료`
);
