import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {KeymapService} from './keymap.service';
import {Layout} from '../models/layouts.model';
import {Keymap} from '../models/keymap.model';

describe('KeymapService', () => {
    let service: KeymapService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(KeymapService);
    });

    const dims = {rows: 3, cols: 10};

    describe('offset', () => {
        it('shifts a position by column and row', () => {
            expect(service.offset('a1', 1, 0, dims)).toBe('a2');
            expect(service.offset('a1', 0, 1, dims)).toBe('b1');
        });

        it('wraps columns and rows at the grid dimensions', () => {
            expect(service.offset('a10', 1, 0, dims)).toBe('a1');
            expect(service.offset('a1', -1, 0, dims)).toBe('a10');
            expect(service.offset('c1', 0, 1, dims)).toBe('a1');
            expect(service.offset('a1', 0, -1, dims)).toBe('c1');
        });

        it('throws on a malformed position', () => {
            expect(() => service.offset('', 0, 0, dims)).toThrow();
            expect(() => service.offset('1a', 0, 0, dims)).toThrow();
        });
    });

    describe('remapStroke / remapAll', () => {
        const layoutFrom: Layout = {a1: 'q', a2: 'w', b1: 'a', b2: 's'};
        const layoutTo: Layout = {a1: 'w', a2: 'q', b1: 's', b2: 'a'};

        it('remaps a single-character key found in the source grid', () => {
            const remapped = service.remapStroke(layoutFrom, layoutTo, {key: 'q'}, 0, 0);
            expect(remapped.key).toBe('w');
        });

        it('passes through named keys unchanged', () => {
            const remapped = service.remapStroke(layoutFrom, layoutTo, {key: 'Enter'}, 0, 0);
            expect(remapped.key).toBe('Enter');
        });

        it('remaps unlocked strokes and leaves locked entries untouched', () => {
            const keymap: Keymap = {
                copy: {strokes: [{key: 'q'}], locked: false},
                paste: {strokes: [{key: 'a'}], locked: true},
            };
            const result = service.remapAll(layoutFrom, layoutTo, keymap, 0, 0);
            expect(result['copy'].strokes[0].key).toBe('w');
            expect(result['paste'].strokes[0].key).toBe('a');
        });
    });
});
