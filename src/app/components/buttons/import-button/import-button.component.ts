import {booleanAttribute, Component, inject, input, output} from '@angular/core';

import {Dialog} from '@angular/cdk/dialog';

import {CustomButtonComponent} from '../custom-button/custom-button.component';
import {APP_MESSAGES} from '../../../constants/app.constants';
import {StorageService} from '../../../services/storage.service';
import {FileTransferService} from '../../../services/file-transfer.service';
import {CustomDialogComponent} from '../../dialogs/custom-dialog/custom-dialog.component';
import {Variant} from '../../../constants/variants';

@Component({
    selector: 'app-import-button',
    imports: [CustomButtonComponent],
    templateUrl: './import-button.component.html',
})
export class ImportButtonComponent<T extends Record<string, unknown>> {
    protected readonly APP_MESSAGES = APP_MESSAGES;
    dialog = inject(Dialog);
    storageService = inject(StorageService);
    private fileTransferService = inject(FileTransferService);
    imported = output<T>();
    isAllImport = input(false, {transform: booleanAttribute});
    localStorageKey = input("");
    localStorageValues = input<T>({} as T);
    variant = input<Variant>('neutral');

    protected async onImport(event: Event): Promise<void> {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (!file) return;

        let result;
        try {
            result = await this.fileTransferService.readFile<T>(file);
        } catch {
            this.dialog.open(CustomDialogComponent, {
                data: {
                    message: APP_MESSAGES.invalidFileFormat,
                    variant: 'danger'
                },
            })
            return;
        }

        if (result.kind !== this.localStorageKey()) {
            this.dialog.open(CustomDialogComponent, {
                data: {
                    message: APP_MESSAGES.invalidFileKind,
                    variant: 'danger'
                },
            })
            return;
        }

        const data = result.data;
        if (this.isAllImport()) {
            const existingKeys = Object.keys(this.localStorageValues());
            const newObj = Object.fromEntries(
                Object.entries(data).filter(([key]) => !existingKeys.includes(key))
            ) as T;
            const merged = {...this.localStorageValues(), ...newObj};
            this.storageService.setItem(this.localStorageKey(), merged);
            this.imported.emit(merged);
        } else {
            this.imported.emit(data);
        }
        this.dialog.open(CustomDialogComponent, {
            data: {
                message: APP_MESSAGES.fileImportSuccess
            },
        })
    }
}
