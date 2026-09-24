import {Component, computed, input, output} from '@angular/core';
import {DeleteButtonComponent} from '../buttons/delete-button/delete-button.component';
import {EditButtonComponent} from '../buttons/edit-button/edit-button.component';
import {ExportButtonComponent} from '../buttons/export-button/export-button.component';
import {ImportButtonComponent} from '../buttons/import-button/import-button.component';
import {NewButtonComponent} from '../buttons/new-button/new-button.component';

@Component({
    selector: 'app-crud-list',
    imports: [
        DeleteButtonComponent,
        EditButtonComponent,
        ExportButtonComponent,
        ImportButtonComponent,
        NewButtonComponent
    ],
    templateUrl: './crud-list.component.html',
})
export class CrudListComponent<T extends Record<string, unknown>> {
    title = input.required<string>();
    itemLabel = input('items');
    newLink = input.required<string>();
    localStorageKey = input.required<string>();
    items = input.required<Record<string, T>>();
    itemMeta = input<(value: T) => string>(() => '');

    itemsChange = output<Record<string, T>>();

    rows = computed(() => Object.entries(this.items()).sort(([a], [b]) => a.localeCompare(b)));
    subtitle = computed(() => `${this.rows().length} ${this.itemLabel()}`);

    single(name: string, item: T): Record<string, T> {
        return {[name]: item};
    }
}
