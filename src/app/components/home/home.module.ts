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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductCardCatalogueComponent } from './product-card-catalogue/product-card-catalogue.component';
import { NgxPopper } from 'angular-popper';
import { OrdersComponent } from './orders.component';
import { MachineCardComponent } from './board-machine-card/machine-card.component';
import { ProspectiveCardComponent } from './prospective-card/prospective-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyAccountComponent } from './my-account/my-account.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SwitchButtonComponent } from './switch-button/switch-button.component';
import { SearchProductsComponent } from './search-products/search-products.component';
import { FooterComponent } from './footer/footer.component';

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
        NgxPopper,
        FontAwesomeModule,
        MatAutocompleteModule,
        ModalModule.forRoot()
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
        OrdersComponent,
        MachineCardComponent,
        ProspectiveCardComponent,
        MyAccountComponent,
        SwitchButtonComponent,
        SearchProductsComponent,
        FooterComponent
    ]
})
export class HomeModule { }