"""Create Spectral-colormap previews for every grayscale depth image."""

from pathlib import Path
from PIL import Image


ROOT = Path(__file__).parent / "assets" / "images"

# ColorBrewer Spectral, sampled at its eleven canonical control points.
SPECTRAL = (
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#ffffbf",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2",
)


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[index : index + 2], 16) for index in (0, 2, 4))


def spectral_lut() -> tuple[list[int], list[int], list[int]]:
    stops = [hex_to_rgb(color) for color in SPECTRAL]
    lookup: tuple[list[int], list[int], list[int]] = ([], [], [])

    for value in range(256):
        position = value / 255 * (len(stops) - 1)
        left = min(int(position), len(stops) - 2)
        amount = position - left
        rgb = tuple(
            round(stops[left][channel] * (1 - amount) + stops[left + 1][channel] * amount)
            for channel in range(3)
        )
        for channel in range(3):
            lookup[channel].append(rgb[channel])

    return lookup


def main() -> None:
    lookup = spectral_lut()
    depth_images = sorted(ROOT.glob("*/depth_*.png"))

    for source in depth_images:
        destination = source.with_name(source.name.replace("depth_", "spectral_", 1))
        grayscale = Image.open(source).convert("L")
        colored = Image.merge("RGB", tuple(grayscale.point(channel) for channel in lookup))
        colored.save(destination, optimize=True)
        print(f"{source.relative_to(ROOT)} -> {destination.name}")

    print(f"Generated {len(depth_images)} Spectral previews.")


if __name__ == "__main__":
    main()
