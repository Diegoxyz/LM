import { NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { CatalogueComponent } from './catalogue.component';
import { BoardsComponent } from './boards.component';
import { OrdersComponent } from './orders.component';
import { ProspectiveCardComponent } from './prospective-card/prospective-card.component';
import { CartComponent } from './cart.component';
import { ShipToSetComponent } from './ship-to-set/ship-to-set.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { SaveOrderComponent } from './save-order/save-order.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: BoardsComponent },
            { path: 'home', component: BoardsComponent },
            { path: 'catalogue/:groupId', component: CatalogueComponent },
            { path: 'catalogue', component: CatalogueComponent },
            { path: 'catalogue_last_purchases', component: CatalogueComponent },
           /* { path: 'boards/:machineId', component: BoardsComponent }, */
            { path: 'prospective', component: ProspectiveCardComponent },
            { path: 'boards', component: BoardsComponent},
            { path: 'orders', component: OrdersComponent },
            { path: 'cart', component: CartComponent },
            { path: 'cart/ship-to-set', component: ShipToSetComponent },
            { path: 'cart/confirm-order', component: ConfirmOrderComponent },
            { path: 'cart/save-order', component: SaveOrderComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }