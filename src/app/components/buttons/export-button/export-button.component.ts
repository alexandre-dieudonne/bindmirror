import {booleanAttribute, Component, inject, input, output} from '@angular/core';
import {CustomButtonComponent} from '../custom-button/custom-button.component';
import {Variant} from '../../../constants/variants';
import {FileTransferService} from '../../../services/file-transfer.service';

@Component({
    selector: 'app-export-button',
    imports: [CustomButtonComponent],
    templateUrl: './export-button.component.html',
})
export class ExportButtonComponent<T extends Record<string, unknown>> {
    private fileTransferService = inject(FileTransferService);

    isAllExport = input(false, {transform: booleanAttribute});
    localStorageKey = input('');
    localStorageValues = input<T>({} as T);
    name = input<string>('');
    variant = input<Variant>('neutral');

    exported = output();

    protected onExport(): void {
        const filename = this.isAllExport() ? this.localStorageKey() : this.name();
        this.fileTransferService.exportFile(this.localStorageKey(), this.localStorageValues(), filename);
        this.exported.emit();
    }
}
