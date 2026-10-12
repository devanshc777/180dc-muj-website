"""Inline the land mask into the template and write index.html.

    uv run python tools/build.py

Keeps the 27KB base64 blob out of the editable source file.
"""
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent
TEMPLATE = ROOT / "globe.template.html"
MASK = HERE / "landmask.b64.txt"
OUT = ROOT / "index.html"
TOKEN = "__LANDMASK_B64__"


def main():
    if not MASK.exists():
        sys.exit("missing tools/landmask.b64.txt - run build_landmask.py first")

    html = TEMPLATE.read_text(encoding="utf-8")
    if TOKEN not in html:
        sys.exit(f"template no longer contains {TOKEN}")

    mask = MASK.read_text(encoding="ascii").strip()
    out = html.replace(TOKEN, mask)
    OUT.write_text(out, encoding="utf-8")

    print(f"wrote {OUT.name}: {len(out):,} chars ({OUT.stat().st_size / 1024:.0f} KB)")
    print(f"  mask inlined: {len(mask):,} chars")
    assert TOKEN not in out, "token survived substitution"
    print("  token substituted: ok")


if __name__ == "__main__":
    main()
