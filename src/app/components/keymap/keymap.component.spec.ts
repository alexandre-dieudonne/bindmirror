import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KeymapComponent} from './keymap.component';

describe('KeymapComponent', () => {
    let component: KeymapComponent;
    let fixture: ComponentFixture<KeymapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KeymapComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KeymapComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
