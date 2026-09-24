# Technical documentation - BindMirror

BindMirror is an Angular 22 application (standalone components, no NgModules) for defining custom keyboard **layouts** (which character sits at each physical key position) and **keymaps** (action to keyboard shortcut), then converting a keymap from one layout to another based on physical key position. Example: keep a set of game shortcuts when switching from QWERTY to Colemak.

The application runs entirely client-side. There is no backend: user data lives in the browser's `localStorage`.

## Contents

| Document | Content |
| --- | --- |
| [architecture.md](architecture.md) | Stack, folder structure, bootstrap, routing, data flow |
| [data-model.md](data-model.md) | `Layout`, `Keymap`, `Stroke` types, key positions, JSON formats |
| [services.md](services.md) | `KeymapService`, `StorageService`, `FileTransferService`, `createEntityForm` |
| [conversion-algorithm.md](conversion-algorithm.md) | Position-based remap, offsets and wrapping |
| [pages.md](pages.md) | Routed pages: converter, lists, forms |
| [components.md](components.md) | Reusable components and the `FormValueControl` contract |
| [persistence-import-export.md](persistence-import-export.md) | localStorage, import/export file format, merging |
| [styles.md](styles.md) | Tailwind v4, tokens, `Variant` system |
| [testing-and-build.md](testing-and-build.md) | Commands, test conventions, TestBed setup |

## Quick start

```bash
npm install
npm start                  # http://localhost:4200
ng build                   # production build in dist/
ng test --watch=false      # full spec suite (Vitest, jsdom)
npm run format             # Prettier on src/**/*.{ts,html}
```
