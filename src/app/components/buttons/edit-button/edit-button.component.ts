import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CustomButtonComponent} from '../custom-button/custom-button.component';
import {Variant} from '../../../constants/variants';

@Component({
    selector: 'app-edit-button',
    imports: [RouterLink, CustomButtonComponent],
    templateUrl: './edit-button.component.html',
})
export class EditButtonComponent {
    link = input('');
    variant = input<Variant>('ghost');
}
