import {Component, ElementRef, model, signal, viewChild} from '@angular/core';
import type {FormValueControl} from '@angular/forms/signals';

@Component({
    selector: 'app-editable-title',
    templateUrl: './editable-title.component.html',
})
export class EditableTitleComponent implements FormValueControl<string> {
    value = model('');
    isEditing = signal(false);
    input = viewChild<ElementRef<HTMLInputElement>>('input');

    edit() {
        this.isEditing.set(true);
        setTimeout(() => this.input()?.nativeElement.focus());
    }

    stopEdit() {
        this.isEditing.set(false);
    }
}
