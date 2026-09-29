# Testing and build

## Commands

```bash
npm start                                      # dev server, http://localhost:4200
ng build                                       # production build, output in dist/
ng test                                        # full suite (Vitest, jsdom)
ng test --watch=false                          # single run
ng test --include src/app/path/to/x.spec.ts    # a single file
ng test --filter "test name"                   # filter by name
npm run format                                 # Prettier on src/**/*.{ts,html}
npm run format:check                           # check formatting without writing
```

No lint command is configured. The test builder is `@angular/build:unit-test`.

## Docker and CI

| File | Role |
| --- | --- |
| `Dockerfile` | Two stages: Node builds the app (`npm run build`), Nginx serves `dist/bindmirror/browser` |
| `nginx.conf` | Falls back to `index.html` so direct links to Angular routes work |
| `docker-compose.yml` | Builds the image and exposes it on http://localhost:8080 |
| `.dockerignore` | Keeps `node_modules`, `dist`, docs and sample data out of the build context |
| `.gitlab-ci.yml` | `test` stage (`npm run format:check`, `ng test --watch=false`) then `build` stage (`npm run build`), then `pages` on the default branch: publishes the build to GitLab Pages, with `index.html` copied to `404.html` so direct links to routes work |

## Test files

Specs sit next to the code (`*.spec.ts`): `app`, `converter`, `keymap-form`, `layout-form`, `crud-list`, `keymap`, `layout`, `navbar`, `custom-input`, `custom-select`, `custom-dialog`, `key-dialog`, buttons (back, custom, export, import), `keymap.service`, `storage.service`, `layouts.model`.

## TestBed setup by dependency

| The component injects | Required providers |
| --- | --- |
| `ActivatedRoute` or `RouterLink` | `provideRouter([])` |
| CDK `DialogRef` / `DIALOG_DATA` | Provide them directly, e.g. `{provide: DialogRef, useValue: {close: () => {}}}` (they only exist for real when a dialog is opened through the `Dialog` service) |
| An HTTP call (via `KeymapService`) | `provideHttpClient()` and `provideHttpClientTesting()` to avoid a real network call |

Examples: the `back-button`, `custom-dialog` and `layout-form` specs.

## Configuration

| File | Role |
| --- | --- |
| `angular.json` | Builders (`application`, `dev-server`, `unit-test`), build budgets |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json` | TypeScript |
| `.prettierrc` | Print width 120, 4-space indent, single quotes, no bracket spacing, Angular parser for `.html` |
| `.editorconfig` | Editor conventions |
| `.postcssrc.json` | Tailwind plugin |

## Static and sample data files

| File | Usage |
| --- | --- |
| `public/assets/layout-presets.json` | Presets loaded by `KeymapService.loadLayoutPresets()`. Served as-is under `/assets/` |
| `examples/baldurs-gate-3-keymap.json` | Sample keymap, importable from the My Keymaps page |
| `fixtures/test-layouts.json`, `fixtures/test-keymaps.json` | Manual import fixtures. Not part of the build |
