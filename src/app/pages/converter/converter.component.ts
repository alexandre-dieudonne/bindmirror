import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {KeymapService} from '../../services/keymap.service';
import {CustomSelectComponent} from '../../components/custom-select/custom-select.component';
import {getLayoutDimensions, Layouts, Layout,} from '../../models/layouts.model';
import {Keymap, Keymaps, Stroke} from '../../models/keymap.model';
import {CustomButtonComponent} from '../../components/buttons/custom-button/custom-button.component';
import {StorageService} from '../../services/storage.service';
import {APP_CONSTANTS} from '../../constants/app.constants';
import {LayoutComponent} from '../../components/layout/layout.component';
import {ToggleButtonComponent} from '../../components/toggle-button/toggle-button.component';
import {TagComponent} from '../../components/tag/tag.component';
import {CustomInputComponent} from '../../components/custom-input/custom-input.component';

type BindingRow = { action: string; original: Stroke[]; converted?: Stroke[]; locked: boolean };

const PREVIEW_POSITIONS = ['a2', 'b1', 'b2', 'b3'];

@Component({
    selector: 'app-converter',
    templateUrl: './converter.component.html',
    imports: [CustomSelectComponent, CustomButtonComponent, LayoutComponent, ToggleButtonComponent, TagComponent, CustomInputComponent],
})
export class ConverterComponent {
    keymapService = inject(KeymapService);
    storageService = inject(StorageService);

    protected readonly APP_CONSTANTS = APP_CONSTANTS;

    layoutPresets = signal<Layouts>({});
    customLayouts = signal<Layouts>({});

    isCustomLayoutFrom = signal(false);
    isCustomLayoutTo = signal(false);

    layoutNamesFrom = computed(() =>
        this.isCustomLayoutFrom() ? Object.keys(this.customLayouts()) : Object.keys(this.layoutPresets())
    );
    layoutNamesTo = computed(() =>
        this.isCustomLayoutTo() ? Object.keys(this.customLayouts()) : Object.keys(this.layoutPresets())
    );

    layoutFrom = signal<Layout>({});
    layoutTo = signal<Layout>({});
    layoutFromName = signal('');
    layoutToName = signal('');

    diffPositions = computed(() => {
        const from = this.layoutFrom() as Record<string, string>;
        const to = this.layoutTo() as Record<string, string>;
        const positions = new Set([...Object.keys(from), ...Object.keys(to)]);
        return new Set([...positions].filter((pos) => (from[pos] ?? '') !== (to[pos] ?? '')));
    });
    diffCount = computed(() => this.diffPositions().size);

    layoutFromDimensions = computed(() => getLayoutDimensions(this.layoutFrom()));
    layoutFromKeyCount = computed(() => {
        const dims = this.layoutFromDimensions();
        return dims.rows * dims.cols;
    });

    keymaps = signal<Keymaps>({});
    keymap = signal<Keymap>({});
    keymapName = computed(() => Object.keys(this.keymaps()));
    actionCount = computed(() => Object.keys(this.keymap()).length);

    convertedKeymap = signal<Keymap>({});
    hasResult = computed(() => Object.keys(this.convertedKeymap()).length > 0);

    bindingRows = computed<BindingRow[]>(() => {
        const converted = this.convertedKeymap();
        return Object.entries(this.keymap()).map(([action, entry]) => ({
            action,
            original: entry.strokes,
            converted: converted[action]?.strokes,
            locked: entry.locked,
        }));
    });

    remappedCount = computed(() => this.bindingRows().filter((row) => this.isChanged(row)).length);
    untouchedCount = computed(() => this.hasResult() ? this.bindingRows().length - this.remappedCount() : 0);

    json = signal('');
    jsonConverted = signal('');

    horizontalOffset = signal("");
    verticalOffset = signal("");
    horizontalOffsetValue = computed(() => Number(this.horizontalOffset()) || 0);
    verticalOffsetValue = computed(() => Number(this.verticalOffset()) || 0);

    previewPositionsFrom = computed(() => new Set(PREVIEW_POSITIONS));

    previewPositionsTo = computed(() => {
        const dims = this.layoutFromDimensions();
        return new Set(
            PREVIEW_POSITIONS.map((pos) =>
                this.keymapService.offset(pos, this.horizontalOffsetValue(), this.verticalOffsetValue(), dims),
            ),
        );
    });

    ngOnInit() {
        this.keymapService.loadLayoutPresets().subscribe(layouts => {
            this.layoutPresets.set(layouts);
        })

        const layouts = this.storageService.getItem<Layouts>(this.APP_CONSTANTS.layouts);
        if (layouts) {
            this.customLayouts.set(layouts);
        }

        const keymaps = this.storageService.getItem<Keymaps>(this.APP_CONSTANTS.keymaps);
        if (keymaps) {
            this.keymaps.set(keymaps);
        }
    }

    onCommitFrom(name: string) {
        const source = this.isCustomLayoutFrom() ? this.customLayouts() : this.layoutPresets();
        this.layoutFrom.set(source[name] ?? {});
        this.layoutFromName.set(name);
        this.clearResult();
    }

    onCommitTo(name: string) {
        const source = this.isCustomLayoutTo() ? this.customLayouts() : this.layoutPresets();
        this.layoutTo.set(source[name] ?? {});
        this.layoutToName.set(name);
        this.clearResult();
    }

    onCommitKeymap(name: string) {
        this.keymap.set(this.keymaps()[name]);
        this.clearResult();
    }

    onConvert() {
        this.json.set(JSON.stringify(this.keymap(), null, 2));
        const result = this.keymapService.remapAll(
            this.layoutFrom(),
            this.layoutTo(),
            this.keymap(),
            this.horizontalOffsetValue(),
            this.verticalOffsetValue(),
        )
        this.convertedKeymap.set(result);
        this.jsonConverted.set(JSON.stringify(result, null, 2));
    }

    stepOffset(offset: WritableSignal<string>, delta: number) {
        offset.update((v) => String((Number(v) || 0) + delta));
    }

    clearResult() {
        this.convertedKeymap.set({});
        this.json.set('');
        this.jsonConverted.set('');
    }

    chordsOf(strokes: Stroke[] = []): { prefix: string; label: string }[] {
        return strokes.map((stroke, i) => ({prefix: i === 0 ? '' : 'then', label: this.formatStroke(stroke)}));
    }

    isChanged(row: BindingRow): boolean {
        if (!row.converted) return false;
        return this.shortcutText(row.converted) !== this.shortcutText(row.original);
    }

    private formatStroke(stroke: Stroke): string {
        const mods = stroke.modifiers ?? {};
        const modLabels = (['ctrl', 'shift', 'alt', 'meta'] as const)
            .filter((mod) => mods[mod])
            .map((mod) => mod[0].toUpperCase() + mod.slice(1));
        const keyLabel = stroke.key.length === 1 ? stroke.key.toUpperCase() : stroke.key;
        return [...modLabels, keyLabel].join('+');
    }

    private shortcutText(strokes: Stroke[] = []): string {
        return strokes.map((stroke) => this.formatStroke(stroke)).join(' then ');
    }
}
