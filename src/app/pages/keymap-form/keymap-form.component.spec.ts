import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {KeymapFormComponent} from './keymap-form.component';

describe('EditKeymapComponent', () => {
    let component: KeymapFormComponent;
    let fixture: ComponentFixture<KeymapFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KeymapFormComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(KeymapFormComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('exports the keymap as a named record, not as editor rows', () => {
        component.currentName.set('mine');
        component.currentKeymap.set({
            rows: [{action: 'jump', strokes: [{key: 'space'}], locked: true}],
        });
        expect(component.exportData()).toEqual({
            mine: {jump: {strokes: [{key: 'space'}], locked: true}},
        });
    });

    it('re-imports what it exports', () => {
        component.currentName.set('mine');
        component.currentKeymap.set({
            rows: [{action: 'jump', strokes: [{key: 'space'}], locked: true}],
        });
        const exported = component.exportData();
        component.currentKeymap.set({rows: [{action: '', strokes: [{key: ''}], locked: false}]});
        component['onImported'](exported);
        expect(component.currentKeymap().rows).toEqual([{action: 'jump', strokes: [{key: 'space'}], locked: true}]);
    });

    it('ignores an import that holds no keymap', () => {
        const before = component.currentKeymap();
        component['onImported']({});
        expect(component.currentKeymap()).toBe(before);
    });
});
