# Asset review: supplied free packs

Local metadata inspection only. No canonical-package admission, import, GPU appearance, collision, or runtime validation has been performed.

All three supplied license files declare CC0. The village and props license files identify the Standard FREE editions.

| Pack | Files on disk | glTF models | Extracted size |
|---|---:|---:|---:|
| Fantasy Props MegaKit[Standard] | 517 | 94 | 155.3 MiB |
| Medieval Village MegaKit[Standard] | 936 | 176 | 166.3 MiB |
| Ultimate Stylized Nature - May 2022-20261021T131147Z-1-001 | 369 | 36 | 449.3 MiB |

## Initial findings

- The free village pack supplies floors, interior corners, arches, wall and door modules, supports, and roof sections. These support the planned open-front workshops; dimensions and camera clearance still need validation in a representative assembled scene.
- The free props pack supplies Workbench, Workbench_Drawers, Table_Large, Shelf_Simple, Bookcase_2, Anvil, tools, and other furnishings. These are actual included model names, not assumptions from the paid edition.
- The nature pack includes 63 FBX and 63 OBJ models, but only 36 glTF files. Choose browser-format vegetation first and convert additional selected models only if necessary. Do not ship all alternate formats.
- Extracted source size includes alternate formats and editable source files. It is not the website download size.
- The nature license text has an apparent reused title, 'Ultimate Platformer Pack', but explicitly declares CC0. Retain the original license and the supplied pack provenance.

## Metadata checks

- Fantasy Props MegaKit[Standard]: 0 glTF resource-reference issues, 0 parsing errors; largest PNG dimensions 4096 x 4096.
- Medieval Village MegaKit[Standard]: 0 glTF resource-reference issues, 0 parsing errors; largest PNG dimensions 4096 x 4096.
- Ultimate Stylized Nature - May 2022-20261021T131147Z-1-001: 0 glTF resource-reference issues, 0 parsing errors; largest PNG dimensions 2048 x 2048.

## Next stage

Keep the downloaded sources intact. Complete planning and create a removable local development setup only when implementation begins. Select a small set of models for one workshop test, rather than importing the entire library. Package verification and project admission remain separate from this read-only review; the Game Development Studio catalog CLI is not installed in this environment, so its canonical-package integrity/admission checks have not been run. No tool installation was attempted.

The intended local setup uses a portable Node runtime, project-local dependencies, and project-local caches/logs. No system-wide package installation or permanent PATH changes are needed for that design. The user has returned to local development; the earlier cloud handoff ZIP remains a transfer snapshot, not the current development location.
