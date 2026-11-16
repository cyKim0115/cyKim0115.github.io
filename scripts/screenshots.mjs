/**
 * 사이트 스크린샷 — 고친 뒤 화면을 눈으로 확인하거나 공유할 때.
 *
 *   npm run shots                         # ./shots 에 저장
 *   npm run shots -- --out=<dir>          # 저장 폴더 지정
 *   npm run shots -- --detail=<id>        # 상세 패널 샷에 쓸 프로젝트 id (기본 neko-omakase)
 *   npm run shots -- --motion             # prefers-reduced-motion 을 끄고 찍는다
 *
 * 만드는 파일:
 *   desktop-light-fold.png / -full.png   1440x900, 라이트
 *   desktop-dark-fold.png  / -full.png   1440x900, 다크
 *   mobile-light-fold.png  / -full.png   390x844, 라이트, 모바일 에뮬레이션 (DPR 2)
 *   desktop-light-detail.png             index.html#<id> 상세 패널이 열린 화면
 *   desktop-light-featured.png           #featured 섹션 (있을 때만)
 *
 * 페이지 오류·콘솔 오류·실패한 요청(404 등)은 마지막에 경고로 모아 출력한다.
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { launchBrowser, startStaticServer, ROOT } from "./browser.mjs";

const MAX_BYTES = 8 * 1024 * 1024;

const PROFILES = [
  { name: "desktop-light", viewport: { width: 1440, height: 900 }, colorScheme: "light" },
  { name: "desktop-dark", viewport: { width: 1440, height: 900 }, colorScheme: "dark" },
  {
    name: "mobile-light",
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  },
];

function parseArgs(argv) {
  const get = (key) => argv.find((a) => a.startsWith(`--${key}=`))?.slice(key.length + 3);
  return {
    out: path.resolve(get("out") || "shots"),
    detail: get("detail") || "neko-omakase",
    reduceMotion: !argv.includes("--motion"),
  };
}

function watchProblems(page, label, problems) {
  page.on("pageerror", (err) => problems.push(`[${label}] pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`[${label}] console: ${msg.text()}`);
  });
  page.on("response", (res) => {
    const url = res.url();
    if (res.status() >= 400 && url.startsWith("http://127.0.0.1")) {
      problems.push(`[${label}] ${res.status()} ${decodeURIComponent(new URL(url).pathname)}`);
    }
  });
  page.on("requestfailed", (req) => {
    const url = req.url();
    if (url.startsWith("http://127.0.0.1")) {
      problems.push(`[${label}] failed ${decodeURIComponent(new URL(url).pathname)}`);
    }
  });
}

async function settle(page, ms = 400) {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

/** 조금씩 내려가며 lazy 이미지를 깨우고, 이미지가 다 뜰 때까지 기다린 뒤 맨 위로 돌아온다. */
async function warmUp(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(200, Math.floor(window.innerHeight * 0.7));
    let y = 0;
    for (let guard = 0; guard < 200; guard++) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (y >= max) break;
      y = Math.min(y + step, max);
      window.scrollTo({ top: y, behavior: "instant" });
      await sleep(120);
    }
  });
  await waitForImages(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await settle(page, 500);
}

async function waitForImages(page, timeout = 20000) {
  await page
    .evaluate(async (limit) => {
      await document.fonts?.ready;
      const pending = [...document.images].map((img) => {
        img.loading = "eager";
        if (img.complete) return null;
        return new Promise((r) => {
          img.addEventListener("load", r, { once: true });
          img.addEventListener("error", r, { once: true });
        });
      });
      await Promise.race([Promise.all(pending), new Promise((r) => setTimeout(r, limit))]);
    }, timeout)
    .catch(() => {});
  const broken = await page.evaluate(() =>
    [...document.images]
      .filter((img) => img.complete && img.currentSrc && !img.naturalWidth)
      .map((img) => decodeURIComponent(new URL(img.currentSrc).pathname))
  );
  return broken;
}

/** 스크롤이 멈출 때까지 기다린다 (smooth scroll 대응). */
async function waitScrollIdle(page, quietMs = 300, timeout = 4000) {
  await page.evaluate(
    async ({ quietMs, timeout }) => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const start = performance.now();
      let last = window.scrollY;
      let quietSince = performance.now();
      while (performance.now() - start < timeout) {
        await sleep(50);
        if (window.scrollY !== last) {
          last = window.scrollY;
          quietSince = performance.now();
        } else if (performance.now() - quietSince >= quietMs) {
          return;
        }
      }
    },
    { quietMs, timeout }
  );
}

// Chrome 은 한 번에 16384px 넘게 캡처하지 못하고 그 아래를 위쪽 내용으로 다시 채운다
const MAX_CAPTURE_PX = 16000;

