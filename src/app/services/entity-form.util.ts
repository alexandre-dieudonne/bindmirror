import {computed, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {Dialog} from '@angular/cdk/dialog';
import {StorageService} from './storage.service';
import {APP_MESSAGES} from '../constants/app.constants';
import {CustomDialogComponent} from '../components/dialogs/custom-dialog/custom-dialog.component';

export type EntityFormOptions = {
    storageKey: string;
    listUrl: string;
};

export function createEntityForm<T>(options: EntityFormOptions) {
    const dialog = inject(Dialog);
    const storageService = inject(StorageService);
    const route = inject(ActivatedRoute);

    const name = toSignal(route.paramMap.pipe(map(p => p.get('name') ?? '')), {initialValue: ''});
    const isEditMode = computed(() => !!name());
    const oldName = signal(name());
    const currentName = signal(name());
    const entities = signal<Record<string, T>>({});

    function load(): Record<string, T> {
        const items = storageService.getItem<Record<string, T>>(options.storageKey) ?? {};
        entities.set(items);
        return items;
    }

    function currentEntity(): T | undefined {
        return entities()[name()];
    }

    function notify(message: string, variant?: 'danger'): void {
        dialog.open(CustomDialogComponent, {data: {message, variant}});
    }

    function save(value: T): void {
        if (!currentName()) {
            notify(APP_MESSAGES.titleNotSpecified, 'danger');
            return;
        }

        const otherEntities = Object.fromEntries(
            Object.entries(entities()).filter(([n]) => n !== oldName()),
        );

        if (Object.keys(otherEntities).includes(currentName())) {
            notify(APP_MESSAGES.nameAlreadyUsed, 'danger');
            return;
        }

        const updated = {...otherEntities, [currentName()]: value};
        entities.set(updated);
        storageService.setItem(options.storageKey, updated);
        dialog.open(CustomDialogComponent, {
            data: {message: APP_MESSAGES.saveSuccess, navigateUrl: options.listUrl},
        });
    }

    return {name, isEditMode, currentName, entities, load, currentEntity, save};
}
