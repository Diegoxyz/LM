import { Component, OnInit, Input, TemplateRef, SecurityContext, Renderer2 } from '@angular/core';
import { ManageProducts } from '../services/manage-products.service';
import { Item } from '@app/models/item';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProspectiveCardComponent } from '../prospective-card/prospective-card.component';
import { BinDataMatnrSetService } from '@app/models/OData/BinDataMatnrSet/bindatamatnrset.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { Output, EventEmitter } from '@angular/core';


@Component({selector: 'app-section-card',
templateUrl: './section-card.component.html',
styleUrls: ['./section-card.component.css']
})
export class SectionCardComponent implements OnInit {

    @Input()
    item : Item;

    @Output() 
    openProspective : EventEmitter<Item> = new EventEmitter<Item>();

    bsModalRef: BsModalRef;
    
    config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false
    };

    thumbnail: any;

    svgThumbnail: any;

    baseImage: any;

    // just for test with no odata
    svgData = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNDcycHgiIGhlaWdodD0iMzkycHgiIHZpZXdCb3g9IjAgMCA0NzIgMzkyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0NzIgMzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJMYXllcl8zIj4NCgk8cGF0aCBmaWxsPSIjRkZCNTY0IiBkPSJNMjg4LjcsMTg3LjdjLTUzLjctMzIuNi0xMTkuOCwxLTExOS44LDFzMTEuNiw5Mi42LDExLjQsMTIxLjRjLTAuOCwyLTEsNC4xLTAuNCw2LjMNCgkJYy0wLjIsMS4yLTAuNiwxLjctMSwxLjdoMS43YzEuMSwzLDIuOSw0LjMsNS44LDUuM2MxMC45LDQsMjEuNSw2LjgsMzMuMSw3LjdjMy42LDAuMyw3LjEsMC4yLDEwLjUtMC4yYzEuNiwxLjUsNCwyLjQsNy4xLDIuMQ0KCQljMTMuMi0xLjIsMjgtMS45LDM4LjYtMTAuM2MxLjctMS40LDIuNy0yLjcsMy4xLTQuN2gwLjhMMjg4LjcsMTg3Ljd6Ii8+DQoJPHBvbHlnb24gZmlsbD0iIzUyRTJENyIgcG9pbnRzPSIxNzMuMiwxNDYuNCAxODAuNSwxODQgMjA2LjYsMTc3LjIgMjAwLjEsMTQ0IAkiLz4NCgk8cGF0aCBmaWxsPSIjRkZGQkU4IiBkPSJNMjIyLjYsMTMzLjhjMCwwLTE3LjktMTUuNi01LjMsMzkuOWMwLjYsMi41LDE5LjQsMy40LDE5LjQsMy40TDIyMi42LDEzMy44eiIvPg0KCTxwYXRoIGZpbGw9IiNGOUEwMzUiIGQ9Ik0xODguNiwxODEuNGMwLDAtMjAuNiwwLTIwLjYsMTIuNGMwLjEsMTcuMiwxMy40LDEwNS42LDEzLjEsMTE5LjljLTAuMiw5LjMsMTkuMSwxMy42LDE5LjEsMTMuNiIvPg0KCTxwYXRoIGZpbGw9IiNGRkI1NjQiIGQ9Ik0yMDAuMiw5My4zYzAsMCw5LjcsNTAuMiwxMS42LDQ4LjRjMi0xLjgsMTAuOC03LjksMTAuOC03LjlsLTEzLjUtNDAuNUgyMDAuMnoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGQkU4IiBkPSJNMTg0LjEsMTIzLjZjMCwwLTEyLjksMjQuNi0xMC45LDIyLjhjMi0xLjgsMjctMi40LDI3LTIuNEwxODQuMSwxMjMuNnoiLz4NCgk8cGF0aCBmaWxsPSIjRjI1RjY4IiBkPSJNMjU3LjksOTIuOGMtMS41LDItMyw0LjEtNC40LDYuM2MtMS4yLDEuOS0yLjksMi4zLTQuNiwxLjljLTEuNywzLjQtMy41LDYuNy01LjcsOS44DQoJCWMtNi4yLDIyLjQtMC43LDQxLjctOC43LDYzLjhjLTEuMywzLjUsMC4zLDAuMywyLjIsMi41YzUuNi0zLDMxLjEsMy41LDM4LjcsNC4yYzEuNy0yLjMtOS4xLTMuMy0xMC4zLTYuNmMxLjQsMy45LDAuMi01LjIsMC4yLTYuMQ0KCQljMC4zLTIuNiwwLTUuNSwwLjMtOC4xYzAuNy00LjYtMS40LTYuNC0wLjgtMTFjMS45LTE0LjUsMy40LTI5LjQsMy00NC4xYy0yLjItMy45LTQuMS03LjktNS42LTEyLjENCgkJQzI2MSw5Mi45LDI1OS40LDkyLjcsMjU3LjksOTIuOHoiLz4NCjwvZz4NCjxnIGlkPSJMYXllcl8yIj4NCgkNCgkJPHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0FGM0E0NiIgc3Ryb2tlLXdpZHRoPSI0Ljk3NjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSINCgkJMjM4LDE3MS4xIDI0NS4yLDEwOSAyNjAuNCw4Ni45IDI2Ny43LDExMC44IDI2NS4xLDE3NC44IAkiLz4NCgkNCgkJPHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0FGM0E0NiIgc3Ryb2tlLXdpZHRoPSI0Ljk3NjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSINCgkJMTgwLjIsMTgyLjQgMTczLjgsMTQ0IDE4NC4xLDEyMy42IDIwMC4xLDEzOS4yIDIwNi42LDE3Ni4yIAkiLz4NCgkNCgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjQuOTc2MyIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSINCgkJTTIxOC4yLDE3NC44YzAsMC00LjUtMTYuNS05LTM2LjRjLTQuOC0yMS4zLTkuNy00My44LTktNDUuMWMxLjMtMi42LDUuNC00LjgsOC45LDBjMiwyLjcsNy45LDIxLjYsMTMuNSw0MC41DQoJCWM2LjMsMjEuMSwxMi4yLDQyLjMsMTEuOSw0MC44Ii8+DQoJPHBhdGggZmlsbD0iI0FGM0E0NiIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjIuNDg4MiIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMjAwLjIsOTMuM2MtMTEuNi0xMi4yLTEwLjQtMTkuMi02LjYtMjMNCgkJYzYuNi02LjYtMi44LTE2LjYtMC45LTE2LjhjNi42LTAuNiwyOC42LDkuNiwxNy4zLDM2LjkiLz4NCgkNCgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjQuOTc2MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ig0KCQlNMjQ1LjIsMTA5YzAsMCwxMS4zLTQuOCwyMi41LDEuOSIvPg0KCQ0KCQk8cGF0aCBmaWxsPSIjRkZGQkU4IiBzdHJva2U9IiNBRjNBNDYiIHN0cm9rZS13aWR0aD0iNC45NzYzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iDQoJCU0yMDAuMSwxMzkuMmMwLDQuNy0xMi4yLDQuNy0xMi4yLDQuN2MtMy4yLDUuMy0xNC4xLDAtMTQuMSwwIi8+DQoJPHBhdGggZmlsbD0iI0FGM0E0NiIgZD0iTTE5MC45LDEzMC4zYzMuNCwzLjMtMTIsMy41LTEyLDMuNWw1LjEtMTAuMkwxOTAuOSwxMzAuM3oiLz4NCgkNCgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjQuOTc2MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ig0KCQlNMjExLjgsMTQxLjZjNy43LDAsMTEuNC02LDExLjQtNiIvPg0KCQ0KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNBRjNBNDYiIHN0cm9rZS13aWR0aD0iNC45NzYzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iDQoJCU0xNjksMTg4LjhMMTY5LDE4OC44YzQzLjktMjEuNSw5NC4zLTE2LjYsMTE5LjgtMS4xTDI3NywzMjEuOWMwLDAtMzkuOSwyMy4yLTk1LjItMS4xTDE2OSwxODguOHoiLz4NCgkNCgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjQuODIyOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ig0KCQlNMjU1LjcsMjcwLjRsLTIuMi0zMi42bC0yNC40LTE4LjlMMjA1LDIzNi42YzAuMywxMS44LDEuNCwyMi44LDEuNywzNC42QzIwNi42LDI3MS4yLDIzNiwyNzUuOSwyNTUuNywyNzAuNHoiLz4NCgkNCgkJPGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiB4MT0iMjI5LjUiIHkxPSIyMTkiIHgyPSIyMjkuNSIgeTI9IjI0NiIvPg0KCQ0KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNBRjNBNDYiIHN0cm9rZS13aWR0aD0iMy44NTgyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iDQoJCU0yMzMuMiwyNDAuOGMtMS41LDAtMi45LDAuMy02LjgsMC40YzAsMC0xLTAuOS0wLjEsNS45YzIuOSwwLjEsNCwwLjIsNi45LDAuMkMyMzMuMiwyNDcuNCwyMzMuMiwyNDIuNSwyMzMuMiwyNDAuOHoiLz4NCjwvZz4NCjwvc3ZnPg0K';

    displayNoImage : boolean;
    displayItem : boolean;

    constructor(private router: Router,private modalService: BsModalService,
        private binDataMatnrSetService: BinDataMatnrSetService, public sanitizer: DomSanitizer, private renderer: Renderer2) {
    }
    
    ngOnInit(): void {
        if (this.item.emptyItem) {
            this.displayItem = false;
        } else {
            this.displayItem = true;
        }
        if (environment && environment.oData) {
            this.thumbnail = undefined;
            this.svgThumbnail = undefined;
            if (this.item.picId) {
                this.binDataMatnrSetService.getImage(this.item.code,this.item.picId).subscribe((resp : any) => {
                    if (resp.body && resp.body.d && resp.body.d) {
                        if (resp.body.d.Filename) {
                            const fileName = resp.body.d.Filename && resp.body.d.Filename.substring(resp.body.d.Filename.lastIndexOf('.') + 1);
                            // let objectURL = 'data:image/jpeg;base64,' + resp.body.d.BinDoc;
                            if (fileName && fileName.toLowerCase() === 'jpg' || fileName.toLowerCase() === 'png') {
                                let objectURL = 'data:image/'+fileName+';base64,' + resp.body.d.BinDoc;
                                this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                                let itemFamily = this.item.family;
                                if (itemFamily === undefined || itemFamily === undefined) {
                                    itemFamily = '';
                                }
                                const imgId = 'genericPic'.concat(this.item.code).concat(itemFamily);
                                const el : HTMLElement = document.getElementById(imgId);
                                const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/'+fileName+';base64,' + resp.body.d.BinDoc);
                                if (el) {
                                    el.setAttribute('src',this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src));
                                    el.setAttribute('width','260px');
                                    el.setAttribute('height','auto');
                                    el.setAttribute('style','max-weigth: 260px; max-height: 260px;');
                                    this.renderer.setStyle(el, 'display', 'block');
                                }
                            } else if (fileName && fileName.toLowerCase() === 'svg') {
                                this.svgThumbnail= resp.body.d.BinDoc;
                                let itemFamily = this.item.family;
                                if (itemFamily === undefined || itemFamily === undefined) {
                                    itemFamily = '';
                                }
                                const imgId = 'genericPic'.concat(this.item.code).concat(itemFamily);
                                const el : HTMLElement = document.getElementById(imgId);
                                const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64, '+ this.svgThumbnail);
                                if (el) {
                                    el.setAttribute('src',this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src));
                                    el.setAttribute('width','260px');
                                    el.setAttribute('height','auto');
                                    el.setAttribute('style','max-weigth: 260px; max-height: 260px;');
                                    this.renderer.setStyle(el, 'display', 'block');
                                }
                            } else {
                                console.log('section ' + this.item.code + '- no fileName or not recognized:' + fileName);
                                this.displayNoImage = true;
                            }                         
                        }
                    }
                });
            } else {
                this.displayNoImage = true;
            }
        } else {
            this.svgThumbnail = this.svgData;
            const imgId = 'genericPic'.concat(this.item.code).concat(this.item.family);
            const el : HTMLElement = document.getElementById(imgId);
            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64, '+ this.svgThumbnail);
            if (el) {
                el.setAttribute('src',this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src));
                el.setAttribute('width','260');
                el.setAttribute('heigth','260');
            }
            this.displayNoImage = false;
        }
        

    }

    public openProspectives() {
        if (this.item) {
            // we will load the item's prospectives
            this.bsModalRef = this.modalService.show(ProspectiveCardComponent, this.config);
            // this.router.navigate(['./home/prospective'], {queryParams:{itemCode: this.item.code}});
        }
    }

    public openSpecificProspective() {
        if (this.item) {
            // we will load the item's prospectives
            // this.router.navigate(['./home/prospective'], {queryParams:{itemCode: this.item.code}});
            this.openProspective.emit(this.item);
        }
    }
    

    openModal(template: TemplateRef<any>) {
        this.bsModalRef = this.modalService.show(template, this.config);
      }

}