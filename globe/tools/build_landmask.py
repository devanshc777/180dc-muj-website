"""Rasterise a Natural Earth land GeoJSON into a 1-bit equirectangular land mask,
then emit it as a base64 data URI ready to paste into index.html.

    uv run --with pillow python tools/build_landmask.py

Outputs tools/landmask.png (inspectable) and tools/landmask.b64.txt.
"""
import base64
import json
import pathlib

from PIL import Image, ImageDraw

HERE = pathlib.Path(__file__).parent
SRC = HERE / "ne_50m_land.geojson"
W, H = 2048, 1024


def to_px(lon, lat):
    return ((lon + 180.0) / 360.0 * W, (90.0 - lat) / 180.0 * H)


def rings(geom):
    """Yield (ring, is_hole) for every ring in a Polygon or MultiPolygon."""
    if geom["type"] == "Polygon":
        polys = [geom["coordinates"]]
    elif geom["type"] == "MultiPolygon":
        polys = geom["coordinates"]
    else:
        return
    for poly in polys:
        for i, ring in enumerate(poly):
            yield ring, i > 0


def main():
    data = json.loads(SRC.read_text(encoding="utf-8"))
    img = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(img)

    exteriors = holes = 0
    # Exteriors first, then holes punched out, so lakes/inland seas read as ocean.
    for is_hole_pass in (False, True):
        for feat in data["features"]:
            for ring, is_hole in rings(feat["geometry"]):
                if is_hole != is_hole_pass:
                    continue
                pts = [to_px(x, y) for x, y in ring]
                if len(pts) < 3:
                    continue
                draw.polygon(pts, fill=0 if is_hole else 255)
                if is_hole:
                    holes += 1
                else:
                    exteriors += 1

    out_png = HERE / "landmask.png"
    # convert("1") dithers by default, which speckles every coastline. Hard threshold.
    img.point(lambda v: 255 if v > 127 else 0).convert("1", dither=Image.Dither.NONE).save(
        out_png, optimize=True
    )

    raw = out_png.read_bytes()
    b64 = base64.b64encode(raw).decode("ascii")
    (HERE / "landmask.b64.txt").write_text(f"data:image/png;base64,{b64}", encoding="ascii")

    # Sanity: land fraction of Earth's surface is ~29%, but equirectangular
    # over-weights the poles, so the raw pixel fraction should land near ~24-28%.
    px = img.load()
    land = sum(1 for y in range(0, H, 4) for x in range(0, W, 4) if px[x, y] > 127)
    total = (H // 4) * (W // 4)
    print(f"rings: {exteriors} exterior, {holes} holes")
    print(f"png bytes: {len(raw)}  base64 chars: {len(b64)}")
    print(f"land pixel fraction: {land / total:.3f}")

    # Spot-check known coordinates: land should be land, ocean should be ocean.
    checks = [
        ("Paris", 2.35, 48.85, True),
        ("Sahara", 10.0, 23.0, True),
        ("Amazon", -60.0, -3.0, True),
        ("Mumbai", 72.87, 19.07, True),
        ("Sydney", 151.2, -33.87, True),
        ("mid-Pacific", -140.0, 0.0, False),
        ("mid-Atlantic", -30.0, 0.0, False),
        ("Indian Ocean", 80.0, -30.0, False),
    ]
    bad = 0
    for name, lon, lat, want in checks:
        x, y = to_px(lon, lat)
        got = px[min(int(x), W - 1), min(int(y), H - 1)] > 127
        flag = "ok " if got == want else "BAD"
        if got != want:
            bad += 1
        print(f"  {flag} {name:<14} land={got} expected={want}")
    print("SPOTCHECK", "PASS" if bad == 0 else f"FAIL ({bad})")


if __name__ == "__main__":
    main()
