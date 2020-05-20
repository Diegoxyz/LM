import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

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

    constructor(private router: Router) {
    }
    
    ngOnInit(): void {
        
    }

    public close() {
        // this.bsModalRef.hide();
        this.router.navigate(['./home/boards']);
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
}