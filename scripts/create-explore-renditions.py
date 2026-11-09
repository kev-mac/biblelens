#!/usr/bin/env python3
"""Reproduce the checked-in Explore WebP renditions without changing source art.

Manual developer tool; run from any working directory with Python and the recorded
Pillow/libwebp versions available. It adds no application/runtime dependency.
The source hashes and encoder versions are pinned so a rerun reproduces exactly
the same bytes and cache-safe filenames, or stops before writing any files.
"""

import hashlib
import io
import json
import platform
from pathlib import Path

from PIL import Image, __version__ as pillow_version, features


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "assets"
MANIFEST = ASSETS / "explore-renditions.json"
PROVENANCE = ASSETS / "explore-art.provenance.json"
SMALL_WIDTH = 640
SMALL_QUALITY = 83
# This already compact 960px source grows when re-encoded at quality 83.
# Quality 75 keeps the 640px rendition smaller than the unchanged source.
QUALITY_BY_ROLE = {"hero": 75}
BATCH_ID = "explore-responsive-v1"
ENCODER_VERSIONS = {"pillow": "13.0.0", "libwebp": "1.6.0"}
SOURCES = {
    "stories": (
        "explore-ark.webp",
        "a1ddf2b31a3bfe6af2c984de9ba9b0e8874001c327d9526e36154290248b82b0",
    ),
    "people": (
        "story-david-and-goliath-v1.webp",
        "6b117546a13831f42bf6accf699e3077b23557e74d454fb2b01f42274f361738",
    ),
    "places": (
        "story-the-dedication-of-jerusalem-s-wall-v1.webp",
        "f50eb9191cc4d16ca41a1c65a6ef6601ad12a28a184cacdc4201836f22761aec",
    ),
    "commandments": (
        "explore-commandments.webp",
        "cfc17c910f4b3a27783a470e213e8b3d4ef9336939a1f7620095dfe70395f7b0",
    ),
    "lost": (
        "story-the-scroll-burned-v1.webp",
        "6deddc004b1bddb7c6dd78fc6ef2899efa0a55d2845f8793a882a1c2335ae430",
    ),
    "evidence": (
        "explore-evidence.webp",
        "75347e8a2715d1af484b03ef6e96a6d2a3cd75a45b5079ea3e87c7bb65b4333c",
    ),
    "timeline": (
        "explore-timeline.webp",
        "34ea21a8b7f8487907aa9640e08653cb7d1bcb2380ab167e63ac01d479957955",
    ),
    "hero": (
        "chapter-genesis-07-v1.webp",
        "12642542dd673d161d772c172e150bbe67845e6983a705fa21c5891194ad15f0",
    ),
}


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def describe(role, data):
    with Image.open(io.BytesIO(data)) as image:
        image.load()
        width, height = image.size
    digest = sha256(data)
    return {
        "file": f"explore-{role}-{width}-v1-{digest[:12]}.webp",
        "width": width,
        "height": height,
        "sha256": digest,
        "bytes": len(data),
    }


def main():
    encoder_versions = {
        "pillow": pillow_version,
        "libwebp": features.version("webp"),
    }
    if encoder_versions != ENCODER_VERSIONS:
        raise SystemExit(
            f"Exact reproduction requires {ENCODER_VERSIONS}; found {encoder_versions}"
        )

    # Compute and validate everything before writing any output.
    images = {}
    provenance_images = {}
    outputs = {}
    original_bytes = {}
    for role, (source_file, expected_hash) in SOURCES.items():
        source_bytes = (ASSETS / source_file).read_bytes()
        if sha256(source_bytes) != expected_hash:
            raise SystemExit(f"Original source changed: {source_file}")
        original_bytes[source_file] = source_bytes
        with Image.open(io.BytesIO(source_bytes)) as image:
            image.load()
            source_width, source_height = image.size
            if image.format != "WEBP" or image.mode != "RGB":
                raise SystemExit(f"Unexpected source format/mode: {source_file}")
            if source_width < SMALL_WIDTH:
                raise SystemExit(f"Refusing to upscale {source_file}")
            # Round the proportional height to the nearest integer, half up.
            small_height = (source_height * SMALL_WIDTH + source_width // 2) // source_width
            small = image.resize(
                (SMALL_WIDTH, small_height), resample=Image.Resampling.LANCZOS,
                box=None, reducing_gap=None,
            )
            buffer = io.BytesIO()
            small.save(
                buffer, format="WEBP", lossless=False,
                quality=QUALITY_BY_ROLE.get(role, SMALL_QUALITY), method=6,
            )
            small_bytes = buffer.getvalue()

        small_info = describe(role, small_bytes)
        large_info = describe(role, source_bytes)
        if len(small_bytes) >= len(source_bytes):
            raise SystemExit(f"Small rendition did not reduce bytes: {source_file}")
        outputs[small_info["file"]] = small_bytes
        outputs[large_info["file"]] = source_bytes
        images[role] = {
            "source": source_file,
            "width": source_width,
            "height": source_height,
            "small": small_info,
            "large": large_info,
        }
        provenance_images[role] = {
            **images[role],
            "sourceSha256": expected_hash,
            "sourceBytes": len(source_bytes),
        }

    for filename, data in outputs.items():
        target = ASSETS / filename
        if target.exists() and target.read_bytes() != data:
            raise SystemExit(f"Refusing to overwrite different asset bytes: {filename}")

    manifest = {"schemaVersion": 1, "images": images}
    provenance = json.loads(PROVENANCE.read_text())
    batch = {
        "id": BATCH_ID,
        "date": "2026-11-09",
        "generator": "scripts/create-explore-renditions.py",
        "toolVersions": {"python": platform.python_version(), **encoder_versions},
        "contentEdits": "None. Existing artwork only; no generation, crop, retouch, or semantic edits.",
        "smallConversion": {
            "width": SMALL_WIDTH,
            "height": "Proportional, nearest integer with halves rounded up",
            "upscale": False,
            "resample": "Pillow Image.Resampling.LANCZOS",
            "box": None,
            "reducingGap": None,
            "format": "WEBP",
            "lossless": False,
            "quality": SMALL_QUALITY,
            "qualityByRole": QUALITY_BY_ROLE,
            "qualityException": "The hero source is already 43,060 bytes. At 640px, quality 83 produces 52,824 bytes; quality 75 produces 40,050 bytes.",
            "method": 6,
            "mode": "RGB (unchanged)",
            "metadata": "No metadata passed to the encoder",
        },
        "largeConversion": "Exact original source bytes; no resize, upscale, or re-encoding.",
        "filename": "explore-{role}-{actualWidth}-v1-{sha256First12}.webp",
        "images": provenance_images,
    }
    batches = provenance.setdefault("renditionBatches", [])
    batches[:] = [entry for entry in batches if entry.get("id") != BATCH_ID]
    batches.append(batch)

    for filename, data in outputs.items():
        (ASSETS / filename).write_bytes(data)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    PROVENANCE.write_text(json.dumps(provenance, indent=2, ensure_ascii=False) + "\n")

    for filename, data in original_bytes.items():
        if (ASSETS / filename).read_bytes() != data:
            raise SystemExit(f"Original source unexpectedly changed: {filename}")
    for role, image in images.items():
        small, large = image["small"], image["large"]
        print(
            f"{role}: {large['width']}x{large['height']} {large['bytes']} bytes -> "
            f"{small['width']}x{small['height']} {small['bytes']} bytes "
            f"({100 * (1 - small['bytes'] / large['bytes']):.1f}% smaller)"
        )


if __name__ == "__main__":
    main()
