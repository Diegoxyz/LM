import { Component, OnInit, Input } from '@angular/core';
import { ManageProducts } from '../services/manage-products.service';
import { Item } from '@app/models/item';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProspectiveCardComponent } from '../prospective-card/prospective-card.component';

@Component({selector: 'app-machine-card',
templateUrl: './machine-card.component.html',
styleUrls: ['./machine-card.component.css']
})
export class MachineCardComponent implements OnInit {

    @Input()
    item : Item;

    bsModalRef: BsModalRef;
    
    constructor(private router: Router,private modalService: BsModalService) {
    }
    
    ngOnInit(): void {
        
    }

    public openProspectives() {
        if (this.item) {
            // we will load the item's prospectives
            // this.bsModalRef = this.modalService.show(ProspectiveCardComponent, { ignoreBackdropClick: true, class: 'modal-lg' });
            this.router.navigate(['./home/prospective'], {queryParams:{itemCode: this.item.code}});
        }
    }
}