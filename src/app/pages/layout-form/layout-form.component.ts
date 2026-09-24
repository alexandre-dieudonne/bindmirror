import {Component, computed, inject, signal} from '@angular/core';
import {getLayoutDimensions, Layout, Layouts} from '../../models/layouts.model';
import {LayoutComponent} from '../../components/layout/layout.component';
import {EditableTitleComponent} from '../../components/editable-title/editable-title.component';
import {KeymapService} from '../../services/keymap.service';
import {CustomSelectComponent} from '../../components/custom-select/custom-select.component';
import {APP_CONSTANTS, APP_URLS} from '../../constants/app.constants';
import {BackButtonComponent} from '../../components/buttons/back-button/back-button.component';
import {ImportButtonComponent} from '../../components/buttons/import-button/import-button.component';
import {ExportButtonComponent} from '../../components/buttons/export-button/export-button.component';
import {CustomButtonComponent} from '../../components/buttons/custom-button/custom-button.component';
import {TagComponent} from '../../components/tag/tag.component';
import {createEntityForm} from '../../services/entity-form.util';

@Component({
    selector: 'app-layout-form',
    imports: [
        LayoutComponent,
        BackButtonComponent,
        CustomSelectComponent,
        ImportButtonComponent,
        ExportButtonComponent,
        CustomButtonComponent,
        TagComponent,
        EditableTitleComponent
    ],
    templateUrl: './layout-form.component.html',
})
export class LayoutFormComponent {
    keymapService = inject(KeymapService);

    protected readonly APP_CONSTANTS = APP_CONSTANTS;

    private form = createEntityForm<Layout>({
        storageKey: APP_CONSTANTS.layouts,
        listUrl: APP_URLS.myLayouts,
    });

    name = this.form.name;
    isEditMode = this.form.isEditMode;
    currentName = this.form.currentName;

    layoutPresets = signal<Layouts>({});
    layoutNames = computed(() => Object.keys(this.layoutPresets()));
    currentLayout = signal<Layout>({});
    dimensions = computed(() => getLayoutDimensions(this.currentLayout()));
    exportData = computed<Layouts>(() => ({[this.currentName() || 'layout']: this.currentLayout()}));

    ngOnInit() {
        this.form.load();
        if (this.isEditMode()) {
            const layout = this.form.currentEntity();
            if (layout) {
                this.currentLayout.set(layout);
            }
        } else {
            this.keymapService.loadLayoutPresets().subscribe(layouts => {
                this.layoutPresets.set(layouts);
            })
        }
    }

    onCommitPreset(name: string) {
        this.currentLayout.set(this.layoutPresets()[name]);
    }

    onLayoutChange(layout: Layout) {
        this.currentLayout.set(layout);
    }

    protected onImported(data: Layouts) {
        const layout = Object.values(data)[0];
        if (layout) {
            this.currentLayout.set(layout);
        }
    }

    protected onSave() {
        this.form.save(this.currentLayout());
    }
}
