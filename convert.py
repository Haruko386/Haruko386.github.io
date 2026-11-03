"""Convert an image or an image folder to WebP beside each source file.

Requires Pillow: python -m pip install Pillow
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps, UnidentifiedImageError, features
except ImportError as exc:
    raise SystemExit("Pillow is required. Install it with: python -m pip install Pillow") from exc


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff", ".avif"}


def convert_image(source, output):
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        has_alpha = "A" in image.getbands() or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        save_options = {"quality": 85, "method": 6}
        if original.info.get("icc_profile"):
            save_options["icc_profile"] = original.info["icc_profile"]
        image.save(output, "WEBP", **save_options)


def main():
    parser = argparse.ArgumentParser(description="Convert an image or folder to WebP beside the sources.")
    parser.add_argument("path", type=Path, help="Source image or folder, for example ./img.jpg or ./img")
    parser.add_argument("--force", action="store_true", help="Overwrite an existing WebP file")
    args = parser.parse_args()

    source = args.path.expanduser()
    if not source.exists():
        parser.error(f"Path not found: {source}")
    if not features.check("webp"):
        parser.error("This Pillow installation does not support WebP")

    if source.is_file():
        if source.suffix.lower() == ".webp":
            parser.error("The source is already a WebP file")
        output = source.with_suffix(".webp")
        if output.exists() and not args.force:
            parser.error(f"Output already exists: {output} (use --force to overwrite)")
        try:
            convert_image(source, output)
        except (OSError, UnidentifiedImageError) as exc:
            parser.exit(1, f"Conversion failed: {exc}\n")
        print(output)
        return

    if not source.is_dir():
        parser.error(f"Not a file or directory: {source}")

    images = sorted(
        (path for path in source.rglob("*")
         if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS),
        key=lambda path: str(path).casefold(),
    )
    converted = skipped = failed = 0
    outputs_seen = set()
    for image in images:
        output = image.with_suffix(".webp")
        if output in outputs_seen:
            print(f"Skipped {image}: another image has the same output name")
            skipped += 1
            continue
        outputs_seen.add(output)
        if output.exists() and not args.force:
            print(f"Skipped {image}: {output} already exists")
            skipped += 1
            continue
        try:
            convert_image(image, output)
        except (OSError, UnidentifiedImageError) as exc:
            print(f"Failed {image}: {exc}", file=sys.stderr)
            failed += 1
            continue
        print(output)
        converted += 1

    print(f"Converted: {converted}, skipped: {skipped}, failed: {failed}")
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
