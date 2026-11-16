"""
Resource/ 아래 .png/.jpg/.jpeg 마다 같은 이름의 .webp 를 옆에 만든다. 원본은 건드리지 않는다.

  npm run images                 # 원본보다 오래된 .webp 만 다시 만든다
  npm run images -- --force      # 전부 다시 만든다
  npm run images -- --quality=75 # 품질 조정 (기본 80)

크기 규칙 (줄이기만 하고 키우지 않는다, 비율 유지):
  - icon.*               : 긴 변 256px 이하
  - Resource/My/증사.jpg  : 높이 960px 이하
  - 그 밖 (배너·스크린샷)  : 가로 1200px 이하, 세로 1600px 이하

알파가 실제로 쓰이는 이미지만 알파를 유지한다 (전부 255 인 알파는 버린다).
결과 표와 합계를 출력하고, 200KB 를 넘는 결과는 따로 알린다.

필요: Python 3.10+, Pillow (WebP 지원 빌드)
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps, features
except ImportError:  # pragma: no cover
    sys.exit("Pillow 가 필요합니다:  python -m pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
RESOURCE = ROOT / "Resource"
SOURCE_EXTS = {".png", ".jpg", ".jpeg"}
LARGE_KB = 200

MAX_BANNER = (1200, 1600)
MAX_ICON = 256
PROFILE = Path("Resource/My/증사.jpg")
PROFILE_MAX_H = 960


def target_size(rel: Path, size: tuple[int, int]) -> tuple[int, int]:
    w, h = size
    if rel.stem.lower() == "icon":
        scale = min(1.0, MAX_ICON / max(w, h))
    elif rel.as_posix() == PROFILE.as_posix():
        scale = min(1.0, PROFILE_MAX_H / h)
    else:
        scale = min(1.0, MAX_BANNER[0] / w, MAX_BANNER[1] / h)
    if scale >= 1.0:
        return w, h
    return max(1, round(w * scale)), max(1, round(h * scale))


def has_real_alpha(im: Image.Image) -> bool:
    if im.mode in ("RGBA", "LA", "PA") or (im.mode == "P" and "transparency" in im.info):
        alpha = im.convert("RGBA").getchannel("A")
        return alpha.getextrema()[0] < 255
    return False


def convert(src: Path, dst: Path, quality: int) -> tuple[tuple[int, int], tuple[int, int]]:
    with Image.open(src) as opened:
        im = ImageOps.exif_transpose(opened)
        icc = opened.info.get("icc_profile")
        before = im.size
        keep_alpha = has_real_alpha(im)
        im = im.convert("RGBA" if keep_alpha else "RGB")
        after = target_size(src.relative_to(ROOT), before)
        if after != before:
            im = im.resize(after, Image.Resampling.LANCZOS)
        save_kwargs = {"quality": quality, "method": 6}
        if keep_alpha:
            save_kwargs["alpha_quality"] = 90
        if icc:
            save_kwargs["icc_profile"] = icc
        tmp = dst.with_name(dst.name + ".tmp")
        im.save(tmp, "WEBP", **save_kwargs)
        tmp.replace(dst)
    return before, after


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(errors="replace")

    ap = argparse.ArgumentParser(description="Resource/ 이미지를 WebP 로 변환")
    ap.add_argument("--force", action="store_true", help="최신 .webp 가 있어도 다시 만든다")
    ap.add_argument("--quality", type=int, default=80, help="WebP 품질 (기본 80)")
    args = ap.parse_args()

    if not features.check("webp"):
        sys.exit("이 Pillow 빌드는 WebP 를 지원하지 않습니다.")
    if not RESOURCE.is_dir():
        sys.exit(f"Resource 폴더가 없습니다: {RESOURCE}")

    sources = sorted(
        p for p in RESOURCE.rglob("*") if p.is_file() and p.suffix.lower() in SOURCE_EXTS
    )

    rows = []
    total_before = total_after = 0
    made = skipped = 0
    for src in sources:
        dst = src.with_suffix(".webp")
        rel = src.relative_to(ROOT).as_posix()
        size_before = src.stat().st_size
        if not args.force and dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            status = "skip"
            dims = ""
            skipped += 1
        else:
            before, after = convert(src, dst, args.quality)
            status = "new"
            dims = f"{before[0]}x{before[1]}" + (f" -> {after[0]}x{after[1]}" if after != before else "")
            made += 1
        size_after = dst.stat().st_size
        total_before += size_before
        total_after += size_after
        rows.append((rel, size_before, size_after, status, dims))

    width = max((len(r[0]) for r in rows), default=10)
    print(f"{'file'.ljust(width)}  {'before':>9}  {'after':>9}  {'saved':>6}  status  size")
    print("-" * (width + 50))
    for rel, b, a, status, dims in rows:
        saved = (1 - a / b) * 100 if b else 0
        print(f"{rel.ljust(width)}  {b / 1024:8.1f}K  {a / 1024:8.1f}K  {saved:5.0f}%  {status:6}  {dims}")
    print("-" * (width + 50))
    saved_total = (1 - total_after / total_before) * 100 if total_before else 0
    print(
        f"{'TOTAL'.ljust(width)}  {total_before / 1024:8.1f}K  {total_after / 1024:8.1f}K  {saved_total:5.0f}%"
        f"  (new {made}, skip {skipped})"
    )

    large = [(rel, a) for rel, _, a, _, _ in rows if a > LARGE_KB * 1024]
    if large:
        print(f"\n{LARGE_KB}KB 를 넘는 WebP:")
        for rel, a in large:
            print(f"  - {rel[:-len(Path(rel).suffix)]}.webp  {a / 1024:.1f}K")
    else:
        print(f"\n모든 WebP 가 {LARGE_KB}KB 이하입니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
