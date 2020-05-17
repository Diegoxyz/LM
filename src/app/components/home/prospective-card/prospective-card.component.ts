import { Component, OnInit, Input } from '@angular/core';
import { ManageProducts } from '../services/manage-products.service';
import { Item } from '@app/models/item';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({selector: 'app-prospetive-card',
templateUrl: './prospective-card.component.html',
styleUrls: ['./prospective-card.component.css']
})
export class ProspectiveCardComponent implements OnInit {

    @Input()
    item : Item;

    quantity : number = 0;
    selectedQuantity : number = 0;

    constructor(public bsModalRef: BsModalRef) {
    }
    
    ngOnInit(): void {
        
    }

    public close() {
        this.bsModalRef.hide();
    }

    onKey(quantity: number) {
        if (quantity >= 0) {
            this.quantity = quantity;
        } else {
            this.quantity = 0;
        }
    }
}