import { Component, Input } from '@angular/core';
import { Product } from 'src/app/models/item';

@Component({selector: 'app-product-card',
templateUrl: './product-card.component.html',
styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

    @Input() item: Product;

    constructor(

    ) {
        //TODO We will load the image by odata, but for mock application let's use a fix one
    }
        
}