# Architecture

## Stack

| Item | Version / choice |
| --- | --- |
| Framework | Angular 22, standalone components, signals |
| Forms | `@angular/forms/signals` (`FormValueControl`, `form()`, `FormField`) |
| Overlays / dialogs | `@angular/cdk` (`Dialog`, `DIALOG_DATA`, `DialogRef`) |
| Styling | Tailwind CSS v4, CSS-first config (`@theme` block in `src/styles.css`) |
| Tests | Vitest + jsdom via `ng test` |
| Formatting | Prettier (print width 120, 4-space indent, single quotes, no bracket spacing, Angular parser for `.html`) |
| Language | TypeScript 6 |
| Font | Inter (Google Fonts) |

## Directory layout

```
public/assets/
  layout-presets.json        Layout presets (static)
examples/
  baldurs-gate-3-keymap.json Sample importable keymap
fixtures/
  test-layouts.json          Manual import fixtures
  test-keymaps.json          Manual import fixtures
src/
  main.ts                    Application bootstrap
  styles.css                 Tailwind + design tokens
  app/
    app.ts / app.html        Root component (navbar + router-outlet)
    app.config.ts            Providers: router, HttpClient, global error listeners
    app.routes.ts            Route table
    constants/               App constants, key options, variants
    models/                  Types and pure functions (layouts, keymaps, import/export)
    services/                Services and the entity form helper
    pages/                   Routed components
    components/              Reusable, non-routed components
.claude/skills/style-guide/  Style guide used by Claude Code
```

## Bootstrap

`main.ts` bootstraps `App` with `appConfig` (`app.config.ts`), which provides:

- `provideRouter(routes)`
- `provideHttpClient()` (only used to load layout presets)
- `provideBrowserGlobalErrorListeners()`

`App` renders `NavbarComponent` followed by a `RouterOutlet`.

## Pages vs components

- `src/app/pages/*`: components bound to a route. They orchestrate state and services.
- `src/app/components/*`: reusable building blocks with no knowledge of routing. They communicate through `input()` / `output()` / `model()`.

## Data flow

```
public/assets/layout-presets.json --HTTP--> KeymapService.loadLayoutPresets()
localStorage <----> StorageService <----> pages (converter, my-items, layout-form, keymap-form)
JSON file <----> FileTransferService <----> Import/ExportButton
```

There is no global store: each page loads its data into its own signals in `ngOnInit`. Pages are not synchronized with each other beyond reloading on navigation.

## Routing

| Route | Component | Purpose |
| --- | --- | --- |
| `''` | redirect to `convert` | |
| `convert` | `ConverterComponent` | Convert a keymap between two layouts |
| `my-layouts` | `MyItemsComponent` | List of user layouts |
| `my-layouts/new-layout` | `LayoutFormComponent` | Create a layout |
| `my-layouts/:name` | `LayoutFormComponent` | Edit a layout |
| `my-keymaps` | `MyItemsComponent` | List of user keymaps |
| `my-keymaps/new-keymap` | `KeymapFormComponent` | Create a keymap |
| `my-keymaps/:name` | `KeymapFormComponent` | Edit a keymap |
| `**` | redirect to `convert` | |

The conversion route is named `convert` (not `converter`).

Both list routes use the same generic `MyItemsComponent<T>`, parameterized through `data: MyItemsRouteData<T>` in `app.routes.ts`. The forms' create/edit mode is derived from the `:name` param (present means edit).
