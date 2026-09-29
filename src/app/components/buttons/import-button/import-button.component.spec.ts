import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportButtonComponent} from './import-button.component';
import {APP_MESSAGES} from '../../../constants/app.constants';

function fileEvent(content: string): Event {
    const file = new File([content], 'export.json', {type: 'application/json'});
    return {target: {files: [file]}} as unknown as Event;
}

describe('ImportButtonComponent', () => {
    let component: ImportButtonComponent<Record<string, unknown>>;
    let fixture: ComponentFixture<ImportButtonComponent<Record<string, unknown>>>;
    let open: ReturnType<typeof vi.spyOn>;
    let imported: unknown[];

    beforeEach(async () => {
        localStorage.clear();
        await TestBed.configureTestingModule({
            imports: [ImportButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ImportButtonComponent);
        component = fixture.componentInstance;
        open = vi.spyOn(component.dialog, 'open').mockReturnValue(undefined as never);
        imported = [];
        component.imported.subscribe((value) => imported.push(value));
        fixture.componentRef.setInput('localStorageKey', 'layouts');
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('rejects a file that is not valid JSON', async () => {
        await component['onImport'](fileEvent('{not json'));
        expect(imported).toEqual([]);
        expect(open).toHaveBeenCalledWith(expect.anything(), {
            data: {message: APP_MESSAGES.invalidFileFormat, variant: 'danger'},
        });
    });

    it('rejects a file with an empty or different kind', async () => {
        await component['onImport'](fileEvent(JSON.stringify({kind: '', data: {a: {}}})));
        await component['onImport'](fileEvent(JSON.stringify({kind: 'keymaps', data: {a: {}}})));
        expect(imported).toEqual([]);
        expect(open).toHaveBeenCalledTimes(2);
        expect(open).toHaveBeenNthCalledWith(1, expect.anything(), {
            data: {message: APP_MESSAGES.invalidFileKind, variant: 'danger'},
        });
        expect(open).toHaveBeenNthCalledWith(2, expect.anything(), {
            data: {message: APP_MESSAGES.invalidFileKind, variant: 'danger'},
        });
    });

    it('emits the data as-is for a single import', async () => {
        const data = {mine: {a1: 'q'}};
        await component['onImport'](fileEvent(JSON.stringify({kind: 'layouts', data})));
        expect(imported).toEqual([data]);
        expect(localStorage.getItem('layouts')).toBeNull();
    });

    it('merges into storage for an all import and keeps existing names', async () => {
        fixture.componentRef.setInput('isAllImport', true);
        fixture.componentRef.setInput('localStorageValues', {kept: {a1: 'old'}});
        await component['onImport'](
            fileEvent(JSON.stringify({kind: 'layouts', data: {kept: {a1: 'new'}, added: {a1: 'x'}}})),
        );
        const expected = {kept: {a1: 'old'}, added: {a1: 'x'}};
        expect(imported).toEqual([expected]);
        expect(JSON.parse(localStorage.getItem('layouts') as string)).toEqual(expected);
    });
});
