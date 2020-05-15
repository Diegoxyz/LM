import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { LayoutComponent } from './layout.component';
import { CatalogueComponent } from './catalogue.component';
import { BoardsComponent } from './boards.component';
import { OrdersComponent } from './orders.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: MainComponent },
            { path: 'home', component: MainComponent },
            { path: 'catalogue/:groupId', component: CatalogueComponent },
            { path: 'catalogue', component: CatalogueComponent },
            { path: 'boards/:machineId', component: BoardsComponent },
            { path: 'boards', component: BoardsComponent },
            { path: 'orders', component: OrdersComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }