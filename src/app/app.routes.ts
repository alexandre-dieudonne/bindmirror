import {Routes} from '@angular/router';
import {ConverterComponent} from './pages/converter/converter.component';
import {MyItemsComponent, MyItemsRouteData} from './pages/my-items/my-items.component';
import {LayoutFormComponent} from './pages/layout-form/layout-form.component';
import {KeymapFormComponent} from './pages/keymap-form/keymap-form.component';
import {APP_CONSTANTS} from './constants/app.constants';
import {Layout} from './models/layouts.model';
import {Keymap} from './models/keymap.model';

const myLayoutsRouteData: MyItemsRouteData<Layout> = {
    title: 'My Layouts',
    itemLabel: 'custom layouts',
    newLink: 'new-layout',
    localStorageKey: APP_CONSTANTS.layouts,
    itemMeta: (layout) => `${Object.values(layout).filter(Boolean).length} keys`,
};

const myKeymapsRouteData: MyItemsRouteData<Keymap> = {
    title: 'My Keymaps',
    itemLabel: 'saved keymaps',
    newLink: 'new-keymap',
    localStorageKey: APP_CONSTANTS.keymaps,
    itemMeta: (keymap) => `${Object.keys(keymap).length} actions`,
};

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'convert',
        pathMatch: 'full',
    },
    {
        path: 'convert',
        component: ConverterComponent,
    },
    {
        path: 'my-layouts',
        component: MyItemsComponent,
        data: myLayoutsRouteData,
    },
    {
        path: 'my-layouts/new-layout',
        component: LayoutFormComponent,
    },
    {
        path: 'my-layouts/:name',
        component: LayoutFormComponent,
    },
    {
        path: 'my-keymaps',
        component: MyItemsComponent,
        data: myKeymapsRouteData,
    },
    {
        path: 'my-keymaps/new-keymap',
        component: KeymapFormComponent,
    },
    {
        path: 'my-keymaps/:name',
        component: KeymapFormComponent,
    },
    {
        path: '**',
        redirectTo: 'convert',
    },
];
