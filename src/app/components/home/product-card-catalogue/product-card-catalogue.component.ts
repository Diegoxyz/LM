import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from 'src/app/models/item';
import { Order } from '@app/models/order';
import { ManageProducts } from '../services/manage-products.service';
import { CartService } from '@app/services/cart.service';
import { faShoppingCart, faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({selector: 'app-product-catalogue-card',
templateUrl: './product-card-catalogue.component.html',
styleUrls: ['./product-card-catalogue.component.css']
})
export class ProductCardCatalogueComponent implements OnInit {

    @Input() item: Product;
    quantity: number = 0; 
    quantityError : boolean = false;
    faShoppingCart=faShoppingCart;
    faCircle=faCircle;
    
    constructor(private manageProducts: ManageProducts, private cartService : CartService) {
    }
    
    ngOnInit(): void {
        //TODO We will load the image by odata, but for mock application let's use a fix one

        this.cartService.getCart().orders.forEach(o => {
            if (o && o.product && o.product.code === this.item.code) {
                this.quantity = o.quantity;
            }
        });
    }
    onKey(quantity: number) {
        if (quantity >= 0) {
            this.quantity = quantity;
            this.manageProducts.changeProduct(this.item,this.quantity);
        } else {
            this.quantity = 0;
            this.quantityError = true;
        }
    }
    
    addProduct() {
        this.quantity = this.quantity + 1;
        this.manageProducts.changeProduct(this.item,this.quantity);
        this.updateQuantityError();
    }

    removeProduct() {
        if (this.quantity > 0) {
            this.quantity = this.quantity - 1;
            this.manageProducts.changeProduct(this.item,this.quantity);
        }
        this.updateQuantityError();
    }
    
    updateQuantityError() {
        if (this.quantity >= 0) {
            this.quantityError = false;
        } else {
            this.quantityError = true;
        }
    }
}