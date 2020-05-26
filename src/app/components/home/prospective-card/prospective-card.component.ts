import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductsService } from '@app/services/products.service';
import { Product } from '@app/models/item';

@Component({selector: 'app-prospetive-card',
templateUrl: './prospective-card.component.html',
styleUrls: ['./prospective-card.component.css']
})
export class ProspectiveCardComponent implements OnInit {

    @Input()
    itemCode : string;

    quantity : number = 0;
    selectedQuantity : number = 0;
    faShoppingCart=faShoppingCart;
    faCircle=faCircle;

    bsModalRef: BsModalRef;

    items : Product[] =[];

    constructor(private productsService: ProductsService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.items = this.productsService.getBoardsProducts();
    }

    public close() {
        this.bsModalRef.hide();
        // this.router.navigate(['./home/boards']);
    }

    onKey(quantity: number) {
        if (quantity >= 0) {
            this.quantity = quantity;
        } else {
            this.quantity = 0;
        }
    }

    addProduct() {
        if (this.quantity >= 0) {
            this.quantity = this.quantity + 1;
        } else {
            this.quantity = 0;
        }
    }



    removeProduct() {
        if (this.quantity > 0) {
            this.quantity = this.quantity - 1;
        }
        /* this.updateQuantityError(); */
    }    

/*     updateQuantityError() {
        if (this.quantity >= 0) {
            this.quantityError = false;
        } else {
            this.quantityError = true;
        }
    } */
}