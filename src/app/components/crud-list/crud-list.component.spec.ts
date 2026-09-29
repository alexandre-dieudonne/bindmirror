import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {CrudListComponent} from './crud-list.component';

describe('CrudListComponent', () => {
    let component: CrudListComponent<Record<string, unknown>>;
    let fixture: ComponentFixture<CrudListComponent<Record<string, unknown>>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CrudListComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(CrudListComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('title', 'Test list');
        fixture.componentRef.setInput('newLink', 'new-item');
        fixture.componentRef.setInput('localStorageKey', 'test-items');
        fixture.componentRef.setInput('items', {});
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
