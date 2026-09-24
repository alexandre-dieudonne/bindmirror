# Persistence and import/export

## localStorage

No backend. User data is stored as plain JSON through `StorageService`:

| Key | Value | Type |
| --- | --- | --- |
| `layouts` | `{ [name]: Layout }` | `Layouts` |
| `keymaps` | `{ [name]: Keymap }` | `Keymaps` |

Keys are defined by `APP_CONSTANTS.layouts` and `APP_CONSTANTS.keymaps`. An item's name is its record key and is unique within its type.

Writes happen in:

- `createEntityForm.save`: add, edit, rename
- `DeleteButtonComponent`: delete
- `ImportButtonComponent` in "all" mode: merge

Layout presets are not in localStorage: they are served by `public/assets/layout-presets.json` (qwerty, qwertz, azerty, colemak, colemak-dh, dvorak, bepo, workman, neo2, jcuken).

## File format

```json
{
  "kind": "keymaps",
  "data": { "...": "..." }
}
```

- `kind`: must equal the localStorage key of the relevant type (`layouts` or `keymaps`)
- `data`: always a record `{ [name]: item }`, whether the file holds one item or many

A single-item export is therefore just an "all" export with one entry, and every export button produces a file that any import button of the same `kind` accepts.

Sample file: `examples/baldurs-gate-3-keymap.json`.

## Export

`ExportButtonComponent` calls `FileTransferService.exportFile(kind, data, filename)`.

| Mode | `kind` | `data` | File name |
| --- | --- | --- | --- |
| `isAllExport` (list) | localStorage key | all items | localStorage key |
| single (list) | localStorage key | `{ [name]: item }` | `name` |
| single (layout form) | `layouts` | `{ [currentName]: currentLayout }` | `currentName()` |
| single (keymap form) | `keymaps` | `{ [currentName]: keymap }`, with the editor rows converted back to a `Keymap` | `currentName()` |

When the name is empty (new item not yet titled), the record key falls back to `layout` or `keymap`.

## Import

`ImportButtonComponent.onImport`:

1. Reads the file with `FileTransferService.readFile`. Failure: `invalidFileFormat` dialog.
2. Compares `result.kind` to `localStorageKey`. Different: `invalidFileKind` dialog.
3. Depending on the mode:
   - `isAllImport` (list page): entries whose name already exists are **ignored** (existing ones win), new ones are added, the merged result is written to localStorage and emitted through `imported`.
   - otherwise (form page): `data` is emitted as-is through `imported` with no write; the page takes the first entry of the record (`Object.values(data)[0]`) into its state (`onImported`) and the user saves afterwards. A file with no entry is ignored.
4. `fileImportSuccess` dialog.

The content of `data` is not deeply validated: only the shape `{kind: string, data: object}` is checked.
