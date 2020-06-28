import { NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MainComponent } from './main.component';
import { LayoutComponent } from './layout.component';
import { CatalogueComponent } from './catalogue.component';
import { BoardsComponent } from './boards.component';
import { OrdersComponent } from './orders.component';
import { ProspectiveCardComponent } from './prospective-card/prospective-card.component';
import { CartComponent } from './cart.component';
import { BoardsSectionsComponent } from './boards-sections.component';
import { Observable, NEVER } from 'rxjs';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: BoardsComponent },
            { path: 'home', component: BoardsComponent },
            { path: 'catalogue/:groupId', component: CatalogueComponent },
            { path: 'catalogue', component: CatalogueComponent },
           /* { path: 'boards/:machineId', component: BoardsComponent }, */
            { path: 'prospective', component: ProspectiveCardComponent },
            { path: 'boards', component: BoardsComponent},
            { path: 'sections/:machineId', component: BoardsSectionsComponent},
            { path: 'orders', component: OrdersComponent },
            { path: 'cart', component: CartComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }