import {Component, computed, inject} from '@angular/core';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {CustomButtonComponent} from '../../buttons/custom-button/custom-button.component';
import {Variant, variantBorderClasses} from '../../../constants/variants';

export type ConfirmDialogData = { message: string; confirmLabel?: string; variant?: Variant; confirmed?: boolean };

@Component({
    selector: 'app-confirm-dialog',
    imports: [CustomButtonComponent],
    templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
    dialogRef = inject(DialogRef);
    data = inject<ConfirmDialogData>(DIALOG_DATA);

    variant = computed(() => this.data.variant ?? 'danger');
    dialogClasses = computed(() => variantBorderClasses[this.variant()]);

    onConfirm(): void {
        this.data.confirmed = true;
        this.dialogRef.close();
    }
}
