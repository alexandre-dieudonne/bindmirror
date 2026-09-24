# Data model

Files: `src/app/models/layouts.model.ts`, `src/app/models/keymap.model.ts`, `src/app/models/import-export-files.ts`.

## Layout

```ts
type KeyPosition = `${Row}${number}`;   // Row: 'a' to 'z'
type Layout = Record<KeyPosition, string>;
type Layouts = Record<string, Layout>;  // name -> layout
```

A `KeyPosition` is a row letter (`a`, `b`, `c`, ... in order) followed by a 1-based column number: `a1`, `b3`, `c10`. Row `a` is the first (top) row, column 1 is the leftmost.

Example (QWERTY excerpt):

```json
{ "a1": "q", "a2": "w", "b1": "a", "b2": "s" }
```

### Derived dimensions

There is no `rows`/`cols` field. The grid size is **derived** from the positions present by `getLayoutDimensions(layout)`:

- `rows` = highest row index + 1
- `cols` = highest column number
- empty layout: `{rows: 3, cols: 10}`
- keys that do not match the position format are ignored

Consequence: any single-cell edit must re-emit **every** position of the grid, otherwise the grid shrinks to the bounding box of the remaining positions. `LayoutComponent.onKeyClickOpenDialog()` rebuilds the full grid from `rows()` before emitting. An empty cell is stored as the empty string `''` so that the position keeps existing.

Limits: at most 26 rows (letters `a` to `z`) and 26 columns in the editor.

### Helper functions

| Function | Purpose |
| --- | --- |
| `toPosition(row, col)` | `toPosition(0, 1)` returns `'a1'` (`row` is a 0-based index, `col` is 1-based) |
| `parsePosition(position)` | `'b3'` returns `{row: 1, col: 3}`, or `undefined` for an invalid format |
| `getLayoutDimensions(layout)` | See above |

## Keymap

```ts
type Modifiers = { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean };
type Stroke = { key: string; modifiers?: Modifiers };
type KeymapEntry = { strokes: Stroke[]; locked: boolean };
type Keymap = Record<string, KeymapEntry>;    // action -> entry
type Keymaps = Record<string, Keymap>;        // name -> keymap
type Shortcut = { action: string; strokes: Stroke[]; locked: boolean };  // editing row
```

- A `Stroke` is a single key press with its modifiers.
- `strokes` holds more than one element for chorded or multi-step shortcuts (displayed as "A then B").
- `locked: true` excludes the entry from conversion: it is copied as-is.
- `Shortcut` is the "table row" representation used by the keymap editor (the action is carried by the row instead of being the record key).

Example:

```json
{
  "Toggle Tactical Camera": { "strokes": [{ "key": "o" }], "locked": false },
  "Quick Save": { "strokes": [{ "key": "s", "modifiers": { "ctrl": true } }], "locked": true }
}
```

### Key values

Keys selectable in the editor are listed in `src/app/constants/key-options.constants.ts` (`KEY_OPTIONS`): letters, digits, F1-F12, arrows, navigation keys, named punctuation (`Grave`, `Minus`, `Semicolon`, ...), modifiers, mouse buttons and scroll.

Only single-character keys present in the source layout grid are converted. Named keys (`Enter`, `F5`, `Left Mouse Button`, ...) never change.

## Import/export format

```ts
type ImportExportFiles<T> = { kind: string; data: T };
```

See [persistence-import-export.md](persistence-import-export.md).

## Constants

`src/app/constants/app.constants.ts`:

| Constant | Content |
| --- | --- |
| `APP_CONSTANTS` | `layouts: "layouts"`, `keymaps: "keymaps"`: localStorage keys and file `kind` values |
| `APP_MESSAGES` | Dialog messages (`saveSuccess`, `fileImportSuccess`, `fileExportSuccess`, `invalidFileKind`, `invalidFileFormat`, `nameAlreadyUsed`, `titleNotSpecified`) |
| `APP_URLS` | `myLayouts`, `myKeymaps`: return URLs after saving |
