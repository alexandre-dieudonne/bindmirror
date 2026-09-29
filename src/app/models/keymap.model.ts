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
