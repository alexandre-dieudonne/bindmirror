import {Component, computed, input, model} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import type {FormValueControl} from '@angular/forms/signals';
import {Modifiers, Stroke} from '../../models/keymap.model';
import {CustomButtonComponent} from '../buttons/custom-button/custom-button.component';
import {CustomSelectComponent} from '../custom-select/custom-select.component';
import {ToggleButtonComponent} from '../toggle-button/toggle-button.component';
import {KEY_OPTIONS} from '../../constants/key-options.constants';

@Component({
    selector: 'app-shortcut-input',
    imports: [CustomButtonComponent, CustomSelectComponent, ToggleButtonComponent, NgTemplateOutlet],
    host: {class: 'block w-full'},
    templateUrl: './shortcut-input.component.html',
})
export class ShortcutInputComponent implements FormValueControl<Stroke[]> {
    value = model<Stroke[]>([]);
    disabled = input(false);
    forceMulti = input<boolean>(false);

    readonly keyOptions = KEY_OPTIONS;

    readonly modifierList: {key: keyof Modifiers; label: string}[] = [
        {key: 'ctrl', label: 'Ctrl'},
        {key: 'shift', label: 'Shift'},
        {key: 'alt', label: 'Alt'},
        {key: 'meta', label: 'Meta'},
    ];

    readonly isMulti = computed(() => this.forceMulti() || this.value().length > 1);

    addStroke() {
        if (this.disabled()) return;
        this.value.update((strokes) => [...strokes, {key: ''}]);
    }

    removeStroke(index: number) {
        this.value.update((strokes) => strokes.filter((_, i) => i !== index));
    }

    selectKey(index: number, key: string) {
        this.value.update((strokes) => {
            const next = [...strokes];
            while (next.length <= index) next.push({key: ''});
            next[index] = {...next[index], key};
            return next;
        });
    }

    toggleModifier(index: number, mod: keyof Modifiers, checked: boolean) {
        this.value.update((strokes) => {
            const next = [...strokes];
            while (next.length <= index) next.push({key: ''});
            const modifiers = {...next[index].modifiers, [mod]: checked ? true : undefined};
            const cleaned = Object.fromEntries(Object.entries(modifiers).filter(([, v]) => v)) as Modifiers;
            next[index] = {...next[index], modifiers: Object.keys(cleaned).length ? cleaned : undefined};
            return next;
        });
    }
}
