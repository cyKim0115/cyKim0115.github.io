/**
 * Generate PDFs from local HTML.
 * - portfolio: index.html?pdf=1 (라이트 고정 · 모든 카테고리의 모든 작업을 펼친 목록 — script.js renderPdfDoc)
 * - docs: 이력서 / 경력기술서 / 자기소개서
 *
 * Usage:
 *   npm run pdf
 *   npm run pdf -- --only=portfolio
 *   npm run pdf -- --only=docs
 *
 * 브라우저는 scripts/browser.mjs 의 launchBrowser() 를 쓴다
 * (Playwright Chromium → 시스템 Chrome → 시스템 Edge).
 */
import { mkdir, access, readFile } from "node:fs/promises";
import path from "node:path";
import { launchBrowser, startStaticServer, ROOT } from "./browser.mjs";

const OUT_DIR = path.join(ROOT, "pdf");

function parseArgs(argv) {
  const only = argv.find((a) => a.startsWith("--only="))?.split("=")[1] || "all";
  return { only };
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function printPage(browser, url, outPath, { waitPdfReady = false } = {}) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  if (waitPdfReady) {
    await page.waitForFunction(
      () => document.documentElement.getAttribute("data-pdf-ready") === "1",
      { timeout: 30000 }
    );
    // let images settle
    await page.waitForTimeout(400);
  } else {
    await page.waitForTimeout(300);
  }
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
  });
  await page.close();
  // 로컬 서버에서 찍으므로 상대 링크가 남으면 PDF 안 링크가 http://127.0.0.1:<port>/… 로 박혀 열리지 않는다
  const bytes = await readFile(outPath);
  if (bytes.includes("127.0.0.1") || bytes.includes("localhost:")) {
    throw new Error(
      `${path.relative(ROOT, outPath)}: PDF 안 링크에 로컬 서버 주소가 남았습니다 — 상대 링크를 https://cykim0115.github.io/ 기준 절대 주소로 바꿔 주세요`
    );
  }
  console.log("wrote", path.relative(ROOT, outPath));
}

async function main() {
  const { only } = parseArgs(process.argv.slice(2));
  if (!["all", "portfolio", "docs"].includes(only)) {
    throw new Error(`--only 는 all | portfolio | docs 중 하나여야 합니다 (받은 값: ${only})`);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const { server, base } = await startStaticServer(ROOT);
  let browser;

  try {
    browser = await launchBrowser();

    if (only === "all" || only === "portfolio") {
      await printPage(
        browser,
        `${base}/index.html?pdf=1`,
        path.join(OUT_DIR, "portfolio.pdf"),
        { waitPdfReady: true }
      );
    }

    if (only === "all" || only === "docs") {
      const docs = [
        ["이력서.html", "resume.pdf"],
        ["경력기술서.html", "career.pdf"],
        ["자기소개서.html", "cover-letter.pdf"],
      ];
      for (const [html, pdf] of docs) {
        const full = path.join(ROOT, html);
        if (!(await fileExists(full))) {
          console.warn("skip missing", html);
          continue;
        }
        const encoded = encodeURIComponent(html);
        await printPage(browser, `${base}/${encoded}`, path.join(OUT_DIR, pdf));
      }
    }
  } finally {
    await browser?.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
