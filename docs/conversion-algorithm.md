# Conversion algorithm

Implemented in `KeymapService` (`src/app/services/keymap.service.ts`), called by `ConverterComponent.onConvert()`.

## Principle

For each key of a shortcut:

1. Find the character's **position** in the source layout (first entry whose value matches).
2. Apply an optional **offset** (columns, rows) with wrapping.
3. Read the character at that (offset) position in the target layout.

Example QWERTY to Colemak, no offset: `e` sits at `a3` in QWERTY; `a3` in Colemak holds `f`, so `e` becomes `f`.

## Offset and wrapping

```
newCol = ((col - 1 + colOffset) mod cols + cols) mod cols + 1
newRow = (row + rowOffset) mod rows, brought back into [0, rows[
```

The dimensions used are those of the **source** layout (`getLayoutDimensions(layoutFrom)`), not the target. The double modulo handles negative offsets correctly.

Examples on a 3x10 grid:

| Call | Result |
| --- | --- |
| `offset('a10', +1 col)` | `a1` |
| `offset('a1', -1 col)` | `a10` |
| `offset('c1', +1 row)` | `a1` |
| `offset('a1', -1 row)` | `c1` |

Use case: a horizontal offset helps when two layouts place their gaming cluster (for example `WASD`) at different spots of the grid.

## Edge cases

| Case | Behavior |
| --- | --- |
| Named key (`Enter`, `F5`, mouse, modifier) | Unchanged |
| Single character absent from the source layout | Unchanged |
| Computed position absent from the target layout | Key left unchanged (`remap` returns `undefined`) |
| Entry with `locked: true` | Copied as-is |
| Modifiers (`ctrl`, `shift`, ...) | Preserved |
| Invalid position | `offset` throws |

The match test is `stroke.key.length === 1 && Object.values(layoutFrom).includes(stroke.key)`.

## Preview in the converter

`ConverterComponent` highlights positions `a2`, `b1`, `b2`, `b3` (`PREVIEW_POSITIONS`, the WASD cluster in QWERTY) on the source layout, and their offset positions on the target layout through `KeymapService.offset`.
