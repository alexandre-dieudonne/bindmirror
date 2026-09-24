import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Dialog} from '@angular/cdk/dialog';
import {CustomDialogComponent} from '../dialogs/custom-dialog/custom-dialog.component';

@Component({
    selector: 'app-navbar',
    imports: [
        RouterLink
    ],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {}
