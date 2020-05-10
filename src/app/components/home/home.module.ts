import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { HomeRoutingModule } from './home-routing.module';
import { BarComponent } from './bar/bar.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductCardComponent } from './product-card/product-card.component';
import { CatalogueComponent } from './catalogue.component';
import {NgbModule, NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import { BoardsComponent } from './boards.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductCardCatalogueComponent } from './product-card-catalogue/product-card-catalogue.component';
import { NgxPopper } from 'angular-popper';
import { OrdersComponent } from './orders.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HomeRoutingModule,
        RouterModule,
        NgbModule,
        NgxPaginationModule,
        NgbDropdownModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        NgxPopper
    ],
    declarations: [
        MainComponent,
        BarComponent,
        MenuComponent,
        LayoutComponent,
        ProductCardComponent,
        CatalogueComponent,
        BoardsComponent,
        ProductCardCatalogueComponent,
        OrdersComponent
    ]
})
export class HomeModule { }