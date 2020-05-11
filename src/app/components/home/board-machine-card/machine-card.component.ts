import { Component, OnInit, Input } from '@angular/core';
import { ManageProducts } from '../services/manage-products.service';
import { Item } from '@app/models/item';
import { Router } from '@angular/router';

@Component({selector: 'app-machine-card',
templateUrl: './machine-card.component.html',
styleUrls: ['./machine-card.component.css']
})
export class MachineCardComponent implements OnInit {

    @Input()
    item : Item;

    constructor(private router: Router) {
    }
    
    ngOnInit(): void {
        
    }

    public openProspectives(item) {
        if (item) {
            // we will load the item's prospectives
            this.router.navigate(['./home/boards'], {queryParams:{machineId: item.code}});
        }
    }
}