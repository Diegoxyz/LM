import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ManageProducts } from '../services/manage-products.service';
import { Item } from '@app/models/item';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProspectiveCardComponent } from '../prospective-card/prospective-card.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BinDataMatnrSetService } from '@app/models/OData/BinDataMatnrSet/bindatamatnrset.service';

@Component({selector: 'app-machine-card',
templateUrl: './machine-card.component.html',
styleUrls: ['./machine-card.component.css']
})
export class MachineCardComponent implements OnInit {

    @Input()
    item : Item;

    bsModalRef: BsModalRef;
    
    @Output() 
    openSection : EventEmitter<Item> = new EventEmitter<Item>();
    

    thumbnail: any;

    baseImage: any;

    config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: "my-modal"
    };

    constructor(private router: Router,private modalService: BsModalService,
        private binDataMatnrSetService: BinDataMatnrSetService, private sanitizer: DomSanitizer) {

    }
    
    ngOnInit(): void {
        if (this.item.picId) {
            console.log('item.picId:' + this.item.picId);
            this.binDataMatnrSetService.getImage(this.item.code,this.item.picId).subscribe((resp : any) => {
                if (resp.body && resp.body.d && resp.body.d) {
                    console.log('baseImage.BinDoc:' + resp.body.d.BinDoc);
                    let objectURL = 'data:image/jpeg;base64,' + resp.body.d.BinDoc;
                    this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                }
                this.baseImage = resp;
            });
        }
        
    }

    public openSections() {
        if (this.item) {
            // we will load the item's prospectives
            // this.bsModalRef = this.modalService.show(ProspectiveCardComponent, this.config);
            // this.router.navigate(['./home/prospective'], {queryParams:{itemCode: this.item.code}});
            this.openSection.emit(this.item);
        }
    }

    openModal(template: TemplateRef<any>) {
        this.bsModalRef = this.modalService.show(template, this.config);
      }
}