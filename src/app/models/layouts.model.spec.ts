import {getLayoutDimensions, Layout, parsePosition, toPosition} from './layouts.model';

describe('layouts.model', () => {
    describe('getLayoutDimensions', () => {
        it('defaults to 3x10 for an empty layout', () => {
            expect(getLayoutDimensions({})).toEqual({rows: 3, cols: 10});
        });

        it('derives dimensions from the bounding box of existing positions', () => {
            const layout: Layout = {a1: 'q', a2: 'w', b1: 'a', c3: 'z'};
            expect(getLayoutDimensions(layout)).toEqual({rows: 3, cols: 3});
        });

        it('supports rows beyond c, up to z', () => {
            const layout: Layout = {a1: 'q', z10: 'x'};
            expect(getLayoutDimensions(layout)).toEqual({rows: 26, cols: 10});
        });
    });

    describe('toPosition / parsePosition', () => {
        it('round-trips row/col through a position string', () => {
            expect(toPosition(0, 1)).toBe('a1');
            expect(toPosition(25, 12)).toBe('z12');
            expect(parsePosition('a1')).toEqual({row: 0, col: 1});
            expect(parsePosition('z12')).toEqual({row: 25, col: 12});
        });

        it('returns undefined for a malformed position', () => {
            expect(parsePosition('')).toBeUndefined();
            expect(parsePosition('1a')).toBeUndefined();
            expect(parsePosition('aa1')).toBeUndefined();
        });
    });
});
