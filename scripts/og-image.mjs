/**
 * 공유 미리보기 이미지 생성.
 *
 *   npm run og
 *   npm run og -- --preview=<dir>   # favicon 16/32/64px 라이트·다크 미리보기도 저장
 *
 * - assets/og-image.png        1200x630  ← scripts/og-template.html
 * - assets/apple-touch-icon.png 180x180  ← favicon.svg (같은 모노그램, 모서리까지 꽉 채움)
 *
 * 문구를 바꾸려면 scripts/og-template.html 을 고치고 다시 실행한다.
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { launchBrowser, startStaticServer, ROOT } from "./browser.mjs";

const OUT_DIR = path.join(ROOT, "assets");
const OG_PATH = path.join(OUT_DIR, "og-image.png");
const TOUCH_PATH = path.join(OUT_DIR, "apple-touch-icon.png");
const TILE = "#567e65"; // favicon.svg 라이트 타일 색 (세이지 차콜 --accent)

function parseArgs(argv) {
  const preview = argv.find((a) => a.startsWith("--preview="))?.slice("--preview=".length);
  return { preview: preview ? path.resolve(preview) : null };
}

async function waitForAssets(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((r) => img.addEventListener("load", r, { once: true }))
      )
    );
  });
  const broken = await page.evaluate(() =>
    [...document.images].filter((img) => !img.naturalWidth).map((img) => img.src)
  );
  if (broken.length) throw new Error(`이미지를 불러오지 못했습니다: ${broken.join(", ")}`);
}

async function renderOg(browser, base) {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.goto(`${base}/scripts/og-template.html`, { waitUntil: "networkidle" });
  await waitForAssets(page);

  const overflow = await page.evaluate(() => {
    const frame = document.querySelector(".frame");
    const out = [];
    for (const el of frame.querySelectorAll("h1, p, li > span, img")) {
      const r = el.getBoundingClientRect();
      if (r.right > 1200 - 60 || r.bottom > 630 - 36 || r.left < 60 || r.top < 36) {
        out.push(`${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 24)}"`);
      }
    }
    return out;
  });
  if (overflow.length) console.warn("안전 영역(60/36px)을 벗어난 요소:", overflow.join(", "));

  await page.screenshot({ path: OG_PATH, type: "png" });
  await context.close();
}

function iconPage(base, size, inner, background) {
  const pad = (size - inner) / 2;
  return `<!DOCTYPE html><html><head><style>
    html,body{margin:0;width:${size}px;height:${size}px;overflow:hidden;background:${background};}
    img{position:absolute;left:${pad}px;top:${pad}px;width:${inner}px;height:${inner}px;display:block;}
  </style></head><body><img src="${base}/favicon.svg" alt=""></body></html>`;
}

async function renderIcon(browser, base, { size, inner, background, colorScheme, outPath, scale = 1 }) {
  const context = await browser.newContext({
    viewport: { width: size, height: size },
    deviceScaleFactor: scale,
    colorScheme,
  });
  const page = await context.newPage();
  await page.setContent(iconPage(base, size, inner, background), { waitUntil: "load" });
  await waitForAssets(page);
  await page.screenshot({ path: outPath, type: "png", omitBackground: background === "transparent" });
  await context.close();
}

async function kb(file) {
  return `${((await stat(file)).size / 1024).toFixed(1)}KB`;
}

async function main() {
  const { preview } = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });

  const { server, base } = await startStaticServer(ROOT);
  let browser;
  try {
    browser = await launchBrowser();

    await renderOg(browser, base);
    console.log(`wrote ${path.relative(ROOT, OG_PATH)} (1200x630, ${await kb(OG_PATH)})`);

    // iOS 는 모서리를 직접 둥글게 깎으므로 배경까지 타일 색으로 꽉 채운다.
    await renderIcon(browser, base, {
      size: 180,
      inner: 156,
      background: TILE,
      colorScheme: "light",
      outPath: TOUCH_PATH,
    });
    console.log(`wrote ${path.relative(ROOT, TOUCH_PATH)} (180x180, ${await kb(TOUCH_PATH)})`);

    if (preview) {
      await mkdir(preview, { recursive: true });
      for (const scheme of ["light", "dark"]) {
        for (const px of [16, 32, 64]) {
          const out = path.join(preview, `favicon-${scheme}-${px}.png`);
          await renderIcon(browser, base, {
            size: px,
            inner: px,
            background: "transparent",
            colorScheme: scheme,
            outPath: out,
          });
          console.log("preview", out);
        }
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
