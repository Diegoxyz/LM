import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
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
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
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
import { OrderProductComponent } from './order-product/order-product.component';
import { SearchOrdersComponent } from './search-orders/search-orders.component';
import { CartOrderComponent } from './cart-order/cart-order.component';
import { CartComponent } from './cart.component';
import { SearchMachinesComponent } from './search-machines/search-machines.component';
import { SectionCardComponent } from './board-section-card/section-card.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ShipToSetComponent } from './ship-to-set/ship-to-set.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { SaveOrderComponent } from './save-order/save-order.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { CarouselModule, WavesModule } from 'angular-bootstrap-md';
import { NotifierModule, NotifierOptions } from "angular-notifier";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

const notifierDefaultOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: "right",
            distance: 12
        },
        vertical: {
            position: "top",
            distance: 12,
            gap: 10
        }
    },
    theme: "material",
    behaviour: {
        autoHide: 2000,
        onClick: false,
        onMouseover: "pauseAutoHide",
        showDismissButton: true,
        stacking: 4
    },
    animations: {
        enabled: true,
        show: {
            preset: "slide",
            speed: 300,
            easing: "ease"
        },
        hide: {
            preset: "fade",
            speed: 300,
            easing: "ease",
            offset: 50
        },
        shift: {
            speed: 300,
            easing: "ease"
        },
        overlap: 150
    }
};

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HomeRoutingModule,
        RouterModule,
        NgbModule,
        NgxPaginationModule,
        NgbDropdownModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        NgxPopper,
        FontAwesomeModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatCheckboxModule,
        ModalModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
          }),
        NgxSpinnerModule,
        CarouselModule,
        WavesModule,
        NotifierModule.withConfig(notifierDefaultOptions)
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
        SectionCardComponent,
        ProspectiveCardComponent,
        MyAccountComponent,
        SwitchButtonComponent,
        SearchProductsComponent,
        SearchMachinesComponent,
        FooterComponent,
        OrderProductComponent,
        SearchOrdersComponent,
        CartOrderComponent,
        CartComponent,
        ShipToSetComponent,
        ConfirmOrderComponent,
        SaveOrderComponent
    ],
    providers: [DatePipe]
})
export class HomeModule { }