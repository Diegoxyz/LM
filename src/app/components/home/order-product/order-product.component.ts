import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from 'src/app/models/item';
import { Order } from '@app/models/order';
import { faShoppingCart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({selector: 'app-order-product',
templateUrl: './order-product.component.html',
styleUrls: ['./order-product.component.css']
})
export class OrderProductComponent implements OnInit {

    @Input() item: Order;
    quantity: number = 1; 
    faCircle=faCircle;

    constructor(public bsModalRef: BsModalRef) {
    }
    
    ngOnInit(): void {
        //TODO We will load the image by odata, but for mock application let's use a fix one

    }

    public close() {
        this.bsModalRef.hide();
    }
}