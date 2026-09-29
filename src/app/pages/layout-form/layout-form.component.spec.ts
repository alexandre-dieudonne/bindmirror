import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {LayoutFormComponent} from './layout-form.component';

describe('EditLayoutComponent', () => {
    let component: LayoutFormComponent;
    let fixture: ComponentFixture<LayoutFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LayoutFormComponent],
            providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(LayoutFormComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('exports the current layout keyed by its name', () => {
        component.currentName.set('mine');
        component.currentLayout.set({a1: 'q'});
        expect(component.exportData()).toEqual({mine: {a1: 'q'}});
    });

    it('imports the first layout of an exported file', () => {
        component['onImported']({mine: {a1: 'q', a2: 'w'}});
        expect(component.currentLayout()).toEqual({a1: 'q', a2: 'w'});
    });

    it('ignores an import that holds no layout', () => {
        component.currentLayout.set({a1: 'q'});
        component['onImported']({});
        expect(component.currentLayout()).toEqual({a1: 'q'});
    });
});
