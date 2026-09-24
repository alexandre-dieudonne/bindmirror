# Pages

All pages live in `src/app/pages/`. They load their data in `ngOnInit` and keep it in signals.

## ConverterComponent (`/convert`)

Main page: converts a keymap from a source layout to a target layout.

State (signals):

| Signal | Role |
| --- | --- |
| `layoutPresets`, `customLayouts` | Presets (HTTP) and user layouts (localStorage) |
| `isCustomLayoutFrom` / `isCustomLayoutTo` | Preset / custom layout switch for each side |
| `layoutFrom`, `layoutTo`, `layoutFromName`, `layoutToName` | Selected layouts |
| `keymaps`, `keymap` | User keymaps and the selected keymap |
| `horizontalOffset`, `verticalOffset` | Entered offsets (strings, converted with `Number(x) \|\| 0`) |
| `convertedKeymap` | Conversion result |

Derived values (`computed`):

- `layoutNamesFrom` / `layoutNamesTo`: available names depending on the preset/custom switch
- `diffPositions`, `diffCount`: positions whose character differs between source and target
- `layoutFromDimensions`, `layoutFromKeyCount`
- `bindingRows`: `{action, original, converted, locked}` rows for the result table
- `remappedCount`, `untouchedCount`
- `previewPositionsFrom` / `previewPositionsTo`: highlight of the reference area and its offset position

Actions:

- `onCommitFrom(name)`, `onCommitTo(name)`, `onCommitKeymap(name)`: select an item and **clear the result** (`clearResult()`)
- `onConvert()`: calls `KeymapService.remapAll` with the offsets, fills `convertedKeymap`, `json` and `jsonConverted`
- `stepOffset(signal, delta)`: increments/decrements an offset
- `isChanged(row)`: compares the shortcut text before/after
- `chordsOf(strokes)`: splits a multi-step shortcut for display ("then")

Stroke display format: capitalized modifiers joined by `+`, then the key (uppercase if a single character), for example `Ctrl+Shift+S`.

## MyItemsComponent (`/my-layouts`, `/my-keymaps`)

Generic list parameterized by `route.snapshot.data` (`MyItemsRouteData<T>`):

```ts
type MyItemsRouteData<T> = {
  title: string;
  itemLabel: string;
  newLink: string;
  localStorageKey: string;
  itemMeta: (item: T) => string;
};
```

| Route | `itemMeta` |
| --- | --- |
| Layouts | number of non-empty keys ("N keys") |
| Keymaps | number of actions ("N actions") |

Loads `localStorageKey` from `StorageService` into `items` and delegates rendering to `CrudListComponent`. To add a new listable item type, add a route with its `data`.

## LayoutFormComponent (`/my-layouts/new-layout`, `/my-layouts/:name`)

Create/edit a layout, built on `createEntityForm<Layout>`.

- Create mode: loads presets so the user can start from an existing one (`onCommitPreset`).
- Edit mode: loads the stored layout into `currentLayout`.
- `LayoutComponent` in `canResize` mode allows adding/removing rows and columns.
- Single-layout import/export through `ImportButtonComponent` / `ExportButtonComponent`. `exportData` is `{ [currentName]: currentLayout }`; `onImported` replaces `currentLayout` with the first layout of the file.
- `onSave()` calls `form.save(currentLayout())`.

## KeymapFormComponent (`/my-keymaps/new-keymap`, `/my-keymaps/:name`)

Create/edit a keymap, built on `createEntityForm<Keymap>`.

- State: `currentKeymap = signal<{rows: Shortcut[]}>`, initialized with one empty row.
- On load in edit mode, the `Keymap` (record) is converted to `Shortcut[]`.
- `multi`: display toggle for entering multi-step shortcuts.
- `keymap`: `computed` conversion of the rows to a `Keymap`, used by `onSave()` and by `exportData` (`{ [currentName]: keymap }`).
- `onImported(data)`: takes the first keymap of the imported file (`Object.values(data)[0]`).
- `onSave()` converts `Shortcut[]` back to a `Keymap` (`action` becomes the key) then calls `form.save`. Two rows with the same action overwrite each other: the last one wins.