async function savePng(page, outPath, options = {}) {
  let note = "";
  if (options.fullPage && !options.scale) {
    const { h, dpr } = await page.evaluate(() => ({
      h: document.documentElement.scrollHeight,
      dpr: window.devicePixelRatio || 1,
    }));
    if (h * dpr > MAX_CAPTURE_PX) {
      options = { ...options, scale: "css" };
      note = `, ${h}x${dpr}px 가 캡처 한도를 넘어 CSS 배율로 찍음`;
    }
  }
  await page.screenshot({ path: outPath, type: "png", ...options });
  let { size } = await stat(outPath);
  if (size > MAX_BYTES && options.fullPage && options.scale !== "css") {
    // 고해상도 전체 페이지가 너무 크면 CSS 픽셀 배율(DPR 1)로 다시 찍는다
    await page.screenshot({ path: outPath, type: "png", ...options, scale: "css" });
    ({ size } = await stat(outPath));
    note = ", 8MB 를 넘어 CSS 배율로 다시 찍음";
  }
  const mb = (size / 1024 / 1024).toFixed(2);
  console.log(`wrote ${outPath} (${mb}MB${note})${size > MAX_BYTES ? "  ! 8MB 초과" : ""}`);
  return outPath;
}

async function shootProfile(browser, base, profile, opts, problems, written) {
  const { name, ...contextOptions } = profile;
  const context = await browser.newContext({
    ...contextOptions,
    reducedMotion: opts.reduceMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  watchProblems(page, name, problems);

  await page.goto(`${base}/index.html`, { waitUntil: "load", timeout: 60000 });
  await settle(page);
  await warmUp(page);
  const broken = await waitForImages(page, 5000);
  broken.forEach((src) => problems.push(`[${name}] broken image ${src}`));

  written.push(await savePng(page, path.join(opts.out, `${name}-fold.png`)));
  written.push(await savePng(page, path.join(opts.out, `${name}-full.png`), { fullPage: true }));

  if (name === "desktop-light") {
    const featured = page.locator("#featured");
    if (await featured.count()) {
      await featured.scrollIntoViewIfNeeded();
      await settle(page, 300);
      const out = path.join(opts.out, `${name}-featured.png`);
      await featured.screenshot({ path: out });
      console.log(`wrote ${out}`);
      written.push(out);
    } else {
      console.log("skip desktop-light-featured.png (#featured 없음)");
    }
  }

  await context.close();
}

async function shootDetail(browser, base, opts, problems, written) {
  const label = "desktop-light-detail";
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
    reducedMotion: opts.reduceMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  watchProblems(page, label, problems);

  await page.goto(`${base}/index.html#${encodeURIComponent(opts.detail)}`, {
    waitUntil: "load",
    timeout: 60000,
  });
  await settle(page);

  const panel = page.locator("#detail-panel, .detail-panel").first();
  try {
    await page.waitForFunction(
      () => {
        const el = document.querySelector("#detail-panel, .detail-panel");
        return el && el.childElementCount > 0 && el.getBoundingClientRect().height > 0;
      },
      null,
      { timeout: 10000 }
    );
  } catch {
    problems.push(`[${label}] #${opts.detail} 로 열었지만 상세 패널이 열리지 않았습니다`);
  }

  await waitScrollIdle(page);
  if (await panel.count()) {
    await panel.evaluate(async (el) => {
      el.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
      const nav = document.querySelector(".site-nav, nav");
      const navH = nav && getComputedStyle(nav).position === "fixed" ? nav.offsetHeight : 0;
      const top = el.getBoundingClientRect().top;
      if (top < navH || top > window.innerHeight * 0.5) {
        window.scrollTo({ top: window.scrollY + top - navH - 16, behavior: "instant" });
      }
    });
  }
  await waitForImages(page, 8000);
  await waitScrollIdle(page);
  await page.waitForTimeout(300);

  written.push(await savePng(page, path.join(opts.out, `${label}.png`)));
  await context.close();
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  await mkdir(opts.out, { recursive: true });

  const { server, base } = await startStaticServer(ROOT);
  const problems = [];
  const written = [];
  let browser;
  try {
    browser = await launchBrowser();
    for (const profile of PROFILES) {
      await shootProfile(browser, base, profile, opts, problems, written);
    }
    await shootDetail(browser, base, opts, problems, written);
  } finally {
    await browser?.close();
    server.close();
  }

  console.log(`\n${written.length} files -> ${opts.out}`);
  const unique = [...new Set(problems)];
  if (unique.length) {
    console.warn(`\n경고 ${unique.length}건:`);
    unique.forEach((p) => console.warn(`  - ${p}`));
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
