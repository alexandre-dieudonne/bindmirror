import {Component, input, model} from '@angular/core';
import type {FormValueControl} from '@angular/forms/signals';

@Component({
    selector: 'app-custom-input',
    imports: [],
    host: {class: 'block w-full font-body'},
    templateUrl: './custom-input.component.html',
})
export class CustomInputComponent implements FormValueControl<string> {
    value = model('');
    type = input<'text' | 'number'>('text');
    placeholder = input('Placeholder');
    disabled = input(false);
}
