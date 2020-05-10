import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/item';
import { ManageProducts } from '../services/manage-products.service';

@Component({selector: 'app-product-card',
templateUrl: './product-card.component.html',
styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

    @Input() item: Product;

    constructor(private manageProducts: ManageProducts) {
        //TODO We will load the image by odata, but for mock application let's use a fix one
    }
    
    public addProduct(item : Product) {
        this.manageProducts.changeProduct(item,1);
    }
}