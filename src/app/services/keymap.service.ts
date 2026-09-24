import {HttpClient} from '@angular/common/http';
import {inject, Service} from '@angular/core';
import {getLayoutDimensions, KeyPosition, Layout, Layouts, parsePosition, toPosition} from '../models/layouts.model';
import {Keymap, Stroke} from '../models/keymap.model';

@Service()
export class KeymapService {
    http = inject(HttpClient);

    loadLayoutPresets() {
        return this.http.get<Layouts>(`/assets/layout-presets.json`);
    }

    offset(pos: string, colOffset: number, rowOffset: number, dims: { rows: number; cols: number }): KeyPosition {
        const parsed = parsePosition(pos);
        if (!parsed) {
            throw new Error(`Invalid key position: "${pos}"`);
        }
        const newCol = (((parsed.col - 1 + colOffset) % dims.cols) + dims.cols) % dims.cols + 1;
        const newRow = ((parsed.row + rowOffset) % dims.rows + dims.rows) % dims.rows;
        return toPosition(newRow, newCol);
    }

    remap(layoutFrom: Layout,
          layoutTo: Layout,
          keybind: string,
          colOffset: number,
          rowOffset: number
    ): string | undefined {
        const position = Object.entries(layoutFrom).find(([, v]) => v === keybind)?.[0];
        if (!position) return undefined;
        const dims = getLayoutDimensions(layoutFrom);
        return layoutTo[this.offset(position, colOffset, rowOffset, dims)];
    }

    remapStroke(layoutFrom: Layout, layoutTo: Layout, stroke: Stroke, colOffset: number, rowOffset: number): Stroke {
        const isGridLetter = stroke.key.length === 1 && Object.values(layoutFrom).includes(stroke.key);
        if (!isGridLetter) return stroke;
        const remappedKey = this.remap(layoutFrom, layoutTo, stroke.key, colOffset, rowOffset);
        return remappedKey ? {...stroke, key: remappedKey} : stroke;
    }

    remapAll(
        layoutFrom: Layout,
        layoutTo: Layout,
        keymap: Keymap,
        colOffset: number,
        rowOffset: number
    ): Keymap {
        return Object.fromEntries(
            Object.entries(keymap).map(([action, entry]) => [
                action,
                entry.locked
                    ? entry
                    : {...entry, strokes: entry.strokes.map((stroke) => this.remapStroke(layoutFrom, layoutTo, stroke, colOffset, rowOffset))},
            ])
        );
    }
}
