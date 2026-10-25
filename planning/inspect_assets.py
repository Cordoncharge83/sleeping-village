"""Read-only metadata review of supplied assets; does not import or modify them."""
import collections
import hashlib
import json
import struct
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "asset-packs"
records = []
for pack in sorted(p for p in SOURCE.iterdir() if p.is_dir()):
    files = sorted(p for p in pack.rglob("*") if p.is_file())
    formats = collections.Counter(p.suffix.lower() for p in files)
    models = []
    missing = []
    errors = []
    for path in (p for p in files if p.suffix.lower() == ".gltf"):
        try:
            data = json.loads(path.read_text(encoding="utf-8-sig"))
            for section in ("buffers", "images"):
                for resource in data.get(section, []):
                    uri = resource.get("uri", "")
                    if not uri or uri.startswith("data:"):
                        continue
                    parsed = urlparse(uri)
                    if parsed.scheme:
                        missing.append({"model": str(path.relative_to(pack)), "uri": uri, "issue": "external URI"})
                        continue
                    target = (path.parent / unquote(parsed.path)).resolve()
                    if not target.is_relative_to(pack.resolve()) or not target.is_file():
                        missing.append({"model": str(path.relative_to(pack)), "uri": uri, "issue": "missing or outside pack"})
            triangles = 0
            for mesh in data.get("meshes", []):
                for primitive in mesh.get("primitives", []):
                    if primitive.get("mode", 4) != 4:
                        continue
                    accessor = primitive.get("indices", primitive.get("attributes", {}).get("POSITION"))
                    if accessor is not None:
                        triangles += data["accessors"][accessor]["count"] // 3
            models.append({"name": path.stem, "path": str(path.relative_to(pack)), "mesh_triangles": triangles})
        except (ValueError, KeyError, IndexError, OSError) as error:
            errors.append({"file": str(path.relative_to(pack)), "error": str(error)})
    textures = []
    for path in (p for p in files if p.suffix.lower() == ".png"):
        with path.open("rb") as stream:
            header = stream.read(24)
        if header[:8] == b"\x89PNG\r\n\x1a\n" and len(header) == 24:
            width, height = struct.unpack(">II", header[16:24])
            textures.append({"path": str(path.relative_to(pack)), "width": width, "height": height, "bytes": path.stat().st_size})
    all_names = {p.stem for p in files if p.suffix.lower() in (".gltf", ".fbx", ".obj", ".blend")}
    gltf_names = {model["name"] for model in models}
    licenses = []
    for path in (p for p in files if p.name.lower().startswith("license")):
        license_text = path.read_text(encoding="utf-8-sig", errors="replace")
        licenses.append({"path": str(path.relative_to(pack)), "cc0_declared": "CC0" in license_text,
                         "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    records.append({"pack": pack.name, "files": len(files), "bytes": sum(p.stat().st_size for p in files),
                    "formats": dict(formats), "licenses": licenses, "gltf_models": models,
                    "gltf_reference_issues": missing, "metadata_errors": errors,
                    "names_without_gltf": sorted(all_names - gltf_names), "png_textures": textures})

report = {"scope": "Local metadata inspection only. No canonical-package admission, import, GPU appearance, collision, or runtime validation has been performed.", "packs": records}
(ROOT / "planning" / "asset_inventory.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
lines = ["# Asset review: supplied free packs", "", report["scope"], "", "All three supplied license files declare CC0. The village and props license files identify the Standard FREE editions.", "", "| Pack | Files on disk | glTF models | Extracted size |", "|---|---:|---:|---:|"]
for record in records:
    lines.append(f"| {record['pack']} | {record['files']} | {len(record['gltf_models'])} | {record['bytes'] / 1024**2:.1f} MiB |")
lines += ["", "## Initial findings", "", "- The free village pack supplies floors, interior corners, arches, wall and door modules, supports, and roof sections. These support the planned open-front workshops; dimensions and camera clearance still need validation in a representative assembled scene.", "- The free props pack supplies Workbench, Workbench_Drawers, Table_Large, Shelf_Simple, Bookcase_2, Anvil, tools, and other furnishings. These are actual included model names, not assumptions from the paid edition.", "- The nature pack includes 63 FBX and 63 OBJ models, but only 36 glTF files. Choose browser-format vegetation first and convert additional selected models only if necessary. Do not ship all alternate formats.", "- Extracted source size includes alternate formats and editable source files. It is not the website download size.", "- The nature license text has an apparent reused title, 'Ultimate Platformer Pack', but explicitly declares CC0. Retain the original license and the supplied pack provenance.", "", "## Metadata checks", ""]
for record in records:
    largest = max(record["png_textures"], key=lambda texture: texture["width"] * texture["height"], default=None)
    largest_text = f"{largest['width']} x {largest['height']}" if largest else "none found"
    lines.append(f"- {record['pack']}: {len(record['gltf_reference_issues'])} glTF resource-reference issues, {len(record['metadata_errors'])} parsing errors; largest PNG dimensions {largest_text}.")
lines += ["", "## Next stage", "", "Keep the downloaded sources intact. Complete planning and create a removable local development setup only when implementation begins. Select a small set of models for one workshop test, rather than importing the entire library. Package verification and project admission remain separate from this read-only review; the Game Development Studio catalog CLI is not installed in this environment, so its canonical-package integrity/admission checks have not been run. No tool installation was attempted.", "", "The intended local setup uses a portable Node runtime, project-local dependencies, and project-local caches/logs. No system-wide package installation or permanent PATH changes are needed for that design. The user has returned to local development; the earlier cloud handoff ZIP remains a transfer snapshot, not the current development location."]
(ROOT / "planning" / "ASSET_REVIEW.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(json.dumps({"packs": [{"name": r["pack"], "gltf_models": len(r["gltf_models"]), "reference_issues": len(r["gltf_reference_issues"]), "metadata_errors": len(r["metadata_errors"]), "MiB": round(r["bytes"] / 1024**2, 1), "largest_png_edge": max((max(t["width"], t["height"]) for t in r["png_textures"]), default=0)} for r in records]}, indent=2))
