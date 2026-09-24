import {Component, computed, input, model} from '@angular/core';
import type {FormValueControl} from '@angular/forms/signals';

const TOGGLE_ON = 'text-accent border-accent bg-accent/12';
const TOGGLE_OFF = 'text-text/50 border-divider hover:border-text/45';

@Component({
    selector: 'app-toggle-button',
    templateUrl: './toggle-button.component.html',
})
export class ToggleButtonComponent implements FormValueControl<boolean> {
    value = model(false);
    disabled = input(false);

    readonly toggleClass = computed(() => this.value() ? TOGGLE_ON : TOGGLE_OFF);

    toggle() {
        if (this.disabled()) return;
        this.value.set(!this.value());
    }
}
