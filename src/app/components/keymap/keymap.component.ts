import {Component, input, model} from '@angular/core';
import {disabled, FormField, form} from '@angular/forms/signals';
import {CustomInputComponent} from '../custom-input/custom-input.component';
import {CustomButtonComponent} from '../buttons/custom-button/custom-button.component';
import {ShortcutInputComponent} from '../shortcut-input/shortcut-input.component';
import {ToggleButtonComponent} from '../toggle-button/toggle-button.component';
import {Shortcut} from '../../models/keymap.model';

@Component({
    selector: 'app-keymap',
    imports: [FormField, CustomInputComponent, CustomButtonComponent, ShortcutInputComponent, ToggleButtonComponent],
    templateUrl: './keymap.component.html',
    styleUrl: './keymap.component.css',
})
export class KeymapComponent {
    isDisabled = input<boolean>(false);
    multi = input<boolean>(false);
    keymap = model<{ rows: Shortcut[] }>({
        rows: [
            {action: '', strokes: [{key: ''}], locked: false},
        ],
    });

    form = form(this.keymap, (p) => {
        disabled(p.rows, {when: () => this.isDisabled()});
    });

    addRow() {
        this.keymap.update((m) => ({rows: [...m.rows, {action: '', strokes: [{key: ''}], locked: false}]}));
    }

    removeRow(index: number) {
        this.keymap.update((m) => ({rows: m.rows.filter((_, i) => i !== index)}));
    }

    moveRow(index: number, direction: -1 | 1) {
        this.keymap.update((m) => {
            const target = index + direction;
            if (target < 0 || target >= m.rows.length) return m;
            const rows = [...m.rows];
            [rows[index], rows[target]] = [rows[target], rows[index]];
            return {rows};
        });
    }
}
