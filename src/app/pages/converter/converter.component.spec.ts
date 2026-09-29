import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {ConverterComponent} from './converter.component';

describe('LayoutComponent', () => {
    let component: ConverterComponent;
    let fixture: ComponentFixture<ConverterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConverterComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(ConverterComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
