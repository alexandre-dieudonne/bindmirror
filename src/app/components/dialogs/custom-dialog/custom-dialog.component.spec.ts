import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {Subject} from 'rxjs';

import {CustomDialogComponent} from './custom-dialog.component';

describe('CustomDialogComponent', () => {
    let component: CustomDialogComponent;
    let fixture: ComponentFixture<CustomDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomDialogComponent],
            providers: [
                provideRouter([]),
                {provide: DialogRef, useValue: {closed: new Subject()}},
                {provide: DIALOG_DATA, useValue: {message: 'Test message'}},
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
