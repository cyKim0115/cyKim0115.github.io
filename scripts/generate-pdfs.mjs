/**
 * Generate PDFs from local HTML.
 * - portfolio: index.html?pdf=1 (Company + Personal fully expanded)
 * - docs: 이력서 / 경력기술서 / 자기소개서
 *
 * Usage:
 *   npm run pdf
 *   npm run pdf -- --only=portfolio
 *   npm run pdf -- --only=docs
 */
import { createServer } from "node:http";
import { readFile, mkdir, access } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "pdf");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

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

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url || "/", "http://127.0.0.1");
        let pathname = decodeURIComponent(url.pathname);
        if (pathname === "/") pathname = "/index.html";
        const filePath = path.normalize(path.join(ROOT, pathname.replace(/^\/+/, "")));
        if (!filePath.startsWith(ROOT)) {
          res.writeHead(403).end("Forbidden");
          return;
        }
        if (!(await fileExists(filePath))) {
          res.writeHead(404).end("Not found");
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500).end(String(err));
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
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
  console.log("wrote", path.relative(ROOT, outPath));
}

async function main() {
  const { only } = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });

  const { server, port } = await startStaticServer();
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  try {
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
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
