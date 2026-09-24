import {Component, computed, input} from '@angular/core';
import {Variant, variantButtonClasses} from '../../../constants/variants';

@Component({
    selector: 'app-custom-button',
    imports: [],
    templateUrl: './custom-button.component.html',
})
export class CustomButtonComponent {
    type = input<'button' | 'submit'>('button');
    variant = input<Variant>('accent');
    buttonClasses = computed(() => `${variantButtonClasses[this.variant()]}`);
}
