import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {CrudListComponent} from '../../components/crud-list/crud-list.component';

export type MyItemsRouteData<T extends Record<string, unknown>> = {
    title: string;
    itemLabel: string;
    newLink: string;
    localStorageKey: string;
    itemMeta: (item: T) => string;
};

@Component({
    selector: 'app-my-items',
    imports: [CrudListComponent],
    templateUrl: './my-items.component.html',
})
export class MyItemsComponent<T extends Record<string, unknown>> {
    private storageService = inject(StorageService);
    private route = inject(ActivatedRoute);

    protected config = this.route.snapshot.data as MyItemsRouteData<T>;

    items = signal<Record<string, T>>({});

    ngOnInit() {
        const items = this.storageService.getItem<Record<string, T>>(this.config.localStorageKey);
        if (items) {
            this.items.set(items);
        }
    }
}
