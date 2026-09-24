import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { KeyDialogComponent } from './key-dialog.component';

describe('LayoutComponent', () => {
    let component: KeyDialogComponent;
    let fixture: ComponentFixture<KeyDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KeyDialogComponent],
            providers: [
                {provide: DialogRef, useValue: {close: () => {}}},
                {provide: DIALOG_DATA, useValue: {position: 'a1', label: 'q'}},
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(KeyDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
