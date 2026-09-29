import {isRecord} from './import-export-files';

export type Modifiers = {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
};

export type Stroke = {
    key: string;
    modifiers?: Modifiers;
};

export type Shortcut = {
    action: string;
    strokes: Stroke[];
    locked: boolean;
};

export type KeymapEntry = {
    strokes: Stroke[];
    locked: boolean;
};

export type Keymap = Record<string, KeymapEntry>;
export type Keymaps = Record<string, Keymap>;

function isStroke(value: unknown): boolean {
    return (
        isRecord(value) &&
        typeof value['key'] === 'string' &&
        (value['modifiers'] === undefined ||
            (isRecord(value['modifiers']) &&
                Object.values(value['modifiers']).every((modifier) => typeof modifier === 'boolean')))
    );
}

export function isKeymaps(value: unknown): value is Keymaps {
    return (
        isRecord(value) &&
        Object.values(value).every(
            (keymap) =>
                isRecord(keymap) &&
                Object.values(keymap).every(
                    (entry) =>
                        isRecord(entry) &&
                        Array.isArray(entry['strokes']) &&
                        entry['strokes'].every(isStroke) &&
                        typeof entry['locked'] === 'boolean',
                ),
        )
    );
}
