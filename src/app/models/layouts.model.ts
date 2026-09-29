type Row =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';

export type KeyPosition = `${Row}${number}`;

export type Layout = Record<KeyPosition, string>;
export type Layouts = Record<string, Layout>;

export function getLayoutDimensions(layout: Layout): {rows: number; cols: number} {
    const keys = Object.keys(layout);
    if (keys.length === 0) return {rows: 3, cols: 10};
    let maxRow = 0;
    let maxCol = 0;
    for (const key of keys) {
        const parsed = parsePosition(key);
        if (!parsed) continue;
        maxRow = Math.max(maxRow, parsed.row);
        maxCol = Math.max(maxCol, parsed.col);
    }
    return {rows: maxRow + 1, cols: maxCol};
}

export function toPosition(row: number, col: number): KeyPosition {
    return `${String.fromCharCode(97 + row)}${col}` as KeyPosition;
}

export function parsePosition(position: string): {row: number; col: number} | undefined {
    const match = /^([a-z])(\d+)$/.exec(position);
    if (!match) return undefined;
    return {row: match[1].charCodeAt(0) - 97, col: parseInt(match[2], 10)};
}
