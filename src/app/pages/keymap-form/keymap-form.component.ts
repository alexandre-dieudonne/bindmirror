import {Component, computed, signal} from '@angular/core';
import {ToggleButtonComponent} from '../../components/toggle-button/toggle-button.component';
import {Shortcut, Keymap, Keymaps} from '../../models/keymap.model';
import {APP_CONSTANTS, APP_URLS} from '../../constants/app.constants';
import {BackButtonComponent} from '../../components/buttons/back-button/back-button.component';
import {ExportButtonComponent} from '../../components/buttons/export-button/export-button.component';
import {ImportButtonComponent} from '../../components/buttons/import-button/import-button.component';
import {CustomButtonComponent} from '../../components/buttons/custom-button/custom-button.component';
import {KeymapComponent} from '../../components/keymap/keymap.component';
import {EditableTitleComponent} from '../../components/editable-title/editable-title.component';
import {createEntityForm} from '../../services/entity-form.util';

@Component({
    selector: 'app-keymap-form',
    imports: [
        BackButtonComponent,
        ExportButtonComponent,
        ImportButtonComponent,
        CustomButtonComponent,
        ToggleButtonComponent,
        KeymapComponent,
        EditableTitleComponent,
    ],
    templateUrl: './keymap-form.component.html',
})
export class KeymapFormComponent {
    protected readonly APP_CONSTANTS = APP_CONSTANTS;

    private form = createEntityForm<Keymap>({
        storageKey: APP_CONSTANTS.keymaps,
        listUrl: APP_URLS.myKeymaps,
    });

    name = this.form.name;
    isEditMode = this.form.isEditMode;
    currentName = this.form.currentName;

    currentKeymap = signal<{rows: Shortcut[]}>({
        rows: [{action: '', strokes: [{key: ''}], locked: false}],
    });
    multi = signal(false);
    keymap = computed<Keymap>(() =>
        Object.fromEntries(
            this.currentKeymap().rows.map((row) => [row.action, {strokes: row.strokes, locked: row.locked}]),
        ),
    );
    exportData = computed<Keymaps>(() => ({[this.currentName() || 'keymap']: this.keymap()}));

    ngOnInit() {
        this.form.load();
        if (this.isEditMode()) {
            const keymap = this.form.currentEntity();
            if (keymap) {
                const rows = Object.entries(keymap).map(([action, entry]) => ({
                    action,
                    strokes: entry.strokes,
                    locked: entry.locked,
                }));
                this.currentKeymap.set({rows});
            }
        }
    }

    protected onImported(data: Keymaps) {
        const keymap = Object.values(data)[0];
        if (!keymap) return;
        const rows: Shortcut[] = Object.entries(keymap).map(([action, entry]) => ({
            action,
            strokes: entry.strokes,
            locked: entry.locked,
        }));
        this.currentKeymap.set({rows});
    }

    protected onSave() {
        this.form.save(this.keymap());
    }
}
