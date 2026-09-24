# Services and helpers

Services use Angular's `@Service()` decorator and are injected with `inject()`.

## KeymapService

`src/app/services/keymap.service.ts`

| Method | Description |
| --- | --- |
| `loadLayoutPresets()` | `GET /assets/layout-presets.json`, returns an `Observable<Layouts>` |
| `offset(pos, colOffset, rowOffset, dims)` | Shifts a position with wrapping on the dimensions. Throws if `pos` is invalid |
| `remap(from, to, keybind, colOffset, rowOffset)` | Returns the target-layout character for a source-layout character, or `undefined` if absent |
| `remapStroke(from, to, stroke, colOffset, rowOffset)` | Remaps a `Stroke`. Named or off-grid keys are returned unchanged. Modifiers are preserved |
| `remapAll(from, to, keymap, colOffset, rowOffset)` | Remaps a whole `Keymap`. `locked` entries are copied untouched |

See [conversion-algorithm.md](conversion-algorithm.md).

## StorageService

`src/app/services/storage.service.ts`. A `localStorage` wrapper that never throws.

| Method | Behavior |
| --- | --- |
| `getItem<T>(key)` | Returns the parsed value, or `null` if the key is missing, the JSON is invalid, or `localStorage` is inaccessible |
| `setItem(key, value)` | Serializes to JSON. Returns `true` on success, `false` on failure (quota exceeded, access denied) |
| `removeItem(key)` | Removes the key, ignoring errors |

## FileTransferService

`src/app/services/file-transfer.service.ts`

| Method | Description |
| --- | --- |
| `exportFile(kind, data, filename)` | Builds a JSON Blob `{kind, data}` and triggers a download through a temporary link |
| `readFile(file)` | Reads a `File` as text, parses the JSON and checks the shape `{kind: string, data: object}`. Rejects with `Invalid JSON`, `Invalid file shape` or the read error |

## createEntityForm

`src/app/services/entity-form.util.ts`. A function (not a service) to be called in an injection context, i.e. in a component field initializer. It factors out the logic shared by the layout and keymap forms.

```ts
const form = createEntityForm<Layout>({ storageKey: APP_CONSTANTS.layouts, listUrl: APP_URLS.myLayouts });
```

It returns:

| Member | Description |
| --- | --- |
| `name` | Signal of the `:name` route param (empty string when creating) |
| `isEditMode` | `computed`, true when `name` is non-empty |
| `currentName` | Signal of the entered name (initialized from `name`), bound to `EditableTitleComponent` |
| `entities` | Signal of the record of all stored entities |
| `load()` | Reads localStorage, fills `entities`, returns the items |
| `currentEntity()` | The entity matching `name`, or `undefined` |
| `save(value)` | Validates and saves (see below) |

`save(value)` logic:

1. If `currentName` is empty: error dialog `titleNotSpecified`, stop.
2. Builds `otherEntities`: all entities except the one under the old name (`oldName`, the name at load time). This allows renaming without colliding with itself.
3. If `currentName` already exists in `otherEntities`: error dialog `nameAlreadyUsed`, stop.
4. Writes `{...otherEntities, [currentName]: value}` to localStorage and to `entities`.
5. Opens a success `CustomDialogComponent` that navigates to `listUrl` when closed.

Each page keeps its own state (`currentLayout`, `currentKeymap`) and only calls `form.save(value)`.
