import {Component, inject, input, output} from '@angular/core';
import {Dialog} from '@angular/cdk/dialog';
import {CustomButtonComponent} from '../custom-button/custom-button.component';
import {StorageService} from '../../../services/storage.service';
import {Variant} from '../../../constants/variants';
import {ConfirmDialogComponent, ConfirmDialogData} from '../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-delete-button',
    imports: [CustomButtonComponent],
    templateUrl: './delete-button.component.html',
})
export class DeleteButtonComponent<T extends Record<string, unknown>> {
    storageService = inject(StorageService);
    dialog = inject(Dialog);

    localStorageKey = input('');
    localStorageValues = input<T>({} as T);
    name = input('');
    variant = input<Variant>('ghostDanger');

    deleted = output<T>();

    protected onDelete(): void {
        const data: ConfirmDialogData = {message: `Delete "${this.name()}"? This can't be undone.`};
        const dialogRef = this.dialog.open<ConfirmDialogData>(ConfirmDialogComponent, {data});
        dialogRef.closed.subscribe(() => {
            if (!data.confirmed) return;
            const {[this.name()]: _, ...rest} = this.localStorageValues();
            this.storageService.setItem(this.localStorageKey(), rest);
            this.deleted.emit(rest as T);
        });
    }
}
