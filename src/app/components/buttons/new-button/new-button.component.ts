import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CustomButtonComponent} from '../custom-button/custom-button.component';
import {Variant} from '../../../constants/variants';

@Component({
    selector: 'app-new-button',
    imports: [RouterLink, CustomButtonComponent],
    templateUrl: './new-button.component.html',
})
export class NewButtonComponent {
    link = input('');
    variant = input<Variant>('accent');
}
