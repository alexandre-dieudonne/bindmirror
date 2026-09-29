import {Component, computed, inject} from '@angular/core';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {Router} from '@angular/router';
import {CustomButtonComponent} from '../../buttons/custom-button/custom-button.component';
import {Variant, variantBorderClasses} from '../../../constants/variants';

export type CustomDialogData = {message: string; navigateUrl?: string; variant?: Variant};

@Component({
    selector: 'app-custom-dialog',
    imports: [CustomButtonComponent],
    templateUrl: './custom-dialog.component.html',
})
export class CustomDialogComponent {
    router = inject(Router);
    dialogRef = inject(DialogRef);
    data = inject<CustomDialogData>(DIALOG_DATA);

    variant = computed(() => this.data.variant ?? 'accent');
    dialogClasses = computed(() => variantBorderClasses[this.variant()]);

    ngOnInit() {
        this.dialogRef.closed.subscribe(() => {
            if (!this.data.navigateUrl) return;
            void this.router.navigate([this.data.navigateUrl]);
        });
    }
}
