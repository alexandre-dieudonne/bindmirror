import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportButtonComponent} from './export-button.component';
import {FileTransferService} from '../../../services/file-transfer.service';

describe('ExportButtonComponent', () => {
    let component: ExportButtonComponent<Record<string, unknown>>;
    let fixture: ComponentFixture<ExportButtonComponent<Record<string, unknown>>>;
    let exportFile: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        exportFile = vi.fn();
        await TestBed.configureTestingModule({
            imports: [ExportButtonComponent],
            providers: [{provide: FileTransferService, useValue: {exportFile}}],
        }).compileComponents();

        fixture = TestBed.createComponent(ExportButtonComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('exports a single item under its name with the given kind', () => {
        fixture.componentRef.setInput('localStorageKey', 'layouts');
        fixture.componentRef.setInput('localStorageValues', {mine: {a1: 'q'}});
        fixture.componentRef.setInput('name', 'mine');
        component['onExport']();
        expect(exportFile).toHaveBeenCalledWith('layouts', {mine: {a1: 'q'}}, 'mine');
    });

    it('exports everything under the storage key when isAllExport is set', () => {
        fixture.componentRef.setInput('localStorageKey', 'keymaps');
        fixture.componentRef.setInput('localStorageValues', {one: {}, two: {}});
        fixture.componentRef.setInput('isAllExport', true);
        component['onExport']();
        expect(exportFile).toHaveBeenCalledWith('keymaps', {one: {}, two: {}}, 'keymaps');
    });
});
