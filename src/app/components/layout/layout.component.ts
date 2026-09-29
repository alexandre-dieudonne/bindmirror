import {Component, computed, inject, input, output} from '@angular/core';
import {Dialog} from '@angular/cdk/dialog';
import {getLayoutDimensions, KeyPosition, Layout, parsePosition, toPosition} from '../../models/layouts.model';
import {KeyDialogComponent, KeyDialogData} from '../dialogs/key-dialog/key-dialog.component';
import {CustomButtonComponent} from '../buttons/custom-button/custom-button.component';

type Key = {position: KeyPosition; label: string; highlighted: boolean; secondaryHighlighted: boolean};

@Component({
    selector: 'app-layout',
    imports: [CustomButtonComponent],
    templateUrl: './layout.component.html',
})
export class LayoutComponent {
    dialog = inject(Dialog);

    isDisabled = input<boolean>(false);
    canResize = input<boolean>(false);
    layout = input<Layout>({});
    layoutChange = output<Layout>();
    highlightPositions = input<ReadonlySet<string>>(new Set());
    secondaryHighlightPositions = input<ReadonlySet<string>>(new Set());

    dimensions = computed(() => getLayoutDimensions(this.layout()));

    rows = computed<Key[][]>(() => {
        const layout = this.layout();
        const highlight = this.highlightPositions();
        const secondaryHighlight = this.secondaryHighlightPositions();
        const {rows, cols} = this.dimensions();
        return Array.from({length: rows}, (_, r) =>
            Array.from({length: cols}, (_, i) => {
                const position = toPosition(r, i + 1);
                return {
                    position,
                    label: layout[position] ?? '',
                    highlighted: highlight.has(position),
                    secondaryHighlighted: secondaryHighlight.has(position),
                };
            }),
        );
    });

    onKeyClickOpenDialog(key: Key) {
        const dialogRef = this.dialog.open<KeyDialogData>(KeyDialogComponent, {data: key});
        dialogRef.closed.subscribe(() => {
            const layout: Layout = {};
            for (const row of this.rows()) {
                for (const k of row) {
                    layout[k.position] = k.position === key.position ? key.label : k.label;
                }
            }
            this.layoutChange.emit(layout);
        });
    }

    addRow() {
        const {rows, cols} = this.dimensions();
        if (rows >= 26) return;
        const additions = Object.fromEntries(
            Array.from({length: cols}, (_, i) => [toPosition(rows, i + 1), '']),
        ) as Layout;
        this.layoutChange.emit({...this.layout(), ...additions});
    }

    removeRow() {
        const {rows} = this.dimensions();
        if (rows <= 1) return;
        const layout = Object.fromEntries(
            Object.entries(this.layout()).filter(([position]) => parsePosition(position)?.row !== rows - 1),
        ) as Layout;
        this.layoutChange.emit(layout);
    }

    addColumn() {
        const {rows, cols} = this.dimensions();
        if (cols >= 26) return;
        const newCol = cols + 1;
        const additions = Object.fromEntries(
            Array.from({length: rows}, (_, r) => [toPosition(r, newCol), '']),
        ) as Layout;
        this.layoutChange.emit({...this.layout(), ...additions});
    }

    removeColumn() {
        const {cols} = this.dimensions();
        if (cols <= 1) return;
        const layout = Object.fromEntries(
            Object.entries(this.layout()).filter(([position]) => parsePosition(position)?.col !== cols),
        ) as Layout;
        this.layoutChange.emit(layout);
    }
}
