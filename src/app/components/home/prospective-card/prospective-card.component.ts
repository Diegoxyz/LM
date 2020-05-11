import { Component, OnInit, Input } from '@angular/core';
import { ManageProducts } from '../services/manage-products.service';
import { Item } from '@app/models/item';
import { Router } from '@angular/router';

@Component({selector: 'app-prospetive-card',
templateUrl: './prospective-card.component.html',
styleUrls: ['./prospective-card.component.css']
})
export class ProspectiveCardComponent implements OnInit {

    @Input()
    item : Item;

    quantity : number = 0;
    selectedQuantity : number = 0;

    constructor() {
    }
    
    ngOnInit(): void {
        
    }

    public close() {
    }

    onKey(quantity: number) {
        if (quantity >= 0) {
            this.quantity = quantity;
        } else {
            this.quantity = 0;
        }
    }
}