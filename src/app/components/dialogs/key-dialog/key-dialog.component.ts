import {Component, ElementRef, afterNextRender, inject, viewChild} from '@angular/core';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {CustomButtonComponent} from '../../buttons/custom-button/custom-button.component';

export type KeyDialogData = {position: string; label: string};

@Component({
    selector: 'app-key-dialog',
    imports: [CustomButtonComponent],
    templateUrl: './key-dialog.component.html',
})
export class KeyDialogComponent {
    dialogRef = inject(DialogRef);
    data = inject<KeyDialogData>(DIALOG_DATA);
    labelEl = viewChild<ElementRef<HTMLElement>>('labelEl');

    constructor() {
        afterNextRender(() => this.labelEl()?.nativeElement.focus());
    }

    onKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.data.label = event.key;
    }

    onUnbind() {
        this.data.label = '';
        this.dialogRef.close();
    }
}
