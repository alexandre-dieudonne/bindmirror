# Styles

Tailwind CSS v4 with CSS-first configuration: no `tailwind.config.js`. Tokens live in the `@theme` block of `src/styles.css`, PostCSS is configured in `.postcssrc.json` (`@tailwindcss/postcss`). The application is **dark-only**.

## Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `--color-text` | `#e9e9ed` | Text |
| `--color-accent` | `#9184d9` | Primary accent |
| `--color-danger` | `#e05d5d` | Error, deletion |
| `--color-info` | `#5b9bd9` | Information |
| `--color-warning` | `#cea424` | Warning, secondary highlight |
| `--color-bg` | `#161826` | Page background |
| `--color-surface` | `#232532` | Cards |
| `--color-divider` | text at 16% | Borders |
| `--font-heading`, `--font-body` | Inter | Fonts |

Never write a hex color in a template: use the token-backed classes (`text-accent`, `bg-surface`, `border-divider`).

## Conventions

- Text opacity scale, four values only: `text-text/85` (primary), `/60` (secondary), `/50` (muted), `/40` (meta).
- Cards: `rounded-2xl bg-surface shadow-sm`.
- Dialogs: `rounded-2xl shadow-lg`; border color from `variantBorderClasses`.
- Section headings: `text-xs tracking-widest uppercase text-text/60`.
- Disabled state: `disabled:opacity-40 disabled:cursor-not-allowed`. For non-native elements: `opacity-40`, `cursor-not-allowed`, `pointer-events-none` as conditional bindings.

## Variant system

`src/app/constants/variants.ts`:

```ts
type Variant = 'accent' | 'danger' | 'info' | 'neutral' | 'warning' | 'ghost' | 'ghostDanger';
```

Three class tables indexed by `Variant`:

| Table | Used by |
| --- | --- |
| `variantButtonClasses` | `CustomButtonComponent` |
| `variantBorderClasses` | Dialogs |
| `variantTagClasses` | `TagComponent` |

Reuse these tables instead of inventing new color combinations. `TagComponent` additionally accepts the `outline` value.

The full guide is in `.claude/skills/style-guide/SKILL.md` and must be consulted before changing any template or classes.
