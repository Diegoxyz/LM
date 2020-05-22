import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ManageProducts } from '../services/manage-products.service';
import { Item } from '@app/models/item';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProspectiveCardComponent } from '../prospective-card/prospective-card.component';

@Component({selector: 'app-section-card',
templateUrl: './section-card.component.html',
styleUrls: ['./section-card.component.css']
})
export class SectionCardComponent implements OnInit {

    @Input()
    item : Item;

    bsModalRef: BsModalRef;
    
    config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false
    };

    constructor(private router: Router,private modalService: BsModalService) {
    }
    
    ngOnInit(): void {
        
    }

    public openProspectives() {
        if (this.item) {
            // we will load the item's prospectives
            this.bsModalRef = this.modalService.show(ProspectiveCardComponent, this.config);
            // this.router.navigate(['./home/prospective'], {queryParams:{itemCode: this.item.code}});
        }
    }

    openModal(template: TemplateRef<any>) {
        this.bsModalRef = this.modalService.show(template, this.config);
      }
}