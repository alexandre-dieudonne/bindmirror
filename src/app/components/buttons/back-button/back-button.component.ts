import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CustomButtonComponent} from '../custom-button/custom-button.component';

@Component({
    selector: 'app-back-button',
    imports: [RouterLink, CustomButtonComponent],
    templateUrl: './back-button.component.html',
})
export class BackButtonComponent {
    backUrl = input('');
}
