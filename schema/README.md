# Schema

JSON Schema files for the workbench data contracts.

| File | Describes | Source of truth |
|---|---|---|
| `schedule.schema.json` | `SCHEDULE` data object in `index.html` | `index.html` |
| `block.schema.json` | One block (or phase marker) in a SCHEDULE day | `index.html` |
| `activities.schema.json` | `ACTIVITIES` data object in `index.html` | `index.html` |
| `days.schema.json` | `DAYS` data object in `index.html` | `index.html` |
| `extraction-entry.schema.json` | One entry in `data/porto-extraction.json` | Private repo |
| `mapping-entry.schema.json` | One entry in `data/porto-mapping.json` | Private repo |

## Validation

Run `node tools/validate.mjs` to check the workbench against these schemas. The same validator runs in-browser at page load and shows a banner on failure.

## Versioning

Schemas are at JSON Schema Draft 07. They describe the *current* state of the data — when the workbench data shape changes, the schema changes too. There's no separate schema versioning; the file in main is canonical.

## Other AI consumers

These files are the contract any external tool / AI / pipeline should read to understand the data shape. They're stable, machine-readable, and decoupled from the renderer.
