/**
 * 스크립트 공용 도우미 — 브라우저 실행과 정적 서버.
 *
 *   import { launchBrowser, startStaticServer, ROOT } from "./browser.mjs";
 *
 * launchBrowser(): Playwright 번들 Chromium → 시스템 Chrome → 시스템 Edge 순서로 시도한다.
 *   `npx playwright install` 을 하지 않은 PC 에서도 Chrome/Edge 가 있으면 동작한다.
 * startStaticServer(root): 127.0.0.1 임의 포트에 root 를 정적으로 서빙한다.
 *   한글 경로(퍼센트 인코딩)를 풀고, root 밖으로 나가는 경로는 막는다.
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CANDIDATES = [
  { name: "Playwright Chromium", options: {} },
  { name: "Google Chrome", options: { channel: "chrome" } },
  { name: "Microsoft Edge", options: { channel: "msedge" } },
];

/**
 * @param {import("playwright").LaunchOptions} [options] 추가 실행 옵션 (headless 등)
 * @returns {Promise<import("playwright").Browser>}
 */
export async function launchBrowser(options = {}) {
  const failures = [];
  // PW_BROWSER=chromium|chrome|msedge 로 하나만 강제할 수 있다 (폴백 확인용)
  const forced = process.env.PW_BROWSER;
  const candidates = forced
    ? CANDIDATES.filter(({ options: o }) => (o.channel || "chromium") === forced)
    : CANDIDATES;
  if (!candidates.length) throw new Error(`PW_BROWSER=${forced} 는 chromium | chrome | msedge 중 하나여야 합니다`);
  for (const { name, options: channel } of candidates) {
    try {
      const browser = await chromium.launch({ headless: true, ...options, ...channel });
      if (process.env.BROWSER_VERBOSE !== "0") console.log(`browser: ${name}`);
      return browser;
    } catch (err) {
      failures.push(`  - ${name}: ${String(err?.message || err).split("\n")[0]}`);
    }
  }
  throw new Error(
    [
      "실행할 수 있는 Chromium 계열 브라우저가 없습니다.",
      ...failures,
      "다음 중 하나를 해 주세요:",
      "  1) Google Chrome 또는 Microsoft Edge 설치",
      "  2) npx playwright install chromium",
    ].join("\n")
  );
}

export const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

/**
 * @param {string} [root] 서빙할 폴더 (기본: 저장소 루트)
 * @returns {Promise<{ server: import("node:http").Server, base: string, port: number }>}
 */
export function startStaticServer(root = ROOT) {
  const rootDir = path.resolve(root);
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url || "/", "http://127.0.0.1");
        let pathname;
        try {
          pathname = decodeURIComponent(url.pathname);
        } catch {
          res.writeHead(400).end("Bad request");
          return;
        }
        if (pathname.includes("\0")) {
          res.writeHead(400).end("Bad request");
          return;
        }
        if (pathname.endsWith("/")) pathname += "index.html";

        const filePath = path.resolve(rootDir, "." + path.posix.normalize("/" + pathname));
        const rel = path.relative(rootDir, filePath);
        if (rel.startsWith("..") || path.isAbsolute(rel)) {
          res.writeHead(403).end("Forbidden");
          return;
        }

        let info;
        try {
          info = await stat(filePath);
        } catch {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
          return;
        }
        if (!info.isFile()) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          "Content-Type": MIME[ext] || "application/octet-stream",
          "Content-Length": info.size,
          "Cache-Control": "no-store",
        });
        if (req.method === "HEAD") {
          res.end();
          return;
        }
        createReadStream(filePath).pipe(res);
      } catch (err) {
        if (!res.headersSent) res.writeHead(500);
        res.end(String(err));
      }
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}`, port });
    });
  });
}
