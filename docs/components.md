# Reusable components

Folder `src/app/components/`. All are standalone.

## FormValueControl contract

`custom-input`, `custom-select`, `toggle-button`, `shortcut-input` and `editable-title` implement `FormValueControl<T>` from `@angular/forms/signals`. They expose `value = model<T>()` and `disabled = input()`. Two equivalent usages:

```html
<app-custom-input [(value)]="someSignal" />
<app-custom-input [formField]="row.someField" />
```

The second wires the component into a signal `form()` (see `KeymapComponent`).

| Component | Value type | Notes |
| --- | --- | --- |
| `CustomInputComponent` | `string` | `type`: `text` or `number`, `placeholder` |
| `CustomSelectComponent` | `string` | Dropdown with search, keyboard navigation (`moveHighlight`, `selectHighlighted`), entries from `labels`, default placeholder "Select a preset" |
| `ToggleButtonComponent` | `boolean` | Reference for the disabled state |
| `ShortcutInputComponent` | `Stroke[]` | Shortcut entry: key choice from `KEY_OPTIONS`, modifiers, add/remove steps. `forceMulti` forces multi-step display |
| `EditableTitleComponent` | `string` | In-place editable title (auto focus) |

## Layout and keymap

- `LayoutComponent` (`app-layout`): key grid. Inputs: `layout`, `isDisabled`, `canResize`, `highlightPositions`, `secondaryHighlightPositions`. Output: `layoutChange`. Clicking a key opens `KeyDialogComponent`. `addRow`, `removeRow`, `addColumn`, `removeColumn` change the grid (bounds: 1 to 26).
- `KeymapComponent` (`app-keymap`): keymap editing table. `keymap` model `{rows: Shortcut[]}` wrapped in a signal `form()`. Methods `addRow`, `removeRow`, `moveRow(index, +1 | -1)` for reordering.

## CRUD list

`CrudListComponent<T>` (`app-crud-list`): displays a `Record<string, T>` sorted by name (`localeCompare`), with new, global import/export, edit, single export and delete. Inputs: `title`, `itemLabel`, `newLink`, `localStorageKey`, `items`, `itemMeta`.

## Buttons (`buttons/`)

| Component | Role |
| --- | --- |
| `CustomButtonComponent` | Base button, styled through `Variant` (default `accent`) |
| `BackButtonComponent` | Back navigation |
| `NewButtonComponent`, `EditButtonComponent` | Navigation links (`link`) |
| `DeleteButtonComponent` | Opens a `ConfirmDialogComponent`, then removes the item from localStorage and emits `deleted` with the remaining record |
| `ExportButtonComponent` | Exports through `FileTransferService`. `isAllExport`: file name = localStorage key, otherwise `name` |
| `ImportButtonComponent` | Reads a file, validates `kind`, merges or replaces (see [persistence-import-export.md](persistence-import-export.md)) |

## Dialogs (`dialogs/`)

Built on the CDK `Dialog`, data passed through `DIALOG_DATA`.

| Component | Data | Behavior |
| --- | --- | --- |
| `CustomDialogComponent` | `{message, navigateUrl?, variant?}` | Message. On close, navigates to `navigateUrl` if provided |
| `ConfirmDialogComponent` | `{message, confirmLabel?, variant?, confirmed?}` | Confirmation. Sets `data.confirmed = true` before closing; the caller reads that object after `closed` |
| `KeyDialogComponent` | `{position, label}` | Captures the next key pressed (`event.key`) and writes it to `data.label`. `onUnbind()` clears the key |

Dialogs return their result by mutating the `data` object rather than passing a value to `close()`.

## Others

- `NavbarComponent`: main navigation (`RouterLink`).
- `TagComponent`: pill. `variant` = `Variant | 'outline'`.
